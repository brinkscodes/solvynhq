"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/types";

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "border-transparent bg-[#F7F5F0] text-[#2A2A2A]/50",
  },
  medium: {
    label: "Medium",
    className: "border-transparent bg-[#EAE4D9] text-[#2A2A2A]/70",
  },
  high: {
    label: "High",
    className: "border-transparent bg-[#B96E5C]/15 text-[#B96E5C]",
  },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-normal", config.className)}>
      {config.label}
    </Badge>
  );
}
