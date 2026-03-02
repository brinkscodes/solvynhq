"use client";

import type { PageGaps, ContentGap } from "@/lib/seo-types";

function PriorityBadge({ priority }: { priority: ContentGap["priority"] }) {
  const styles = {
    high: "bg-[var(--solvyn-rust)]/15 text-[var(--solvyn-rust)]",
    medium: "bg-[var(--solvyn-olive)]/15 text-[var(--solvyn-olive)]",
    low: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function GapCard({ gap }: { gap: ContentGap }) {
  return (
    <div className="border-b border-[var(--solvyn-border-subtle)]/40 px-5 py-4 last:border-b-0">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--solvyn-text-primary)]">
          {gap.topic}
        </span>
        <PriorityBadge priority={gap.priority} />
      </div>
      <p className="mb-2 text-xs leading-relaxed text-[var(--solvyn-text-secondary)]">
        {gap.reason}
      </p>
      <div className="rounded-md bg-[var(--solvyn-bg-elevated)] px-3 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-olive)]">
          Recommended Action
        </span>
        <p className="mt-0.5 text-xs text-[var(--solvyn-text-secondary)]">{gap.action}</p>
      </div>
      {gap.competitorExample && (
        <p className="mt-2 text-[11px] italic text-[var(--solvyn-text-tertiary)]">
          Example: {gap.competitorExample}
        </p>
      )}
    </div>
  );
}

export function ContentGapsTab({ contentGaps }: { contentGaps: PageGaps[] }) {
  if (contentGaps.length === 0) {
    return (
      <p className="text-sm text-[var(--solvyn-text-tertiary)]">
        No content gap data added yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {contentGaps.map((page) => (
        <div key={page.pageId}>
          <div className="mb-3 px-1">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
              {page.pageName}
            </h2>
          </div>
          {page.gaps.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)]">
              {page.gaps.map((gap) => (
                <GapCard key={gap.id} gap={gap} />
              ))}
            </div>
          ) : (
            <p className="px-1 text-sm text-[var(--solvyn-text-tertiary)]">
              No gaps identified for this page.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
