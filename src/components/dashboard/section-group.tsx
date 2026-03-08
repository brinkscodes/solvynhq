"use client";

import { useState, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskRow } from "./task-row";
import type { Task, Section, TaskStatus } from "@/lib/types";

export function SectionGroup({
  section,
  onStatusChange,
  onTaskClick,
  onToggleTodayFocus,
  onCreateTask,
}: {
  section: Section;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
  onToggleTodayFocus?: (taskId: string, todayFocus: boolean) => void;
  onCreateTask?: (sectionId: string, name: string) => Promise<void>;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const activeTasks = section.tasks.filter((t) => t.status !== "done");
  const total = section.tasks.length;
  const done = section.tasks.filter((t) => t.status === "done").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  if (activeTasks.length === 0 && !adding) return null;

  const handleAdd = async () => {
    if (!newTaskName.trim() || !onCreateTask) return;
    await onCreateTask(section.id, newTaskName.trim());
    setNewTaskName("");
    inputRef.current?.focus();
  };

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
        <>
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
            {adding && (
              <div className="flex items-center gap-3.5 border-t border-[var(--solvyn-border-subtle)] px-5 py-3">
                <div className="h-[22px] w-[22px] shrink-0 rounded-full border-2 border-[var(--solvyn-border-strong)]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") { setAdding(false); setNewTaskName(""); }
                  }}
                  placeholder="Task name..."
                  autoFocus
                  className="flex-1 bg-transparent text-[13px] font-medium text-[var(--solvyn-text-primary)] placeholder:text-[var(--solvyn-text-tertiary)] outline-none"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newTaskName.trim()}
                  className="rounded-lg bg-[var(--solvyn-olive)] px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-40"
                >
                  Add
                </button>
                <button
                  onClick={() => { setAdding(false); setNewTaskName(""); }}
                  className="text-[11px] font-medium text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {onCreateTask && !adding && (
            <button
              onClick={() => setAdding(true)}
              className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-elevated)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add task
            </button>
          )}
        </>
      )}
    </div>
  );
}
