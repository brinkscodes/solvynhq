"use client";

import { Circle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MyTaskCard } from "./my-task-card";
import type { MyTask, MyTaskStatus } from "@/lib/my-tasks-types";

const columns: {
  status: MyTaskStatus;
  label: string;
  icon: typeof Circle;
  color: string;
  headerBg: string;
  headerBorder: string;
}[] = [
  {
    status: "todo",
    label: "To Do",
    icon: Circle,
    color: "#2A2A2A",
    headerBg: "bg-[#2A2A2A]/[0.03]",
    headerBorder: "border-[#2A2A2A]/[0.08]",
  },
  {
    status: "in-progress",
    label: "In Progress",
    icon: Clock,
    color: "#B96E5C",
    headerBg: "bg-[#B96E5C]/[0.04]",
    headerBorder: "border-[#B96E5C]/15",
  },
  {
    status: "done",
    label: "Done",
    icon: CheckCircle2,
    color: "#6C7B5A",
    headerBg: "bg-[#6C7B5A]/[0.04]",
    headerBorder: "border-[#6C7B5A]/15",
  },
];

interface MyTasksKanbanViewProps {
  tasks: MyTask[];
  showCompleted: boolean;
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
}

export function MyTasksKanbanView({
  tasks,
  showCompleted,
  onStatusChange,
  onEdit,
}: MyTasksKanbanViewProps) {
  const visibleColumns = showCompleted
    ? columns
    : columns.filter((c) => c.status !== "done");

  return (
    <div className={cn(
      "grid grid-cols-1 gap-4",
      visibleColumns.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
    )}>
      {visibleColumns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="min-h-[200px]">
            {/* Column header */}
            <div
              className={cn(
                "mb-3 flex items-center gap-2 rounded-xl border px-4 py-2.5",
                col.headerBg,
                col.headerBorder
              )}
            >
              <col.icon className="h-4 w-4" style={{ color: col.color }} />
              <span className="text-[13px] font-semibold text-[#1A1A1A]">
                {col.label}
              </span>
              <span className="ml-auto text-[11px] font-bold text-[#1A1A1A]/25">
                {columnTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {columnTasks.map((task) => (
                <MyTaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-[#E8E4DE] py-8">
                  <p className="text-[12px] text-[#1A1A1A]/20">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
