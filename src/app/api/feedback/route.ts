import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message } = body as { message: string };

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let emailSent = false;

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
      text: `New feedback from the dashboard:\n\n${message.trim()}\n\nFrom: ${user?.email || "unknown"}\nSent at: ${new Date().toISOString()}`,
    });
    emailSent = true;
  } catch (error) {
    console.error("Failed to send feedback email:", error);
  }

  // Save to Supabase
  try {
    await supabase.from("feedback").insert({
      user_id: user?.id || null,
      message: message.trim(),
      email_sent: emailSent,
    });
  } catch (error) {
    console.error("Failed to save feedback:", error);
  }

  if (!emailSent) {
    return NextResponse.json(
      { success: true, warning: "Feedback saved but email delivery failed" },
      { status: 207 }
    );
  }

  return NextResponse.json({ success: true });
}
