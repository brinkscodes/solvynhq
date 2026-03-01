"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskRow } from "./task-row";
import type { Task, Section } from "@/lib/types";

interface DoneTask extends Task {
  sectionName: string;
}

export function DoneSection({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState(false);

  const doneTasks: DoneTask[] = sections.flatMap((section) =>
    section.tasks
      .filter((t) => t.status === "done")
      .map((t) => ({ ...t, sectionName: section.name }))
  );

  if (doneTasks.length === 0) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 flex w-full items-center gap-2 px-4 transition-colors hover:opacity-80"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6C7B5A]">
          <Check className="h-3.5 w-3.5 text-white" />
        </div>
        <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#6C7B5A]">
          Completed
        </h2>
        <span className="text-xs text-[#2A2A2A]/40">
          {doneTasks.length} {doneTasks.length === 1 ? "task" : "tasks"}
        </span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-[#6C7B5A]/50 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="rounded-lg border border-[#6C7B5A]/20 bg-white">
          {doneTasks.map((task) => (
            <TaskRow key={task.id} task={task} showSection={task.sectionName} />
          ))}
        </div>
      )}
    </div>
  );
}
