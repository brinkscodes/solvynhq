"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MY_TASK_TAGS } from "@/lib/my-tasks-types";
import type { MyTask, MyTaskPriority, MyTaskStatus, MyTaskTag, MyTaskSection, UpdateTaskPayload } from "@/lib/my-tasks-types";

interface MyTaskEditModalProps {
  task: MyTask;
  sections: MyTaskSection[];
  onSave: (payload: UpdateTaskPayload) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}

export function MyTaskEditModal({ task, sections, onSave, onDelete, onClose }: MyTaskEditModalProps) {
  const [name, setName] = useState(task.name);
  const [sectionId, setSectionId] = useState<string | null>(task.sectionId);
  const [status, setStatus] = useState<MyTaskStatus>(task.status);
  const [priority, setPriority] = useState<MyTaskPriority>(task.priority);
  const [deadline, setDeadline] = useState(task.deadline ? task.deadline.split("T")[0] : "");
  const [selectedTags, setSelectedTags] = useState<MyTaskTag[]>(task.tags);
  const [notes, setNotes] = useState(task.notes);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleTag(tag: MyTaskTag) {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({ taskId: task.id, name: name.trim(), sectionId, status, priority, deadline: deadline || null, tags: selectedTags, notes });
  }

  const inputClass = "w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-4 py-2.5 text-[13px] text-[var(--solvyn-text-primary)] outline-none transition-colors focus:border-[var(--solvyn-olive)]/40 focus:bg-[var(--solvyn-bg-base)]";
  const selectClass = "w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-3 py-2.5 text-[12px] text-[var(--solvyn-text-secondary)] outline-none transition-colors focus:border-[var(--solvyn-olive)]/40";
  const labelClass = "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--solvyn-text-tertiary)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[520px] rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--solvyn-border-subtle)] px-6 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--solvyn-text-primary)]">Edit Task</h2>
          <button onClick={onClose} className="rounded-md p-1 text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className={labelClass}>Task Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Section</label>
              <select value={sectionId || ""} onChange={(e) => setSectionId(e.target.value || null)} className={selectClass}>
                <option value="">Inbox</option>
                {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as MyTaskStatus)} className={selectClass}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as MyTaskPriority)} className={selectClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={cn(labelClass, "mb-2")}>Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {MY_TASK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all",
                    selectedTags.includes(tag)
                      ? "bg-[var(--solvyn-olive-bg)] text-[var(--solvyn-olive)] ring-1 ring-[var(--solvyn-olive)]/30"
                      : "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add notes..." className={cn(inputClass, "resize-none placeholder-[var(--solvyn-text-tertiary)]")} />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--solvyn-border-subtle)] px-6 py-4">
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-medium text-[var(--solvyn-rust)]/60 transition-colors hover:bg-[var(--solvyn-rust-bg)] hover:text-[var(--solvyn-rust)]">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => onDelete(task.id)} className="rounded-xl bg-[var(--solvyn-rust)] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:brightness-110">
                Confirm Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="rounded-xl px-3 py-2 text-[12px] font-medium text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]">
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)]">
              Cancel
            </button>
            <button onClick={handleSave} disabled={!name.trim()} className="rounded-xl bg-[var(--solvyn-olive)] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
