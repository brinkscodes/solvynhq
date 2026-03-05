"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  Circle,
  Clock,
  CheckCircle2,
  Flag,
  Tag,
  CalendarCheck,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AssigneeSelector } from "./assignee-selector";
import { TaskCommentsSection } from "./task-comments-section";
import { MentionInput } from "./mention-input";
import type { Task, TaskStatus, TaskPriority, TaskTag, Subtask, TaskAssignee } from "@/lib/types";
import type { TaskComment } from "@/lib/task-comment-types";

interface TaskDetailPanelProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onToggleTodayFocus?: (taskId: string, todayFocus: boolean) => void;
}

const statusOptions: { value: TaskStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "todo", label: "To Do", icon: Circle },
  { value: "in-progress", label: "In Progress", icon: Clock },
  { value: "done", label: "Done", icon: CheckCircle2 },
];

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "var(--solvyn-text-tertiary)" },
  { value: "medium", label: "Medium", color: "var(--solvyn-amber)" },
  { value: "high", label: "High", color: "var(--solvyn-rust)" },
];

export function TaskDetailPanel({ task, open, onClose, onUpdate, onStatusChange, onToggleTodayFocus }: TaskDetailPanelProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setSubtasks(task.subtasks || []);
      setEditingName(false);
      setEditingDesc(false);
      setNewSubtask("");
    }
  }, [task]);

  // Fetch comments when task changes
  const fetchComments = useCallback(async (taskId: string) => {
    setCommentsLoading(true);
    setCommentsError(false);
    try {
      const res = await fetch(`/api/task-comments?taskId=${taskId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        setComments([]);
        setCommentsError(true);
      }
    } catch {
      setComments([]);
      setCommentsError(true);
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (task && open) {
      fetchComments(task.id);
    }
    if (!open) {
      setComments([]);
      setCommentsError(false);
    }
  }, [task?.id, open, fetchComments]);

  async function handleAddComment(content: string, mentions: string[]) {
    if (!task) return;
    try {
      const res = await fetch("/api/task-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, content, mentions }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const saveField = useCallback(
    (field: string, value: unknown) => {
      if (!task) return;
      onUpdate(task.id, { [field]: value });
    },
    [task, onUpdate]
  );

  const handleNameBlur = () => {
    setEditingName(false);
    if (task && name !== task.name && name.trim()) {
      saveField("name", name.trim());
    }
  };

  const handleDescBlur = () => {
    setEditingDesc(false);
    if (task && description !== task.description) {
      saveField("description", description);
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim() || !task) return;
    const updated = [
      ...subtasks,
      { id: crypto.randomUUID(), name: newSubtask.trim(), completed: false },
    ];
    setSubtasks(updated);
    setNewSubtask("");
    saveField("subtasks", updated);
  };

  const toggleSubtask = (id: string) => {
    const updated = subtasks.map((s) =>
      s.id === id
        ? { ...s, completed: !s.completed, completedAt: !s.completed ? new Date().toISOString() : undefined }
        : s
    );
    setSubtasks(updated);
    saveField("subtasks", updated);
  };

  const removeSubtask = (id: string) => {
    const updated = subtasks.filter((s) => s.id !== id);
    setSubtasks(updated);
    saveField("subtasks", updated);
  };

  if (!task) return null;

  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-[540px] max-w-[calc(100vw-48px)] flex-col bg-[var(--solvyn-bg-raised)] shadow-2xl shadow-black/40 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onStatusChange) {
                  const nextStatus: TaskStatus = task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo";
                  onStatusChange(task.id, nextStatus);
                }
              }}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200",
                task.status === "done"
                  ? "border-[var(--solvyn-olive)] bg-[var(--solvyn-olive)] text-white"
                  : task.status === "in-progress"
                  ? "border-[var(--solvyn-rust)]/50 text-[var(--solvyn-rust)]"
                  : "border-[var(--solvyn-border-strong)] text-transparent hover:text-[var(--solvyn-text-tertiary)]"
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </button>
            <span className="text-[12px] font-medium text-[var(--solvyn-text-tertiary)]">
              Task Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-6 h-px bg-[var(--solvyn-border-subtle)]" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            {/* Task name */}
            <div>
              {editingName ? (
                <input
                  ref={nameInputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleNameBlur()}
                  className="w-full bg-transparent text-[18px] font-semibold leading-snug text-[var(--solvyn-text-primary)] outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => {
                    setEditingName(true);
                    setTimeout(() => nameInputRef.current?.focus(), 0);
                  }}
                  className="w-full text-left text-[18px] font-semibold leading-snug text-[var(--solvyn-text-primary)] hover:text-[var(--solvyn-olive)] transition-colors rounded-md"
                >
                  {task.name}
                </button>
              )}
            </div>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowStatusMenu(!showStatusMenu); setShowPriorityMenu(false); }}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-1 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-all hover:border-[var(--solvyn-border-default)] hover:bg-[var(--solvyn-bg-elevated)]"
                >
                  {(() => {
                    const opt = statusOptions.find((s) => s.value === task.status);
                    return opt ? <opt.icon className="h-3.5 w-3.5" /> : null;
                  })()}
                  {statusOptions.find((s) => s.value === task.status)?.label}
                  <ChevronDown className="h-3 w-3 text-[var(--solvyn-text-tertiary)]" />
                </button>
                {showStatusMenu && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-36 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-lg shadow-black/20">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onStatusChange?.(task.id, opt.value);
                          setShowStatusMenu(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium transition-colors hover:bg-[var(--solvyn-bg-base)]",
                          task.status === opt.value ? "text-[var(--solvyn-olive)]" : "text-[var(--solvyn-text-secondary)]"
                        )}
                      >
                        <opt.icon className="h-3.5 w-3.5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowPriorityMenu(!showPriorityMenu); setShowStatusMenu(false); }}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-1 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-all hover:border-[var(--solvyn-border-default)] hover:bg-[var(--solvyn-bg-elevated)]"
                >
                  <Flag className="h-3.5 w-3.5" style={{ color: priorityOptions.find((p) => p.value === task.priority)?.color }} />
                  {priorityOptions.find((p) => p.value === task.priority)?.label}
                  <ChevronDown className="h-3 w-3 text-[var(--solvyn-text-tertiary)]" />
                </button>
                {showPriorityMenu && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-32 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-lg shadow-black/20">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          saveField("priority", opt.value);
                          setShowPriorityMenu(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium transition-colors hover:bg-[var(--solvyn-bg-base)]",
                          task.priority === opt.value ? "text-[var(--solvyn-olive)]" : "text-[var(--solvyn-text-secondary)]"
                        )}
                      >
                        <Flag className="h-3.5 w-3.5" style={{ color: opt.color }} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tag badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-1 text-[12px] font-medium text-[var(--solvyn-text-secondary)]">
                <Tag className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
                {task.tag}
              </div>

              {/* Today toggle */}
              <button
                onClick={() => onToggleTodayFocus?.(task.id, !task.todayFocus)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-all",
                  task.todayFocus
                    ? "border-[var(--solvyn-amber)]/30 bg-[var(--solvyn-amber)]/10 text-[var(--solvyn-amber)]"
                    : "border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] text-[var(--solvyn-text-tertiary)] hover:border-[var(--solvyn-amber)]/30 hover:text-[var(--solvyn-amber)]"
                )}
                title={task.todayFocus ? "Remove from today" : "Add to today"}
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                Today
              </button>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-medium text-[var(--solvyn-text-tertiary)] w-16 shrink-0">Assignee</span>
              <AssigneeSelector
                assignee={task.assignee}
                onAssign={(userId, assignee) => {
                  onUpdate(task.id, { assigneeId: userId, assignee });
                }}
              />
            </div>

            <div className="h-px bg-[var(--solvyn-border-subtle)]" />

            {/* Description */}
            <div>
              <span className="mb-2 block text-[12px] font-medium text-[var(--solvyn-text-tertiary)]">
                Description
              </span>
              {editingDesc ? (
                <textarea
                  ref={descInputRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescBlur}
                  className="w-full rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--solvyn-text-primary)] outline-none focus:border-[var(--solvyn-olive)]/40 focus:ring-1 focus:ring-[var(--solvyn-olive)]/20 min-h-[80px] resize-none transition-all"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => {
                    setEditingDesc(true);
                    setTimeout(() => descInputRef.current?.focus(), 0);
                  }}
                  className="w-full text-left rounded-lg px-3 py-2.5 text-[13px] leading-relaxed text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-elevated)] transition-colors min-h-[40px]"
                >
                  {task.description || "Add a description..."}
                </button>
              )}
            </div>

            <div className="h-px bg-[var(--solvyn-border-subtle)]" />

            {/* Subtasks */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] font-medium text-[var(--solvyn-text-tertiary)]">
                  Subtasks
                </span>
                {subtasks.length > 0 && (
                  <span className="text-[11px] font-medium text-[var(--solvyn-text-tertiary)]">
                    {completedSubtasks}/{subtasks.length}
                  </span>
                )}
              </div>

              {/* Subtask progress */}
              {subtasks.length > 0 && (
                <div className="mb-3 h-1 overflow-hidden rounded-full bg-[var(--solvyn-bg-elevated)]">
                  <div
                    className="h-full rounded-full bg-[var(--solvyn-olive)]/60 transition-all duration-300"
                    style={{ width: `${subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0}%` }}
                  />
                </div>
              )}

              {/* Subtask list */}
              <div className="space-y-0.5">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--solvyn-bg-elevated)]/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleSubtask(sub.id)}
                      className={cn(
                        "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-[1.5px] transition-all duration-200",
                        sub.completed
                          ? "border-[var(--solvyn-olive)] bg-[var(--solvyn-olive)] text-white"
                          : "border-[var(--solvyn-border-strong)] text-transparent hover:border-[var(--solvyn-olive)]"
                      )}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-[13px]",
                        sub.completed
                          ? "line-through text-[var(--solvyn-text-tertiary)]"
                          : "text-[var(--solvyn-text-primary)]"
                      )}
                    >
                      {sub.name}
                    </span>
                    <button
                      onClick={() => removeSubtask(sub.id)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-rust)] transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add subtask input */}
              <div className="mt-2 flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--solvyn-bg-elevated)]/30 transition-colors">
                <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--solvyn-text-tertiary)]" />
                <input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                  placeholder="Add subtask..."
                  className="flex-1 bg-transparent text-[13px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none"
                />
              </div>
            </div>

            <div className="h-px bg-[var(--solvyn-border-subtle)]" />

            {/* Comments list */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
                <span className="text-[12px] font-medium text-[var(--solvyn-text-tertiary)]">
                  Comments
                </span>
                {comments.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--solvyn-olive)]/15 px-1 text-[10px] font-semibold text-[var(--solvyn-olive)]">
                    {comments.length}
                  </span>
                )}
              </div>

              {commentsLoading ? (
                <div className="flex items-center gap-2 py-3 text-[12px] text-[var(--solvyn-text-tertiary)]">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-[var(--solvyn-olive)] border-t-transparent" />
                  Loading comments...
                </div>
              ) : commentsError ? (
                <p className="py-3 text-[12px] text-[var(--solvyn-text-tertiary)]">
                  Could not load comments.{" "}
                  <button
                    onClick={() => task && fetchComments(task.id)}
                    className="text-[var(--solvyn-olive)] hover:underline"
                  >
                    Retry
                  </button>
                </p>
              ) : comments.length === 0 ? (
                <p className="py-3 text-[12px] text-[var(--solvyn-text-tertiary)]">
                  No comments yet. Start the conversation below.
                </p>
              ) : (
                <TaskCommentsSection comments={comments} setComments={setComments} />
              )}
              <div ref={commentsEndRef} />
            </div>
          </div>
        </div>

        {/* Pinned comment input — Asana style */}
        <div className="border-t border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-6 py-4">
          <MentionInput
            onSubmit={handleAddComment}
            placeholder="Write a comment..."
          />
        </div>
      </div>
    </>
  );
}
