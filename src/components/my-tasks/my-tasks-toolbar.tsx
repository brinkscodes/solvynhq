"use client";

import {
  Plus,
  ArrowDownAZ,
  Clock,
  CalendarCheck,
  ArrowUpDown,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MyTaskSortOption } from "@/lib/my-tasks-types";

interface MyTasksToolbarProps {
  sort: MyTaskSortOption;
  onSortChange: (sort: MyTaskSortOption) => void;
  onAddTask: () => void;
  onManageSections: () => void;
  showCompleted: boolean;
  onToggleCompleted: () => void;
  completedCount: number;
}

const sortOptions: { value: MyTaskSortOption; label: string; icon: React.ReactNode }[] = [
  { value: "position", label: "Default", icon: <ArrowUpDown className="h-3.5 w-3.5" /> },
  { value: "deadline", label: "Deadline", icon: <CalendarCheck className="h-3.5 w-3.5" /> },
  { value: "name", label: "A — Z", icon: <ArrowDownAZ className="h-3.5 w-3.5" /> },
  { value: "priority", label: "Priority", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { value: "created", label: "Newest", icon: <Clock className="h-3.5 w-3.5" /> },
];

export function MyTasksToolbar({
  sort,
  onSortChange,
  onAddTask,
  onManageSections,
  showCompleted,
  onToggleCompleted,
  completedCount,
}: MyTasksToolbarProps) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 rounded-xl bg-[var(--solvyn-olive)] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
        <button
          onClick={onManageSections}
          className="flex items-center gap-2 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] px-4 py-2.5 text-[13px] font-medium text-[var(--solvyn-text-secondary)] transition-all duration-200 hover:border-[var(--solvyn-border-strong)] hover:text-[var(--solvyn-text-primary)]"
        >
          <Layers className="h-3.5 w-3.5" />
          Sections
        </button>

        <div className="flex-1" />

        <button
          onClick={onToggleCompleted}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
            showCompleted
              ? "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)]"
              : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
          )}
        >
          {showCompleted ? "Hide" : "Show"} completed
          <span className={cn(
            "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
            showCompleted ? "bg-[var(--solvyn-olive)]/15 text-[var(--solvyn-olive)]" : "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)]"
          )}>
            {completedCount}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="mr-2 text-xs font-medium text-[var(--solvyn-text-tertiary)]">Sort</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200",
              sort === opt.value
                ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] border border-[var(--solvyn-border-default)]"
                : "border border-[var(--solvyn-border-subtle)] text-[var(--solvyn-text-tertiary)] hover:border-[var(--solvyn-border-default)] hover:text-[var(--solvyn-text-secondary)]"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
