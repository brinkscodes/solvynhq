"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import type { TeamMember } from "@/lib/team-types";
import type { TaskAssignee } from "@/lib/types";

export function AssigneeSelector({
  assignee,
  onAssign,
}: {
  assignee: TaskAssignee | null | undefined;
  onAssign: (userId: string | null, assignee: TaskAssignee | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !loaded) {
      fetch("/api/team")
        .then((r) => r.json())
        .then((d) => { setMembers(d.members || []); setLoaded(true); })
        .catch(() => setLoaded(true));
    }
  }, [open, loaded]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {assignee ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:border-[var(--solvyn-border-default)]"
          >
            <Avatar name={assignee.fullName} avatarUrl={assignee.avatarUrl} size="xs" />
            {assignee.fullName}
          </button>
          <button
            onClick={() => onAssign(null, null)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-rust)]"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-default)] px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/30 hover:text-[var(--solvyn-text-secondary)]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Assign
        </button>
      )}

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-lg shadow-black/20">
          <div className="px-2 pb-1 pt-1">
            <div className="flex items-center gap-2 rounded-md border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-2 py-1.5">
              <Search className="h-3 w-3 text-[var(--solvyn-text-tertiary)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="flex-1 bg-transparent text-[12px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filtered.map((member) => (
              <button
                key={member.userId}
                onClick={() => {
                  onAssign(member.userId, {
                    userId: member.userId,
                    fullName: member.fullName,
                    avatarUrl: member.avatarUrl,
                  });
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-[12px] transition-colors hover:bg-[var(--solvyn-bg-base)]",
                  assignee?.userId === member.userId
                    ? "text-[var(--solvyn-olive)] font-medium"
                    : "text-[var(--solvyn-text-secondary)]"
                )}
              >
                <Avatar name={member.fullName} avatarUrl={member.avatarUrl} size="xs" />
                <span className="truncate">{member.fullName}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-3 text-center text-[11px] text-[var(--solvyn-text-tertiary)]">
                {loaded ? "No members found" : "Loading..."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
