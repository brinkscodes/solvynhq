"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus } from "lucide-react";
import { MemberRow } from "./member-row";
import { InviteForm } from "./invite-form";
import type { TeamMember, ProjectInvite, MemberRole } from "@/lib/team-types";

export function TeamViewer() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<ProjectInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch("/api/team");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load team");
      }
      const data = await res.json();
      setMembers(data.members || []);
      setInvites(data.invites || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.id) setCurrentUserId(d.id); })
      .catch(() => {});
  }, [fetchTeam]);

  const currentUserRole: MemberRole =
    members.find((m) => m.userId === currentUserId)?.role || "member";

  const isOwner = currentUserRole === "owner";

  async function handleInvite(payload: { email?: string; role: "admin" | "member" }) {
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const invite = await res.json();
    setInvites((prev) => [invite, ...prev]);
    return { inviteCode: invite.inviteCode };
  }

  async function handleUpdateRole(memberId: string, role: MemberRole) {
    const res = await fetch("/api/team/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, role }),
    });
    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role } : m))
      );
    }
  }

  async function handleRemove(memberId: string) {
    const res = await fetch(`/api/team/members?memberId=${memberId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--solvyn-olive)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-[var(--solvyn-rust)]">{error}</p>
        <button
          onClick={() => { setLoading(true); fetchTeam(); }}
          className="mt-3 text-sm font-medium text-[var(--solvyn-olive)] hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Members section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--solvyn-olive)]" />
          <h2 className="text-[14px] font-semibold text-[var(--solvyn-text-primary)]">
            Team Members
          </h2>
          <span className="rounded-full bg-[var(--solvyn-bg-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--solvyn-text-tertiary)]">
            {members.length}
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)]">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onUpdateRole={handleUpdateRole}
              onRemove={handleRemove}
            />
          ))}
          {members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-3 h-8 w-8 text-[var(--solvyn-text-tertiary)]" />
              <p className="text-[13px] font-medium text-[var(--solvyn-text-secondary)]">
                No team members yet
              </p>
              <p className="mt-1 text-[12px] text-[var(--solvyn-text-tertiary)]">
                Invite people below to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div>
          <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
            Pending Invites
          </h3>
          <div className="space-y-2">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-4 py-2.5"
              >
                <div>
                  <span className="text-[13px] font-medium text-[var(--solvyn-text-secondary)]">
                    {invite.email || "Open invite link"}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--solvyn-text-tertiary)]">
                  Expires {new Date(invite.expiresAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite section — only visible to owner */}
      {isOwner && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[var(--solvyn-olive)]" />
            <h2 className="text-[14px] font-semibold text-[var(--solvyn-text-primary)]">
              Invite People
            </h2>
          </div>

          <div className="rounded-2xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] p-5">
            <InviteForm onInvite={handleInvite} />
          </div>
        </div>
      )}
    </div>
  );
}
