"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { ArrowDownAZ, ArrowUpAZ, Clock, CalendarCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { ProjectHeader } from "./project-header";
import { CurrentFocus } from "./current-focus";
import { SectionGroup } from "./section-group";
import { TaskRow } from "./task-row";
import { UndoToast } from "./undo-toast";
import type { ProjectData, Task, TaskStatus } from "@/lib/types";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

export function Dashboard({ data: initialData }: { data: ProjectData }) {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState<"active" | "completed">("active");
  const [sort, setSort] = useState<SortOption>("newest");
  const [undoToast, setUndoToast] = useState<{
    taskId: string;
    taskName: string;
    previousStatus: TaskStatus;
    previousCompletedAt?: string;
  } | null>(null);
  const undoToastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#6C7B5A", "#B96E5C", "#D4A843", "#EAE4D9", "#ffffff"],
    });
  }, []);

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      const now = new Date().toISOString();

      // Find the task before updating (for undo)
      let previousTask: Task | undefined;
      for (const section of data.sections) {
        previousTask = section.tasks.find((t) => t.id === taskId);
        if (previousTask) break;
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

      // Fire confetti and show undo toast when marking done
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

    // Optimistic revert
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

  const phaseColors: Record<number, string> = {
    1: "bg-[#6C7B5A] text-white",
    2: "bg-[#1A1A1A]/[0.06] text-[#1A1A1A]/50",
    3: "bg-[#B96E5C]/10 text-[#B96E5C]",
  };

  return (
    <>
      <ProjectHeader data={data} view={view} onViewChange={setView} />

      <CurrentFocus data={data} onMarkDone={updateTaskStatus} />

      {view === "active" ? (
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

            return (
              <div key={phase} className="mb-4">
                <div className="mb-6 flex items-center gap-3">
                  <div className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-1.5 text-[11px] font-bold tracking-wide uppercase",
                    phaseColors[phase]
                  )}>
                    {phaseLabels[phase] ?? `Phase ${phase}`}
                  </div>
                  <span className="text-xs font-medium text-[#1A1A1A]/30">
                    {phaseDone}/{phaseTotal} — {phasePercent}%
                  </span>
                  <div className="h-px flex-1 bg-[#EAE4D9]/50" />
                </div>
                {phaseSections.map((section) => (
                  <SectionGroup
                    key={section.id}
                    section={section}
                    onStatusChange={updateTaskStatus}
                  />
                ))}
              </div>
            );
          })}
        </>
      ) : (
        <div>
          {/* Sort controls */}
          <div className="mb-4 flex items-center gap-1.5">
            <span className="mr-2 text-xs font-medium text-[#1A1A1A]/30">Sort</span>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  sort === opt.value
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white text-[#1A1A1A]/40 border border-[#E8E4DE] hover:border-[#1A1A1A]/15 hover:text-[#1A1A1A]/60"
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {doneTasks.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[#6C7B5A]/15 bg-white">
              {doneTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  showSection={task.sectionName}
                  showCompletedAt
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8E4DE] py-16">
              <p className="text-sm text-[#1A1A1A]/25">
                No completed tasks yet.
              </p>
            </div>
          )}
        </div>
      )}

      {undoToast && (
        <UndoToast
          key={undoToast.taskId}
          taskName={undoToast.taskName}
          onUndo={handleUndo}
          onDismiss={() => setUndoToast(null)}
        />
      )}
    </>
  );
}
