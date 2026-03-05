"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import type { ImageSeo } from "@/lib/seo-types";

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

function ImageSeoCard({ image }: { image: ImageSeo }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)]">
      {/* Image preview */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--solvyn-bg-sunken)]">
        <img
          src={image.url}
          alt={image.altText}
          className="h-full w-full object-cover"
        />
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
          title="Open original"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Title header */}
      <div className="border-b border-[var(--solvyn-border-subtle)]/60 px-5 py-3">
        <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[var(--solvyn-text-primary)]">
          {image.title}
        </h3>
        <p className="mt-0.5 text-[11px] font-mono text-[var(--solvyn-text-tertiary)]">
          {image.filename}
        </p>
      </div>

      {/* Alt Text */}
      <div className="group/field border-b border-[var(--solvyn-border-subtle)]/40 px-5 py-3">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-rust)]">
          Alt Text
        </span>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
            {image.altText}
          </p>
          <CopyButton text={image.altText} />
        </div>
      </div>

      {/* Caption */}
      <div className="group/field border-b border-[var(--solvyn-border-subtle)]/40 px-5 py-3">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-olive)]">
          Caption
        </span>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
            {image.caption}
          </p>
          <CopyButton text={image.caption} />
        </div>
      </div>

      {/* Description */}
      <div className="group/field px-5 py-3">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">
          Description
        </span>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
            {image.description}
          </p>
          <CopyButton text={image.description} />
        </div>
      </div>
    </div>
  );
}

export function ImageSeoTab({ images }: { images: ImageSeo[] }) {
  if (images.length === 0) {
    return (
      <p className="text-sm text-[var(--solvyn-text-tertiary)]">No image SEO data added yet.</p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {images.map((image) => (
        <ImageSeoCard key={image.id} image={image} />
      ))}
    </div>
  );
}
