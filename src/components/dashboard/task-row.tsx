"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { TagBadge } from "./tag-badge";
import type { Task, TaskStatus } from "@/lib/types";

function formatCompletedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }) + " at " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TaskRow({
  task,
  showSection,
  showCompletedAt,
  onStatusChange,
}: {
  task: Task;
  showSection?: string;
  showCompletedAt?: boolean;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "border-b border-[#E8E4DE]/60 transition-colors last:border-b-0",
        task.status === "done" ? "opacity-50" : "hover:bg-[#FAFAF7]"
      )}
    >
      <div className="flex w-full items-center gap-3.5 px-5 py-3.5">
        {/* Checkbox */}
        {onStatusChange && task.status !== "done" ? (
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
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[#1A1A1A]/25 transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
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
          {showCompletedAt && task.completedAt && (
            <span className="ml-2 text-[11px] text-[#1A1A1A]/25">
              {formatCompletedAt(task.completedAt)}
            </span>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          <TagBadge tag={task.tag} />
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </div>

      {/* Expanded description */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 pl-[52px]">
            {showSection && (
              <p className="mb-1 text-[11px] font-medium text-[#1A1A1A]/25">{showSection}</p>
            )}
            <p className="text-[13px] leading-relaxed text-[#1A1A1A]/45">
              {task.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
