"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { StickyNote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Notepad() {
  const [open, setOpen] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load notes on mount
  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => {
        setNotes(data.notes || "");
        setLoaded(true);
      });
  }, []);

  // Auto-save with debounce
  const save = useCallback((value: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setSaving(true);
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: value }),
      });
      setSaving(false);
    }, 600);
  }, []);

  const handleChange = (value: string) => {
    setNotes(value);
    save(value);
  };

  return (
    <div
      className={cn(
        "sticky top-12 shrink-0 transition-all duration-300 ease-in-out",
        open ? "w-72" : "w-10"
      )}
    >
      {/* Collapse / expand toggle */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#EAE4D9] bg-white shadow-sm transition-colors hover:bg-[#F7F5F0]",
          !open && "-right-3"
        )}
      >
        {open ? (
          <ChevronLeft className="h-3.5 w-3.5 text-[#2A2A2A]/50" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-[#2A2A2A]/50" />
        )}
      </button>

      {/* Collapsed state — just the icon */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE4D9] bg-white transition-colors hover:bg-[#F7F5F0]"
          title="Open notepad"
        >
          <StickyNote className="h-4 w-4 text-[#B96E5C]" />
        </button>
      )}

      {/* Expanded state */}
      {open && (
        <div className="overflow-hidden rounded-xl border border-[#EAE4D9] bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-[#EAE4D9]/60 px-4 py-3">
            <StickyNote className="h-4 w-4 text-[#B96E5C]" />
            <h3 className="text-sm font-semibold tracking-wide uppercase text-[#2A2A2A]">
              Notepad
            </h3>
            {saving && (
              <span className="ml-auto text-[10px] text-[#2A2A2A]/30">
                Saving...
              </span>
            )}
            {!saving && loaded && notes.length > 0 && (
              <span className="ml-auto text-[10px] text-[#6C7B5A]/50">
                Saved
              </span>
            )}
          </div>

          {/* Textarea */}
          <textarea
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Quick notes, ideas, reminders..."
            className="h-[calc(100vh-180px)] min-h-[300px] w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed text-[#2A2A2A] placeholder-[#2A2A2A]/25 outline-none"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
