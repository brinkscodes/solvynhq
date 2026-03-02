"use client";

import { Circle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MyTaskCard } from "./my-task-card";
import type { MyTask, MyTaskStatus } from "@/lib/my-tasks-types";

const columns: {
  status: MyTaskStatus;
  label: string;
  icon: typeof Circle;
  color: string;
  headerBg: string;
  headerBorder: string;
}[] = [
  {
    status: "todo",
    label: "To Do",
    icon: Circle,
    color: "var(--solvyn-text-tertiary)",
    headerBg: "bg-[var(--solvyn-bg-raised)]",
    headerBorder: "border-[var(--solvyn-border-subtle)]",
  },
  {
    status: "in-progress",
    label: "In Progress",
    icon: Clock,
    color: "var(--solvyn-rust)",
    headerBg: "bg-[var(--solvyn-rust-bg)]",
    headerBorder: "border-[var(--solvyn-rust)]/15",
  },
  {
    status: "done",
    label: "Done",
    icon: CheckCircle2,
    color: "var(--solvyn-olive)",
    headerBg: "bg-[var(--solvyn-olive-bg)]",
    headerBorder: "border-[var(--solvyn-olive)]/15",
  },
];

interface MyTasksKanbanViewProps {
  tasks: MyTask[];
  showCompleted: boolean;
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
}

export function MyTasksKanbanView({
  tasks,
  showCompleted,
  onStatusChange,
  onEdit,
}: MyTasksKanbanViewProps) {
  const visibleColumns = showCompleted
    ? columns
    : columns.filter((c) => c.status !== "done");

  return (
    <div className={cn(
      "grid grid-cols-1 gap-4",
      visibleColumns.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
    )}>
      {visibleColumns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="min-h-[200px]">
            <div
              className={cn(
                "mb-3 flex items-center gap-2 rounded-xl border px-4 py-2.5",
                col.headerBg,
                col.headerBorder
              )}
            >
              <col.icon className="h-4 w-4" style={{ color: col.color }} />
              <span className="text-[13px] font-semibold text-[var(--solvyn-text-primary)]">
                {col.label}
              </span>
              <span className="ml-auto text-[11px] font-bold text-[var(--solvyn-text-tertiary)]">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {columnTasks.map((task) => (
                <MyTaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-[var(--solvyn-border-default)] py-8">
                  <p className="text-[12px] text-[var(--solvyn-text-tertiary)]">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
