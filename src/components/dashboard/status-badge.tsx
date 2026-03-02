"use client";

import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)] border-transparent",
  },
  "in-progress": {
    label: "Active",
    className: "bg-[var(--solvyn-rust-bg)] text-[var(--solvyn-rust)] border-transparent",
  },
  done: {
    label: "Done",
    className: "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)] border-transparent",
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
