"use client";

import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "bg-[#1A1A1A]/[0.04] text-[#1A1A1A]/45 border-transparent",
  },
  "in-progress": {
    label: "Active",
    className: "bg-[#B96E5C]/10 text-[#B96E5C] border-transparent",
  },
  done: {
    label: "Done",
    className: "bg-[#6C7B5A]/10 text-[#6C7B5A] border-transparent",
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
