"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Undo2, CalendarCheck, Zap, Circle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { TagBadge } from "./tag-badge";
import { Avatar } from "@/components/shared/avatar";
import type { Task, TaskStatus } from "@/lib/types";

function formatCompletedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }) + " at " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TaskRow({
  task,
  showSection,
  showCompletedAt,
  onStatusChange,
  onClick,
  onToggleTodayFocus,
}: {
  task: Task;
  showSection?: string;
  showCompletedAt?: boolean;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onClick?: (task: Task) => void;
  onToggleTodayFocus?: (taskId: string, todayFocus: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [contextMenu]);

  const handleRowClick = () => {
    if (onClick) {
      onClick(task);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      className={cn(
        "relative border-b border-[var(--solvyn-border-subtle)] transition-colors last:border-b-0",
        task.status === "done"
          ? "opacity-50 hover:opacity-100"
          : "hover:bg-[var(--solvyn-bg-elevated)]/50"
      )}
      onContextMenu={(e) => {
        if (!onToggleTodayFocus && !onStatusChange) return;
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      {/* Context menu */}
      {contextMenu && (onToggleTodayFocus || onStatusChange) && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 min-w-[180px] rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-xl shadow-black/20"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {onStatusChange && task.status !== "in-progress" && task.status !== "done" && (
            <button
              onClick={() => {
                onStatusChange(task.id, "in-progress");
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
            >
              <Zap className="h-3.5 w-3.5 text-[var(--solvyn-rust)]" />
              Set to In Progress
            </button>
          )}
          {onStatusChange && task.status === "in-progress" && (
            <button
              onClick={() => {
                onStatusChange(task.id, "todo");
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
            >
              <Circle className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
              Set to Todo
            </button>
          )}
          {onToggleTodayFocus && (
            <button
              onClick={() => {
                onToggleTodayFocus(task.id, !task.todayFocus);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-base)]"
            >
              <CalendarCheck className={cn("h-3.5 w-3.5", task.todayFocus ? "text-[var(--solvyn-amber)]" : "text-[var(--solvyn-text-tertiary)]")} />
              {task.todayFocus ? "Remove from Today" : "Add to Today"}
            </button>
          )}
        </div>
      )}
      {/* Undo confirmation popup */}
      {showUndoConfirm && (
        <div className="absolute left-10 top-1/2 z-20 -translate-y-1/2 animate-[slideUp_0.15s_ease-out]">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] px-4 py-2.5 shadow-lg shadow-black/20">
            <p className="text-[12px] text-[var(--solvyn-text-secondary)]">Move back to active?</p>
            <button
              onClick={() => {
                onStatusChange?.(task.id, "todo");
                setShowUndoConfirm(false);
              }}
              className="rounded-lg bg-[var(--solvyn-rust)] px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:brightness-110"
            >
              Undo
            </button>
            <button
              onClick={() => setShowUndoConfirm(false)}
              className="rounded-lg bg-[var(--solvyn-bg-base)] px-3 py-1 text-[11px] font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex w-full items-center gap-3.5 px-5 py-3.5">
        {/* Checkbox / Undo */}
        {onStatusChange && task.status === "done" ? (
          <button
            onClick={() => setShowUndoConfirm(true)}
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-olive)]/10 text-[var(--solvyn-olive)]/40 transition-all duration-200 hover:border-[var(--solvyn-rust)] hover:bg-[var(--solvyn-rust)]/10 hover:text-[var(--solvyn-rust)] hover:scale-110"
            title="Mark as to do"
          >
            <Undo2 className="h-3 w-3" strokeWidth={2.5} />
          </button>
        ) : onStatusChange && task.status !== "done" ? (
          <button
            onClick={() => onStatusChange(task.id, "done")}
            className={cn(
              "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 text-transparent transition-all duration-200",
              task.status === "in-progress"
                ? "border-[var(--solvyn-rust)]/35 hover:border-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)] hover:text-white hover:scale-110"
                : "border-[var(--solvyn-border-strong)] hover:border-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)] hover:text-white hover:scale-110"
            )}
            title="Mark as done"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={handleRowClick}
            className="shrink-0"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[var(--solvyn-text-tertiary)] transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>
        )}

        {/* Task name */}
        <button
          onClick={handleRowClick}
          className="min-w-0 flex-1 text-left"
        >
          <span
            className={cn(
              "text-[13px] font-medium text-[var(--solvyn-text-primary)]",
              task.status === "done" && "line-through text-[var(--solvyn-text-tertiary)]"
            )}
          >
            {task.name}
          </span>
          {showCompletedAt && task.completedAt && (
            <span className="ml-2 text-[11px] text-[var(--solvyn-text-tertiary)]">
              {formatCompletedAt(task.completedAt)}
            </span>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          {task.assignee && (
            <Avatar
              name={task.assignee.fullName}
              avatarUrl={task.assignee.avatarUrl}
              size="xs"
            />
          )}
          {(task.commentCount ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-[var(--solvyn-text-tertiary)]">
              <MessageSquare className="h-3 w-3" />
              {task.commentCount}
            </span>
          )}
          <TagBadge tag={task.tag} />
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </div>

      {/* Expanded description */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 pl-[52px]">
            {showSection && (
              <p className="mb-1 text-[11px] font-medium text-[var(--solvyn-text-tertiary)]">{showSection}</p>
            )}
            <p className="text-[13px] leading-relaxed text-[var(--solvyn-text-secondary)]">
              {task.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
