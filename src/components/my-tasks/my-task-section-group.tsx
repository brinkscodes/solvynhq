"use client";

import { Inbox, FolderOpen } from "lucide-react";
import { MyTaskRow } from "./my-task-row";
import type { MyTask, MyTaskStatus } from "@/lib/my-tasks-types";

interface MyTaskSectionGroupProps {
  name: string;
  isInbox?: boolean;
  tasks: MyTask[];
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
  focusedTaskId?: string;
}

export function MyTaskSectionGroup({
  name,
  isInbox,
  tasks,
  onStatusChange,
  onEdit,
  focusedTaskId,
}: MyTaskSectionGroupProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        {isInbox ? (
          <Inbox className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
        ) : (
          <FolderOpen className="h-4 w-4 text-[var(--solvyn-olive)]/60" />
        )}
        <h3 className="text-[13px] font-semibold text-[var(--solvyn-text-secondary)]">
          {name}
        </h3>
        <span className="text-[11px] font-medium text-[var(--solvyn-text-tertiary)]">
          {tasks.length}
        </span>
        <div className="h-px flex-1 bg-[var(--solvyn-border-subtle)]" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]">
        {tasks.map((task) => (
          <MyTaskRow
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            focused={focusedTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}
