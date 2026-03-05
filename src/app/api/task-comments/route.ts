import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

// GET: List comments for a task
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });

    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: comments, error } = await supabase
      .from("task_comments")
      .select("id, task_id, user_id, content, mentions, created_at, updated_at")
      .eq("task_id", taskId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Resolve profiles
    const userIds = [...new Set(comments.map((c: any) => c.user_id))];
    let profileMap: Record<string, { fullName: string; avatarUrl: string | null }> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);
      if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map((p: any) => [p.id, { fullName: p.full_name || "Unknown", avatarUrl: p.avatar_url }])
        );
      }
    }

    // Get reactions for these comments
    const commentIds = comments.map((c: any) => c.id);
    let reactionsMap: Record<string, Array<{ emoji: string; count: number; reacted: boolean }>> = {};
    if (commentIds.length > 0) {
      const { data: reactions } = await supabase
        .from("comment_reactions")
        .select("comment_id, user_id, emoji")
        .in("comment_id", commentIds);

      if (reactions) {
        const grouped: Record<string, Record<string, Set<string>>> = {};
        for (const r of reactions) {
          if (!grouped[r.comment_id]) grouped[r.comment_id] = {};
          if (!grouped[r.comment_id][r.emoji]) grouped[r.comment_id][r.emoji] = new Set();
          grouped[r.comment_id][r.emoji].add(r.user_id);
        }
        for (const [commentId, emojis] of Object.entries(grouped)) {
          reactionsMap[commentId] = Object.entries(emojis).map(([emoji, users]) => ({
            emoji,
            count: users.size,
            reacted: user ? users.has(user.id) : false,
          }));
        }
      }
    }

    const result = comments.map((c: any) => ({
      id: c.id,
      taskId: c.task_id,
      userId: c.user_id,
      fullName: profileMap[c.user_id]?.fullName || "Unknown",
      avatarUrl: profileMap[c.user_id]?.avatarUrl || null,
      content: c.content,
      mentions: c.mentions || [],
      reactions: reactionsMap[c.id] || [],
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/task-comments error:", err);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

// POST: Create a comment
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { taskId, content, mentions } = body as { taskId: string; content: string; mentions?: string[] };

    if (!taskId || !content?.trim()) {
      return NextResponse.json({ error: "taskId and content required" }, { status: 400 });
    }

    const { data: comment, error } = await supabase
      .from("task_comments")
      .insert({
        task_id: taskId,
        project_id: projectId,
        user_id: user.id,
        content: content.trim(),
        mentions: mentions || [],
      })
      .select("id, task_id, user_id, content, mentions, created_at, updated_at")
      .single();

    if (error) throw error;

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      id: comment.id,
      taskId: comment.task_id,
      userId: comment.user_id,
      fullName: profile?.full_name || "Unknown",
      avatarUrl: profile?.avatar_url || null,
      content: comment.content,
      mentions: comment.mentions || [],
      reactions: [],
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    });
  } catch (err) {
    console.error("POST /api/task-comments error:", err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// PATCH: Update own comment
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { commentId, content } = body as { commentId: string; content: string };

    if (!commentId || !content?.trim()) {
      return NextResponse.json({ error: "commentId and content required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("task_comments")
      .update({ content: content.trim(), updated_at: new Date().toISOString() })
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/task-comments error:", err);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

// DELETE: Delete own comment
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) return NextResponse.json({ error: "commentId required" }, { status: 400 });

    const { error } = await supabase
      .from("task_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/task-comments error:", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
