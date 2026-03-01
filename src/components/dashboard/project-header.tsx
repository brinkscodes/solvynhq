"use client";

import { cn } from "@/lib/utils";
import type { ProjectData } from "@/lib/types";

type View = "active" | "completed";

interface ProjectHeaderProps {
  data: ProjectData;
  view: View;
  onViewChange: (view: View) => void;
}

export function ProjectHeader({ data, view, onViewChange }: ProjectHeaderProps) {
  const allTasks = data.sections.flatMap((s) => s.tasks);
  const total = allTasks.length;
  const done = allTasks.filter((t) => t.status === "done").length;
  const inProgress = allTasks.filter((t) => t.status === "in-progress").length;
  const todo = allTasks.filter((t) => t.status === "todo").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mb-10">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[#2A2A2A]">
        {data.project.name}
      </h1>
      <p className="mt-1 text-sm text-[#2A2A2A]/50">{data.project.description}</p>

      {/* Progress bar */}
      <div className="mt-6 flex items-center gap-4">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#EAE4D9]">
          <div
            className="h-full rounded-full bg-[#6C7B5A] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="shrink-0 text-sm font-semibold text-[#6C7B5A]">{percent}%</span>
      </div>

      {/* Stats */}
      <div className="mt-3 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#6C7B5A]" />
          <span className="text-sm text-[#2A2A2A]/60">
            <span className="font-semibold text-[#2A2A2A]">{done}</span> Done
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#B96E5C]" />
          <span className="text-sm text-[#2A2A2A]/60">
            <span className="font-semibold text-[#2A2A2A]">{inProgress}</span> In Progress
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#EAE4D9]" />
          <span className="text-sm text-[#2A2A2A]/60">
            <span className="font-semibold text-[#2A2A2A]">{todo}</span> To Do
          </span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mt-6 flex gap-1 rounded-lg bg-[#EAE4D9]/60 p-1">
        <button
          onClick={() => onViewChange("active")}
          className={cn(
            "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
            view === "active"
              ? "bg-white text-[#2A2A2A] shadow-sm"
              : "text-[#2A2A2A]/40 hover:text-[#2A2A2A]/60"
          )}
        >
          Active ({todo + inProgress})
        </button>
        <button
          onClick={() => onViewChange("completed")}
          className={cn(
            "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
            view === "completed"
              ? "bg-white text-[#2A2A2A] shadow-sm"
              : "text-[#2A2A2A]/40 hover:text-[#2A2A2A]/60"
          )}
        >
          Completed ({done})
        </button>
      </div>
    </div>
  );
}
