"use client";

import type { PageGaps, ContentGap } from "@/lib/seo-types";

function PriorityBadge({ priority }: { priority: ContentGap["priority"] }) {
  const styles = {
    high: "bg-[#B96E5C]/15 text-[#B96E5C]",
    medium: "bg-[#6C7B5A]/15 text-[#6C7B5A]",
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
    <div className="border-b border-[#EAE4D9]/40 px-5 py-4 last:border-b-0">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-medium text-[#2A2A2A]">
          {gap.topic}
        </span>
        <PriorityBadge priority={gap.priority} />
      </div>
      <p className="mb-2 text-xs leading-relaxed text-[#2A2A2A]/50">
        {gap.reason}
      </p>
      <div className="rounded-md bg-[#F7F5F0] px-3 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#6C7B5A]">
          Recommended Action
        </span>
        <p className="mt-0.5 text-xs text-[#2A2A2A]/60">{gap.action}</p>
      </div>
      {gap.competitorExample && (
        <p className="mt-2 text-[11px] italic text-[#2A2A2A]/30">
          Example: {gap.competitorExample}
        </p>
      )}
    </div>
  );
}

export function ContentGapsTab({ contentGaps }: { contentGaps: PageGaps[] }) {
  if (contentGaps.length === 0) {
    return (
      <p className="text-sm text-[#2A2A2A]/30">
        No content gap data added yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {contentGaps.map((page) => (
        <div key={page.pageId}>
          <div className="mb-3 px-1">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2A2A2A]">
              {page.pageName}
            </h2>
          </div>
          {page.gaps.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-[#EAE4D9] bg-white">
              {page.gaps.map((gap) => (
                <GapCard key={gap.id} gap={gap} />
              ))}
            </div>
          ) : (
            <p className="px-1 text-sm text-[#2A2A2A]/30">
              No gaps identified for this page.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
