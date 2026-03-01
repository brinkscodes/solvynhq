import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "product-context.json");

function readContext() {
  const raw = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(raw);
}

function writeContext(data: Record<string, unknown>) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readContext();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const updates = await req.json();
  const current = readContext();
  const merged = { ...current, ...updates, lastUpdated: new Date().toISOString() };
  writeContext(merged);
  return NextResponse.json({ success: true });
}
