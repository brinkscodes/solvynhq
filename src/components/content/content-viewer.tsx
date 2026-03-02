"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentSection } from "./content-section";
import type { ContentPage, SectionComments, Comment } from "@/lib/content-types";

export function ContentViewer({ pages }: { pages: ContentPage[] }) {
  const [activePageId, setActivePageId] = useState(pages[0]?.id ?? "");
  const activePage = pages.find((p) => p.id === activePageId);

  const [comments, setComments] = useState<SectionComments>({});

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((data) => setComments(data));
  }, []);

  const handlePostComment = useCallback(
    async (sectionId: string, text: string) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, comment: text }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const newComment: Comment = await res.json();
      setComments((prev) => ({
        ...prev,
        [sectionId]: [...(prev[sectionId] || []), newComment],
      }));
    },
    []
  );

  const handleDeleteComment = useCallback(
    async (sectionId: string, commentId: string) => {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      setComments((prev) => ({
        ...prev,
        [sectionId]: (prev[sectionId] || []).filter((c) => c.id !== commentId),
      }));
    },
    []
  );

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[var(--solvyn-text-primary)]">
              Website Content
            </h1>
            <p className="mt-1 text-sm text-[var(--solvyn-text-secondary)]">
              Copy reference for the Solvyn WordPress build
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-4 py-2 text-sm font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        {/* Page tab switcher */}
        <div className="mt-6 flex gap-1 overflow-x-auto rounded-lg bg-[var(--solvyn-border-subtle)]/60 p-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={cn(
                "flex-1 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm",
                activePageId === page.id
                  ? "bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-primary)] shadow-sm"
                  : "text-[var(--solvyn-text-secondary)] hover:text-[var(--solvyn-text-secondary)]"
              )}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      {/* Page description */}
      {activePage && (
        <p className="mb-6 px-4 text-sm text-[var(--solvyn-text-secondary)]">
          {activePage.description}
        </p>
      )}

      {/* Content sections */}
      {activePage?.sections.map((section) => (
        <ContentSection
          key={section.id}
          section={section}
          comments={comments[section.id] ?? []}
          onPostComment={handlePostComment}
          onDeleteComment={handleDeleteComment}
        />
      ))}
    </>
  );
}
