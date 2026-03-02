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
      color: "#2A2A2A",
      bg: "bg-[#2A2A2A]/[0.02]",
      border: "border-[#2A2A2A]/[0.06]",
      iconBg: "bg-[#2A2A2A]/[0.04]",
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
      label: "Done",
      value: done,
      icon: CheckCircle2,
      color: "#6C7B5A",
      bg: "bg-[#6C7B5A]/[0.06]",
      border: "border-[#6C7B5A]/10",
      iconBg: "bg-[#6C7B5A]/10",
    },
  ];

  return (
    <div className="mb-10">
      {/* Title + View Toggle */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[28px] font-bold tracking-tight text-[#1A1A1A]">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-[#1A1A1A]/40">
            Your personal task manager
          </p>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 rounded-xl bg-[#EAE4D9]/40 p-1">
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              view === "list"
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "text-[#1A1A1A]/35 hover:text-[#1A1A1A]/55"
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
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "text-[#1A1A1A]/35 hover:text-[#1A1A1A]/55"
            )}
          >
            <Columns3 className="h-3.5 w-3.5" />
            Kanban
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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
    </div>
  );
}
