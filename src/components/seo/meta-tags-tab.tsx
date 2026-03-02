"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { MetaTag } from "@/lib/seo-types";

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
      className="shrink-0 rounded-md p-1.5 opacity-0 transition-all hover:bg-[var(--solvyn-border-subtle)]/60 group-hover/field:opacity-100"
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

function CharCount({
  current,
  limit,
}: {
  current: number;
  limit: number;
}) {
  const over = current > limit;
  return (
    <span
      className={`text-[10px] font-medium ${
        over ? "text-[var(--solvyn-rust)]" : "text-[var(--solvyn-text-tertiary)]"
      }`}
    >
      {current}/{limit}
    </span>
  );
}

function MetaTagCard({ tag }: { tag: MetaTag }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)]">
      <div className="border-b border-[var(--solvyn-border-subtle)]/60 px-5 py-3">
        <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[var(--solvyn-text-primary)]">
          {tag.pageName}
        </h3>
      </div>

      {/* Meta Title */}
      <div className="group/field border-b border-[var(--solvyn-border-subtle)]/40 px-5 py-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-rust)]">
            Meta Title
          </span>
          <CharCount current={tag.titleLength} limit={60} />
        </div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
            {tag.title}
          </p>
          <CopyButton text={tag.title} />
        </div>
      </div>

      {/* Meta Description */}
      <div className="group/field border-b border-[var(--solvyn-border-subtle)]/40 px-5 py-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-olive)]">
            Meta Description
          </span>
          <CharCount current={tag.descriptionLength} limit={155} />
        </div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
            {tag.description}
          </p>
          <CopyButton text={tag.description} />
        </div>
      </div>

      {/* H1 */}
      <div className="group/field px-5 py-3">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
          H1 Suggestion
        </span>
        <div className="flex items-start justify-between gap-2">
          <p className="font-[family-name:var(--font-playfair)] text-sm font-medium text-[var(--solvyn-text-primary)]">
            {tag.h1}
          </p>
          <CopyButton text={tag.h1} />
        </div>
      </div>
    </div>
  );
}

export function MetaTagsTab({ metaTags }: { metaTags: MetaTag[] }) {
  if (metaTags.length === 0) {
    return (
      <p className="text-sm text-[var(--solvyn-text-tertiary)]">No meta tag data added yet.</p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {metaTags.map((tag) => (
        <MetaTagCard key={tag.pageId} tag={tag} />
      ))}
    </div>
  );
}
