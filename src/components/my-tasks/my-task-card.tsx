"use client";

import { ArrowRight, ArrowLeft, Calendar, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { MyTaskTagBadge } from "./my-task-tag-badge";
import { PriorityBadge } from "../dashboard/priority-badge";
import type { MyTask, MyTaskStatus } from "@/lib/my-tasks-types";

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(deadline: string | null, status: MyTaskStatus): boolean {
  if (!deadline || status === "done") return false;
  return new Date(deadline) < new Date();
}

const statusTransitions: Record<MyTaskStatus, { prev?: MyTaskStatus; next?: MyTaskStatus }> = {
  todo: { next: "in-progress" },
  "in-progress": { prev: "todo", next: "done" },
  done: { prev: "in-progress" },
};

export function MyTaskCard({
  task,
  onStatusChange,
  onEdit,
}: {
  task: MyTask;
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
}) {
  const overdue = isOverdue(task.deadline, task.status);
  const transitions = statusTransitions[task.status];

  return (
    <div className="rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] p-3.5 transition-all hover:border-[var(--solvyn-border-strong)]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className={cn(
          "text-[13px] font-medium text-[var(--solvyn-text-primary)] leading-snug",
          task.status === "done" && "line-through text-[var(--solvyn-text-tertiary)]"
        )}>
          {task.name}
        </p>
        <button
          onClick={() => onEdit(task)}
          className="shrink-0 rounded-md p-1 text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>

      {task.notes && (
        <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-[var(--solvyn-text-tertiary)]">
          {task.notes}
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-1">
        {task.tags.map((tag) => (
          <MyTaskTagBadge key={tag} tag={tag} />
        ))}
        <PriorityBadge priority={task.priority} />
        {task.deadline && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-medium",
              overdue ? "text-[var(--solvyn-rust)]" : "text-[var(--solvyn-text-tertiary)]"
            )}
          >
            <Calendar className="h-3 w-3" />
            {formatDeadline(task.deadline)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {transitions.prev && (
          <button
            onClick={() => onStatusChange(task.id, transitions.prev!)}
            className="flex items-center gap-1 rounded-lg bg-[var(--solvyn-bg-elevated)] px-2.5 py-1 text-[10px] font-semibold text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)]"
          >
            <ArrowLeft className="h-3 w-3" />
            {transitions.prev === "todo" ? "To Do" : "In Progress"}
          </button>
        )}
        {transitions.next && (
          <button
            onClick={() => onStatusChange(task.id, transitions.next!)}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors",
              transitions.next === "done"
                ? "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)] hover:brightness-110"
                : "bg-[var(--solvyn-rust-bg)] text-[var(--solvyn-rust)] hover:brightness-110"
            )}
          >
            {transitions.next === "done" ? "Done" : "In Progress"}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
