import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { MyTaskSection } from "@/lib/my-tasks-types";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, userId: user.id };
}

export async function POST(req: NextRequest) {
  try {
    const { supabase, userId } = await getUserId();
    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // Get next position
    const { data: maxRow } = await supabase
      .from("user_task_sections")
      .select("position")
      .eq("user_id", userId)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (maxRow?.position ?? -1) + 1;

    const { data: section, error } = await supabase
      .from("user_task_sections")
      .insert({
        user_id: userId,
        name: body.name.trim(),
        position: nextPosition,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    const result: MyTaskSection = {
      id: section.id,
      name: section.name,
      position: section.position,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/my-tasks/sections error:", err);
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { supabase, userId } = await getUserId();
    const body = await req.json();

    if (!body.sectionId) {
      return NextResponse.json({ error: "sectionId is required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.position !== undefined) updates.position = body.position;

    const { error } = await supabase
      .from("user_task_sections")
      .update(updates)
      .eq("id", body.sectionId)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/my-tasks/sections error:", err);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { supabase, userId } = await getUserId();
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json({ error: "sectionId is required" }, { status: 400 });
    }

    // Move tasks in this section to Inbox (null section)
    await supabase
      .from("user_tasks")
      .update({ section_id: null, updated_at: new Date().toISOString() })
      .eq("section_id", sectionId)
      .eq("user_id", userId);

    const { error } = await supabase
      .from("user_task_sections")
      .delete()
      .eq("id", sectionId)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/my-tasks/sections error:", err);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
