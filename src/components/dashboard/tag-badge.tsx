"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskTag } from "@/lib/types";

const tagConfig: Record<TaskTag, { className: string }> = {
  Homepage:    { className: "bg-[#6C7B5A]/10 text-[#6C7B5A] border-[#6C7B5A]/20" },
  Page:        { className: "bg-[#6C7B5A]/10 text-[#6C7B5A] border-[#6C7B5A]/20" },
  Nav:         { className: "bg-[#4A6FA5]/10 text-[#4A6FA5] border-[#4A6FA5]/20" },
  Footer:      { className: "bg-[#4A6FA5]/10 text-[#4A6FA5] border-[#4A6FA5]/20" },
  Config:      { className: "bg-[#2A2A2A]/8 text-[#2A2A2A]/60 border-[#2A2A2A]/15" },
  Assets:      { className: "bg-[#B96E5C]/10 text-[#B96E5C] border-[#B96E5C]/20" },
  SEO:         { className: "bg-[#8B6DAF]/10 text-[#8B6DAF] border-[#8B6DAF]/20" },
  Animation:   { className: "bg-[#B96E5C]/10 text-[#B96E5C] border-[#B96E5C]/20" },
  Performance: { className: "bg-[#D4A843]/10 text-[#D4A843] border-[#D4A843]/20" },
  Responsive:  { className: "bg-[#4A6FA5]/10 text-[#4A6FA5] border-[#4A6FA5]/20" },
  QA:          { className: "bg-[#D4A843]/10 text-[#D4A843] border-[#D4A843]/20" },
  Review:      { className: "bg-[#8B6DAF]/10 text-[#8B6DAF] border-[#8B6DAF]/20" },
  Launch:      { className: "bg-[#6C7B5A]/10 text-[#6C7B5A] border-[#6C7B5A]/20" },
  Design:      { className: "bg-[#8B6DAF]/10 text-[#8B6DAF] border-[#8B6DAF]/20" },
  Mockup:      { className: "bg-[#B96E5C]/10 text-[#B96E5C] border-[#B96E5C]/20" },
};

export function TagBadge({ tag }: { tag: TaskTag }) {
  const config = tagConfig[tag];
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-medium uppercase tracking-wider", config.className)}
    >
      {tag}
    </Badge>
  );
}
