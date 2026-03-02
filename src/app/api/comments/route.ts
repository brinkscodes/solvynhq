import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";
import type { Comment } from "@/lib/content-types";

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const { data, error } = await supabase
      .from("section_comments")
      .select("id, section_id, author_name, author_email, comment, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const result: Record<string, Comment[]> = {};
    for (const row of data || []) {
      if (!result[row.section_id]) result[row.section_id] = [];
      result[row.section_id].push({
        id: row.id,
        author_name: row.author_name,
        author_email: row.author_email,
        comment: row.comment,
        created_at: row.created_at,
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/comments error:", err);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, comment } = body as { sectionId: string; comment: string };

    if (!sectionId || !comment?.trim()) {
      return NextResponse.json(
        { error: "sectionId and comment required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const authorName =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Unknown";
    const authorEmail = user.email || "";

    const { data, error } = await supabase
      .from("section_comments")
      .insert({
        project_id: projectId,
        section_id: sectionId,
        user_id: user.id,
        author_name: authorName,
        author_email: authorEmail,
        comment: comment.trim(),
      })
      .select("id, section_id, author_name, author_email, comment, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/comments error:", err);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json({ error: "Comment id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const { error } = await supabase
      .from("section_comments")
      .delete()
      .eq("id", commentId)
      .eq("project_id", projectId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/comments error:", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
