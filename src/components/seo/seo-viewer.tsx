"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompetitorsTab } from "./competitors-tab";
import { KeywordsTab } from "./keywords-tab";
import { MetaTagsTab } from "./meta-tags-tab";
import { ContentGapsTab } from "./content-gaps-tab";
import type { SeoResearch } from "@/lib/seo-types";

const tabs = [
  { id: "competitors", label: "Competitors" },
  { id: "keywords", label: "Keywords" },
  { id: "meta-tags", label: "Meta Tags" },
  { id: "content-gaps", label: "Content Gaps" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function SeoViewer({ data }: { data: SeoResearch }) {
  const [activeTab, setActiveTab] = useState<TabId>("competitors");

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[#2A2A2A]">
              SEO Research
            </h1>
            <p className="mt-1 text-sm text-[#2A2A2A]/50">
              Keyword research, competitor analysis & content strategy
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#2A2A2A]/25">
              Updated {data.lastUpdated}
            </span>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-[#EAE4D9] bg-white px-4 py-2 text-sm font-medium text-[#2A2A2A]/60 transition-colors hover:bg-[#F7F5F0] hover:text-[#2A2A2A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 flex gap-1 rounded-lg bg-[#EAE4D9]/60 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white text-[#2A2A2A] shadow-sm"
                  : "text-[#2A2A2A]/40 hover:text-[#2A2A2A]/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "competitors" && (
        <CompetitorsTab competitors={data.competitors} />
      )}
      {activeTab === "keywords" && <KeywordsTab keywords={data.keywords} />}
      {activeTab === "meta-tags" && <MetaTagsTab metaTags={data.metaTags} />}
      {activeTab === "content-gaps" && (
        <ContentGapsTab contentGaps={data.contentGaps} />
      )}
    </>
  );
}
