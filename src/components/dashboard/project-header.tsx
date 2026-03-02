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
      color: "var(--solvyn-olive)",
      bg: "bg-[var(--solvyn-olive-bg)]",
      border: "border-[var(--solvyn-olive)]/10",
      iconBg: "bg-[var(--solvyn-olive)]/15",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "var(--solvyn-rust)",
      bg: "bg-[var(--solvyn-rust-bg)]",
      border: "border-[var(--solvyn-rust)]/10",
      iconBg: "bg-[var(--solvyn-rust)]/15",
    },
    {
      label: "To Do",
      value: todo,
      icon: Circle,
      color: "var(--solvyn-text-tertiary)",
      bg: "bg-[var(--solvyn-bg-raised)]",
      border: "border-[var(--solvyn-border-subtle)]",
      iconBg: "bg-[var(--solvyn-bg-elevated)]",
    },
  ];

  return (
    <div className="mb-10">
      {/* Title area */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-[28px] font-bold tracking-tight text-[var(--solvyn-text-primary)]">
          {data.project.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--solvyn-text-tertiary)]">
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
                <p className="text-[32px] font-bold leading-none tracking-tight text-[var(--solvyn-text-primary)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[13px] font-medium text-[var(--solvyn-text-tertiary)]">
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
      <div className="rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--solvyn-olive)]/15">
              <TrendingUp className="h-4 w-4 text-[var(--solvyn-olive)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--solvyn-text-primary)]">
                Overall Progress
              </p>
              <p className="text-xs text-[var(--solvyn-text-tertiary)]">
                {done} of {total} tasks completed
              </p>
            </div>
          </div>
          <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--solvyn-text-primary)]">
            {percent}%
          </span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--solvyn-bg-elevated)]">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, #D4A843 0%, #8CA878 100%)",
            }}
          />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mt-6 flex gap-1 rounded-2xl bg-[var(--solvyn-bg-raised)] p-1.5 border border-[var(--solvyn-border-subtle)]">
        <button
          onClick={() => onViewChange("active")}
          className={cn(
            "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
            view === "active"
              ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-sm"
              : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
          )}
        >
          Active
          <span className={cn(
            "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
            view === "active"
              ? "bg-[var(--solvyn-olive)]/15 text-[var(--solvyn-olive)]"
              : "text-[var(--solvyn-text-tertiary)]"
          )}>
            {todo + inProgress}
          </span>
        </button>
        <button
          onClick={() => onViewChange("completed")}
          className={cn(
            "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
            view === "completed"
              ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-sm"
              : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
          )}
        >
          Completed
          <span className={cn(
            "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
            view === "completed"
              ? "bg-[var(--solvyn-olive)]/15 text-[var(--solvyn-olive)]"
              : "text-[var(--solvyn-text-tertiary)]"
          )}>
            {done}
          </span>
        </button>
      </div>
    </div>
  );
}
