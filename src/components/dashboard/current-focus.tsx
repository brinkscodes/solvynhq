"use client";

import { Check, Flame } from "lucide-react";
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
    <div className="relative mb-6 overflow-hidden rounded-xl border border-[#B96E5C]/30 bg-gradient-to-br from-[#B96E5C]/8 via-[#EAE4D9]/40 to-[#6C7B5A]/8">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#B96E5C] via-[#D4A843] to-[#6C7B5A]" />

      <div className="px-5 pt-5 pb-4">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B96E5C] shadow-sm">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <h2
            className="text-sm font-semibold tracking-wide uppercase text-[#2A2A2A]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Currently Working On
          </h2>
          <span className="ml-auto rounded-full bg-[#B96E5C]/15 px-2.5 py-0.5 text-xs font-semibold text-[#B96E5C]">
            {inProgressTasks.length} active
          </span>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {inProgressTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-lg border border-[#B96E5C]/15 bg-white/70 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white"
            >
              <button
                onClick={() => onMarkDone(task.id, "done")}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#B96E5C]/40 text-transparent transition-all hover:border-[#6C7B5A] hover:bg-[#6C7B5A] hover:text-white"
                title="Mark as done"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#2A2A2A]">
                  {task.name}
                </p>
                <p className="text-xs text-[#2A2A2A]/40">{task.sectionName}</p>
              </div>
              <TagBadge tag={task.tag} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
