"use client";

import { useEffect } from "react";
import { X, ListChecks, CheckCircle2, Clock } from "lucide-react";
import { TagBadge } from "./tag-badge";
import type { Task } from "@/lib/types";

interface TodaySummaryModalProps {
  open: boolean;
  onClose: () => void;
  doneTasks: (Task & { sectionName: string })[];
  onTaskClick: (task: Task) => void;
}

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function TodaySummaryModal({
  open,
  onClose,
  doneTasks,
  onTaskClick,
}: TodaySummaryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 mx-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--solvyn-olive)]/15">
              <ListChecks className="h-4 w-4 text-[var(--solvyn-olive)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--solvyn-text-primary)]">
                Today&apos;s Summary
              </h3>
              <p className="text-[11px] text-[var(--solvyn-text-tertiary)]">
                {doneTasks.length} task{doneTasks.length !== 1 ? "s" : ""}{" "}
                completed today
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
          >
            <X className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
          </button>
        </div>

        {/* Task list */}
        <div className="max-h-[85vh] overflow-y-auto px-6 pb-6">
          {doneTasks.length > 0 ? (
            <div className="space-y-1.5">
              {doneTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    onClose();
                    onTaskClick(task);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-[var(--solvyn-bg-elevated)] px-4 py-2.5 text-left transition-all duration-200 hover:bg-[var(--solvyn-bg-elevated)]/80 hover:ring-1 hover:ring-[var(--solvyn-olive)]/20"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--solvyn-olive)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[var(--solvyn-text-primary)]">
                      {task.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-[11px] text-[var(--solvyn-text-tertiary)]">
                        {task.sectionName}
                      </span>
                      {task.completedAt && (
                        <>
                          <span className="text-[11px] text-[var(--solvyn-text-tertiary)]/40">
                            ·
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-[var(--solvyn-text-tertiary)]">
                            <Clock className="h-3 w-3" />
                            {formatTime(task.completedAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <TagBadge tag={task.tag} />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-[var(--solvyn-text-tertiary)]">
                No tasks completed yet today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
