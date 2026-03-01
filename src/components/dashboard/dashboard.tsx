"use client";

import { useState, useCallback, useMemo } from "react";
import { ArrowDownAZ, ArrowUpAZ, Clock, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectHeader } from "./project-header";
import { CurrentFocus } from "./current-focus";
import { SectionGroup } from "./section-group";
import { TaskRow } from "./task-row";
import type { ProjectData, TaskStatus } from "@/lib/types";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

export function Dashboard({ data: initialData }: { data: ProjectData }) {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState<"active" | "completed">("active");
  const [sort, setSort] = useState<SortOption>("newest");

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      const now = new Date().toISOString();

      // Optimistic update
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

      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });

      if (!res.ok) {
        // Revert on failure
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
    [initialData]
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

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: "newest", label: "Newest", icon: <CalendarCheck className="h-3.5 w-3.5" /> },
    { value: "oldest", label: "Oldest", icon: <Clock className="h-3.5 w-3.5" /> },
    { value: "name-asc", label: "A — Z", icon: <ArrowDownAZ className="h-3.5 w-3.5" /> },
    { value: "name-desc", label: "Z — A", icon: <ArrowUpAZ className="h-3.5 w-3.5" /> },
  ];

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
            const phaseLabels: Record<number, string> = {
              1: "Phase 1 — Launch Ready",
              2: "Phase 2 — Full Build",
              3: "Phase 3 — Refinement",
            };
            const phaseLabel = phaseLabels[phase] ?? `Phase ${phase}`;

            return (
              <div key={phase} className="mb-4">
                <div className="mb-6 flex items-center gap-3">
                  <div className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase",
                    phase === 1 && "bg-[#6C7B5A] text-white",
                    phase === 2 && "bg-[#2A2A2A]/10 text-[#2A2A2A]/50",
                    phase === 3 && "bg-[#B96E5C]/10 text-[#B96E5C]"
                  )}>
                    {phaseLabel}
                  </div>
                  <span className="text-xs text-[#2A2A2A]/40">
                    {phaseDone}/{phaseTotal} — {phasePercent}%
                  </span>
                  <div className="h-px flex-1 bg-[#EAE4D9]" />
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
            <span className="mr-1 text-xs font-medium text-[#2A2A2A]/40">Sort by</span>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  sort === opt.value
                    ? "bg-[#6C7B5A] text-white"
                    : "bg-white text-[#2A2A2A]/50 border border-[#EAE4D9] hover:bg-[#F7F5F0]"
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {doneTasks.length > 0 ? (
            <div className="rounded-lg border border-[#6C7B5A]/20 bg-white">
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
            <p className="py-12 text-center text-sm text-[#2A2A2A]/30">
              No completed tasks yet.
            </p>
          )}
        </div>
      )}
    </>
  );
}
