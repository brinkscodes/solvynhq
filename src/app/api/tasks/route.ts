import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";
import type { ProjectData, Task, Section } from "@/lib/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    // Parallel queries
    const [projectRes, sectionsRes, tasksRes] = await Promise.all([
      supabase.from("projects").select("name, description").eq("id", projectId).single(),
      supabase.from("sections").select("*").eq("project_id", projectId).order("order"),
      supabase.from("tasks").select("*").eq("project_id", projectId),
    ]);

    if (projectRes.error) throw projectRes.error;
    if (sectionsRes.error) throw sectionsRes.error;
    if (tasksRes.error) throw tasksRes.error;

    // Group tasks by section_id
    const tasksBySection: Record<string, Task[]> = {};
    for (const row of tasksRes.data) {
      const task: Task = {
        id: row.id,
        name: row.name,
        description: row.description || "",
        status: row.status,
        priority: row.priority,
        tag: row.tag,
        ...(row.completed_at ? { completedAt: row.completed_at } : {}),
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, status } = body as { taskId: string; status: string };

    if (!taskId || !status) {
      return NextResponse.json({ error: "taskId and status required" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    const updates: Record<string, unknown> = { status };
    if (status === "done") {
      updates.completed_at = new Date().toISOString();
    } else {
      updates.completed_at = null;
    }

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
