"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageKeywords, KeywordCluster, Keyword } from "@/lib/seo-types";

function IntentBadge({ intent }: { intent: Keyword["intent"] }) {
  const styles = {
    informational: "bg-slate-100 text-slate-600",
    commercial: "bg-[#6C7B5A]/10 text-[#6C7B5A]",
    transactional: "bg-[#B96E5C]/10 text-[#B96E5C]",
    navigational: "bg-gray-100 text-gray-500",
  };
  const labels = {
    informational: "Info",
    commercial: "Commercial",
    transactional: "Transactional",
    navigational: "Nav",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[intent]}`}
    >
      {labels[intent]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Keyword["priority"] }) {
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

function KeywordRow({ keyword }: { keyword: Keyword }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#EAE4D9]/40 px-4 py-2.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <span className="text-sm text-[#2A2A2A]/80">{keyword.term}</span>
        {keyword.notes && (
          <p className="mt-0.5 text-[11px] text-[#2A2A2A]/30">
            {keyword.notes}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {keyword.volume && (
          <span className="text-[11px] text-[#2A2A2A]/30">
            {keyword.volume}
          </span>
        )}
        <IntentBadge intent={keyword.intent} />
        <PriorityBadge priority={keyword.priority} />
      </div>
    </div>
  );
}

function ClusterGroup({ cluster }: { cluster: KeywordCluster }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-lg border border-[#EAE4D9] bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[#F7F5F0]"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-[#2A2A2A]/30" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-[#2A2A2A]/30" />
        )}
        <span className="text-sm font-medium text-[#2A2A2A]">
          {cluster.name}
        </span>
        <span className="ml-auto text-[11px] text-[#2A2A2A]/30">
          {cluster.keywords.length} keywords
        </span>
      </button>
      {open && (
        <div className="border-t border-[#EAE4D9]/60">
          {cluster.keywords.map((kw) => (
            <KeywordRow key={kw.id} keyword={kw} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageSection({ page }: { page: PageKeywords }) {
  return (
    <div className="mb-8">
      <div className="mb-3 px-1">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2A2A2A]">
          {page.pageName}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#B96E5C]">
            Primary
          </span>
          <span className="rounded-full bg-[#B96E5C]/10 px-3 py-0.5 text-xs font-medium text-[#B96E5C]">
            {page.primary}
          </span>
        </div>
        {page.secondary.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6C7B5A]">
              Secondary
            </span>
            {page.secondary.map((s) => (
              <span
                key={s}
                className="rounded-full bg-[#F7F5F0] px-2.5 py-0.5 text-[11px] text-[#2A2A2A]/60"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {page.clusters.map((cluster) => (
          <ClusterGroup key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </div>
  );
}

export function KeywordsTab({ keywords }: { keywords: PageKeywords[] }) {
  if (keywords.length === 0) {
    return (
      <p className="text-sm text-[#2A2A2A]/30">No keyword data added yet.</p>
    );
  }

  return (
    <div>
      {keywords.map((page) => (
        <PageSection key={page.pageId} page={page} />
      ))}
    </div>
  );
}
