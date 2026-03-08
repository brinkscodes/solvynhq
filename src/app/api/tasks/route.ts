import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";
import type { ProjectData, Task, Section } from "@/lib/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    // Parallel queries
    const [projectRes, sectionsRes, tasksRes, commentsCountRes] = await Promise.all([
      supabase.from("projects").select("name, description").eq("id", projectId).single(),
      supabase.from("sections").select("*").eq("project_id", projectId).order("order"),
      supabase.from("tasks").select("*").eq("project_id", projectId),
      supabase.from("task_comments").select("task_id").eq("project_id", projectId),
    ]);

    if (projectRes.error) throw projectRes.error;
    if (sectionsRes.error) throw sectionsRes.error;
    if (tasksRes.error) throw tasksRes.error;

    // Count comments per task
    const commentCounts: Record<string, number> = {};
    if (commentsCountRes.data) {
      for (const row of commentsCountRes.data) {
        commentCounts[row.task_id] = (commentCounts[row.task_id] || 0) + 1;
      }
    }

    // Resolve assignee profiles
    const assigneeIds = [...new Set(
      tasksRes.data
        .map((t: any) => t.assignee_id)
        .filter(Boolean)
    )];

    let assigneeMap: Record<string, { fullName: string; avatarUrl: string | null }> = {};
    if (assigneeIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", assigneeIds);
      if (profiles) {
        assigneeMap = Object.fromEntries(
          profiles.map((p: any) => [p.id, { fullName: p.full_name || "Unknown", avatarUrl: p.avatar_url }])
        );
      }
    }

    // Group tasks by section_id
    const tasksBySection: Record<string, Task[]> = {};
    for (const row of tasksRes.data) {
      const assigneeProfile = row.assignee_id ? assigneeMap[row.assignee_id] : null;
      const task: Task = {
        id: row.id,
        name: row.name,
        description: row.description || "",
        status: row.status,
        priority: row.priority,
        tag: row.tag,
        ...(row.completed_at ? { completedAt: row.completed_at } : {}),
        ...(row.subtasks ? { subtasks: row.subtasks } : {}),
        todayFocus: row.today_focus ?? false,
        assigneeId: row.assignee_id || null,
        assignee: assigneeProfile
          ? { userId: row.assignee_id, fullName: assigneeProfile.fullName, avatarUrl: assigneeProfile.avatarUrl }
          : null,
        commentCount: commentCounts[row.id] || 0,
      };
      if (!tasksBySection[row.section_id]) tasksBySection[row.section_id] = [];
      tasksBySection[row.section_id].push(task);
    }

    // Assemble ProjectData shape
    const sections: Section[] = sectionsRes.data.map((s) => ({
      id: s.id,
      name: s.name,
      order: s.order,
      phase: s.phase as 1 | 2 | 3,
      tasks: tasksBySection[s.id] || [],
    }));

    const data: ProjectData = {
      project: {
        name: projectRes.data.name,
        description: projectRes.data.description || "",
      },
      sections,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, name } = body as { sectionId: string; name: string };

    if (!sectionId || !name?.trim()) {
      return NextResponse.json({ error: "sectionId and name required" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const taskId = crypto.randomUUID();

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        id: taskId,
        project_id: projectId,
        section_id: sectionId,
        name: name.trim(),
        status: "todo",
        priority: "medium",
        tag: "Config",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: task.id,
      name: task.name,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      tag: task.tag,
      todayFocus: task.today_focus ?? false,
      assigneeId: null,
      assignee: null,
      commentCount: 0,
    });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, status, subtasks, name, description, priority, tag, todayFocus, assigneeId } = body as {
      taskId: string;
      status?: string;
      subtasks?: Array<{ id: string; name: string; completed: boolean; completedAt?: string }>;
      name?: string;
      description?: string;
      priority?: string;
      tag?: string;
      todayFocus?: boolean;
      assigneeId?: string | null;
    };

    if (!taskId) {
      return NextResponse.json({ error: "taskId required" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const updates: Record<string, unknown> = {};
    if (status !== undefined) {
      updates.status = status;
      if (status === "done") {
        updates.completed_at = new Date().toISOString();
      } else {
        updates.completed_at = null;
      }
    }
    if (subtasks !== undefined) updates.subtasks = subtasks;
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (tag !== undefined) updates.tag = tag;
    if (todayFocus !== undefined) updates.today_focus = todayFocus;
    if (assigneeId !== undefined) updates.assignee_id = assigneeId;

    const { error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .eq("project_id", projectId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/tasks error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
