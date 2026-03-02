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

export function MyTaskCreateForm({
  sections,
  onSubmit,
  onCancel,
}: MyTaskCreateFormProps) {
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
    onSubmit({
      name: name.trim(),
      sectionId,
      priority,
      deadline: deadline || null,
      tags: selectedTags,
      notes,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[520px] rounded-2xl border border-[#E8E4DE] bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DE]/60 px-6 py-4">
          <h2 className="text-[15px] font-semibold text-[#1A1A1A]">New Task</h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-[#1A1A1A]/30 hover:bg-[#1A1A1A]/[0.04] hover:text-[#1A1A1A]/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/35">
              Task Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task name..."
              autoFocus
              className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-4 py-2.5 text-[13px] text-[#1A1A1A] placeholder-[#1A1A1A]/25 outline-none transition-colors focus:border-[#6C7B5A]/40 focus:bg-white"
            />
          </div>

          {/* Row: Section + Priority */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/35">
                Section
              </label>
              <select
                value={sectionId || ""}
                onChange={(e) => setSectionId(e.target.value || null)}
                className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-3 py-2.5 text-[12px] text-[#1A1A1A]/60 outline-none transition-colors focus:border-[#6C7B5A]/40"
              >
                <option value="">Inbox</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/35">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MyTaskPriority)}
                className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-3 py-2.5 text-[12px] text-[#1A1A1A]/60 outline-none transition-colors focus:border-[#6C7B5A]/40"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/35">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-3 py-2.5 text-[12px] text-[#1A1A1A]/60 outline-none transition-colors focus:border-[#6C7B5A]/40"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/35">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MY_TASK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all",
                    selectedTags.includes(tag)
                      ? "bg-[#6C7B5A]/15 text-[#6C7B5A] ring-1 ring-[#6C7B5A]/30"
                      : "bg-[#1A1A1A]/[0.04] text-[#1A1A1A]/30 hover:bg-[#1A1A1A]/[0.08]"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/35">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-4 py-2.5 text-[13px] text-[#1A1A1A] placeholder-[#1A1A1A]/25 outline-none transition-colors focus:border-[#6C7B5A]/40 focus:bg-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E8E4DE]/60 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1A1A1A]/40 transition-colors hover:text-[#1A1A1A]/60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex items-center gap-2 rounded-xl bg-[#1A1B23] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#2A2B33] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
