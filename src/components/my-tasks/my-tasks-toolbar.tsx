"use client";

import {
  Plus,
  ArrowDownAZ,
  ArrowUpAZ,
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
      {/* Top row: Add Task + Manage Sections */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 rounded-xl bg-[#1A1B23] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#2A2B33]"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
        <button
          onClick={onManageSections}
          className="flex items-center gap-2 rounded-xl border border-[#E8E4DE] bg-white px-4 py-2.5 text-[13px] font-medium text-[#1A1A1A]/50 transition-all duration-200 hover:border-[#1A1A1A]/15 hover:text-[#1A1A1A]/70"
        >
          <Layers className="h-3.5 w-3.5" />
          Sections
        </button>

        <div className="flex-1" />

        {/* Toggle completed */}
        <button
          onClick={onToggleCompleted}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
            showCompleted
              ? "bg-[#6C7B5A]/10 text-[#6C7B5A]"
              : "text-[#1A1A1A]/30 hover:text-[#1A1A1A]/50"
          )}
        >
          {showCompleted ? "Hide" : "Show"} completed
          <span className={cn(
            "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
            showCompleted ? "bg-[#6C7B5A]/15 text-[#6C7B5A]" : "bg-[#1A1A1A]/[0.06] text-[#1A1A1A]/30"
          )}>
            {completedCount}
          </span>
        </button>
      </div>

      {/* Sort row */}
      <div className="flex items-center gap-1.5">
        <span className="mr-2 text-xs font-medium text-[#1A1A1A]/30">Sort</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200",
              sort === opt.value
                ? "bg-[#1A1A1A] text-white"
                : "border border-[#E8E4DE] bg-white text-[#1A1A1A]/40 hover:border-[#1A1A1A]/15 hover:text-[#1A1A1A]/60"
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
