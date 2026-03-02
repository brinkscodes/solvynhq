"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { StickyNote, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingNotepad() {
  const [open, setOpen] = useState(false);
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
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
          open
            ? "bg-[#1A1B23] text-white shadow-xl shadow-[#1A1B23]/20 rotate-12"
            : "bg-white text-[#1A1A1A]/40 shadow-lg shadow-black/[0.06] border border-[#E8E4DE] hover:text-[#B96E5C] hover:shadow-xl hover:scale-105"
        )}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <StickyNote className="h-5 w-5" />
        )}
      </button>

      {/* Notepad panel */}
      <div
        className={cn(
          "fixed bottom-20 right-6 z-50 transition-all duration-300 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-3 scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="w-[calc(100vw-3rem)] max-w-80 overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white shadow-2xl shadow-black/[0.08] sm:w-80">
          <div className="flex items-center gap-2.5 border-b border-[#E8E4DE]/60 px-5 py-3.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#B96E5C]/10">
              <StickyNote className="h-3.5 w-3.5 text-[#B96E5C]" />
            </div>
            <h3 className="text-[13px] font-bold text-[#1A1A1A]">
              Notepad
            </h3>
            {saving && (
              <span className="ml-auto text-[10px] font-medium text-[#1A1A1A]/25">
                Saving...
              </span>
            )}
            {!saving && loaded && notes.length > 0 && (
              <span className="ml-auto text-[10px] font-medium text-[#6C7B5A]/50">
                Saved
              </span>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Quick notes, ideas, reminders..."
            className="h-72 w-full resize-none bg-transparent px-5 py-4 text-[13px] leading-relaxed text-[#1A1A1A] placeholder-[#1A1A1A]/20 outline-none"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}
