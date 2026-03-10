"use client";

import { useState, useEffect, useRef } from "react";
import { Megaphone, X } from "lucide-react";

type ChangelogEntry = {
  id: string;
  title: string;
  description: string;
  version: string | null;
  created_at: string;
};

function relativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PatchNoteDetailModal({
  entry,
  onClose,
}: {
  entry: ChangelogEntry;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative mx-4 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-base)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--solvyn-border-subtle)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--solvyn-olive)]/15">
              <Megaphone className="h-4.5 w-4.5 text-[var(--solvyn-olive)]" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
                {entry.title}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                {entry.version && (
                  <span className="rounded-full bg-[var(--solvyn-olive)]/15 px-2 py-0.5 text-[11px] font-medium text-[var(--solvyn-olive)]">
                    {entry.version}
                  </span>
                )}
                <span className="text-[11px] text-[var(--solvyn-text-tertiary)]">
                  {formatDate(entry.created_at)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--solvyn-text-secondary)]">
            {entry.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChangelogViewer() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<ChangelogEntry | null>(null);

  useEffect(() => {
    fetch("/api/changelog")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--solvyn-olive)] border-t-transparent" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--solvyn-bg-elevated)]">
          <Megaphone className="h-6 w-6 text-[var(--solvyn-text-tertiary)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--solvyn-text-secondary)]">
          No patch notes yet
        </p>
        <p className="mt-1 text-[13px] text-[var(--solvyn-text-tertiary)]">
          Updates will appear here as changes are pushed.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-0 w-px bg-[var(--solvyn-border-subtle)]" />

        <div className="flex flex-col gap-6">
          {entries.map((entry, i) => {
            const isLatest = i === 0;

            return (
              <div key={entry.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 transition-colors ${
                    isLatest
                      ? "border-[var(--solvyn-olive)] bg-[var(--solvyn-olive)]/30"
                      : "border-[var(--solvyn-olive)] bg-[var(--solvyn-bg-base)]"
                  }`}
                />

                {/* Card */}
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="flex-1 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] p-4 text-left transition-all duration-150 hover:border-[var(--solvyn-border-default)] hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-[var(--solvyn-text-primary)]">
                        {entry.title}
                      </h3>
                      {entry.version && (
                        <span className="rounded-full bg-[var(--solvyn-olive)]/15 px-2 py-0.5 text-[11px] font-medium text-[var(--solvyn-olive)]">
                          {entry.version}
                        </span>
                      )}
                      {isLatest && (
                        <span className="rounded-full bg-[var(--solvyn-amber)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--solvyn-amber)]">
                          Latest
                        </span>
                      )}
                    </div>
                    <span
                      className="shrink-0 text-[12px] text-[var(--solvyn-text-tertiary)]"
                      title={formatDate(entry.created_at)}
                    >
                      {relativeDate(entry.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--solvyn-text-tertiary)] line-clamp-2">
                    {entry.description}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEntry && (
        <PatchNoteDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
}
