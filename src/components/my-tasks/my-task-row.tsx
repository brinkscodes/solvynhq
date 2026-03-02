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
  if (days < 0) return label; // overdue
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
}: {
  task: MyTask;
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const overdue = isOverdue(task.deadline, task.status);

  return (
    <div
      className={cn(
        "border-b border-[#E8E4DE]/60 transition-colors last:border-b-0",
        task.status === "done" ? "opacity-50" : "hover:bg-[#FAFAF7]"
      )}
    >
      <div className="flex w-full items-center gap-3.5 px-5 py-3.5">
        {/* Checkbox / Undo */}
        {task.status === "done" ? (
          <button
            onClick={() => onStatusChange(task.id, "todo")}
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[#6C7B5A]/30 bg-[#6C7B5A]/10 text-[#6C7B5A]/40 transition-all duration-200 hover:border-[#B96E5C] hover:bg-[#B96E5C]/10 hover:text-[#B96E5C] hover:scale-110"
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
                ? "border-[#B96E5C]/35 hover:border-[#6C7B5A] hover:bg-[#6C7B5A] hover:text-white hover:scale-110"
                : "border-[#1A1A1A]/15 hover:border-[#6C7B5A] hover:bg-[#6C7B5A] hover:text-white hover:scale-110"
            )}
            title="Mark as done"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </button>
        )}

        {/* Task name */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="min-w-0 flex-1 text-left"
        >
          <span
            className={cn(
              "text-[13px] font-medium text-[#1A1A1A]",
              task.status === "done" && "line-through text-[#1A1A1A]/40"
            )}
          >
            {task.name}
          </span>
        </button>

        {/* Badges */}
        <div className="flex shrink-0 items-center gap-1.5">
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
          <button
            onClick={() => onEdit(task)}
            className="ml-1 rounded-md p-1 text-[#1A1A1A]/20 transition-colors hover:bg-[#1A1A1A]/[0.04] hover:text-[#1A1A1A]/50"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <ChevronDown
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "h-4 w-4 cursor-pointer text-[#1A1A1A]/20 transition-transform duration-200 hover:text-[#1A1A1A]/40",
              expanded && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Expanded notes */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 pl-[52px]">
            {task.notes ? (
              <p className="text-[13px] leading-relaxed text-[#1A1A1A]/45 whitespace-pre-wrap">
                {task.notes}
              </p>
            ) : (
              <p className="text-[12px] italic text-[#1A1A1A]/25">No notes</p>
            )}
            {task.status !== "done" && task.status !== "in-progress" && (
              <button
                onClick={() => onStatusChange(task.id, "in-progress")}
                className="mt-2 rounded-lg bg-[#B96E5C]/10 px-3 py-1 text-[11px] font-semibold text-[#B96E5C] transition-colors hover:bg-[#B96E5C]/15"
              >
                Start Working
              </button>
            )}
            {task.status === "in-progress" && (
              <button
                onClick={() => onStatusChange(task.id, "todo")}
                className="mt-2 rounded-lg bg-[#1A1A1A]/[0.04] px-3 py-1 text-[11px] font-semibold text-[#1A1A1A]/40 transition-colors hover:bg-[#1A1A1A]/[0.08]"
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
