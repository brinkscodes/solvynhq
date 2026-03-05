"use client";

import { useState } from "react";
import { MoreHorizontal, Shield, ShieldCheck, Crown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/avatar";
import type { TeamMember, MemberRole } from "@/lib/team-types";

const roleBadge: Record<MemberRole, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  owner: { label: "Owner", icon: Crown, color: "text-[var(--solvyn-amber)]" },
  admin: { label: "Admin", icon: ShieldCheck, color: "text-[var(--solvyn-olive)]" },
  member: { label: "Member", icon: Shield, color: "text-[var(--solvyn-text-tertiary)]" },
};

export function MemberRow({
  member,
  currentUserId,
  currentUserRole,
  onUpdateRole,
  onRemove,
}: {
  member: TeamMember;
  currentUserId: string;
  currentUserRole: MemberRole;
  onUpdateRole: (memberId: string, role: MemberRole) => void;
  onRemove: (memberId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const badge = roleBadge[member.role];
  const isCurrentUser = member.userId === currentUserId;
  const canManage =
    !isCurrentUser &&
    member.role !== "owner" &&
    (currentUserRole === "owner" || (currentUserRole === "admin" && member.role === "member"));

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
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-lg shadow-black/20">
                {currentUserRole === "owner" && member.role === "member" && (
                  <button
                    onClick={() => { onUpdateRole(member.id, "admin"); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-base)]"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Promote to Admin
                  </button>
                )}
                {currentUserRole === "owner" && member.role === "admin" && (
                  <button
                    onClick={() => { onUpdateRole(member.id, "member"); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-base)]"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Demote to Member
                  </button>
                )}
                <button
                  onClick={() => { onRemove(member.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium text-[var(--solvyn-rust)] hover:bg-[var(--solvyn-bg-base)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
