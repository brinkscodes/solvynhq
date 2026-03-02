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

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => {
        setNotes(data.notes || "");
        setLoaded(true);
      });
  }, []);

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
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] shadow-sm transition-colors hover:bg-[var(--solvyn-bg-elevated)]",
          !open && "-right-3"
        )}
      >
        {open ? (
          <ChevronLeft className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
        )}
      </button>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
          title="Open notepad"
        >
          <StickyNote className="h-4 w-4 text-[var(--solvyn-rust)]" />
        </button>
      )}

      {open && (
        <div className="overflow-hidden rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] shadow-sm">
          <div className="flex items-center gap-2 border-b border-[var(--solvyn-border-subtle)] px-4 py-3">
            <StickyNote className="h-4 w-4 text-[var(--solvyn-rust)]" />
            <h3 className="text-sm font-semibold tracking-wide uppercase text-[var(--solvyn-text-primary)]">
              Notepad
            </h3>
            {saving && (
              <span className="ml-auto text-[10px] text-[var(--solvyn-text-tertiary)]">
                Saving...
              </span>
            )}
            {!saving && loaded && notes.length > 0 && (
              <span className="ml-auto text-[10px] text-[var(--solvyn-olive)]/50">
                Saved
              </span>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Quick notes, ideas, reminders..."
            className="h-[calc(100vh-180px)] min-h-[300px] w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
