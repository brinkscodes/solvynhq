"use client";

import { CheckCircle2, Clock, Circle } from "lucide-react";
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
      <div
        className="overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white px-8 pb-6 pt-8"
        style={{
          boxShadow:
            "0 1px 3px rgba(42, 42, 42, 0.04), 0 4px 16px rgba(42, 42, 42, 0.06)",
        }}
      >
        {/* Accent bar */}
        <div
          className="-mx-8 -mt-8 mb-8 h-[2px]"
          style={{
            background: "linear-gradient(to right, #C9A96E, #B96E5C, #6C7B5A)",
          }}
        />

        {/* Logo + title */}
        <div className="flex items-center gap-4">
          <img src="/solvyn-logo.png" alt="Solvyn" className="w-24" />
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-[#2A2A2A]">
              {data.project.name}
            </h1>
            <p className="mt-0.5 text-sm font-light tracking-wide text-[#2A2A2A]/40">
              {data.project.description}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2A2A2A]/40">
              Progress
            </span>
            <span className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#2A2A2A]">
              {percent}%
            </span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#EAE4D9]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percent}%`,
                background: "linear-gradient(to right, #C9A96E, #6C7B5A)",
              }}
            />
          </div>
        </div>

        {/* Status chips */}
        <div className="mt-5 flex gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[#6C7B5A]/15 bg-[#6C7B5A]/[0.06] px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#6C7B5A]" />
            <span className="text-sm text-[#2A2A2A]/70">
              <span className="font-semibold text-[#2A2A2A]">{done}</span> Done
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#B96E5C]/15 bg-[#B96E5C]/[0.06] px-3 py-1">
            <Clock className="h-3.5 w-3.5 text-[#B96E5C]" />
            <span className="text-sm text-[#2A2A2A]/70">
              <span className="font-semibold text-[#2A2A2A]">{inProgress}</span> In Progress
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#2A2A2A]/[0.08] bg-[#2A2A2A]/[0.03] px-3 py-1">
            <Circle className="h-3.5 w-3.5 text-[#2A2A2A]/40" />
            <span className="text-sm text-[#2A2A2A]/70">
              <span className="font-semibold text-[#2A2A2A]">{todo}</span> To Do
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-8 flex gap-1 rounded-full bg-[#F5F3EF] p-1">
          <button
            onClick={() => onViewChange("active")}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all",
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
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all",
              view === "completed"
                ? "bg-white text-[#2A2A2A] shadow-sm"
                : "text-[#2A2A2A]/40 hover:text-[#2A2A2A]/60"
            )}
          >
            Completed ({done})
          </button>
        </div>
      </div>
    </div>
  );
}
