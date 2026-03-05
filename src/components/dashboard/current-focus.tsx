"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Zap, Circle, CalendarCheck } from "lucide-react";
import { TagBadge } from "./tag-badge";
import type { ProjectData, Task, TaskStatus } from "@/lib/types";

export function CurrentFocus({
  data,
  onMarkDone,
  onTaskClick,
}: {
  data: ProjectData;
  onMarkDone: (taskId: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}) {
  const inProgressTasks = data.sections.flatMap((section) =>
    section.tasks
      .filter((t) => t.status === "in-progress")
      .map((t) => ({ ...t, sectionName: section.name }))
  );

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; taskId: string } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [contextMenu]);

  if (inProgressTasks.length === 0) return null;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--solvyn-rust)]/15 bg-[var(--solvyn-bg-raised)]">
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: "linear-gradient(to bottom, #C97A68, #D4A843, #8CA878)",
        }}
      />

      <div className="px-6 pt-5 pb-5">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--solvyn-rust)] to-[var(--solvyn-amber)]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--solvyn-text-primary)]">
              In Focus
            </h2>
            <p className="text-[11px] text-[var(--solvyn-text-tertiary)]">
              {inProgressTasks.length} task{inProgressTasks.length > 1 ? "s" : ""} in progress
            </p>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {inProgressTasks.map((task) => (
            <div
              key={task.id}
              className="group flex cursor-pointer items-center gap-3.5 rounded-xl bg-[var(--solvyn-bg-elevated)] px-4 py-3 transition-all duration-200 hover:bg-[var(--solvyn-bg-elevated)]/80"
              onClick={() => onTaskClick(task)}
              onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, taskId: task.id }); }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onMarkDone(task.id, "done"); }}
                className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--solvyn-rust)]/30 text-transparent transition-all duration-200 hover:border-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)] hover:text-white hover:scale-110"
                title="Mark as done"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--solvyn-text-primary)]">
                  {task.name}
                </p>
                <p className="text-[11px] text-[var(--solvyn-text-tertiary)]">{task.sectionName}</p>
              </div>
              <TagBadge tag={task.tag} />
            </div>
          ))}
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 min-w-[180px] rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-xl shadow-black/20"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              onMarkDone(contextMenu.taskId, "todo");
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
          >
            <Circle className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
            Set to Todo
          </button>
          <button
            onClick={() => {
              onMarkDone(contextMenu.taskId, "done");
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
          >
            <Check className="h-3.5 w-3.5 text-[var(--solvyn-olive)]" />
            Mark as Done
          </button>
        </div>
      )}
    </div>
  );
}
