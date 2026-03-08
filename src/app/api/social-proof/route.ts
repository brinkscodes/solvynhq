import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";
import type { SocialProofTable } from "@/lib/social-proof-types";

const VALID_TABLES: SocialProofTable[] = ["partners", "advisory_board", "volunteers"];

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const [partners, advisors, volunteers] = await Promise.all([
      supabase.from("partners").select("*").eq("project_id", projectId).order("sort_order"),
      supabase.from("advisory_board").select("*").eq("project_id", projectId).order("sort_order"),
      supabase.from("volunteers").select("*").eq("project_id", projectId).order("sort_order"),
    ]);

    return NextResponse.json({
      partners: partners.data || [],
      advisors: advisors.data || [],
      volunteers: volunteers.data || [],
    });
  } catch (err) {
    console.error("GET /api/social-proof error:", err);
    return NextResponse.json({ error: "Failed to load social proof data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { table, data: rowData } = await req.json();

    if (!VALID_TABLES.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const { data, error } = await supabase
      .from(table)
      .insert({ ...rowData, project_id: projectId })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/social-proof error:", err);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
