import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const { data, error } = await supabase
      .from("notes")
      .select("content")
      .eq("project_id", projectId)
      .single();

    if (error && error.code === "PGRST116") {
      // No row yet
      return NextResponse.json({ notes: "" });
    }
    if (error) throw error;

    return NextResponse.json({ notes: data.content || "" });
  } catch (err) {
    console.error("GET /api/notes error:", err);
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { notes } = body as { notes: string };

    if (typeof notes !== "string") {
      return NextResponse.json({ error: "notes must be a string" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const { error } = await supabase
      .from("notes")
      .upsert(
        { project_id: projectId, content: notes, updated_at: new Date().toISOString() },
        { onConflict: "project_id" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/notes error:", err);
    return NextResponse.json({ error: "Failed to save notes" }, { status: 500 });
  }
}
