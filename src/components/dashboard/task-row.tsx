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
        "border-b border-[#EAE4D9]/60 last:border-b-0",
        task.status === "done" && "opacity-60"
      )}
    >
      <div className="flex w-full items-center gap-3 px-4 py-3">
        {/* Checkbox — only for non-done tasks when handler exists */}
        {onStatusChange && task.status !== "done" ? (
          <button
            onClick={() => onStatusChange(task.id, "done")}
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-transparent transition-all",
              task.status === "in-progress"
                ? "border-[#B96E5C]/40 hover:border-[#6C7B5A] hover:bg-[#6C7B5A] hover:text-white"
                : "border-[#2A2A2A]/20 hover:border-[#6C7B5A] hover:bg-[#6C7B5A] hover:text-white"
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
                "h-4 w-4 text-[#2A2A2A]/30 transition-transform",
                expanded && "rotate-180"
              )}
            />
          </button>
        )}

        {/* Task name + completed timestamp */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="min-w-0 flex-1 text-left"
        >
          <span
            className={cn(
              "text-sm font-medium text-[#2A2A2A]",
              task.status === "done" && "line-through"
            )}
          >
            {task.name}
          </span>
          {showCompletedAt && task.completedAt && (
            <span className="ml-2 text-[11px] text-[#2A2A2A]/30">
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
      {expanded && (
        <div className="px-4 pb-3 pl-11">
          {showSection && (
            <p className="mb-1 text-xs font-medium text-[#2A2A2A]/30">{showSection}</p>
          )}
          <p className="text-sm leading-relaxed text-[#2A2A2A]/50">
            {task.description}
          </p>
        </div>
      )}
    </div>
  );
}
