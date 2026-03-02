import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  MyTask,
  MyTaskSection,
  MyTasksData,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/lib/my-tasks-types";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, userId: user.id };
}

export async function GET() {
  try {
    const { supabase, userId } = await getUserId();

    const [sectionsRes, tasksRes] = await Promise.all([
      supabase
        .from("user_task_sections")
        .select("*")
        .eq("user_id", userId)
        .order("position"),
      supabase
        .from("user_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("position"),
    ]);

    // If tables don't exist yet, return empty data
    const tablesMissing =
      sectionsRes.error?.code === "42P01" || tasksRes.error?.code === "42P01" ||
      sectionsRes.error?.message?.includes("does not exist") ||
      tasksRes.error?.message?.includes("does not exist");

    if (tablesMissing) {
      return NextResponse.json({ tasks: [], sections: [], _migrationNeeded: true });
    }

    if (sectionsRes.error) throw sectionsRes.error;
    if (tasksRes.error) throw tasksRes.error;

    const sections: MyTaskSection[] = sectionsRes.data.map((s) => ({
      id: s.id,
      name: s.name,
      position: s.position,
    }));

    const tasks: MyTask[] = tasksRes.data.map((t) => ({
      id: t.id,
      sectionId: t.section_id,
      name: t.name,
      notes: t.notes || "",
      status: t.status,
      priority: t.priority,
      tags: t.tags || [],
      deadline: t.deadline,
      position: t.position,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      completedAt: t.completed_at,
    }));

    const data: MyTasksData = { tasks, sections };
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/my-tasks error:", err);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supabase, userId } = await getUserId();
    const body = (await req.json()) as CreateTaskPayload;

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // Get next position
    const { data: maxRow } = await supabase
      .from("user_tasks")
      .select("position")
      .eq("user_id", userId)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (maxRow?.position ?? -1) + 1;
    const now = new Date().toISOString();

    const { data: task, error } = await supabase
      .from("user_tasks")
      .insert({
        user_id: userId,
        section_id: body.sectionId || null,
        name: body.name.trim(),
        notes: body.notes || "",
        status: "todo",
        priority: body.priority || "medium",
        tags: body.tags || [],
        deadline: body.deadline || null,
        position: nextPosition,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;

    const myTask: MyTask = {
      id: task.id,
      sectionId: task.section_id,
      name: task.name,
      notes: task.notes || "",
      status: task.status,
      priority: task.priority,
      tags: task.tags || [],
      deadline: task.deadline,
      position: task.position,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      completedAt: task.completed_at,
    };

    return NextResponse.json(myTask);
  } catch (err) {
    console.error("POST /api/my-tasks error:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { supabase, userId } = await getUserId();
    const body = (await req.json()) as UpdateTaskPayload;

    if (!body.taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.sectionId !== undefined) updates.section_id = body.sectionId;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.deadline !== undefined) updates.deadline = body.deadline;
    if (body.position !== undefined) updates.position = body.position;

    if (body.status !== undefined) {
      updates.status = body.status;
      if (body.status === "done") {
        updates.completed_at = new Date().toISOString();
      } else {
        updates.completed_at = null;
      }
    }

    const { error } = await supabase
      .from("user_tasks")
      .update(updates)
      .eq("id", body.taskId)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/my-tasks error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { supabase, userId } = await getUserId();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("user_tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/my-tasks error:", err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
