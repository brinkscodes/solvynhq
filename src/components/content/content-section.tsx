"use client";

import { useState } from "react";
import { Copy, Check, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ContentSection as ContentSectionType,
  ContentBlock,
  Comment,
} from "@/lib/content-types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-md p-1.5 opacity-0 transition-all hover:bg-[var(--solvyn-border-subtle)]/60 group-hover/block:opacity-100"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[var(--solvyn-olive)]" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-[var(--solvyn-text-tertiary)]" />
      )}
    </button>
  );
}

function getCopyText(block: ContentBlock): string {
  let text = block.text;
  if (block.items) {
    text += "\n" + block.items.join("\n");
  }
  return text;
}

function BlockDisplay({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <p className="font-[family-name:var(--font-playfair)] text-lg font-semibold leading-snug text-[var(--solvyn-text-primary)]">
          {block.text}
        </p>
      );

    case "subheading":
      return (
        <p className="text-sm font-medium text-[var(--solvyn-olive)]">{block.text}</p>
      );

    case "body":
      return (
        <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
          {block.text}
        </p>
      );

    case "cta":
      return (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--solvyn-olive)]/10 px-3 py-1 text-sm font-medium text-[var(--solvyn-olive)]">
            {block.text}
          </span>
        </div>
      );

    case "list":
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--solvyn-text-secondary)]">{block.text}</p>
          <ul className="space-y-0.5 pl-4">
            {block.items?.map((item, i) => (
              <li key={i} className="list-disc text-sm text-[var(--solvyn-text-secondary)]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "badge":
      return (
        <div className="space-y-2">
          {block.text !== "Display as compact badges or minimal grid" &&
            block.text !== "Display as horizontal row of badges or seals" &&
            block.text !== "Display as grid or badge row" &&
            block.text !== "Badge label" && (
              <p className="text-sm text-[var(--solvyn-text-secondary)]">{block.text}</p>
            )}
          <div className="flex flex-wrap gap-1.5">
            {block.items?.map((item, i) => (
              <span
                key={i}
                className="rounded-full border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] px-3 py-1 text-xs font-medium text-[var(--solvyn-text-secondary)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      );

    case "step":
      return (
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-[var(--solvyn-text-primary)]">{block.text}</p>
          {block.items?.map((item, i) => (
            <p key={i} className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
              {item}
            </p>
          ))}
        </div>
      );

    default:
      return <p className="text-sm text-[var(--solvyn-text-secondary)]">{block.text}</p>;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function CommentItem({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group/comment flex gap-3 py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--solvyn-olive)]/15 text-xs font-semibold text-[var(--solvyn-olive)]">
        {getInitial(comment.author_name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[var(--solvyn-text-primary)]">
            {comment.author_name}
          </span>
          <span
            className="text-[11px] text-[var(--solvyn-text-tertiary)]"
            title={formatFullDate(comment.created_at)}
          >
            {formatDate(comment.created_at)}
          </span>
          <button
            onClick={() => onDelete(comment.id)}
            className="ml-auto rounded p-1 opacity-0 transition-opacity hover:bg-red-50 group-hover/comment:opacity-100"
            title="Delete comment"
          >
            <Trash2 className="h-3 w-3 text-[var(--solvyn-text-tertiary)] hover:text-red-400" />
          </button>
        </div>
        <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--solvyn-text-secondary)]">
          {comment.comment}
        </p>
      </div>
    </div>
  );
}

interface ContentSectionProps {
  section: ContentSectionType;
  comments: Comment[];
  onPostComment: (sectionId: string, text: string) => Promise<void>;
  onDeleteComment: (sectionId: string, commentId: string) => Promise<void>;
}

export function ContentSection({
  section,
  comments,
  onPostComment,
  onDeleteComment,
}: ContentSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const hasComments = comments.length > 0;

  const handlePost = async () => {
    if (!draft.trim() || posting) return;
    setPosting(true);
    try {
      await onPostComment(section.id, draft);
      setDraft("");
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-3 px-4">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
          {section.name}
        </h2>
      </div>

      <div className="group/section overflow-hidden rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)]">
        {section.blocks.map((block) => (
          <div
            key={block.id}
            className="group/block border-b border-[var(--solvyn-border-subtle)]/60 px-5 py-4 last:border-b-0"
          >
            {block.label && (
              <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-rust)]">
                {block.label}
              </span>
            )}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <BlockDisplay block={block} />
              </div>
              <CopyButton text={getCopyText(block)} />
            </div>
            {block.note && (
              <p className="mt-2 text-[11px] italic text-[var(--solvyn-text-tertiary)]">
                Note: {block.note}
              </p>
            )}
          </div>
        ))}

        {/* Comments area */}
        <div
          className={cn(
            "border-t border-[var(--solvyn-border-subtle)]/60 px-5 py-3 transition-colors",
            hasComments && "bg-[var(--solvyn-bg-base)]/60",
            !hasComments && !expanded && "opacity-0 group-hover/section:opacity-100"
          )}
        >
          {expanded || hasComments ? (
            <div>
              {/* Header */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[var(--solvyn-olive)]" />
                <span className="text-[11px] font-medium text-[var(--solvyn-text-secondary)]">
                  Comments{hasComments ? ` (${comments.length})` : ""}
                </span>
              </button>

              {/* Comment list */}
              {(expanded || hasComments) && comments.length > 0 && (
                <div className="mt-1 divide-y divide-[var(--solvyn-border-subtle)]/40">
                  {comments.map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      onDelete={(id) => onDeleteComment(section.id, id)}
                    />
                  ))}
                </div>
              )}

              {/* Comment input */}
              {expanded && (
                <div className="mt-3 space-y-2">
                  <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a comment..."
                    rows={2}
                    className="w-full resize-none rounded-md border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3 py-2 text-[13px] leading-relaxed text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none focus:border-[var(--solvyn-olive)]/40"
                    spellCheck={false}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--solvyn-text-tertiary)]">
                      Cmd+Enter to post
                    </span>
                    <button
                      onClick={handlePost}
                      disabled={!draft.trim() || posting}
                      className={cn(
                        "rounded-md px-4 py-1.5 text-[13px] font-medium transition-colors",
                        draft.trim() && !posting
                          ? "bg-[var(--solvyn-olive)] text-white hover:brightness-110"
                          : "cursor-not-allowed bg-[var(--solvyn-border-subtle)]/60 text-[var(--solvyn-text-tertiary)]"
                      )}
                    >
                      {posting ? "Posting..." : "Comment"}
                    </button>
                  </div>
                </div>
              )}

              {/* Show "Add a comment" if collapsed with existing comments */}
              {!expanded && hasComments && (
                <button
                  onClick={() => setExpanded(true)}
                  className="mt-2 text-[12px] text-[var(--solvyn-olive)]/60 hover:text-[var(--solvyn-olive)]"
                >
                  Add a comment...
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="flex w-full items-center gap-2 text-left"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[var(--solvyn-text-tertiary)]" />
              <span className="truncate text-[13px] text-[var(--solvyn-text-tertiary)]">
                Add a comment...
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
