"use client";

import { useState, useEffect, useRef } from "react";
import { X, Megaphone, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function PatchNotesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/changelog")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEntries(data);
          // Auto-expand the latest entry
          if (data.length > 0) setExpandedId(data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

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
                Patch Notes
              </h2>
              <p className="text-[11px] text-[var(--solvyn-text-tertiary)]">
                {entries.length} update{entries.length !== 1 ? "s" : ""}
              </p>
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
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--solvyn-olive)] border-t-transparent" />
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
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
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[var(--solvyn-border-subtle)]" />

              <div className="flex flex-col gap-3">
                {entries.map((entry, i) => {
                  const isExpanded = expandedId === entry.id;
                  const isLatest = i === 0;

                  return (
                    <div key={entry.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div
                        className={cn(
                          "relative z-10 mt-3 h-[15px] w-[15px] shrink-0 rounded-full border-2 transition-colors",
                          isLatest
                            ? "border-[var(--solvyn-olive)] bg-[var(--solvyn-olive)]/30"
                            : "border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-base)]"
                        )}
                      />

                      {/* Card */}
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : entry.id)
                        }
                        className={cn(
                          "flex-1 rounded-xl border text-left transition-all duration-200",
                          isExpanded
                            ? "border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)]"
                            : "border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/50 hover:border-[var(--solvyn-border-default)] hover:bg-[var(--solvyn-bg-elevated)]"
                        )}
                      >
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <h3
                              className={cn(
                                "text-[14px] font-semibold",
                                isExpanded
                                  ? "text-[var(--solvyn-text-primary)]"
                                  : "text-[var(--solvyn-text-secondary)]"
                              )}
                            >
                              {entry.title}
                            </h3>
                            {entry.version && (
                              <span className="rounded-full bg-[var(--solvyn-olive)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--solvyn-olive)]">
                                {entry.version}
                              </span>
                            )}
                            {isLatest && (
                              <span className="rounded-full bg-[var(--solvyn-amber)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--solvyn-amber)]">
                                Latest
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[11px] text-[var(--solvyn-text-tertiary)]"
                              title={formatDate(entry.created_at)}
                            >
                              {relativeDate(entry.created_at)}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-[var(--solvyn-border-subtle)] px-4 py-3">
                            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--solvyn-text-secondary)]">
                              {entry.description}
                            </p>
                            <p className="mt-3 text-[11px] text-[var(--solvyn-text-tertiary)]">
                              {formatDate(entry.created_at)}
                            </p>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
