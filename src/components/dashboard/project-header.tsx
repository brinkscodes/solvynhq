"use client";

import { CheckCircle2, Clock, Circle, TrendingUp } from "lucide-react";
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

  const stats = [
    {
      label: "Completed",
      value: done,
      icon: CheckCircle2,
      color: "#6C7B5A",
      bg: "bg-[#6C7B5A]/[0.06]",
      border: "border-[#6C7B5A]/10",
      iconBg: "bg-[#6C7B5A]/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "#B96E5C",
      bg: "bg-[#B96E5C]/[0.04]",
      border: "border-[#B96E5C]/10",
      iconBg: "bg-[#B96E5C]/10",
    },
    {
      label: "To Do",
      value: todo,
      icon: Circle,
      color: "#2A2A2A",
      bg: "bg-[#2A2A2A]/[0.02]",
      border: "border-[#2A2A2A]/[0.06]",
      iconBg: "bg-[#2A2A2A]/[0.04]",
    },
  ];

  return (
    <div className="mb-10">
      {/* Title area */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-[28px] font-bold tracking-tight text-[#1A1A1A]">
          {data.project.name}
        </h1>
        <p className="mt-1 text-sm text-[#1A1A1A]/40">
          {data.project.description}
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-2xl border p-5 transition-all",
              stat.bg,
              stat.border
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[32px] font-bold leading-none tracking-tight text-[#1A1A1A]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[13px] font-medium text-[#1A1A1A]/40">
                  {stat.label}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  stat.iconBg
                )}
              >
                <stat.icon
                  className="h-5 w-5"
                  style={{ color: stat.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-[#E8E4DE] bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C7B5A]/10">
              <TrendingUp className="h-4 w-4 text-[#6C7B5A]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Overall Progress
              </p>
              <p className="text-xs text-[#1A1A1A]/35">
                {done} of {total} tasks completed
              </p>
            </div>
          </div>
          <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1A1A1A]">
            {percent}%
          </span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#EAE4D9]/60">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, #C9A96E 0%, #6C7B5A 100%)",
            }}
          />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mt-6 flex gap-1 rounded-2xl bg-[#EAE4D9]/40 p-1.5">
        <button
          onClick={() => onViewChange("active")}
          className={cn(
            "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
            view === "active"
              ? "bg-white text-[#1A1A1A] shadow-sm"
              : "text-[#1A1A1A]/35 hover:text-[#1A1A1A]/55"
          )}
        >
          Active
          <span className={cn(
            "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
            view === "active"
              ? "bg-[#1A1A1A]/[0.06] text-[#1A1A1A]/60"
              : "bg-transparent text-[#1A1A1A]/25"
          )}>
            {todo + inProgress}
          </span>
        </button>
        <button
          onClick={() => onViewChange("completed")}
          className={cn(
            "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
            view === "completed"
              ? "bg-white text-[#1A1A1A] shadow-sm"
              : "text-[#1A1A1A]/35 hover:text-[#1A1A1A]/55"
          )}
        >
          Completed
          <span className={cn(
            "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
            view === "completed"
              ? "bg-[#6C7B5A]/10 text-[#6C7B5A]"
              : "bg-transparent text-[#1A1A1A]/25"
          )}>
            {done}
          </span>
        </button>
      </div>
    </div>
  );
}
