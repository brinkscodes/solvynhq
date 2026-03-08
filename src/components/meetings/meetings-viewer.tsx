"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Users,
  CheckCircle2,
  Circle,
  Lightbulb,
  ArrowLeft,
  ListTodo,
  StickyNote,
  HelpCircle,
  CircleCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { Meeting } from "@/lib/meetings-types";
import type { MeetingAgendaItem, AgendaItemType } from "@/lib/meeting-agenda-types";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const [expanded, setExpanded] = useState(true);
  const pendingCount = meeting.actionItems.filter(
    (item) => item.status === "pending"
  ).length;
  const doneCount = meeting.actionItems.filter(
    (item) => item.status === "done"
  ).length;

  return (
    <div className="overflow-hidden rounded-2xl bg-[var(--solvyn-bg-raised)] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-[var(--solvyn-bg-base)]/50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--solvyn-olive)]/10">
          <Calendar className="h-5 w-5 text-[var(--solvyn-olive)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
            {meeting.title}
          </h3>
          <p className="mt-0.5 text-sm text-[var(--solvyn-text-secondary)]">
            {formatDate(meeting.date)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {pendingCount > 0 && (
            <span className="hidden rounded-full bg-[var(--solvyn-rust)]/10 px-2.5 py-1 text-xs font-medium text-[var(--solvyn-rust)] sm:inline-flex">
              {pendingCount} pending
            </span>
          )}
          {doneCount > 0 && (
            <span className="hidden rounded-full bg-[var(--solvyn-olive)]/10 px-2.5 py-1 text-xs font-medium text-[var(--solvyn-olive)] sm:inline-flex">
              {doneCount} done
            </span>
          )}
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-[var(--solvyn-border-subtle)]/60 px-6 pb-6 pt-5">
          {/* Attendees */}
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
            <div className="flex flex-wrap gap-1.5">
              {meeting.attendees.map((attendee) => (
                <span
                  key={attendee}
                  className="rounded-full bg-[var(--solvyn-border-subtle)]/60 px-3 py-1 text-xs font-medium text-[var(--solvyn-text-secondary)]"
                >
                  {attendee}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <p className="mb-6 text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
            {meeting.summary}
          </p>

          {/* Decisions */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
              Decisions
            </h4>
            <div className="space-y-2">
              {meeting.decisions.map((decision, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--solvyn-olive)]" />
                  <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
                    {decision}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
              Action Items
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[var(--solvyn-border-default)]/80">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="border-b border-[var(--solvyn-border-subtle)]/60 bg-[var(--solvyn-bg-base)]/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--solvyn-text-secondary)]">
                      Owner
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--solvyn-text-secondary)]">
                      Action
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--solvyn-text-secondary)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meeting.actionItems.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--solvyn-border-subtle)]/40 last:border-b-0"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[var(--solvyn-text-secondary)]">
                        {item.owner}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--solvyn-text-secondary)]">
                        {item.action}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.status === "done" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--solvyn-olive)]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--solvyn-rust)]">
                            <Circle className="h-3.5 w-3.5" />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {meeting.notes.length > 0 && (
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
                Notes
              </h4>
              <div className="space-y-2">
                {meeting.notes.map((note, i) => (
                  <div key={i} className="flex gap-3">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--solvyn-rust)]/50" />
                    <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)] italic">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const AGENDA_TYPE_CONFIG: Record<AgendaItemType, { label: string; icon: typeof StickyNote; color: string }> = {
  note: { label: "Notes", icon: StickyNote, color: "var(--solvyn-olive)" },
  question: { label: "Questions", icon: HelpCircle, color: "var(--solvyn-rust)" },
  action: { label: "Action Items", icon: CircleCheck, color: "var(--solvyn-text-secondary)" },
};

function NextMeetingAgenda() {
  const [items, setItems] = useState<MeetingAgendaItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/meeting-agenda")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

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

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/meeting-agenda?id=${id}`, { method: "DELETE" });
  };

  if (!loaded || items.length === 0) return null;

  const grouped = {
    note: items.filter((i) => i.type === "note"),
    question: items.filter((i) => i.type === "question"),
    action: items.filter((i) => i.type === "action"),
  };

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border-2 border-dashed border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-bg-raised)] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--solvyn-olive)]/10">
          <ListTodo className="h-5 w-5 text-[var(--solvyn-olive)]" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
            Next Meeting Agenda
          </h3>
          <p className="mt-0.5 text-sm text-[var(--solvyn-text-secondary)]">
            {items.length} item{items.length !== 1 ? "s" : ""} to discuss
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--solvyn-border-subtle)]/60 px-6 pb-6 pt-5">
        {(["note", "question", "action"] as AgendaItemType[]).map((type) => {
          const typeItems = grouped[type];
          if (typeItems.length === 0) return null;
          const cfg = AGENDA_TYPE_CONFIG[type];
          const Icon = cfg.icon;
          return (
            <div key={type} className="mb-5 last:mb-0">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
                {cfg.label}
              </h4>
              <div className="space-y-2">
                {typeItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-3"
                  >
                    {type === "action" ? (
                      <button
                        onClick={() => handleToggle(item.id)}
                        className="mt-0.5 shrink-0"
                      >
                        {item.completed ? (
                          <CircleCheck className="h-4 w-4 text-[var(--solvyn-olive)]" />
                        ) : (
                          <Circle className="h-4 w-4 text-[var(--solvyn-rust)]" />
                        )}
                      </button>
                    ) : (
                      <Icon
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: cfg.color }}
                      />
                    )}
                    <p
                      className={cn(
                        "flex-1 text-sm leading-relaxed text-[var(--solvyn-text-secondary)]",
                        type === "action" && item.completed && "line-through opacity-50"
                      )}
                    >
                      {item.content}
                    </p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-rust)]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MeetingsViewer({ meetings }: { meetings: Meeting[] }) {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[var(--solvyn-text-primary)]">
              Meetings
            </h1>
            <p className="mt-1 text-sm text-[var(--solvyn-text-secondary)]">
              {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-border-subtle)]/40 hover:text-[var(--solvyn-text-secondary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Next meeting agenda */}
      <NextMeetingAgenda />

      {/* Meeting cards */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>

      {/* Empty state */}
      {meetings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--solvyn-border-subtle)] py-16">
          <Calendar className="mb-3 h-8 w-8 text-[var(--solvyn-text-tertiary)]" />
          <p className="text-sm text-[var(--solvyn-text-secondary)]">No meetings recorded yet</p>
        </div>
      )}
    </>
  );
}
