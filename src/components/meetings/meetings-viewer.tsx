"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Users,
  CheckCircle2,
  Circle,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { Meeting } from "@/lib/meetings-types";

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
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-[#F8F7F4]/50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6C7B5A]/10">
          <Calendar className="h-5 w-5 text-[#6C7B5A]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2A2A2A]">
            {meeting.title}
          </h3>
          <p className="mt-0.5 text-sm text-[#2A2A2A]/40">
            {formatDate(meeting.date)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="rounded-full bg-[#B96E5C]/10 px-2.5 py-1 text-xs font-medium text-[#B96E5C]">
              {pendingCount} pending
            </span>
          )}
          {doneCount > 0 && (
            <span className="rounded-full bg-[#6C7B5A]/10 px-2.5 py-1 text-xs font-medium text-[#6C7B5A]">
              {doneCount} done
            </span>
          )}
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-[#2A2A2A]/30" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#2A2A2A]/30" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-[#EAE4D9]/60 px-6 pb-6 pt-5">
          {/* Attendees */}
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#2A2A2A]/30" />
            <div className="flex flex-wrap gap-1.5">
              {meeting.attendees.map((attendee) => (
                <span
                  key={attendee}
                  className="rounded-full bg-[#EAE4D9]/60 px-3 py-1 text-xs font-medium text-[#2A2A2A]/70"
                >
                  {attendee}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <p className="mb-6 text-sm leading-relaxed text-[#2A2A2A]/60">
            {meeting.summary}
          </p>

          {/* Decisions */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]/30">
              Decisions
            </h4>
            <div className="space-y-2">
              {meeting.decisions.map((decision, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6C7B5A]" />
                  <p className="text-sm leading-relaxed text-[#2A2A2A]/70">
                    {decision}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]/30">
              Action Items
            </h4>
            <div className="overflow-hidden rounded-xl border border-[#EAE4D9]/80">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EAE4D9]/60 bg-[#F8F7F4]/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-[#2A2A2A]/40">
                      Owner
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-[#2A2A2A]/40">
                      Action
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-[#2A2A2A]/40">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meeting.actionItems.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#EAE4D9]/40 last:border-b-0"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#2A2A2A]/70">
                        {item.owner}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#2A2A2A]/60">
                        {item.action}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.status === "done" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6C7B5A]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#B96E5C]">
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
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]/30">
                Notes
              </h4>
              <div className="space-y-2">
                {meeting.notes.map((note, i) => (
                  <div key={i} className="flex gap-3">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B96E5C]/50" />
                    <p className="text-sm leading-relaxed text-[#2A2A2A]/50 italic">
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

export function MeetingsViewer({ meetings }: { meetings: Meeting[] }) {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[#2A2A2A]">
              Meetings
            </h1>
            <p className="mt-1 text-sm text-[#2A2A2A]/40">
              {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#2A2A2A]/40 transition-colors hover:bg-[#EAE4D9]/40 hover:text-[#2A2A2A]/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Meeting cards */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>

      {/* Empty state */}
      {meetings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#EAE4D9] py-16">
          <Calendar className="mb-3 h-8 w-8 text-[#2A2A2A]/20" />
          <p className="text-sm text-[#2A2A2A]/40">No meetings recorded yet</p>
        </div>
      )}
    </>
  );
}
