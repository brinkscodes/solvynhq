"use client";

import { cn } from "@/lib/utils";
import type { MyTaskTag } from "@/lib/my-tasks-types";

const tagConfig: Record<MyTaskTag, { className: string }> = {
  Urgent:      { className: "bg-[#B96E5C]/10 text-[#B96E5C]" },
  "Follow-up": { className: "bg-[#D4A843]/10 text-[#D4A843]" },
  Idea:        { className: "bg-[#8B6DAF]/10 text-[#8B6DAF]" },
  Meeting:     { className: "bg-[#4A6FA5]/10 text-[#4A6FA5]" },
  Review:      { className: "bg-[#6C7B5A]/10 text-[#6C7B5A]" },
  Waiting:     { className: "bg-[#D4A843]/10 text-[#D4A843]" },
  Personal:    { className: "bg-[#1A1A1A]/[0.06] text-[#1A1A1A]/50" },
  Research:    { className: "bg-[#8B6DAF]/10 text-[#8B6DAF]" },
};

export function MyTaskTagBadge({ tag }: { tag: MyTaskTag }) {
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
