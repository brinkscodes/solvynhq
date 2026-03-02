"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { MyTasksHeader } from "./my-tasks-header";
import { MyTasksToolbar } from "./my-tasks-toolbar";
import { MyTasksListView } from "./my-tasks-list-view";
import { MyTasksKanbanView } from "./my-tasks-kanban-view";
import { MyTaskCreateForm } from "./my-task-create-form";
import { MyTaskEditModal } from "./my-task-edit-modal";
import { MyTaskSectionManager } from "./my-task-section-manager";
import { MyTaskQuickAdd } from "./my-task-quick-add";
import { UndoToast } from "../dashboard/undo-toast";
import type {
  MyTask,
  MyTaskSection,
  MyTaskStatus,
  MyTaskView,
  MyTaskSortOption,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/lib/my-tasks-types";

interface FetchResult {
  tasks: MyTask[];
  sections: MyTaskSection[];
  _migrationNeeded?: boolean;
}

export function MyTasksViewer() {
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [sections, setSections] = useState<MyTaskSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [view, setView] = useState<MyTaskView>("list");
  const [sort, setSort] = useState<MyTaskSortOption>("position");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<MyTask | null>(null);
  const [showSectionManager, setShowSectionManager] = useState(false);
  const [undoToast, setUndoToast] = useState<{
    taskId: string;
    taskName: string;
    previousStatus: MyTaskStatus;
    previousCompletedAt: string | null;
  } | null>(null);
  const loadedRef = useRef(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/my-tasks");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: FetchResult = await res.json();
      setTasks(data.tasks);
      setSections(data.sections);
      if (data._migrationNeeded) setMigrationNeeded(true);
    } catch (err) {
      console.error("Failed to load my tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      fetchData();
    }
  }, [fetchData]);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#8CA878", "#C97A68", "#D4A843", "#E8E4D8", "#ffffff"],
    });
  }, []);

  // Create task
  const handleCreateTask = useCallback(
    async (payload: CreateTaskPayload) => {
      try {
        const res = await fetch("/api/my-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create");
        const newTask: MyTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
        setShowCreateForm(false);
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    },
    []
  );

  // Quick add (just name)
  const handleQuickAdd = useCallback(
    async (name: string) => {
      try {
        const res = await fetch("/api/my-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error("Failed to create");
        const newTask: MyTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
      } catch (err) {
        console.error("Failed to quick-add task:", err);
      }
    },
    []
  );

  // Update task status (optimistic + undo)
  const handleStatusChange = useCallback(
    async (taskId: string, status: MyTaskStatus) => {
      const now = new Date().toISOString();

      // Find the task before updating (for undo)
      const previousTask = tasks.find((t) => t.id === taskId);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status,
                completedAt: status === "done" ? now : null,
                updatedAt: now,
              }
            : t
        )
      );

      if (status === "done" && previousTask) {
        fireConfetti();
        setUndoToast({
          taskId,
          taskName: previousTask.name,
          previousStatus: previousTask.status,
          previousCompletedAt: previousTask.completedAt,
        });
      }

      const res = await fetch("/api/my-tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });

      if (!res.ok) fetchData();
    },
    [tasks, fireConfetti, fetchData]
  );

  // Undo handler
  const handleUndo = useCallback(async () => {
    if (!undoToast) return;
    const { taskId, previousStatus, previousCompletedAt } = undoToast;
    setUndoToast(null);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: previousStatus, completedAt: previousCompletedAt }
          : t
      )
    );

    await fetch("/api/my-tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, status: previousStatus }),
    });
  }, [undoToast]);

  // Update task (from edit modal)
  const handleUpdateTask = useCallback(
    async (payload: UpdateTaskPayload) => {
      const now = new Date().toISOString();

      setTasks((prev) =>
        prev.map((t) =>
          t.id === payload.taskId
            ? {
                ...t,
                ...(payload.name !== undefined && { name: payload.name }),
                ...(payload.sectionId !== undefined && { sectionId: payload.sectionId }),
                ...(payload.notes !== undefined && { notes: payload.notes }),
                ...(payload.status !== undefined && {
                  status: payload.status,
                  completedAt: payload.status === "done" ? now : null,
                }),
                ...(payload.priority !== undefined && { priority: payload.priority }),
                ...(payload.tags !== undefined && { tags: payload.tags }),
                ...(payload.deadline !== undefined && { deadline: payload.deadline }),
                updatedAt: now,
              }
            : t
        )
      );

      if (payload.status === "done") fireConfetti();
      setEditingTask(null);

      const res = await fetch("/api/my-tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) fetchData();
    },
    [fireConfetti, fetchData]
  );

  // Delete task
  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setEditingTask(null);

      const res = await fetch(`/api/my-tasks?taskId=${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) fetchData();
    },
    [fetchData]
  );

  // Section CRUD
  const handleCreateSection = useCallback(
    async (name: string) => {
      try {
        const res = await fetch("/api/my-tasks/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error("Failed to create section");
        const section: MyTaskSection = await res.json();
        setSections((prev) => [...prev, section]);
      } catch (err) {
        console.error("Failed to create section:", err);
      }
    },
    []
  );

  const handleRenameSection = useCallback(
    async (sectionId: string, name: string) => {
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, name } : s))
      );

      const res = await fetch("/api/my-tasks/sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, name }),
      });

      if (!res.ok) fetchData();
    },
    [fetchData]
  );

  const handleDeleteSection = useCallback(
    async (sectionId: string) => {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      setTasks((prev) =>
        prev.map((t) =>
          t.sectionId === sectionId ? { ...t, sectionId: null } : t
        )
      );

      const res = await fetch(
        `/api/my-tasks/sections?sectionId=${sectionId}`,
        { method: "DELETE" }
      );

      if (!res.ok) fetchData();
    },
    [fetchData]
  );

  // Keyboard shortcuts: N = new task, Escape = close modals/forms
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;

      if (e.key === "Escape") {
        if (editingTask) { setEditingTask(null); return; }
        if (showSectionManager) { setShowSectionManager(false); return; }
        if (showCreateForm) { setShowCreateForm(false); return; }
      }

      if (
        e.key === "n" &&
        !e.metaKey && !e.ctrlKey && !e.altKey && !isInput
      ) {
        e.preventDefault();
        setShowCreateForm(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingTask, showSectionManager, showCreateForm]);

  const completedCount = tasks.filter((t) => t.status === "done").length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--solvyn-border-default)] border-t-[var(--solvyn-olive)]" />
        <p className="mt-4 text-sm text-[var(--solvyn-text-tertiary)]">Loading tasks...</p>
      </div>
    );
  }

  return (
    <>
      {/* Migration banner */}
      {migrationNeeded && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--solvyn-amber)]/20 bg-[var(--solvyn-amber-bg)] px-5 py-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--solvyn-amber)]" />
          <div>
            <p className="text-[13px] font-semibold text-[var(--solvyn-text-primary)]">
              Database tables not found
            </p>
            <p className="text-[12px] text-[var(--solvyn-text-secondary)]">
              Run the SQL migration in your Supabase SQL Editor:{" "}
              <code className="rounded bg-[var(--solvyn-bg-elevated)] px-1.5 py-0.5 text-[11px] font-mono">
                supabase-my-tasks-migration.sql
              </code>
            </p>
          </div>
        </div>
      )}

      <MyTasksHeader tasks={tasks} view={view} onViewChange={setView} />

      <MyTasksToolbar
        sort={sort}
        onSortChange={setSort}
        onAddTask={() => setShowCreateForm(true)}
        onManageSections={() => setShowSectionManager(true)}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted((p) => !p)}
        completedCount={completedCount}
      />

      {showCreateForm && (
        <MyTaskCreateForm
          sections={sections}
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Quick add input (always visible when create form is closed) */}
      {!showCreateForm && !migrationNeeded && (
        <MyTaskQuickAdd onAdd={handleQuickAdd} />
      )}

      {view === "list" ? (
        <MyTasksListView
          tasks={tasks}
          sections={sections}
          sort={sort}
          showCompleted={showCompleted}
          onStatusChange={handleStatusChange}
          onEdit={setEditingTask}
        />
      ) : (
        <MyTasksKanbanView
          tasks={tasks}
          showCompleted={showCompleted}
          onStatusChange={handleStatusChange}
          onEdit={setEditingTask}
        />
      )}

      {editingTask && (
        <MyTaskEditModal
          task={editingTask}
          sections={sections}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {showSectionManager && (
        <MyTaskSectionManager
          sections={sections}
          onCreateSection={handleCreateSection}
          onRenameSection={handleRenameSection}
          onDeleteSection={handleDeleteSection}
          onClose={() => setShowSectionManager(false)}
        />
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
