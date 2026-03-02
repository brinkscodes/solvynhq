"use client";

import { ExternalLink } from "lucide-react";
import type { Competitor } from "@/lib/seo-types";

function TypeBadge({ type }: { type: Competitor["type"] }) {
  const styles = {
    b2b: "border-[var(--solvyn-olive)] text-[var(--solvyn-olive)]",
    d2c: "border-[var(--solvyn-rust)] text-[var(--solvyn-rust)]",
    both: "border-[var(--solvyn-text-primary)] text-[var(--solvyn-text-primary)]",
  };
  const labels = { b2b: "B2B", d2c: "D2C", both: "B2B + D2C" };

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[var(--solvyn-text-primary)]">
              {competitor.name}
            </h3>
            <TypeBadge type={competitor.type} />
          </div>
          <a
            href={competitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 flex items-center gap-1 text-xs text-[var(--solvyn-text-secondary)] transition-colors hover:text-[var(--solvyn-olive)]"
          >
            {competitor.url.replace(/^https?:\/\//, "")}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-[var(--solvyn-text-secondary)]">
        {competitor.description}
      </p>

      {/* Target Keywords */}
      {competitor.targetKeywords.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-rust)]">
            Target Keywords
          </p>
          <div className="flex flex-wrap gap-1">
            {competitor.targetKeywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-[var(--solvyn-bg-elevated)] px-2.5 py-0.5 text-[11px] text-[var(--solvyn-text-secondary)]"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Angles */}
      {competitor.contentAngles.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-olive)]">
            Content Angles
          </p>
          <ul className="space-y-0.5 pl-3">
            {competitor.contentAngles.map((angle) => (
              <li
                key={angle}
                className="list-disc text-xs text-[var(--solvyn-text-secondary)]"
              >
                {angle}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {competitor.strengths.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-olive)]">
              Strengths
            </p>
            <ul className="space-y-0.5 pl-3">
              {competitor.strengths.map((s) => (
                <li key={s} className="list-disc text-xs text-[var(--solvyn-text-secondary)]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {competitor.weaknesses.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-rust)]">
              Weaknesses
            </p>
            <ul className="space-y-0.5 pl-3">
              {competitor.weaknesses.map((w) => (
                <li key={w} className="list-disc text-xs text-[var(--solvyn-text-secondary)]">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function CompetitorsTab({
  competitors,
}: {
  competitors: Competitor[];
}) {
  const b2b = competitors.filter(
    (c) => c.type === "b2b" || c.type === "both"
  );
  const d2c = competitors.filter(
    (c) => c.type === "d2c" || c.type === "both"
  );

  return (
    <div className="space-y-8">
      {/* B2B Section */}
      <div>
        <div className="mb-4 px-1">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
            B2B Hospitality
          </h2>
          <p className="text-xs text-[var(--solvyn-text-secondary)]">
            Hotel & resort amenity suppliers offering sunscreen
          </p>
        </div>
        {b2b.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {b2b.map((c) => (
              <CompetitorCard key={c.id} competitor={c} />
            ))}
          </div>
        ) : (
          <p className="px-1 text-sm text-[var(--solvyn-text-tertiary)]">
            No B2B competitors added yet.
          </p>
        )}
      </div>

      {/* D2C Section */}
      <div>
        <div className="mb-4 px-1">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--solvyn-text-primary)]">
            D2C Consumer
          </h2>
          <p className="text-xs text-[var(--solvyn-text-secondary)]">
            Direct-to-consumer luxury & clean sunscreen brands
          </p>
        </div>
        {d2c.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {d2c.map((c) => (
              <CompetitorCard key={c.id} competitor={c} />
            ))}
          </div>
        ) : (
          <p className="px-1 text-sm text-[var(--solvyn-text-tertiary)]">
            No D2C competitors added yet.
          </p>
        )}
      </div>
    </div>
  );
}
