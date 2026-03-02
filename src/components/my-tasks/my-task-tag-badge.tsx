"use client";

import { cn } from "@/lib/utils";
import type { MyTaskTag } from "@/lib/my-tasks-types";

const tagConfig: Record<MyTaskTag, { className: string }> = {
  Urgent:      { className: "bg-[var(--solvyn-rust-bg)] text-[var(--solvyn-rust)]" },
  "Follow-up": { className: "bg-[var(--solvyn-amber-bg)] text-[var(--solvyn-amber)]" },
  Idea:        { className: "bg-[#1C162A] text-[#A88BD4]" },
  Meeting:     { className: "bg-[#121A24] text-[#6B9ED6]" },
  Review:      { className: "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)]" },
  Waiting:     { className: "bg-[var(--solvyn-amber-bg)] text-[var(--solvyn-amber)]" },
  Personal:    { className: "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)]" },
  Research:    { className: "bg-[#1C162A] text-[#A88BD4]" },
};

export function MyTaskTagBadge({ tag }: { tag: MyTaskTag }) {
  const config = tagConfig[tag] ?? { className: "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)]" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        config.className
      )}
    >
      {tag}
    </span>
  );
}
