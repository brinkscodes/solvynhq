"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormSubmission, SubmissionStatus } from "@/lib/form-submission-types";
import type { MemberRole } from "@/lib/team-types";

const statusConfig: Record<SubmissionStatus, { label: string; color: string; icon: typeof Mail }> = {
  new: { label: "New", color: "bg-[var(--solvyn-olive)]/15 text-[var(--solvyn-olive)]", icon: Mail },
  read: { label: "Read", color: "bg-[var(--solvyn-text-tertiary)]/10 text-[var(--solvyn-text-tertiary)]", icon: MailOpen },
  archived: { label: "Archived", color: "bg-[var(--solvyn-text-tertiary)]/10 text-[var(--solvyn-text-tertiary)]", icon: Archive },
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
  const preview = extractPreview(submission.fields);
  const isNew = submission.status === "new";

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
            {Object.entries(submission.fields).map(([key, value]) => (
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
            {submission.status !== "new" && (
              <button
                onClick={() => onStatusChange(submission.id, "new")}
                className="flex items-center gap-1.5 rounded-md border border-[var(--solvyn-border-subtle)] px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
              >
                <Mail className="h-3 w-3" />
                Mark as New
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

type Filter = "all" | "new" | "read" | "archived";

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

  const filtered = filter === "all"
    ? submissions.filter((s) => s.status !== "archived")
    : submissions.filter((s) => s.status === filter);

  const newCount = submissions.filter((s) => s.status === "new").length;

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "Inbox" },
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-semibold text-[var(--solvyn-text-primary)]">
            Leads
          </h1>
          {newCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--solvyn-olive)] px-1.5 text-[11px] font-semibold text-white">
              {newCount}
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px] text-[var(--solvyn-text-tertiary)]">
          Submissions from your website forms
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] p-0.5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
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
        <button
          onClick={fetchSubmissions}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:text-[var(--solvyn-text-secondary)]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </button>
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
