"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentSection as ContentSectionType, ContentBlock } from "@/lib/content-types";

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
      className="shrink-0 rounded-md p-1.5 opacity-0 transition-all hover:bg-[#EAE4D9]/60 group-hover/block:opacity-100"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[#6C7B5A]" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-[#2A2A2A]/30" />
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
        <p className="font-[family-name:var(--font-playfair)] text-lg font-semibold leading-snug text-[#2A2A2A]">
          {block.text}
        </p>
      );

    case "subheading":
      return (
        <p className="text-sm font-medium text-[#6C7B5A]">
          {block.text}
        </p>
      );

    case "body":
      return (
        <p className="text-sm leading-relaxed text-[#2A2A2A]/70">
          {block.text}
        </p>
      );

    case "cta":
      return (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#6C7B5A]/10 px-3 py-1 text-sm font-medium text-[#6C7B5A]">
            {block.text}
          </span>
        </div>
      );

    case "list":
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#2A2A2A]/60">{block.text}</p>
          <ul className="space-y-0.5 pl-4">
            {block.items?.map((item, i) => (
              <li key={i} className="list-disc text-sm text-[#2A2A2A]/70">
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
            <p className="text-sm text-[#2A2A2A]/50">{block.text}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {block.items?.map((item, i) => (
              <span
                key={i}
                className="rounded-full border border-[#EAE4D9] bg-[#F7F5F0] px-3 py-1 text-xs font-medium text-[#2A2A2A]/70"
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
          <p className="text-sm font-semibold text-[#2A2A2A]">{block.text}</p>
          {block.items?.map((item, i) => (
            <p key={i} className="text-sm leading-relaxed text-[#2A2A2A]/60">
              {item}
            </p>
          ))}
        </div>
      );

    default:
      return <p className="text-sm text-[#2A2A2A]/70">{block.text}</p>;
  }
}

export function ContentSection({ section }: { section: ContentSectionType }) {
  return (
    <div className="mb-8">
      <div className="mb-3 px-4">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2A2A2A]">
          {section.name}
        </h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#EAE4D9] bg-white">
        {section.blocks.map((block) => (
          <div
            key={block.id}
            className="group/block border-b border-[#EAE4D9]/60 px-5 py-4 last:border-b-0"
          >
            {block.label && (
              <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-[#B96E5C]">
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
              <p className="mt-2 text-[11px] italic text-[#2A2A2A]/30">
                Note: {block.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
