"use client";

import { cn } from "@/lib/utils";
import type { TaskTag } from "@/lib/types";

const tagConfig: Record<TaskTag, { className: string }> = {
  Homepage:    { className: "bg-[#6C7B5A]/8 text-[#6C7B5A]" },
  Page:        { className: "bg-[#6C7B5A]/8 text-[#6C7B5A]" },
  Nav:         { className: "bg-[#4A6FA5]/8 text-[#4A6FA5]" },
  Footer:      { className: "bg-[#4A6FA5]/8 text-[#4A6FA5]" },
  Config:      { className: "bg-[#1A1A1A]/5 text-[#1A1A1A]/50" },
  Assets:      { className: "bg-[#B96E5C]/8 text-[#B96E5C]" },
  SEO:         { className: "bg-[#8B6DAF]/8 text-[#8B6DAF]" },
  Animation:   { className: "bg-[#B96E5C]/8 text-[#B96E5C]" },
  Performance: { className: "bg-[#D4A843]/8 text-[#D4A843]" },
  Responsive:  { className: "bg-[#4A6FA5]/8 text-[#4A6FA5]" },
  QA:          { className: "bg-[#D4A843]/8 text-[#D4A843]" },
  Review:      { className: "bg-[#8B6DAF]/8 text-[#8B6DAF]" },
  Launch:      { className: "bg-[#6C7B5A]/8 text-[#6C7B5A]" },
  Design:      { className: "bg-[#8B6DAF]/8 text-[#8B6DAF]" },
  Mockup:      { className: "bg-[#B96E5C]/8 text-[#B96E5C]" },
  Legal:       { className: "bg-[#1A1A1A]/5 text-[#1A1A1A]/50" },
  Form:        { className: "bg-[#4A6FA5]/8 text-[#4A6FA5]" },
  Automation:  { className: "bg-[#D4A843]/8 text-[#D4A843]" },
  Waiting:     { className: "bg-[#D4A843]/8 text-[#D4A843]" },
  Content:     { className: "bg-[#8B6DAF]/8 text-[#8B6DAF]" },
  Social:      { className: "bg-[#4A6FA5]/8 text-[#4A6FA5]" },
};

export function TagBadge({ tag }: { tag: TaskTag }) {
  const config = tagConfig[tag] ?? { className: "bg-[#1A1A1A]/5 text-[#1A1A1A]/50" };
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
