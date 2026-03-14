"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Code, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentSection } from "./content-section";
import type { ContentPage, ContentBlock, SectionComments, Comment } from "@/lib/content-types";

function sectionSlug(name: string): string {
  return "pp-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
}

function renderSectionBlocks(blocks: ContentBlock[]): string {
  const lines: string[] = [];
  // Skip the first heading block — it's rendered as the section <h2> already
  const contentBlocks = blocks[0]?.type === "heading" ? blocks.slice(1) : blocks;

  for (const block of contentBlocks) {
    switch (block.type) {
      case "heading":
        lines.push(`      <h2>${block.text}</h2>`);
        break;
      case "subheading":
        lines.push(`      <p><strong>${block.text}</strong></p>`);
        break;
      case "body":
        if (block.note === "highlight-box") {
          lines.push(`      <div class="pp-highlight-box">\n        <p>${block.text}</p>\n      </div>`);
        } else {
          lines.push(`      <p>${block.text}</p>`);
        }
        break;
      case "badge":
        lines.push(`      <p><strong>${block.text}</strong></p>`);
        break;
      case "cta":
        lines.push(`      <p><a href="#">${block.text}</a></p>`);
        break;
      case "list":
        if (block.text) lines.push(`      <p>${block.text}</p>`);
        lines.push("      <ul>");
        for (const item of block.items ?? []) {
          // Bold text before em dash or colon
          const formatted = item.replace(/^([^—:]+)(—|:)\s*/, "<strong>$1$2</strong> ");
          lines.push(`        <li>${formatted}</li>`);
        }
        lines.push("      </ul>");
        break;
      case "step":
        lines.push(`      <p><strong>${block.text}</strong></p>`);
        lines.push("      <ul>");
        for (const item of block.items ?? []) {
          lines.push(`        <li>${item}</li>`);
        }
        lines.push("      </ul>");
        break;
      default:
        lines.push(`      <p>${block.text}</p>`);
    }
  }
  return lines.join("\n");
}

function pageToHtml(page: ContentPage): string {
  // Find page title, subtitle, and effective date from first section
  const firstSection = page.sections[0];
  const titleBlock = firstSection?.blocks.find((b) => b.type === "heading");
  const subtitleBlock = firstSection?.blocks.find((b) => b.type === "subheading");
  const pageTitle = titleBlock?.text ?? page.name;

  // Split title for italic styling on last word
  const titleWords = pageTitle.split(" ");
  const titleMain = titleWords.slice(0, -1).join(" ");
  const titleEmphasis = titleWords[titleWords.length - 1];

  // Determine hero label based on page type
  const isLegal = page.id.includes("privacy") || page.id.includes("terms");
  const heroLabel = isLegal ? "Legal · Transparency" : page.name;

  // Build TOC entries (skip first section if it's just the intro heading)
  const tocSections = page.sections.filter((s) => {
    const hasContent = s.blocks.some((b) => b.type !== "heading" && b.type !== "subheading");
    return hasContent || s.blocks.length > 1;
  });

  // Find the last section for contact card treatment
  const lastSection = page.sections[page.sections.length - 1];
  const isContactSection = lastSection?.id.includes("contact") || lastSection?.id.includes("changes");

  const css = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

<style>
  :root {
    --olive: #6C7B5A;
    --olive-light: #8a9a72;
    --sand: #EAE4D9;
    --sand-dark: #d4cdc0;
    --rust: #B96E5C;
    --charcoal: #2A2A2A;
    --charcoal-soft: #3d3d3d;
    --white: #FAFAF7;
  }

  .pp-hero {
    background-color: var(--sand);
    padding: 80px 48px 60px;
    border-bottom: 1px solid var(--sand-dark);
  }

  .pp-hero-label {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--olive);
    font-weight: 500;
    margin-bottom: 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 58px);
    font-weight: 400;
    color: var(--charcoal);
    line-height: 1.15;
    max-width: 640px;
    margin: 0;
  }

  .pp-hero h1 em {
    font-style: italic;
    color: var(--olive);
  }

  .pp-hero-meta {
    margin-top: 28px;
    font-size: 13px;
    color: #777;
    font-weight: 300;
    letter-spacing: 0.04em;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 72px 48px 100px;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 80px;
    align-items: start;
  }

  .pp-toc {
    position: sticky;
    top: 80px;
  }

  .pp-toc-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #aaa;
    font-weight: 500;
    margin-bottom: 16px;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-toc ul {
    list-style: none;
    border-left: 1px solid var(--sand-dark);
    padding-left: 16px;
    margin: 0;
  }

  .pp-toc li { margin-bottom: 10px; }

  .pp-toc a {
    font-size: 13px;
    color: var(--charcoal-soft);
    text-decoration: none;
    font-weight: 300;
    transition: color 0.2s;
    line-height: 1.4;
    display: block;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-toc a:hover { color: var(--olive); }

  .pp-content section {
    margin-bottom: 60px;
    padding-bottom: 60px;
    border-bottom: 1px solid var(--sand-dark);
  }

  .pp-content section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .pp-section-number {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--rust);
    font-weight: 500;
    margin-bottom: 10px;
    opacity: 0.75;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-content h2 {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--charcoal);
    margin-bottom: 22px;
    line-height: 1.3;
  }

  .pp-content p {
    font-size: 15px;
    font-weight: 300;
    color: #444;
    margin-bottom: 16px;
    line-height: 1.85;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-content p:last-child { margin-bottom: 0; }

  .pp-content ul {
    margin: 16px 0 20px 0;
    padding-left: 0;
    list-style: none;
  }

  .pp-content li {
    font-size: 15px;
    font-weight: 300;
    color: #444;
    line-height: 1.75;
    padding: 8px 0 8px 24px;
    position: relative;
    border-bottom: 1px solid #f0ece5;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-content li:last-child { border-bottom: none; }

  .pp-content li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--olive);
    opacity: 0.5;
  }

  .pp-content a {
    color: var(--olive);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .pp-content strong {
    font-weight: 500;
    color: var(--charcoal);
  }

  .pp-highlight-box {
    background: var(--sand);
    border-left: 3px solid var(--olive);
    padding: 24px 28px;
    margin: 24px 0;
    border-radius: 0 4px 4px 0;
  }

  .pp-highlight-box p {
    font-size: 14px;
    color: var(--charcoal-soft);
    margin: 0;
  }

  .pp-contact-card {
    background: var(--charcoal);
    color: var(--white);
    padding: 40px;
    margin-top: 16px;
    border-radius: 2px;
  }

  .pp-contact-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 12px;
    color: var(--white);
  }

  .pp-contact-card p {
    color: #b0b0a8;
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 8px;
  }

  .pp-contact-card a {
    color: var(--olive-light);
    text-decoration: none;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    .pp-hero { padding: 60px 24px 48px; }
    .pp-wrapper {
      grid-template-columns: 1fr;
      padding: 48px 24px 80px;
      gap: 0;
    }
    .pp-toc { display: none; }
  }
</style>`;

  // Hero
  const hero = `<!-- HERO -->
<div class="pp-hero">
  <p class="pp-hero-label">${heroLabel}</p>
  <h1>${titleMain} <em>${titleEmphasis}</em></h1>${subtitleBlock ? `\n  <p class="pp-hero-meta">${subtitleBlock.text}</p>` : ""}
</div>`;

  // TOC
  const tocItems = tocSections.map((s) =>
    `      <li><a href="#${sectionSlug(s.name)}">${s.name}</a></li>`
  ).join("\n");

  const toc = `  <!-- TOC -->
  <aside class="pp-toc">
    <p class="pp-toc-label">On this page</p>
    <ul>
${tocItems}
    </ul>
  </aside>`;

  // Content sections
  const contentSections: string[] = [];
  // Skip the intro section since its content is in the hero
  const bodySections = page.sections.slice(1);

  bodySections.forEach((section, i) => {
    const num = String(i + 1).padStart(2, "0");
    const slug = sectionSlug(section.name);
    const heading = section.blocks.find((b) => b.type === "heading")?.text ?? section.name;
    const blocks = renderSectionBlocks(section.blocks);

    // Check if this is the last section and has contact info — render contact card
    const isLast = i === bodySections.length - 1;
    const hasContactInfo = section.blocks.some((b) =>
      b.type === "list" && b.items?.some((item) => item.toLowerCase().includes("email:"))
    );

    if (isLast && hasContactInfo) {
      // Extract contact details for the card
      const contactList = section.blocks.find((b) => b.type === "list" && b.items?.some((item) => item.toLowerCase().includes("email:")));
      const entityName = contactList?.items?.find((item) => !item.includes(":") && !item.includes("State"))?.trim() ?? "Solvyn Skin LLC";
      const emailItem = contactList?.items?.find((item) => item.toLowerCase().startsWith("email:"));
      const email = emailItem?.replace(/^Email:\s*/i, "").trim() ?? "info@solvynskin.com";
      const websiteItem = contactList?.items?.find((item) => item.toLowerCase().startsWith("website:"));
      const website = websiteItem?.replace(/^Website:\s*/i, "").trim() ?? "solvynskin.com";
      const stateItem = contactList?.items?.find((item) => item.toLowerCase().includes("state of"));
      const location = stateItem?.replace(/^State of Formation:\s*/i, "").trim() ?? "";

      // Render the non-contact blocks normally, then add the card
      const nonContactBlocks = section.blocks.filter((b) => b !== contactList);
      const nonContactHtml = renderSectionBlocks(nonContactBlocks);

      contentSections.push(`    <section id="${slug}">
      <p class="pp-section-number">${num}</p>
      <h2>${heading}</h2>
${nonContactHtml}
      <div class="pp-contact-card">
        <h3>${entityName}</h3>
        <p>Email: <a href="mailto:${email}">${email}</a></p>
        <p>Website: <a href="https://${website}">${website}</a></p>${location ? `\n        <p style="margin-top: 16px; font-size: 13px; color: #666;">${location}</p>` : ""}
      </div>
    </section>`);
    } else {
      contentSections.push(`    <section id="${slug}">
      <p class="pp-section-number">${num}</p>
      <h2>${heading}</h2>
${blocks}
    </section>`);
    }
  });

  return `${css}

${hero}

<!-- BODY -->
<div class="pp-wrapper">

${toc}

  <!-- CONTENT -->
  <main class="pp-content">

${contentSections.join("\n\n")}

  </main>
</div>
`;
}

export function ContentViewer({ pages }: { pages: ContentPage[] }) {
  const [activePageId, setActivePageId] = useState(pages[0]?.id ?? "");
  const activePage = pages.find((p) => p.id === activePageId);

  const [copied, setCopied] = useState(false);
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
          <div className="flex items-center gap-2">
            {activePage && (
              <button
                onClick={() => {
                  const html = pageToHtml(activePage);
                  navigator.clipboard.writeText(html);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  copied
                    ? "border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-olive)]/10 text-[var(--solvyn-olive)]"
                    : "border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-primary)]"
                )}
              >
                {copied ? <Check className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy as HTML"}
              </button>
            )}
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-4 py-2 text-sm font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
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
