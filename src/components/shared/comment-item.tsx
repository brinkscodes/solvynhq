"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { ReactionPicker } from "./reaction-picker";
import { MentionInput } from "./mention-input";
import type { TaskComment } from "@/lib/task-comment-types";

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function renderContent(content: string) {
  // Render @mentions as highlighted spans and basic markdown bold/italic
  const parts = content.split(/(@[^\s@]+(?:\s[^\s@]+)?)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      return (
        <span key={i} className="rounded-sm bg-[var(--solvyn-olive)]/10 px-0.5 font-medium text-[var(--solvyn-olive)]">
          {part}
        </span>
      );
    }
    // Basic **bold** rendering
    const boldParts = part.split(/\*\*(.+?)\*\*/g);
    return boldParts.map((bp, j) =>
      j % 2 === 1 ? <strong key={`${i}-${j}`}>{bp}</strong> : bp
    );
  });
}

export function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReact,
}: {
  comment: TaskComment;
  currentUserId: string;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReact: (commentId: string, emoji: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const isOwn = comment.userId === currentUserId;
  const wasEdited = comment.updatedAt !== comment.createdAt;

  return (
    <div className="group flex gap-3 py-3">
      <Avatar name={comment.fullName} avatarUrl={comment.avatarUrl} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--solvyn-text-primary)]">
            {comment.fullName}
          </span>
          <span className="text-[11px] text-[var(--solvyn-text-tertiary)]">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {wasEdited && (
            <span className="text-[10px] text-[var(--solvyn-text-tertiary)]">(edited)</span>
          )}
        </div>

        {editing ? (
          <div className="mt-1">
            <MentionInput
              initialValue={comment.content}
              autoFocus
              onSubmit={(content) => {
                onEdit(comment.id, content);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
              placeholder="Edit comment..."
            />
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--solvyn-text-secondary)]">
            {renderContent(comment.content)}
          </p>
        )}

        {/* Reactions bar */}
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {comment.reactions.map((r) => (
            <button
              key={r.emoji}
              onClick={() => onReact(comment.id, r.emoji)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] transition-all",
                r.reacted
                  ? "border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-olive)]/10"
                  : "border-[var(--solvyn-border-subtle)] hover:border-[var(--solvyn-border-default)]"
              )}
            >
              <span>{r.emoji}</span>
              <span className="text-[11px] font-medium text-[var(--solvyn-text-tertiary)]">{r.count}</span>
            </button>
          ))}
          <ReactionPicker onSelect={(emoji) => onReact(comment.id, emoji)} />
        </div>
      </div>

      {/* Actions (own comments only) */}
      {isOwn && !editing && (
        <div className="flex shrink-0 items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(comment.id)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-rust)]"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
