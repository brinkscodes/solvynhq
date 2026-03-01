"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "border-[#2A2A2A]/20 bg-transparent text-[#2A2A2A]/60",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-transparent bg-[#B96E5C] text-white",
  },
  done: {
    label: "Done",
    className: "border-transparent bg-[#6C7B5A] text-white",
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
