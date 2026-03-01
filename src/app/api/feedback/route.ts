import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const FEEDBACK_FILE = path.join(process.cwd(), "data", "feedback.json");

interface FeedbackEntry {
  id: string;
  message: string;
  sentAt: string;
  emailSent: boolean;
}

interface FeedbackLog {
  entries: FeedbackEntry[];
}

function readFeedback(): FeedbackLog {
  if (!fs.existsSync(FEEDBACK_FILE)) {
    return { entries: [] };
  }
  const raw = fs.readFileSync(FEEDBACK_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeFeedback(data: FeedbackLog) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message } = body as { message: string };

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 }
    );
  }

  const entry: FeedbackEntry = {
    id: crypto.randomUUID(),
    message: message.trim(),
    sentAt: new Date().toISOString(),
    emailSent: false,
  };

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY not configured");

    const resend = new Resend(apiKey);
    const to = process.env.FEEDBACK_RECIPIENT_EMAIL || "developer@example.com";
    const from = process.env.FEEDBACK_FROM_EMAIL || "onboarding@resend.dev";

    await resend.emails.send({
      from,
      to,
      subject: "SolvynHQ Dashboard Feedback",
      text: `New feedback from the dashboard:\n\n${entry.message}\n\nSent at: ${entry.sentAt}`,
    });
    entry.emailSent = true;
  } catch (error) {
    console.error("Failed to send feedback email:", error);
  }

  const log = readFeedback();
  log.entries.push(entry);
  writeFeedback(log);

  if (!entry.emailSent) {
    return NextResponse.json(
      { success: true, warning: "Feedback saved but email delivery failed" },
      { status: 207 }
    );
  }

  return NextResponse.json({ success: true });
}
