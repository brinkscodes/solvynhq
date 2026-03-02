"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MY_TASK_TAGS } from "@/lib/my-tasks-types";
import type {
  MyTaskPriority,
  MyTaskTag,
  MyTaskSection,
  CreateTaskPayload,
} from "@/lib/my-tasks-types";

interface MyTaskCreateFormProps {
  sections: MyTaskSection[];
  onSubmit: (payload: CreateTaskPayload) => void;
  onCancel: () => void;
}

export function MyTaskCreateForm({ sections, onSubmit, onCancel }: MyTaskCreateFormProps) {
  const [name, setName] = useState("");
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [priority, setPriority] = useState<MyTaskPriority>("medium");
  const [deadline, setDeadline] = useState("");
  const [selectedTags, setSelectedTags] = useState<MyTaskTag[]>([]);
  const [notes, setNotes] = useState("");

  function toggleTag(tag: MyTaskTag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), sectionId, priority, deadline: deadline || null, tags: selectedTags, notes });
  }

  const inputClass = "w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-4 py-2.5 text-[13px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)]/40 focus:bg-[var(--solvyn-bg-base)]";
  const selectClass = "w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-3 py-2.5 text-[12px] text-[var(--solvyn-text-secondary)] outline-none transition-colors focus:border-[var(--solvyn-olive)]/40";
  const labelClass = "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--solvyn-text-tertiary)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[520px] rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--solvyn-border-subtle)] px-6 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--solvyn-text-primary)]">New Task</h2>
          <button type="button" onClick={onCancel} className="rounded-md p-1 text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className={labelClass}>Task Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Task name..." autoFocus className={inputClass} />
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
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as MyTaskPriority)} className={selectClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Deadline</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={selectClass} />
            </div>
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
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes (optional)..." rows={3} className={cn(inputClass, "resize-none")} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--solvyn-border-subtle)] px-6 py-4">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex items-center gap-2 rounded-xl bg-[var(--solvyn-olive)] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
