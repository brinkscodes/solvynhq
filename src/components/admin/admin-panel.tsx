"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Clock,
  Mail,
  FolderOpen,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/avatar";

interface UserProject {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
  taskStats: { total: number; done: number };
}

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  lastSignInAt: string | null;
  provider: string;
  projects: UserProject[];
}

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) +
    " at " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
}

function timeAgo(iso: string | null): string {
  if (!iso) return "Never";
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] px-5 py-4">
      <div className="flex items-center gap-2 text-[var(--solvyn-text-tertiary)]">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1.5 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--solvyn-text-primary)]">
        {value}
      </p>
    </div>
  );
}

export function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => {
        if (r.status === 403) throw new Error("Unauthorized");
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--solvyn-text-tertiary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--solvyn-border-default)] py-16">
        <ShieldAlert className="mb-3 h-8 w-8 text-[var(--solvyn-rust)]" />
        <p className="text-sm font-medium text-[var(--solvyn-text-primary)]">
          {error === "Unauthorized" ? "Admin access only" : "Something went wrong"}
        </p>
        <p className="mt-1 text-xs text-[var(--solvyn-text-tertiary)]">
          {error === "Unauthorized"
            ? "This page is restricted to the admin account."
            : error}
        </p>
      </div>
    );
  }

  const activeToday = users.filter((u) => {
    const last = u.lastSeenAt ?? u.lastSignInAt;
    if (!last) return false;
    const today = new Date();
    const seen = new Date(last);
    return seen.toDateString() === today.toDateString();
  }).length;

  const activeThisWeek = users.filter((u) => {
    const last = u.lastSeenAt ?? u.lastSignInAt;
    if (!last) return false;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(last).getTime() > weekAgo;
  }).length;

  return (
    <div>
      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={Users} />
        <StatCard label="Active Today" value={activeToday} icon={Activity} />
        <StatCard label="Active This Week" value={activeThisWeek} icon={Clock} />
        <StatCard
          label="Total Projects"
          value={new Set(users.flatMap((u) => u.projects.map((p) => p.id))).size}
          icon={FolderOpen}
        />
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_140px_100px] gap-4 border-b border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
            User
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
            Email
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
            Last Active
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
            Joined
          </span>
        </div>

        {/* Rows */}
        {users.map((user) => (
          <div key={user.id}>
            <button
              onClick={() =>
                setExpandedUser(expandedUser === user.id ? null : user.id)
              }
              className={cn(
                "grid w-full grid-cols-[1fr_1fr_140px_100px] items-center gap-4 border-b border-[var(--solvyn-border-subtle)] px-5 py-3.5 text-left transition-colors last:border-b-0 hover:bg-[var(--solvyn-bg-elevated)]/50",
                expandedUser === user.id && "bg-[var(--solvyn-bg-elevated)]/30"
              )}
            >
              {/* User */}
              <div className="flex items-center gap-3">
                <Avatar
                  name={user.fullName || user.email}
                  avatarUrl={user.avatarUrl}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--solvyn-text-primary)]">
                    {user.fullName || "No name"}
                  </p>
                  <p className="text-[11px] text-[var(--solvyn-text-tertiary)]">
                    {user.provider}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--solvyn-text-tertiary)]" />
                <span className="truncate text-[13px] text-[var(--solvyn-text-secondary)]">
                  {user.email}
                </span>
              </div>

              {/* Last active */}
              <div>
                <span
                  className={cn(
                    "text-[13px]",
                    (user.lastSeenAt ?? user.lastSignInAt) &&
                      Date.now() - new Date(user.lastSeenAt ?? user.lastSignInAt!).getTime() <
                        24 * 60 * 60 * 1000
                      ? "font-medium text-[var(--solvyn-olive)]"
                      : "text-[var(--solvyn-text-secondary)]"
                  )}
                >
                  {timeAgo(user.lastSeenAt ?? user.lastSignInAt)}
                </span>
              </div>

              {/* Joined */}
              <span className="text-[13px] text-[var(--solvyn-text-tertiary)]">
                {formatDate(user.createdAt)}
              </span>
            </button>

            {/* Expanded details */}
            {expandedUser === user.id && (
              <div className="border-b border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/20 px-5 py-4 pl-[68px]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
                      Details
                    </p>
                    <div className="space-y-1 text-[13px]">
                      <p className="text-[var(--solvyn-text-secondary)]">
                        <span className="text-[var(--solvyn-text-tertiary)]">
                          User ID:{" "}
                        </span>
                        <code className="rounded bg-[var(--solvyn-bg-elevated)] px-1.5 py-0.5 text-[11px]">
                          {user.id.slice(0, 8)}...
                        </code>
                      </p>
                      <p className="text-[var(--solvyn-text-secondary)]">
                        <span className="text-[var(--solvyn-text-tertiary)]">
                          Last active:{" "}
                        </span>
                        {formatDateTime(user.lastSeenAt ?? user.lastSignInAt)}
                      </p>
                      <p className="text-[var(--solvyn-text-secondary)]">
                        <span className="text-[var(--solvyn-text-tertiary)]">
                          Signed up:{" "}
                        </span>
                        {formatDateTime(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
                      Projects ({user.projects.length})
                    </p>
                    {user.projects.length > 0 ? (
                      <div className="space-y-2">
                        {user.projects.map((project) => (
                          <div
                            key={project.id}
                            className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3 py-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-medium text-[var(--solvyn-text-primary)]">
                                {project.name}
                              </span>
                              <span className="rounded-full bg-[var(--solvyn-bg-elevated)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--solvyn-text-tertiary)]">
                                {project.role}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-[11px] text-[var(--solvyn-text-tertiary)]">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {project.taskStats.done}/{project.taskStats.total} tasks
                              </span>
                              <span>
                                Joined {formatDate(project.joinedAt)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-[var(--solvyn-text-tertiary)]">
                        No projects yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-[var(--solvyn-text-tertiary)]">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
