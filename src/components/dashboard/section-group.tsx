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
      <div className="mb-3 flex items-end justify-between px-4">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2A2A2A]">
          {section.name}
        </h2>
        <span className="text-xs text-[#2A2A2A]/40">
          {done} of {total} complete
        </span>
      </div>
      <div className="mx-4 mb-4 h-1.5 overflow-hidden rounded-full bg-[#EAE4D9]">
        <div
          className="h-full rounded-full bg-[#6C7B5A] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="rounded-lg border border-[#EAE4D9] bg-white">
        {activeTasks.map((task) => (
          <TaskRow key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}
