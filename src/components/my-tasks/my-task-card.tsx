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
    <div className="rounded-xl border border-[#E8E4DE] bg-white p-3.5 transition-all hover:shadow-sm">
      {/* Name + edit */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className={cn(
          "text-[13px] font-medium text-[#1A1A1A] leading-snug",
          task.status === "done" && "line-through text-[#1A1A1A]/40"
        )}>
          {task.name}
        </p>
        <button
          onClick={() => onEdit(task)}
          className="shrink-0 rounded-md p-1 text-[#1A1A1A]/20 transition-colors hover:bg-[#1A1A1A]/[0.04] hover:text-[#1A1A1A]/50"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>

      {/* Notes preview */}
      {task.notes && (
        <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-[#1A1A1A]/35">
          {task.notes}
        </p>
      )}

      {/* Tags + priority + deadline */}
      <div className="mb-3 flex flex-wrap items-center gap-1">
        {task.tags.map((tag) => (
          <MyTaskTagBadge key={tag} tag={tag} />
        ))}
        <PriorityBadge priority={task.priority} />
        {task.deadline && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-medium",
              overdue ? "text-[#B96E5C]" : "text-[#1A1A1A]/35"
            )}
          >
            <Calendar className="h-3 w-3" />
            {formatDeadline(task.deadline)}
          </span>
        )}
      </div>

      {/* Status move buttons */}
      <div className="flex items-center gap-1.5">
        {transitions.prev && (
          <button
            onClick={() => onStatusChange(task.id, transitions.prev!)}
            className="flex items-center gap-1 rounded-lg bg-[#1A1A1A]/[0.04] px-2.5 py-1 text-[10px] font-semibold text-[#1A1A1A]/40 transition-colors hover:bg-[#1A1A1A]/[0.08]"
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
                ? "bg-[#6C7B5A]/10 text-[#6C7B5A] hover:bg-[#6C7B5A]/15"
                : "bg-[#B96E5C]/10 text-[#B96E5C] hover:bg-[#B96E5C]/15"
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
