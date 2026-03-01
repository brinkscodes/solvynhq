"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { StickyNote, FileText, Search, MessageSquare, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedbackModal } from "./feedback-modal";

export function Sidebar() {
  const [notepadOpen, setNotepadOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
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
    <div className="sticky top-12 flex shrink-0 gap-3">
      {/* Icon strip */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setNotepadOpen(!notepadOpen)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
            notepadOpen
              ? "border-[#B96E5C]/30 bg-[#B96E5C]/10"
              : "border-[#EAE4D9] bg-white hover:bg-[#F7F5F0]"
          )}
          title="Notepad"
        >
          <StickyNote
            className={cn(
              "h-4 w-4",
              notepadOpen ? "text-[#B96E5C]" : "text-[#2A2A2A]/40"
            )}
          />
        </button>

        <Link
          href="/content"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE4D9] bg-white transition-colors hover:border-[#6C7B5A]/30 hover:bg-[#6C7B5A]/10"
          title="Website Content"
        >
          <FileText className="h-4 w-4 text-[#2A2A2A]/40 transition-colors group-hover:text-[#6C7B5A]" />
        </Link>

        <Link
          href="/product-context"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE4D9] bg-white transition-colors hover:border-[#6C7B5A]/30 hover:bg-[#6C7B5A]/10"
          title="Marketing Context"
        >
          <Crosshair className="h-4 w-4 text-[#2A2A2A]/40 transition-colors group-hover:text-[#6C7B5A]" />
        </Link>

        <Link
          href="/seo"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE4D9] bg-white transition-colors hover:border-[#6C7B5A]/30 hover:bg-[#6C7B5A]/10"
          title="SEO Research"
        >
          <Search className="h-4 w-4 text-[#2A2A2A]/40 transition-colors group-hover:text-[#6C7B5A]" />
        </Link>

        <button
          onClick={() => setFeedbackOpen(true)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
            feedbackOpen
              ? "border-[#6C7B5A]/30 bg-[#6C7B5A]/10"
              : "border-[#EAE4D9] bg-white hover:bg-[#F7F5F0]"
          )}
          title="Send Feedback"
        >
          <MessageSquare
            className={cn(
              "h-4 w-4",
              feedbackOpen ? "text-[#6C7B5A]" : "text-[#2A2A2A]/40"
            )}
          />
        </button>
      </div>

      {/* Notepad panel */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          notepadOpen ? "w-64 opacity-100" : "w-0 opacity-0"
        )}
      >
        {notepadOpen && (
          <div className="w-64 overflow-hidden rounded-xl border border-[#EAE4D9] bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-[#EAE4D9]/60 px-4 py-3">
              <StickyNote className="h-4 w-4 text-[#B96E5C]" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2A2A2A]">
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

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
