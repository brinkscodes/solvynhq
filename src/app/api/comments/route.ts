import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json");

function readComments(): Record<string, string> {
  if (!fs.existsSync(COMMENTS_FILE)) {
    return {};
  }
  const raw = fs.readFileSync(COMMENTS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeComments(data: Record<string, string>) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readComments();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { sectionId, comment } = body as { sectionId: string; comment: string };

  if (!sectionId || typeof comment !== "string") {
    return NextResponse.json(
      { error: "sectionId and comment (string) required" },
      { status: 400 }
    );
  }

  const data = readComments();
  if (comment.trim() === "") {
    delete data[sectionId];
  } else {
    data[sectionId] = comment;
  }
  writeComments(data);

  return NextResponse.json({ success: true });
}
