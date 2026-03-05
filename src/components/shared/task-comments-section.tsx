"use client";

import { useState, useEffect, useCallback } from "react";
import { CommentItem } from "./comment-item";
import type { TaskComment } from "@/lib/task-comment-types";

interface TaskCommentsSectionProps {
  comments: TaskComment[];
  setComments: React.Dispatch<React.SetStateAction<TaskComment[]>>;
}

export function TaskCommentsSection({ comments, setComments }: TaskCommentsSectionProps) {
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.id) setCurrentUserId(d.id); })
      .catch(() => {});
  }, []);

  async function handleEdit(commentId: string, content: string) {
    const res = await fetch("/api/task-comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, content }),
    });
    if (res.ok) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, content, updatedAt: new Date().toISOString() }
            : c
        )
      );
    }
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/task-comments?commentId=${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  async function handleReact(commentId: string, emoji: string) {
    const res = await fetch("/api/task-comments/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, emoji }),
    });
    if (res.ok) {
      const { action } = await res.json();
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const existing = c.reactions.find((r) => r.emoji === emoji);
          if (action === "added") {
            if (existing) {
              return {
                ...c,
                reactions: c.reactions.map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r
                ),
              };
            }
            return { ...c, reactions: [...c.reactions, { emoji, count: 1, reacted: true }] };
          } else {
            if (existing && existing.count <= 1) {
              return { ...c, reactions: c.reactions.filter((r) => r.emoji !== emoji) };
            }
            return {
              ...c,
              reactions: c.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r
              ),
            };
          }
        })
      );
    }
  }

  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReact={handleReact}
        />
      ))}
    </div>
  );
}
