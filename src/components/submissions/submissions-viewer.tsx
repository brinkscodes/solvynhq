"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Inbox,
  Mail,
  MailOpen,
  Archive,
  Clock,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Users,
  TrendingUp,
  Search,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormSubmission, SubmissionStatus } from "@/lib/form-submission-types";
import type { MemberRole } from "@/lib/team-types";

const statusConfig: Record<SubmissionStatus, { label: string; color: string; icon: typeof Mail }> = {
  new: { label: "New", color: "bg-[var(--solvyn-olive)]/15 text-[var(--solvyn-olive)]", icon: Mail },
  read: { label: "Read", color: "bg-[var(--solvyn-text-tertiary)]/10 text-[var(--solvyn-text-tertiary)]", icon: MailOpen },
  archived: { label: "Archived", color: "bg-[var(--solvyn-text-tertiary)]/10 text-[var(--solvyn-text-tertiary)]", icon: Archive },
  test: { label: "Dev Test", color: "bg-purple-500/15 text-purple-400", icon: FlaskConical },
};

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", config.color)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function extractPreview(fields: Record<string, unknown>): { name?: string; email?: string; message?: string } {
  const result: { name?: string; email?: string; message?: string } = {};
  // Try to extract common fields from Elementor's format
  // Elementor sends fields as { field_id: { id, type, label, value, ... } } or flat key-value
  for (const [key, val] of Object.entries(fields)) {
    const value = typeof val === "object" && val !== null && "value" in val
      ? String((val as { value: unknown }).value)
      : String(val);
    const lowerKey = key.toLowerCase();
    if (!result.name && (lowerKey.includes("name") && !lowerKey.includes("form"))) {
      result.name = value;
    }
    if (!result.email && (lowerKey.includes("email") || lowerKey.includes("e-mail"))) {
      result.email = value;
    }
    if (!result.message && (lowerKey.includes("message") || lowerKey.includes("comment") || lowerKey.includes("question"))) {
      result.message = value;
    }
  }
  return result;
}

function FieldValue({ label, value }: { label: string; value: unknown }) {
  const display = typeof value === "object" && value !== null && "value" in value
    ? String((value as { value: unknown }).value)
    : typeof value === "object"
    ? JSON.stringify(value)
    : String(value);

  const displayLabel = typeof value === "object" && value !== null && "label" in value
    ? String((value as { label: unknown }).label)
    : label;

  if (!display || display === "undefined" || display === "null") return null;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
        {displayLabel}
      </span>
      <span className="text-[13px] text-[var(--solvyn-text-primary)] whitespace-pre-wrap break-words">
        {display}
      </span>
    </div>
  );
}

function MetaInfo({ meta }: { meta: Record<string, unknown> }) {
  const items: string[] = [];
  if (meta.remote_ip) items.push(`IP: ${String(meta.remote_ip)}`);
  if (meta.page) {
    const page = meta.page as Record<string, unknown>;
    items.push(`Page: ${String(page?.title || meta.page)}`);
  }
  if (meta.date) {
    items.push(`Date: ${String(meta.date)} ${String(meta.time || "")}`);
  }
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-[var(--solvyn-text-tertiary)]">
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  );
}

const fieldOrder = [
  "form_name",
  "full name",
  "company name",
  "phone number",
  "email address",
  "venue type",
  "location",
  "form_id",
  "message",
];

function sortFields(entries: [string, unknown][]): [string, unknown][] {
  return [...entries].sort((a, b) => {
    const aLabel = getFieldLabel(a).toLowerCase();
    const bLabel = getFieldLabel(b).toLowerCase();
    const aIdx = fieldOrder.findIndex((f) => aLabel.includes(f));
    const bIdx = fieldOrder.findIndex((f) => bLabel.includes(f));
    // Known fields sort by their defined order, unknown fields go to the end
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });
}

function getFieldLabel(entry: [string, unknown]): string {
  const [key, val] = entry;
  if (typeof val === "object" && val !== null && "label" in val) {
    return String((val as { label: unknown }).label);
  }
  return key;
}

function DeleteConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="mx-4 w-full max-w-sm rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--solvyn-text-primary)]">
              Delete Lead
            </h3>
            <p className="mt-1 text-[13px] text-[var(--solvyn-text-tertiary)]">
              Are you sure you want to permanently delete this lead? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md border border-[var(--solvyn-border-subtle)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-sunken)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({
  submission,
  onStatusChange,
  onDelete,
  isAdmin,
}: {
  submission: FormSubmission;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTestConfirm, setShowTestConfirm] = useState(false);
  const preview = extractPreview(submission.fields);
  const isNew = submission.status === "new";
  const isTest = submission.status === "test";

  function handleExpand() {
    setExpanded(!expanded);
    if (!expanded && isNew) {
      onStatusChange(submission.id, "read");
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        isNew
          ? "border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-olive)]/[0.03]"
          : isTest
          ? "border-purple-500/20 bg-purple-500/[0.02] opacity-60"
          : "border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-base)]"
      )}
    >
      <button
        onClick={handleExpand}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--solvyn-text-tertiary)]" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--solvyn-text-tertiary)]" />
        )}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-[13px] truncate", isNew ? "font-semibold text-[var(--solvyn-text-primary)]" : "font-medium text-[var(--solvyn-text-primary)]")}>
              {preview.name || preview.email || submission.formName}
            </span>
            <StatusBadge status={submission.status} />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[var(--solvyn-text-tertiary)]">
            <span>{submission.formName}</span>
            {preview.email && preview.name && (
              <>
                <span className="text-[var(--solvyn-border-default)]">&middot;</span>
                <span className="truncate">{preview.email}</span>
              </>
            )}
            {preview.message && (
              <>
                <span className="text-[var(--solvyn-border-default)]">&middot;</span>
                <span className="truncate max-w-[200px]">{preview.message}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--solvyn-text-tertiary)] shrink-0">
          <Clock className="h-3 w-3" />
          {formatDate(submission.createdAt)}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--solvyn-border-subtle)] px-4 py-4">
          <div className="flex flex-col gap-3">
            {sortFields(Object.entries(submission.fields)).map(([key, value]) => (
              <FieldValue key={key} label={key} value={value} />
            ))}
          </div>

          {submission.meta && Object.keys(submission.meta).length > 0 && (
            <div className="mt-4 border-t border-[var(--solvyn-border-subtle)] pt-3">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
                Submission Info
              </p>
              <MetaInfo meta={submission.meta as Record<string, unknown>} />
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            {submission.status !== "archived" && (
              <button
                onClick={() => onStatusChange(submission.id, "archived")}
                className="flex items-center gap-1.5 rounded-md border border-[var(--solvyn-border-subtle)] px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
              >
                <Archive className="h-3 w-3" />
                Archive
              </button>
            )}
            {submission.status === "archived" && (
              <button
                onClick={() => onStatusChange(submission.id, "read")}
                className="flex items-center gap-1.5 rounded-md border border-[var(--solvyn-border-subtle)] px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
              >
                <Inbox className="h-3 w-3" />
                Unarchive
              </button>
            )}
            {submission.status !== "new" && submission.status !== "test" && (
              <button
                onClick={() => onStatusChange(submission.id, "new")}
                className="flex items-center gap-1.5 rounded-md border border-[var(--solvyn-border-subtle)] px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
              >
                <Mail className="h-3 w-3" />
                Mark as New
              </button>
            )}
            {submission.status !== "test" && (
              <button
                onClick={() => setShowTestConfirm(true)}
                className="flex items-center gap-1.5 rounded-md border border-purple-500/20 px-3 py-1.5 text-[12px] font-medium text-purple-400 transition-colors hover:bg-purple-500/10"
              >
                <FlaskConical className="h-3 w-3" />
                Dev Test
              </button>
            )}
            {submission.status === "test" && (
              <button
                onClick={() => onStatusChange(submission.id, "new")}
                className="flex items-center gap-1.5 rounded-md border border-[var(--solvyn-border-subtle)] px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
              >
                <Mail className="h-3 w-3" />
                Restore to Inbox
              </button>
            )}
            {isAdmin && (
              <div className="ml-auto">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 rounded-md border border-red-500/20 px-3 py-1.5 text-[12px] font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {showTestConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowTestConfirm(false)}>
              <div
                className="mx-4 w-full max-w-sm rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                    <FlaskConical className="h-4.5 w-4.5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[var(--solvyn-text-primary)]">
                      Mark as Dev Test?
                    </h3>
                    <p className="mt-1 text-[13px] text-[var(--solvyn-text-tertiary)]">
                      This lead will be flagged as a test submission and excluded from all metrics. You can restore it later.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => setShowTestConfirm(false)}
                    className="rounded-md border border-[var(--solvyn-border-subtle)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-sunken)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowTestConfirm(false);
                      onStatusChange(submission.id, "test");
                    }}
                    className="rounded-md bg-purple-500 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-purple-600"
                  >
                    Mark as Dev Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteConfirm && (
            <DeleteConfirmDialog
              onConfirm={() => {
                setShowDeleteConfirm(false);
                onDelete(submission.id);
              }}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

type Filter = "all" | "new" | "read" | "archived" | "test";

export function SubmissionsViewer() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [userRole, setUserRole] = useState<MemberRole>("member");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/form-submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
    // Fetch current user's role
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/team").then((r) => r.json()),
    ])
      .then(([profile, team]) => {
        const me = team.members?.find((m: { userId: string }) => m.userId === profile.id);
        if (me) setUserRole(me.role);
      })
      .catch(() => {});
  }, [fetchSubmissions]);

  const isAdmin = userRole === "owner" || userRole === "admin";

  async function handleStatusChange(id: string, status: SubmissionStatus) {
    // Optimistic update
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    try {
      await fetch("/api/form-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      // Revert on failure
      fetchSubmissions();
    }
  }

  async function handleDelete(id: string) {
    // Optimistic removal
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch("/api/form-submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // Revert on failure
      fetchSubmissions();
    }
  }

  const [searchQuery, setSearchQuery] = useState("");

  // Real leads exclude test submissions
  const realLeads = submissions.filter((s) => s.status !== "test");
  const testCount = submissions.filter((s) => s.status === "test").length;

  const newCount = realLeads.filter((s) => s.status === "new").length;
  const readCount = realLeads.filter((s) => s.status === "read").length;
  const archivedCount = realLeads.filter((s) => s.status === "archived").length;

  const newTodayCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return realLeads.filter((s) => {
      const created = new Date(s.createdAt);
      return created >= today;
    }).length;
  }, [realLeads]);

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "Inbox" },
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "archived", label: "Archived" },
  ];

  const stats = [
    {
      label: "Total Leads",
      value: realLeads.length,
      icon: Users,
      color: "var(--solvyn-olive)",
    },
    {
      label: "New Today",
      value: newTodayCount,
      icon: TrendingUp,
      color: "var(--solvyn-olive)",
    },
    {
      label: "Read",
      value: readCount,
      icon: MailOpen,
      color: "var(--solvyn-amber)",
    },
    {
      label: "Archived",
      value: archivedCount,
      icon: Archive,
      color: "var(--solvyn-rust)",
    },
  ];

  const filtered = useMemo(() => {
    let result = filter === "all"
      ? submissions.filter((s) => s.status !== "archived" && s.status !== "test")
      : submissions.filter((s) => s.status === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => {
        const preview = extractPreview(s.fields);
        return (
          (preview.name && preview.name.toLowerCase().includes(q)) ||
          (preview.email && preview.email.toLowerCase().includes(q)) ||
          (preview.message && preview.message.toLowerCase().includes(q)) ||
          s.formName.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [submissions, filter, searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-[var(--solvyn-text-primary)]">
          Inbox
        </h1>
        <p className="mt-1 text-[13px] text-[var(--solvyn-text-tertiary)]">
          Manage and respond to your form submissions
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] px-4 pt-4 pb-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[var(--solvyn-text-tertiary)]">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[26px] font-bold leading-none text-[var(--solvyn-text-primary)]">
                    {stat.value}
                  </p>
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: stat.color }}
                >
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
              </div>
              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-0 h-[3px] w-full"
                style={{ backgroundColor: stat.color }}
              />
            </div>
          );
        })}
      </div>

      {/* Search & Filters Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--solvyn-text-tertiary)]" />
          <input
            type="text"
            placeholder="Search leads by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-base)] py-2.5 pl-9 pr-3 text-[13px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-amber)]/40 focus:ring-1 focus:ring-[var(--solvyn-amber)]/20"
          />
        </div>

        {/* Filter tabs + Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-base)] p-0.5">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
                  filter === f.value
                    ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-sm"
                    : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
                )}
              >
                {f.label}
                {f.value === "new" && newCount > 0 && (
                  <span className="ml-1.5 text-[var(--solvyn-olive)]">{newCount}</span>
                )}
              </button>
            ))}
          </div>
          {testCount > 0 && (
            <button
              onClick={() => setFilter("test")}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-all border",
                filter === "test"
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  : "border-[var(--solvyn-border-subtle)] text-[var(--solvyn-text-tertiary)] hover:text-purple-400"
              )}
            >
              <FlaskConical className="h-3 w-3" />
              Test
              <span className="text-purple-400">{testCount}</span>
            </button>
          )}
          <button
            onClick={fetchSubmissions}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)]"
            title="Refresh"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* List */}
      {loading && submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--solvyn-text-tertiary)]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="mt-3 text-[13px]">Loading submissions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--solvyn-text-tertiary)]">
          <Inbox className="h-8 w-8" />
          <p className="mt-3 text-[14px] font-medium">No submissions yet</p>
          <p className="mt-1 text-[13px]">
            {filter === "all"
              ? "Submissions from your Elementor forms will appear here"
              : `No ${filter} submissions`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((submission) => (
            <SubmissionRow
              key={submission.id}
              submission={submission}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
