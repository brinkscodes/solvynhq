import { Dashboard } from "@/components/dashboard/dashboard";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { FloatingAgenda } from "@/components/meetings/floating-agenda";
import type { ProjectData, Task, Section } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export const dynamic = "force-dynamic";

async function getTaskData(): Promise<ProjectData> {
  const supabase = await createClient();
  const projectId = await getProjectId();

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
    tasksRes.data.map((t: any) => t.assignee_id).filter(Boolean)
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
      todayOrder: row.today_order ?? 0,
      assigneeId: row.assignee_id || null,
      assignee: assigneeProfile
        ? { userId: row.assignee_id, fullName: assigneeProfile.fullName, avatarUrl: assigneeProfile.avatarUrl }
        : null,
      commentCount: commentCounts[row.id] || 0,
    };
    if (!tasksBySection[row.section_id]) tasksBySection[row.section_id] = [];
    tasksBySection[row.section_id].push(task);
  }

  const sections: Section[] = (sectionsRes.data || []).map((s) => ({
    id: s.id,
    name: s.name,
    order: s.order,
    phase: s.phase as 1 | 2 | 3,
    tasks: tasksBySection[s.id] || [],
  }));

  return {
    project: {
      name: projectRes.data.name,
      description: projectRes.data.description || "",
    },
    sections,
  };
}

export default async function Page() {
  const data = await getTaskData();

  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <Dashboard data={data} />
        </div>
      </main>
      <FloatingAgenda />
      <FloatingNotepad />
    </div>
  );
}
