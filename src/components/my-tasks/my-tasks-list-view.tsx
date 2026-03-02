"use client";

import { MyTaskSectionGroup } from "./my-task-section-group";
import type {
  MyTask,
  MyTaskSection,
  MyTaskStatus,
  MyTaskSortOption,
} from "@/lib/my-tasks-types";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function sortTasks(tasks: MyTask[], sort: MyTaskSortOption): MyTask[] {
  const sorted = [...tasks];
  switch (sort) {
    case "position":
      return sorted.sort((a, b) => a.position - b.position);
    case "deadline":
      return sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      });
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "priority":
      return sorted.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
    case "created":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    default:
      return sorted;
  }
}

interface MyTasksListViewProps {
  tasks: MyTask[];
  sections: MyTaskSection[];
  sort: MyTaskSortOption;
  showCompleted: boolean;
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
}

export function MyTasksListView({
  tasks,
  sections,
  sort,
  showCompleted,
  onStatusChange,
  onEdit,
}: MyTasksListViewProps) {
  const activeTasks = tasks.filter((t) => t.status !== "done");
  const completedTasks = tasks.filter((t) => t.status === "done");

  // Inbox = tasks with no section
  const inboxTasks = sortTasks(
    activeTasks.filter((t) => !t.sectionId),
    sort
  );

  // Tasks grouped by section
  const sectionGroups = sections.map((section) => ({
    section,
    tasks: sortTasks(
      activeTasks.filter((t) => t.sectionId === section.id),
      sort
    ),
  }));

  const hasActiveTasks = inboxTasks.length > 0 || sectionGroups.some((g) => g.tasks.length > 0);

  return (
    <div>
      {!hasActiveTasks && completedTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8E4DE] py-16">
          <p className="text-sm text-[#1A1A1A]/25">
            No tasks yet. Click &quot;Add Task&quot; to get started.
          </p>
        </div>
      )}

      {/* Inbox section first */}
      <MyTaskSectionGroup
        name="Inbox"
        isInbox
        tasks={inboxTasks}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />

      {/* Custom sections */}
      {sectionGroups.map(({ section, tasks: sectionTasks }) => (
        <MyTaskSectionGroup
          key={section.id}
          name={section.name}
          tasks={sectionTasks}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
        />
      ))}

      {/* Completed section */}
      {showCompleted && completedTasks.length > 0 && (
        <MyTaskSectionGroup
          name="Completed"
          tasks={sortTasks(completedTasks, "created")}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}
