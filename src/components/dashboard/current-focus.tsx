"use client";

import { Check, Zap } from "lucide-react";
import { TagBadge } from "./tag-badge";
import type { ProjectData, TaskStatus } from "@/lib/types";

export function CurrentFocus({
  data,
  onMarkDone,
}: {
  data: ProjectData;
  onMarkDone: (taskId: string, status: TaskStatus) => void;
}) {
  const inProgressTasks = data.sections.flatMap((section) =>
    section.tasks
      .filter((t) => t.status === "in-progress")
      .map((t) => ({ ...t, sectionName: section.name }))
  );

  if (inProgressTasks.length === 0) return null;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#B96E5C]/15 bg-white">
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: "linear-gradient(to bottom, #B96E5C, #D4A843, #6C7B5A)",
        }}
      />

      <div className="px-6 pt-5 pb-5">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#B96E5C] to-[#D4A843]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1A1A1A]">
              In Focus
            </h2>
            <p className="text-[11px] text-[#1A1A1A]/35">
              {inProgressTasks.length} task{inProgressTasks.length > 1 ? "s" : ""} in progress
            </p>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {inProgressTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3.5 rounded-xl bg-[#F8F7F4] px-4 py-3 transition-all duration-200 hover:bg-[#F3F1EC]"
            >
              <button
                onClick={() => onMarkDone(task.id, "done")}
                className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[#B96E5C]/30 text-transparent transition-all duration-200 hover:border-[#6C7B5A] hover:bg-[#6C7B5A] hover:text-white hover:scale-110"
                title="Mark as done"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#1A1A1A]">
                  {task.name}
                </p>
                <p className="text-[11px] text-[#1A1A1A]/30">{task.sectionName}</p>
              </div>
              <TagBadge tag={task.tag} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
