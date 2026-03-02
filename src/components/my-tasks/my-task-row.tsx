"use client";

import { useState } from "react";
import { Check, ChevronDown, Undo2, Calendar, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { MyTaskTagBadge } from "./my-task-tag-badge";
import { PriorityBadge } from "../dashboard/priority-badge";
import type { MyTask, MyTaskStatus } from "@/lib/my-tasks-types";

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (days < 0) return label;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return label;
}

function isOverdue(deadline: string | null, status: MyTaskStatus): boolean {
  if (!deadline || status === "done") return false;
  return new Date(deadline) < new Date();
}

export function MyTaskRow({
  task,
  onStatusChange,
  onEdit,
  focused,
}: {
  task: MyTask;
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
  focused?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const overdue = isOverdue(task.deadline, task.status);

  return (
    <div
      className={cn(
        "border-b border-[var(--solvyn-border-subtle)] transition-colors last:border-b-0",
        task.status === "done" ? "opacity-50" : "hover:bg-[var(--solvyn-bg-elevated)]/50",
        focused && "bg-[var(--solvyn-bg-elevated)]/70 ring-1 ring-inset ring-[var(--solvyn-olive)]/20"
      )}
    >
      <div className="flex w-full items-center gap-3.5 px-5 py-3.5">
        {task.status === "done" ? (
          <button
            onClick={() => onStatusChange(task.id, "todo")}
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-olive)]/10 text-[var(--solvyn-olive)]/40 transition-all duration-200 hover:border-[var(--solvyn-rust)] hover:bg-[var(--solvyn-rust)]/10 hover:text-[var(--solvyn-rust)] hover:scale-110"
            title="Mark as to do"
          >
            <Undo2 className="h-3 w-3" strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={() => onStatusChange(task.id, "done")}
            className={cn(
              "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 text-transparent transition-all duration-200",
              task.status === "in-progress"
                ? "border-[var(--solvyn-rust)]/35 hover:border-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)] hover:text-white hover:scale-110"
                : "border-[var(--solvyn-border-strong)] hover:border-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)] hover:text-white hover:scale-110"
            )}
            title="Mark as done"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </button>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="min-w-0 flex-1 text-left"
        >
          <span
            className={cn(
              "text-[13px] font-medium text-[var(--solvyn-text-primary)]",
              task.status === "done" && "line-through text-[var(--solvyn-text-tertiary)]"
            )}
          >
            {task.name}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
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
          <button
            onClick={() => onEdit(task)}
            className="ml-1 rounded-md p-1 text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <ChevronDown
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "h-4 w-4 cursor-pointer text-[var(--solvyn-text-tertiary)] transition-transform duration-200 hover:text-[var(--solvyn-text-secondary)]",
              expanded && "rotate-180"
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 pl-[52px]">
            {task.notes ? (
              <p className="text-[13px] leading-relaxed text-[var(--solvyn-text-secondary)] whitespace-pre-wrap">
                {task.notes}
              </p>
            ) : (
              <p className="text-[12px] italic text-[var(--solvyn-text-tertiary)]">No notes</p>
            )}
            {task.status !== "done" && task.status !== "in-progress" && (
              <button
                onClick={() => onStatusChange(task.id, "in-progress")}
                className="mt-2 rounded-lg bg-[var(--solvyn-rust-bg)] px-3 py-1 text-[11px] font-semibold text-[var(--solvyn-rust)] transition-colors hover:brightness-110"
              >
                Start Working
              </button>
            )}
            {task.status === "in-progress" && (
              <button
                onClick={() => onStatusChange(task.id, "todo")}
                className="mt-2 rounded-lg bg-[var(--solvyn-bg-elevated)] px-3 py-1 text-[11px] font-semibold text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)]"
              >
                Move back to To Do
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
