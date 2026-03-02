"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MyTaskSection } from "@/lib/my-tasks-types";

interface MyTaskSectionManagerProps {
  sections: MyTaskSection[];
  onCreateSection: (name: string) => void;
  onRenameSection: (sectionId: string, name: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onClose: () => void;
}

export function MyTaskSectionManager({
  sections,
  onCreateSection,
  onRenameSection,
  onDeleteSection,
  onClose,
}: MyTaskSectionManagerProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateSection(newName.trim());
    setNewName("");
  }

  function startEditing(section: MyTaskSection) {
    setEditingId(section.id);
    setEditingName(section.name);
  }

  function saveEditing() {
    if (editingId && editingName.trim()) {
      onRenameSection(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-[#E8E4DE] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DE]/60 px-6 py-4">
          <h2 className="text-[15px] font-semibold text-[#1A1A1A]">
            Manage Sections
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#1A1A1A]/30 hover:bg-[#1A1A1A]/[0.04] hover:text-[#1A1A1A]/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Existing sections */}
          {sections.length === 0 ? (
            <p className="mb-4 text-center text-[13px] text-[#1A1A1A]/25">
              No sections yet. Tasks without a section go to Inbox.
            </p>
          ) : (
            <div className="mb-4 space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-2 rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-3 py-2.5"
                >
                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-[#1A1A1A]/15" />

                  {editingId === section.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveEditing}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditing();
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditingName("");
                        }
                      }}
                      autoFocus
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1A1A1A] outline-none"
                    />
                  ) : (
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#1A1A1A]/70">
                      {section.name}
                    </span>
                  )}

                  <button
                    onClick={() => startEditing(section)}
                    className="shrink-0 rounded-md p-1 text-[#1A1A1A]/20 hover:bg-[#1A1A1A]/[0.04] hover:text-[#1A1A1A]/50"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>

                  {confirmDeleteId === section.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onDeleteSection(section.id);
                          setConfirmDeleteId(null);
                        }}
                        className="rounded-md bg-[#B96E5C] px-2 py-0.5 text-[10px] font-semibold text-white"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-md px-2 py-0.5 text-[10px] text-[#1A1A1A]/40"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(section.id)}
                      className="shrink-0 rounded-md p-1 text-[#1A1A1A]/20 hover:bg-[#B96E5C]/5 hover:text-[#B96E5C]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create new section */}
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New section name..."
              className="min-w-0 flex-1 rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-4 py-2.5 text-[13px] text-[#1A1A1A] placeholder-[#1A1A1A]/25 outline-none transition-colors focus:border-[#6C7B5A]/40 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-[#1A1B23] px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#2A2B33] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
