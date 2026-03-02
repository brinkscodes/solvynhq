"use client";

import { cn } from "@/lib/utils";
import type { TaskTag } from "@/lib/types";

const tagConfig: Record<TaskTag, { className: string }> = {
  Homepage:    { className: "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)]" },
  Page:        { className: "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)]" },
  Nav:         { className: "bg-[#121A24] text-[#6B9ED6]" },
  Footer:      { className: "bg-[#121A24] text-[#6B9ED6]" },
  Config:      { className: "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)]" },
  Assets:      { className: "bg-[var(--solvyn-rust-bg)] text-[var(--solvyn-rust)]" },
  SEO:         { className: "bg-[#1C162A] text-[#A88BD4]" },
  Animation:   { className: "bg-[var(--solvyn-rust-bg)] text-[var(--solvyn-rust)]" },
  Performance: { className: "bg-[var(--solvyn-amber-bg)] text-[var(--solvyn-amber)]" },
  Responsive:  { className: "bg-[#121A24] text-[#6B9ED6]" },
  QA:          { className: "bg-[var(--solvyn-amber-bg)] text-[var(--solvyn-amber)]" },
  Review:      { className: "bg-[#1C162A] text-[#A88BD4]" },
  Launch:      { className: "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)]" },
  Design:      { className: "bg-[#1C162A] text-[#A88BD4]" },
  Mockup:      { className: "bg-[var(--solvyn-rust-bg)] text-[var(--solvyn-rust)]" },
  Legal:       { className: "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)]" },
  Form:        { className: "bg-[#121A24] text-[#6B9ED6]" },
  Automation:  { className: "bg-[var(--solvyn-amber-bg)] text-[var(--solvyn-amber)]" },
  Waiting:     { className: "bg-[var(--solvyn-amber-bg)] text-[var(--solvyn-amber)]" },
  Content:     { className: "bg-[#1C162A] text-[#A88BD4]" },
  Social:      { className: "bg-[#121A24] text-[#6B9ED6]" },
};

export function TagBadge({ tag }: { tag: TaskTag }) {
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
