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
        data.sections.map((section) => (
          <SectionGroup
            key={section.id}
            section={section}
            onStatusChange={updateTaskStatus}
          />
        ))
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
