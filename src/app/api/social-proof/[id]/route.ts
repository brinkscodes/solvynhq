import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SocialProofTable } from "@/lib/social-proof-types";

const VALID_TABLES: SocialProofTable[] = ["partners", "advisory_board", "volunteers"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { table, data: rowData } = await req.json();

    if (!VALID_TABLES.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from(table)
      .update({ ...rowData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/social-proof/[id] error:", err);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const table = req.nextUrl.searchParams.get("table") as SocialProofTable;

    if (!table || !VALID_TABLES.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/social-proof/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
