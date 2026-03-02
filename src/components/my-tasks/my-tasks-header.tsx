"use client";

import { CheckCircle2, Clock, Circle, LayoutList, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MyTask, MyTaskView } from "@/lib/my-tasks-types";

interface MyTasksHeaderProps {
  tasks: MyTask[];
  view: MyTaskView;
  onViewChange: (view: MyTaskView) => void;
}

export function MyTasksHeader({ tasks, view, onViewChange }: MyTasksHeaderProps) {
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;

  const stats = [
    {
      label: "To Do",
      value: todo,
      icon: Circle,
      color: "var(--solvyn-text-tertiary)",
      bg: "bg-[var(--solvyn-bg-raised)]",
      border: "border-[var(--solvyn-border-subtle)]",
      iconBg: "bg-[var(--solvyn-bg-elevated)]",
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
      label: "Done",
      value: done,
      icon: CheckCircle2,
      color: "var(--solvyn-olive)",
      bg: "bg-[var(--solvyn-olive-bg)]",
      border: "border-[var(--solvyn-olive)]/10",
      iconBg: "bg-[var(--solvyn-olive)]/15",
    },
  ];

  return (
    <div className="mb-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[28px] font-bold tracking-tight text-[var(--solvyn-text-primary)]">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-[var(--solvyn-text-tertiary)]">
            Your personal task manager
          </p>
        </div>

        <div className="flex gap-1 rounded-xl bg-[var(--solvyn-bg-raised)] border border-[var(--solvyn-border-subtle)] p-1">
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              view === "list"
                ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-sm"
                : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
            )}
          >
            <LayoutList className="h-3.5 w-3.5" />
            List
          </button>
          <button
            onClick={() => onViewChange("kanban")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              view === "kanban"
                ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-sm"
                : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
            )}
          >
            <Columns3 className="h-3.5 w-3.5" />
            Kanban
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn("rounded-2xl border p-5 transition-all", stat.bg, stat.border)}
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
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", stat.iconBg)}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
