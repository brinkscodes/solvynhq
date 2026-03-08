"use client";

import { useState, useEffect, useRef } from "react";
import {
  ListTodo,
  X,
  StickyNote,
  HelpCircle,
  CircleCheck,
  Trash2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MeetingAgendaItem, AgendaItemType } from "@/lib/meeting-agenda-types";

const TYPE_CONFIG: Record<AgendaItemType, { label: string; icon: typeof StickyNote; color: string }> = {
  note: { label: "Note", icon: StickyNote, color: "var(--solvyn-olive)" },
  question: { label: "Question", icon: HelpCircle, color: "var(--solvyn-rust)" },
  action: { label: "Action", icon: CircleCheck, color: "var(--solvyn-text-secondary)" },
};

export function FloatingAgenda() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MeetingAgendaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedType, setSelectedType] = useState<AgendaItemType>("note");
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load items
  useEffect(() => {
    fetch("/api/meeting-agenda")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Listen for close event from other floating panels
  useEffect(() => {
    const handleClose = () => setOpen(false);
    window.addEventListener("close-floating-panels", handleClose);
    return () => window.removeEventListener("close-floating-panels", handleClose);
  }, []);

  // Focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleOpen = () => {
    if (!open) {
      window.dispatchEvent(new CustomEvent("close-floating-panels"));
    }
    setOpen(!open);
  };

  const handleSubmit = async () => {
    if (!input.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/meeting-agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, content: input.trim() }),
      });
      const item = await res.json();
      if (item.id) {
        setItems((prev) => [...prev, item]);
        setInput("");
      }
    } finally {
      setSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/meeting-agenda?id=${id}`, { method: "DELETE" });
  };

  const handleToggle = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newCompleted = !item.completed;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: newCompleted } : i))
    );
    await fetch("/api/meeting-agenda", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: newCompleted }),
    });
  };

  const uncompletedCount = items.filter((i) => !i.completed).length;

  return (
    <>
      {/* Floating button — stacked above notepad */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
          open
            ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-xl shadow-black/30 rotate-12 border border-[var(--solvyn-border-default)]"
            : "bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-tertiary)] shadow-lg shadow-black/20 border border-[var(--solvyn-border-default)] hover:text-[var(--solvyn-olive)] hover:shadow-xl hover:scale-105"
        )}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <div className="relative">
            <ListTodo className="h-5 w-5" />
            {uncompletedCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--solvyn-olive)] px-1 text-[10px] font-bold text-white">
                {uncompletedCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Agenda panel */}
      <div
        className={cn(
          "fixed bottom-[8.5rem] right-6 z-50 transition-all duration-300 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-3 scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex w-[calc(100vw-3rem)] max-w-80 flex-col overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] shadow-2xl shadow-black/30 sm:w-80">
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-[var(--solvyn-border-subtle)] px-5 py-3.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--solvyn-olive)]/15">
              <ListTodo className="h-3.5 w-3.5 text-[var(--solvyn-olive)]" />
            </div>
            <h3 className="text-[13px] font-bold text-[var(--solvyn-text-primary)]">
              Meeting Agenda
            </h3>
            {items.length > 0 && (
              <span className="ml-auto text-[10px] font-medium text-[var(--solvyn-text-tertiary)]">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Items list */}
          <div className="max-h-64 overflow-y-auto">
            {loaded && items.length === 0 && (
              <div className="px-5 py-8 text-center text-xs text-[var(--solvyn-text-tertiary)]">
                No agenda items yet. Add one below.
              </div>
            )}
            {items.map((item) => {
              const cfg = TYPE_CONFIG[item.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={item.id}
                  className="group flex items-start gap-2.5 border-b border-[var(--solvyn-border-subtle)]/50 px-5 py-2.5 last:border-b-0"
                >
                  {item.type === "action" ? (
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="mt-0.5 shrink-0"
                    >
                      {item.completed ? (
                        <CircleCheck
                          className="h-4 w-4 text-[var(--solvyn-olive)]"
                        />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-[var(--solvyn-border-default)]" />
                      )}
                    </button>
                  ) : (
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: cfg.color }}
                    />
                  )}
                  <span
                    className={cn(
                      "flex-1 text-[13px] leading-snug text-[var(--solvyn-text-secondary)]",
                      item.type === "action" && item.completed && "line-through opacity-50"
                    )}
                  >
                    {item.content}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-rust)]" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add form */}
          <div className="border-t border-[var(--solvyn-border-subtle)] px-4 py-3">
            {/* Type selector pills */}
            <div className="mb-2.5 flex gap-1.5">
              {(Object.entries(TYPE_CONFIG) as [AgendaItemType, typeof TYPE_CONFIG["note"]][]).map(
                ([type, cfg]) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
                      selectedType === type
                        ? "bg-[var(--solvyn-olive)]/15 text-[var(--solvyn-olive)]"
                        : "text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-border-subtle)]/40"
                    )}
                  >
                    {cfg.label}
                  </button>
                )
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder={`Add a ${selectedType}...`}
                className="min-w-0 flex-1 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-base)] px-3 py-2 text-[13px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none focus:border-[var(--solvyn-olive)]/40"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || submitting}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--solvyn-olive)] text-white transition-opacity disabled:opacity-30"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
