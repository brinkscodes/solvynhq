import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const { data, error } = await supabase
      .from("comments")
      .select("section_id, comment")
      .eq("project_id", projectId);

    if (error) throw error;

    // Reshape to Record<string, string>
    const result: Record<string, string> = {};
    for (const row of data || []) {
      result[row.section_id] = row.comment;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/comments error:", err);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, comment } = body as { sectionId: string; comment: string };

    if (!sectionId || typeof comment !== "string") {
      return NextResponse.json(
        { error: "sectionId and comment (string) required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    if (comment.trim() === "") {
      // Delete the comment
      await supabase
        .from("comments")
        .delete()
        .eq("project_id", projectId)
        .eq("section_id", sectionId);
    } else {
      // Upsert the comment
      const { error } = await supabase
        .from("comments")
        .upsert(
          {
            project_id: projectId,
            section_id: sectionId,
            comment,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "project_id,section_id" }
        );

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/comments error:", err);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}
