"use client";

import { TaskRow } from "./task-row";
import type { Section, TaskStatus } from "@/lib/types";

export function SectionGroup({
  section,
  onStatusChange,
}: {
  section: Section;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}) {
  const activeTasks = section.tasks.filter((t) => t.status !== "done");
  const total = section.tasks.length;
  const done = section.tasks.filter((t) => t.status === "done").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  if (activeTasks.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#1A1A1A]">
          {section.name}
        </h2>
        <span className="text-xs font-medium text-[#1A1A1A]/30">
          {done}/{total}
        </span>
      </div>
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-[#EAE4D9]/50">
        <div
          className="h-full rounded-full bg-[#6C7B5A]/60 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white">
        {activeTasks.map((task) => (
          <TaskRow key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}
