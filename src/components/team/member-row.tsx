"use client";

import { useState } from "react";
import { MoreHorizontal, Shield, Code, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/avatar";
import type { TeamMember, MemberRole } from "@/lib/team-types";

const roleBadge: Record<MemberRole, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  owner: { label: "Developer", icon: Code, color: "text-[var(--solvyn-amber)]" },
  admin: { label: "Admin", icon: Shield, color: "text-[var(--solvyn-olive)]" },
  member: { label: "Member", icon: Shield, color: "text-[var(--solvyn-text-tertiary)]" },
};

export function MemberRow({
  member,
  currentUserId,
  currentUserRole,
  onRemove,
}: {
  member: TeamMember;
  currentUserId: string;
  currentUserRole: MemberRole;
  onUpdateRole: (memberId: string, role: MemberRole) => void;
  onRemove: (memberId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const badge = roleBadge[member.role];
  const isCurrentUser = member.userId === currentUserId;
  // Only owner can manage, and can't manage themselves
  const canManage = !isCurrentUser && member.role !== "owner" && currentUserRole === "owner";

  return (
    <div className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-[var(--solvyn-bg-elevated)]/50">
      <Avatar name={member.fullName} avatarUrl={member.avatarUrl} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] font-medium text-[var(--solvyn-text-primary)]">
            {member.fullName}
          </span>
          {isCurrentUser && (
            <span className="text-[10px] font-medium text-[var(--solvyn-text-tertiary)]">(you)</span>
          )}
        </div>
        <p className="truncate text-[12px] text-[var(--solvyn-text-tertiary)]">{member.email}</p>
      </div>

      <div className={cn("flex items-center gap-1.5 text-[11px] font-medium", badge.color)}>
        <badge.icon className="h-3.5 w-3.5" />
        {badge.label}
      </div>

      {canManage && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => { setMenuOpen(false); setConfirmRemove(false); }} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-lg shadow-black/20">
                {!confirmRemove ? (
                  <button
                    onClick={() => setConfirmRemove(true)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium text-[var(--solvyn-rust)] hover:bg-[var(--solvyn-bg-base)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove from Team
                  </button>
                ) : (
                  <div className="px-3 py-2">
                    <p className="mb-2 text-[12px] text-[var(--solvyn-text-secondary)]">
                      Remove <strong>{member.fullName}</strong>?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { onRemove(member.id); setMenuOpen(false); setConfirmRemove(false); }}
                        className="rounded-md bg-[var(--solvyn-rust)] px-3 py-1 text-[11px] font-semibold text-white hover:brightness-110"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => { setConfirmRemove(false); setMenuOpen(false); }}
                        className="rounded-md border border-[var(--solvyn-border-default)] px-3 py-1 text-[11px] font-medium text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-base)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
