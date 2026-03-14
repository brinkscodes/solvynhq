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
  ImagePlus,
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
  const [pendingImage, setPendingImage] = useState<{ url: string; uploading: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Listen for agenda-updated events (from meetings page inline form)
  useEffect(() => {
    const handleUpdate = () => {
      fetch("/api/meeting-agenda")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setItems(data);
        });
    };
    window.addEventListener("agenda-updated", handleUpdate);
    return () => window.removeEventListener("agenda-updated", handleUpdate);
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately with uploading state
    const previewUrl = URL.createObjectURL(file);
    setPendingImage({ url: previewUrl, uploading: true });

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/meeting-agenda/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        URL.revokeObjectURL(previewUrl);
        setPendingImage({ url: data.url, uploading: false });
      } else {
        setPendingImage(null);
      }
    } catch {
      setPendingImage(null);
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if ((!input.trim() && !pendingImage) || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/meeting-agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          content: input.trim() || `[image]`,
          ...(pendingImage && !pendingImage.uploading ? { imageUrl: pendingImage.url } : {}),
        }),
      });
      const item = await res.json();
      if (item.id) {
        setItems((prev) => [...prev, item]);
        setInput("");
        setPendingImage(null);
        window.dispatchEvent(new CustomEvent("agenda-updated"));
      }
    } finally {
      setSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/meeting-agenda?id=${id}`, { method: "DELETE" });
    window.dispatchEvent(new CustomEvent("agenda-updated"));
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
                  className="group border-b border-[var(--solvyn-border-subtle)]/50 px-5 py-2.5 last:border-b-0"
                >
                  <div className="flex items-start gap-2.5">
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
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="mt-2 ml-6.5 max-h-28 rounded-lg border border-[var(--solvyn-border-subtle)] object-cover"
                    />
                  )}
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

            {/* Image preview */}
            {pendingImage && (
              <div className="relative mb-2.5 inline-block">
                <img
                  src={pendingImage.url}
                  alt="Attachment preview"
                  className={cn(
                    "h-16 rounded-lg border border-[var(--solvyn-border-subtle)] object-cover",
                    pendingImage.uploading && "opacity-50"
                  )}
                />
                {pendingImage.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--solvyn-olive)] border-t-transparent" />
                  </div>
                )}
                {!pendingImage.uploading && (
                  <button
                    onClick={() => setPendingImage(null)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--solvyn-bg-elevated)] border border-[var(--solvyn-border-default)] shadow-sm"
                  >
                    <X className="h-3 w-3 text-[var(--solvyn-text-secondary)]" />
                  </button>
                )}
              </div>
            )}

            {/* Input + image button */}
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={pendingImage?.uploading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--solvyn-border-subtle)] text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-border-subtle)]/40 hover:text-[var(--solvyn-text-secondary)] disabled:opacity-30"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={(!input.trim() && !pendingImage) || submitting || pendingImage?.uploading}
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
