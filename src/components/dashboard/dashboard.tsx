"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { ArrowDownAZ, ArrowUpAZ, Clock, CalendarCheck, Tag, AlertTriangle, Layers } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { ProjectHeader } from "./project-header";
import { CurrentFocus } from "./current-focus";
import { WorkingOnToday } from "./working-on-today";
import { SectionGroup } from "./section-group";
import { TaskRow } from "./task-row";
import { UndoToast } from "./undo-toast";
import { TaskDetailPanel } from "../shared/task-detail-panel";
import type { ProjectData, Task, TaskStatus } from "@/lib/types";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";
type ActiveSortOption = "default" | "priority" | "label";

export function Dashboard({ data: initialData }: { data: ProjectData }) {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState<"active" | "completed">("active");
  const [sort, setSort] = useState<SortOption>("newest");
  const [activeSort, setActiveSort] = useState<ActiveSortOption>("default");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [undoToast, setUndoToast] = useState<{
    taskId: string;
    taskName: string;
    previousStatus: TaskStatus;
    previousCompletedAt?: string;
  } | null>(null);
  const undoToastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [resetUndo, setResetUndo] = useState<{ taskIds: string[] } | null>(null);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#8CA878", "#C97A68", "#D4A843", "#E8E4D8", "#ffffff"],
    });
  }, []);

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      const now = new Date().toISOString();

      let previousTask: Task | undefined;
      for (const section of data.sections) {
        previousTask = section.tasks.find((t) => t.id === taskId);
        if (previousTask) break;
      }

      // Block completion if there are incomplete subtasks
      if (status === "done" && previousTask?.subtasks?.length) {
        const incomplete = previousTask.subtasks.filter((s) => !s.completed);
        if (incomplete.length > 0) {
          alert(`Cannot mark as done — ${incomplete.length} subtask${incomplete.length > 1 ? "s" : ""} still incomplete.`);
          return;
        }
      }

      setData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) => ({
          ...section,
          tasks: section.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  completedAt: status === "done" ? now : undefined,
                }
              : t
          ),
        })),
      }));

      // Keep detail panel in sync
      setSelectedTask((prev) =>
        prev && prev.id === taskId
          ? { ...prev, status, completedAt: status === "done" ? now : undefined }
          : prev
      );

      if (status === "done" && previousTask) {
        fireConfetti();
        if (undoToastTimeoutRef.current) clearTimeout(undoToastTimeoutRef.current);
        setUndoToast({
          taskId,
          taskName: previousTask.name,
          previousStatus: previousTask.status,
          previousCompletedAt: previousTask.completedAt,
        });
      }

      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });

      if (!res.ok) {
        setData((prev) => ({
          ...prev,
          sections: prev.sections.map((section) => ({
            ...section,
            tasks: section.tasks.map((t) => {
              if (t.id === taskId) {
                const original = initialData.sections
                  .flatMap((s) => s.tasks)
                  .find((ot) => ot.id === taskId);
                return original ? { ...t, status: original.status, completedAt: original.completedAt } : t;
              }
              return t;
            }),
          })),
        }));
      }
    },
    [initialData, data, fireConfetti]
  );

  const handleUndo = useCallback(async () => {
    if (!undoToast) return;
    const { taskId, previousStatus, previousCompletedAt } = undoToast;
    setUndoToast(null);

    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        tasks: section.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: previousStatus, completedAt: previousCompletedAt }
            : t
        ),
      })),
    }));

    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, status: previousStatus }),
    });
  }, [undoToast]);

  const handleResetUndo = useCallback(async () => {
    if (!resetUndo) return;
    const { taskIds } = resetUndo;
    setResetUndo(null);

    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        tasks: section.tasks.map((t) =>
          taskIds.includes(t.id) ? { ...t, todayFocus: true } : t
        ),
      })),
    }));

    await Promise.all(
      taskIds.map((id) =>
        fetch("/api/tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: id, todayFocus: true }),
        })
      )
    );
  }, [resetUndo]);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setDetailPanelOpen(true);
  }, []);

  const handleTaskUpdate = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      setData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) => ({
          ...section,
          tasks: section.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        })),
      }));

      // Update the selected task in the panel too
      setSelectedTask((prev) =>
        prev && prev.id === taskId ? { ...prev, ...updates } : prev
      );

      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, ...updates }),
      });
    },
    []
  );

  const createTask = useCallback(
    async (sectionId: string, name: string) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, name }),
      });

      if (!res.ok) return;

      const newTask: Task = await res.json();

      setData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? { ...section, tasks: [...section.tasks, newTask] }
            : section
        ),
      }));
    },
    []
  );

  const resetToday = useCallback(async () => {
    const todayTaskIds = data.sections
      .flatMap((s) => s.tasks)
      .filter((t) => t.todayFocus)
      .map((t) => t.id);

    if (todayTaskIds.length === 0) return;

    setResetUndo({ taskIds: todayTaskIds });

    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        tasks: section.tasks.map((t) =>
          t.todayFocus ? { ...t, todayFocus: false } : t
        ),
      })),
    }));

    await fetch("/api/tasks/reset-today", { method: "POST" });
  }, [data]);

  const toggleTodayFocus = useCallback(
    async (taskId: string, todayFocus: boolean) => {
      setData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) => ({
          ...section,
          tasks: section.tasks.map((t) =>
            t.id === taskId ? { ...t, todayFocus } : t
          ),
        })),
      }));

      setSelectedTask((prev) =>
        prev && prev.id === taskId ? { ...prev, todayFocus } : prev
      );

      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, todayFocus }),
      });
    },
    []
  );

  const doneTasks = useMemo(() => {
    const tasks = data.sections.flatMap((section) =>
      section.tasks
        .filter((t) => t.status === "done")
        .map((t) => ({ ...t, sectionName: section.name }))
    );

    switch (sort) {
      case "newest":
        return tasks.sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));
      case "oldest":
        return tasks.sort((a, b) => (a.completedAt || "").localeCompare(b.completedAt || ""));
      case "name-asc":
        return tasks.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return tasks.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return tasks;
    }
  }, [data, sort]);

  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

  const sortedActiveTasks = useMemo(() => {
    if (activeSort === "default") return null;
    const tasks = data.sections.flatMap((section) =>
      section.tasks
        .filter((t) => t.status !== "done")
        .map((t) => ({ ...t, sectionName: section.name }))
    );

    if (activeSort === "priority") {
      return tasks.sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));
    }
    if (activeSort === "label") {
      return tasks.sort((a, b) => (a.tag || "").localeCompare(b.tag || ""));
    }
    return tasks;
  }, [data, activeSort]);

  const activeSortOptions: { value: ActiveSortOption; label: string; icon: React.ReactNode }[] = [
    { value: "default", label: "Phase", icon: <Layers className="h-3.5 w-3.5" /> },
    { value: "priority", label: "Priority", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    { value: "label", label: "Label", icon: <Tag className="h-3.5 w-3.5" /> },
  ];

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: "newest", label: "Newest", icon: <CalendarCheck className="h-3.5 w-3.5" /> },
    { value: "oldest", label: "Oldest", icon: <Clock className="h-3.5 w-3.5" /> },
    { value: "name-asc", label: "A — Z", icon: <ArrowDownAZ className="h-3.5 w-3.5" /> },
    { value: "name-desc", label: "Z — A", icon: <ArrowUpAZ className="h-3.5 w-3.5" /> },
  ];

  const phaseLabels: Record<number, string> = {
    1: "Phase 1 — Launch Ready",
    2: "Phase 2 — Full Build",
    3: "Phase 3 — Refinement",
  };

  return (
    <>
      <ProjectHeader data={data} view={view} onViewChange={setView} />

      <CurrentFocus data={data} onMarkDone={updateTaskStatus} onTaskClick={handleTaskClick} />
      <WorkingOnToday data={data} onMarkDone={updateTaskStatus} onToggleTodayFocus={toggleTodayFocus} onResetToday={resetToday} onTaskClick={handleTaskClick} />

      {view === "active" ? (
        <>
          {/* Active sort controls */}
          <div className="mb-5 flex items-center gap-1.5">
            <span className="mr-2 text-xs font-medium text-[var(--solvyn-text-tertiary)]">Sort</span>
            {activeSortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveSort(opt.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  activeSort === opt.value
                    ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] border border-[var(--solvyn-border-default)]"
                    : "text-[var(--solvyn-text-tertiary)] border border-[var(--solvyn-border-subtle)] hover:border-[var(--solvyn-border-default)] hover:text-[var(--solvyn-text-secondary)]"
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {activeSort === "default" ? (
            <>
              {[1, 2, 3].map((phase) => {
                const phaseSections = data.sections.filter((s) => s.phase === phase);
                const phaseTasks = phaseSections.flatMap((s) => s.tasks);
                const phaseActive = phaseTasks.filter((t) => t.status !== "done");
                if (phaseActive.length === 0 && phaseTasks.length > 0) return null;
                if (phaseTasks.length === 0) return null;

                const phaseDone = phaseTasks.filter((t) => t.status === "done").length;
                const phaseTotal = phaseTasks.length;
                const phasePercent = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;

                const phaseColors: Record<number, string> = {
                  1: "var(--solvyn-olive)",
                  2: "var(--solvyn-amber)",
                  3: "var(--solvyn-rust)",
                };

                return (
                  <div key={phase} className="mb-6">
                    {/* Phase header */}
                    <div className="mb-5 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] px-5 py-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: phaseColors[phase] }}
                          />
                          <h2 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[var(--solvyn-text-primary)]">
                            {phaseLabels[phase] ?? `Phase ${phase}`}
                          </h2>
                        </div>
                        <span className="text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                          {phaseDone}/{phaseTotal} tasks — {phasePercent}%
                        </span>
                      </div>
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--solvyn-bg-base)]">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${phasePercent}%`,
                            backgroundColor: phaseColors[phase],
                            opacity: 0.6,
                          }}
                        />
                      </div>
                    </div>
                    {phaseSections.map((section) => (
                      <SectionGroup
                        key={section.id}
                        section={section}
                        onStatusChange={updateTaskStatus}
                        onTaskClick={handleTaskClick}
                        onToggleTodayFocus={toggleTodayFocus}
                        onCreateTask={createTask}
                      />
                    ))}
                  </div>
                );
              })}
            </>
          ) : sortedActiveTasks && sortedActiveTasks.length > 0 ? (
            <div>
              {activeSort === "label" ? (
                // Group by tag label
                (() => {
                  const groups = new Map<string, typeof sortedActiveTasks>();
                  for (const task of sortedActiveTasks) {
                    const key = task.tag || "No Label";
                    if (!groups.has(key)) groups.set(key, []);
                    groups.get(key)!.push(task);
                  }
                  return Array.from(groups.entries()).map(([tag, tasks]) => (
                    <div key={tag} className="mb-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
                        <span className="text-sm font-semibold text-[var(--solvyn-text-primary)]">{tag}</span>
                        <span className="text-xs text-[var(--solvyn-text-tertiary)]">{tasks.length}</span>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]">
                        {tasks.map((task) => (
                          <TaskRow
                            key={task.id}
                            task={task}
                            showSection={task.sectionName}
                            onStatusChange={updateTaskStatus}
                            onClick={handleTaskClick}
                            onToggleTodayFocus={toggleTodayFocus}
                          />
                        ))}
                      </div>
                    </div>
                  ));
                })()
              ) : (
                // Flat list sorted by priority
                <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]">
                  {sortedActiveTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      showSection={task.sectionName}
                      onStatusChange={updateTaskStatus}
                      onClick={handleTaskClick}
                      onToggleTodayFocus={toggleTodayFocus}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <div>
          {/* Sort controls */}
          <div className="mb-4 flex items-center gap-1.5">
            <span className="mr-2 text-xs font-medium text-[var(--solvyn-text-tertiary)]">Sort</span>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  sort === opt.value
                    ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] border border-[var(--solvyn-border-default)]"
                    : "text-[var(--solvyn-text-tertiary)] border border-[var(--solvyn-border-subtle)] hover:border-[var(--solvyn-border-default)] hover:text-[var(--solvyn-text-secondary)]"
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {doneTasks.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-olive)]/15 bg-[var(--solvyn-bg-raised)]">
              {doneTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  showSection={task.sectionName}
                  showCompletedAt
                  onStatusChange={updateTaskStatus}
                  onClick={handleTaskClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--solvyn-border-default)] py-16">
              <p className="text-sm text-[var(--solvyn-text-tertiary)]">
                No completed tasks yet.
              </p>
            </div>
          )}
        </div>
      )}

      <TaskDetailPanel
        task={selectedTask}
        open={detailPanelOpen}
        onClose={() => { setDetailPanelOpen(false); setSelectedTask(null); }}
        onUpdate={handleTaskUpdate}
        onStatusChange={updateTaskStatus}
        onToggleTodayFocus={toggleTodayFocus}
      />

      {undoToast && (
        <UndoToast
          key={undoToast.taskId}
          taskName={undoToast.taskName}
          onUndo={handleUndo}
          onDismiss={() => setUndoToast(null)}
        />
      )}

      {resetUndo && (
        <UndoToast
          key="reset-today"
          message={`Day reset — ${resetUndo.taskIds.length} ${resetUndo.taskIds.length === 1 ? "task" : "tasks"} cleared`}
          onUndo={handleResetUndo}
          onDismiss={() => setResetUndo(null)}
        />
      )}
    </>
  );
}
