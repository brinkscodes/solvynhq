"use client";

import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/types";

const priorityConfig: Record<TaskPriority, { label: string; dot: string; className: string }> = {
  low: {
    label: "Low",
    dot: "bg-[#1A1A1A]/20",
    className: "text-[#1A1A1A]/35",
  },
  medium: {
    label: "Med",
    dot: "bg-[#D4A843]",
    className: "text-[#1A1A1A]/50",
  },
  high: {
    label: "High",
    dot: "bg-[#B96E5C]",
    className: "text-[#B96E5C]",
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
