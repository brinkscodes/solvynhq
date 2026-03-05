"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskRow } from "./task-row";
import type { Task, Section, TaskStatus } from "@/lib/types";

export function SectionGroup({
  section,
  onStatusChange,
  onTaskClick,
  onToggleTodayFocus,
}: {
  section: Section;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
  onToggleTodayFocus?: (taskId: string, todayFocus: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const activeTasks = section.tasks.filter((t) => t.status !== "done");
  const total = section.tasks.length;
  const done = section.tasks.filter((t) => t.status === "done").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  if (activeTasks.length === 0) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-3 flex w-full items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--solvyn-text-tertiary)] transition-transform duration-200",
              collapsed && "-rotate-90"
            )}
          />
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
            {section.name}
          </h2>
        </div>
        <span className="text-xs font-medium text-[var(--solvyn-text-tertiary)]">
          {done}/{total}
        </span>
      </button>
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-[var(--solvyn-bg-elevated)]">
        <div
          className="h-full rounded-full bg-[var(--solvyn-olive)]/60 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {!collapsed && (
        <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]">
          {activeTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onClick={onTaskClick}
              onToggleTodayFocus={onToggleTodayFocus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
