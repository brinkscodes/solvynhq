"use client";

import { useState, useEffect, useRef } from "react";
import { Check, CalendarCheck, X, CheckCircle2, Zap, Circle, ListChecks, RotateCcw, AlertTriangle } from "lucide-react";
import { TagBadge } from "./tag-badge";
import { TodaySummaryModal } from "./today-summary-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ProjectData, Task, TaskStatus } from "@/lib/types";

export function WorkingOnToday({
  data,
  onMarkDone,
  onToggleTodayFocus,
  onResetToday,
  onTaskClick,
}: {
  data: ProjectData;
  onMarkDone: (taskId: string, status: TaskStatus) => void;
  onToggleTodayFocus: (taskId: string, todayFocus: boolean) => void;
  onResetToday: () => void;
  onTaskClick: (task: Task) => void;
}) {
  const activeTasks = data.sections.flatMap((section) =>
    section.tasks
      .filter((t) => t.todayFocus && t.status !== "done")
      .map((t) => ({ ...t, sectionName: section.name }))
  );

  const doneTasks = data.sections.flatMap((section) =>
    section.tasks
      .filter((t) => t.todayFocus && t.status === "done")
      .map((t) => ({ ...t, sectionName: section.name }))
  );

  const totalTasks = activeTasks.length + doneTasks.length;

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; taskId: string; taskStatus: TaskStatus } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [contextMenu]);

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--solvyn-amber)]/15 bg-[var(--solvyn-bg-raised)]">
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: "linear-gradient(to bottom, #D4A843, #C97A68)",
        }}
      />

      <div className="px-6 pt-5 pb-5">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--solvyn-amber)] to-[var(--solvyn-rust)]">
            <CalendarCheck className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-[var(--solvyn-text-primary)]">
              Working on Today
            </h2>
            <p className="text-[11px] text-[var(--solvyn-text-tertiary)]">
              {totalTasks > 0
                ? `${doneTasks.length}/${totalTasks} done`
                : "No tasks set for today"}
            </p>
          </div>
          {totalTasks > 0 && (
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] px-3 text-[11px] font-semibold text-[var(--solvyn-text-tertiary)] transition-all duration-200 hover:bg-[var(--solvyn-bg-base)] hover:text-[var(--solvyn-text-secondary)]"
              title="Clear all tasks from today and start fresh"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Day
            </button>
          )}
          {doneTasks.length > 0 && (
            <button
              onClick={() => setSummaryOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded-xl border border-[var(--solvyn-olive)]/20 bg-[var(--solvyn-olive)]/[0.08] px-3 text-[11px] font-semibold text-[var(--solvyn-olive)] transition-all duration-200 hover:bg-[var(--solvyn-olive)]/15 hover:border-[var(--solvyn-olive)]/30"
              title="View today's summary"
            >
              <ListChecks className="h-3.5 w-3.5" />
              Summary
            </button>
          )}
        </div>

        {/* Active tasks */}
        {activeTasks.length > 0 ? (
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="group flex cursor-pointer items-center gap-3.5 rounded-xl bg-[var(--solvyn-bg-elevated)] px-4 py-3 transition-all duration-200 hover:bg-[var(--solvyn-bg-elevated)]/80"
                onClick={() => onTaskClick(task)}
                onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, taskId: task.id, taskStatus: task.status }); }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onMarkDone(task.id, "done"); }}
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--solvyn-amber)]/30 text-transparent transition-all duration-200 hover:border-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)] hover:text-white hover:scale-110"
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
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleTodayFocus(task.id, false); }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[var(--solvyn-text-tertiary)] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[var(--solvyn-bg-base)] hover:text-[var(--solvyn-rust)]"
                  title="Remove from today"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : totalTasks === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--solvyn-border-default)] py-6 text-center">
            <p className="text-[12px] text-[var(--solvyn-text-tertiary)]">
              Open any task and tap the calendar icon to add it here.
            </p>
          </div>
        ) : null}

        {/* Completed today — shown at bottom */}
        {doneTasks.length > 0 && (
          <>
            {activeTasks.length > 0 && (
              <div className="my-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-[var(--solvyn-border-subtle)]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--solvyn-olive)]/60">
                  Done today
                </span>
                <div className="h-px flex-1 bg-[var(--solvyn-border-subtle)]" />
              </div>
            )}
            {activeTasks.length === 0 && (
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--solvyn-olive)]/60" />
                <span className="text-[11px] font-medium text-[var(--solvyn-olive)]/60">
                  All done for today!
                </span>
              </div>
            )}
            <div className="space-y-1.5">
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex cursor-pointer items-center gap-3.5 rounded-xl bg-[var(--solvyn-olive)]/[0.04] px-4 py-2.5"
                  onClick={() => onTaskClick(task)}
                  onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, taskId: task.id, taskStatus: task.status }); }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); onMarkDone(task.id, "in-progress"); }}
                    className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--solvyn-olive)] text-white transition-all duration-200 hover:bg-[var(--solvyn-olive)]/60 hover:scale-110"
                    title="Mark as not done"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--solvyn-text-tertiary)] line-through">
                      {task.name}
                    </p>
                    <p className="text-[11px] text-[var(--solvyn-text-tertiary)]/60">{task.sectionName}</p>
                  </div>
                  <TagBadge tag={task.tag} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <TodaySummaryModal
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        doneTasks={doneTasks}
        onTaskClick={onTaskClick}
      />

      {/* Reset Day confirmation dialog */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent showCloseButton={false} className="max-w-sm border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)]">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--solvyn-rust)]/10">
                <AlertTriangle className="h-4 w-4 text-[var(--solvyn-rust)]" />
              </div>
              <DialogTitle className="text-[15px] text-[var(--solvyn-text-primary)]">
                Reset today&apos;s tasks?
              </DialogTitle>
            </div>
            <DialogDescription className="text-[13px] text-[var(--solvyn-text-tertiary)]">
              This will remove {totalTasks} {totalTasks === 1 ? "task" : "tasks"} from your &quot;Working on Today&quot; list. You can undo this after.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              onClick={() => setResetConfirmOpen(false)}
              className="flex-1 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-base)] px-4 py-2.5 text-[13px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setResetConfirmOpen(false);
                onResetToday();
              }}
              className="flex-1 rounded-xl bg-[var(--solvyn-rust)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--solvyn-rust)]/90"
            >
              Reset Day
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 min-w-[180px] rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-xl shadow-black/20"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.taskStatus === "in-progress" ? (
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
          ) : contextMenu.taskStatus === "done" ? (
            <button
              onClick={() => {
                onMarkDone(contextMenu.taskId, "in-progress");
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
            >
              <Zap className="h-3.5 w-3.5 text-[var(--solvyn-rust)]" />
              Set to In Progress
            </button>
          ) : (
            <button
              onClick={() => {
                onMarkDone(contextMenu.taskId, "in-progress");
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
            >
              <Zap className="h-3.5 w-3.5 text-[var(--solvyn-rust)]" />
              Set to In Progress
            </button>
          )}
          <button
            onClick={() => {
              onToggleTodayFocus(contextMenu.taskId, false);
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
          >
            <CalendarCheck className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
            Remove from Today
          </button>
        </div>
      )}
    </div>
  );
}
