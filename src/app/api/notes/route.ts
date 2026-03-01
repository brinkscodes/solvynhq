import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NOTES_FILE = path.join(process.cwd(), "data", "notes.json");

function readNotes(): { notes: string } {
  const raw = fs.readFileSync(NOTES_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeNotes(notes: string) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify({ notes }, null, 2));
}

export async function GET() {
  const data = readNotes();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { notes } = body as { notes: string };

  if (typeof notes !== "string") {
    return NextResponse.json({ error: "notes must be a string" }, { status: 400 });
  }

  writeNotes(notes);
  return NextResponse.json({ success: true });
}
