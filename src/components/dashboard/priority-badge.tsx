"use client";

import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/types";

const priorityConfig: Record<TaskPriority, { label: string; dot: string; className: string }> = {
  low: {
    label: "Low",
    dot: "bg-[var(--solvyn-text-tertiary)]",
    className: "text-[var(--solvyn-text-tertiary)]",
  },
  medium: {
    label: "Med",
    dot: "bg-[var(--solvyn-amber)]",
    className: "text-[var(--solvyn-amber)]",
  },
  high: {
    label: "High",
    dot: "bg-[var(--solvyn-rust)]",
    className: "text-[var(--solvyn-rust)]",
  },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityConfig[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium",
        config.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
