import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const { data, error } = await supabase
      .from("changelog")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/changelog error:", err);
    return NextResponse.json({ error: "Failed to load changelog" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, version } = body as {
      title: string;
      description: string;
      version?: string;
    };

    if (!title || !description) {
      return NextResponse.json({ error: "title and description required" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const { data, error } = await supabase
      .from("changelog")
      .insert({
        project_id: projectId,
        title,
        description,
        version: version || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/changelog error:", err);
    return NextResponse.json({ error: "Failed to create changelog entry" }, { status: 500 });
  }
}
