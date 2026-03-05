import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: Add reaction (toggle — add if not exists)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { commentId, emoji } = body as { commentId: string; emoji: string };

    if (!commentId || !emoji) {
      return NextResponse.json({ error: "commentId and emoji required" }, { status: 400 });
    }

    // Check if reaction already exists
    const { data: existing } = await supabase
      .from("comment_reactions")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .eq("emoji", emoji)
      .single();

    if (existing) {
      // Remove it (toggle off)
      await supabase
        .from("comment_reactions")
        .delete()
        .eq("id", existing.id);
      return NextResponse.json({ action: "removed" });
    }

    // Add reaction
    const { error } = await supabase
      .from("comment_reactions")
      .insert({ comment_id: commentId, user_id: user.id, emoji });

    if (error) throw error;

    return NextResponse.json({ action: "added" });
  } catch (err) {
    console.error("POST /api/task-comments/reactions error:", err);
    return NextResponse.json({ error: "Failed to toggle reaction" }, { status: 500 });
  }
}
