"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Loader2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ProductContext,
  PersonaRow,
  ObjectionRow,
  GlossaryRow,
  ValueThemeRow,
} from "@/lib/product-context-types";

// ── Tab config ──────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "audience", label: "Audience" },
  { id: "personas", label: "Personas" },
  { id: "painPoints", label: "Pain Points" },
  { id: "competitors", label: "Competitors" },
  { id: "differentiation", label: "Differentiation" },
  { id: "objections", label: "Objections" },
  { id: "switching", label: "Switching" },
  { id: "language", label: "Language" },
  { id: "voice", label: "Voice" },
  { id: "proofPoints", label: "Proof Points" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Shared display components ───────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--solvyn-text-secondary)]">
      {children}
    </label>
  );
}

function ReadText({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className="text-sm leading-relaxed text-[var(--solvyn-text-primary)] whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}

function ReadList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-[var(--solvyn-text-primary)]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--solvyn-olive)]/40" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Shared edit components ──────────────────────────────────
function EditText({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
      />
    </div>
  );
}

function EditList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const addItem = () => onChange([...items, ""]);
  const removeItem = (i: number) =>
    onChange(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, val: string) =>
    onChange(items.map((item, idx) => (idx === i ? val : item)));

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
            />
            <button
              onClick={() => removeItem(i)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-rust)]/30 hover:bg-[var(--solvyn-rust)]/5 hover:text-[var(--solvyn-rust)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-2 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
        >
          <Plus className="h-3 w-3" />
          Add item
        </button>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────
export function BrandIdentityEditor({
  initialData,
}: {
  initialData: ProductContext;
}) {
  const [data, setData] = useState<ProductContext>(initialData);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [editing, setEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback(async (updated: ProductContext) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      await fetch("/api/product-context", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  }, []);

  const update = useCallback(
    (partial: Partial<ProductContext>) => {
      setData((prev) => {
        const next = { ...prev, ...partial };
        save(next);
        return next;
      });
    },
    [save]
  );

  const lastUpdated = new Date(data.lastUpdated).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[var(--solvyn-text-primary)]">
              Brand Identity
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-[var(--solvyn-text-secondary)]">
              Last updated {lastUpdated}
              {saveStatus === "saving" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--solvyn-text-tertiary)]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--solvyn-olive)]">
                  <Check className="h-3 w-3" />
                  Saved
                </span>
              )}
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

        {/* Tab switcher */}
        <div className="mt-6 flex flex-wrap gap-1 rounded-lg bg-[var(--solvyn-border-subtle)]/60 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-primary)] shadow-sm"
                  : "text-[var(--solvyn-text-secondary)] hover:text-[var(--solvyn-text-secondary)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="relative rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] p-6 pb-8 shadow-sm">
        {activeTab === "overview" && (
          <TabOverview data={data.productOverview} update={update} editing={editing} />
        )}
        {activeTab === "audience" && (
          <TabAudience data={data.targetAudience} update={update} editing={editing} />
        )}
        {activeTab === "personas" && (
          <TabPersonas data={data.personas} update={update} editing={editing} />
        )}
        {activeTab === "painPoints" && (
          <TabPainPoints data={data.painPoints} update={update} editing={editing} />
        )}
        {activeTab === "competitors" && (
          <TabCompetitors data={data.competitiveLandscape} update={update} editing={editing} />
        )}
        {activeTab === "differentiation" && (
          <TabDifferentiation data={data.differentiation} update={update} editing={editing} />
        )}
        {activeTab === "objections" && (
          <TabObjections data={data.objections} update={update} editing={editing} />
        )}
        {activeTab === "switching" && (
          <TabSwitching data={data.switchingDynamics} update={update} editing={editing} />
        )}
        {activeTab === "language" && (
          <TabLanguage data={data.customerLanguage} update={update} editing={editing} />
        )}
        {activeTab === "voice" && (
          <TabVoice data={data.brandVoice} update={update} editing={editing} />
        )}
        {activeTab === "proofPoints" && (
          <TabProofPoints data={data.proofPoints} update={update} editing={editing} />
        )}
        {/* Edit toggle */}
        <button
          onClick={() => setEditing(!editing)}
          className={cn(
            "absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105",
            editing
              ? "bg-[var(--solvyn-olive)] text-white shadow-sm hover:brightness-110"
              : "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)]/10"
          )}
          title={editing ? "Done editing" : "Edit"}
        >
          {editing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );
}

// ── Tab panels ──────────────────────────────────────────────

function TabHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--solvyn-text-primary)]">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[var(--solvyn-text-secondary)]">{description}</p>
    </div>
  );
}

// ── Overview ────────────────────────────────────────────────
function TabOverview({
  data,
  update,
  editing,
}: {
  data: ProductContext["productOverview"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (field: keyof typeof data, value: string) =>
    update({ productOverview: { ...data, [field]: value } });

  return (
    <div className="space-y-5">
      <TabHeader title="Product Overview" description="What Solvyn is and how it fits in the market." />
      {editing ? (
        <>
          <EditText label="One-liner" value={data.oneLiner} onChange={(v) => set("oneLiner", v)} placeholder="A single sentence describing your product..." rows={2} />
          <EditText label="What it does" value={data.whatItDoes} onChange={(v) => set("whatItDoes", v)} placeholder="2-3 sentences on what your product does..." rows={3} />
          <EditText label="Product category" value={data.productCategory} onChange={(v) => set("productCategory", v)} placeholder="What shelf do you sit on?" rows={1} />
          <EditText label="Product type" value={data.productType} onChange={(v) => set("productType", v)} placeholder="SaaS, marketplace, e-commerce, physical product..." rows={1} />
        </>
      ) : (
        <>
          <ReadText label="One-liner" value={data.oneLiner} />
          <ReadText label="What it does" value={data.whatItDoes} />
          <ReadText label="Product category" value={data.productCategory} />
          <ReadText label="Product type" value={data.productType} />
        </>
      )}
    </div>
  );
}

// ── Audience ────────────────────────────────────────────────
function TabAudience({
  data,
  update,
  editing,
}: {
  data: ProductContext["targetAudience"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (field: keyof typeof data, value: string | string[]) =>
    update({ targetAudience: { ...data, [field]: value } });

  return (
    <div className="space-y-5">
      <TabHeader title="Target Audience" description="Who you're selling to and the problems you solve for them." />
      {editing ? (
        <>
          <EditText label="Target companies" value={data.targetCompanies} onChange={(v) => set("targetCompanies", v)} rows={2} />
          <EditText label="Decision-makers" value={data.decisionMakers} onChange={(v) => set("decisionMakers", v)} rows={2} />
          <EditText label="Primary use case" value={data.primaryUseCase} onChange={(v) => set("primaryUseCase", v)} rows={2} />
          <EditList label="Jobs to be done" items={data.jobsToBeDone} onChange={(items) => set("jobsToBeDone", items)} placeholder="What customers hire you for..." />
          <EditText label="Secondary audience" value={data.secondaryAudience} onChange={(v) => set("secondaryAudience", v)} rows={2} />
        </>
      ) : (
        <>
          <ReadText label="Target companies" value={data.targetCompanies} />
          <ReadText label="Decision-makers" value={data.decisionMakers} />
          <ReadText label="Primary use case" value={data.primaryUseCase} />
          <ReadList label="Jobs to be done" items={data.jobsToBeDone} />
          <ReadText label="Secondary audience" value={data.secondaryAudience} />
        </>
      )}
    </div>
  );
}

// ── Personas ────────────────────────────────────────────────
function TabPersonas({
  data,
  update,
  editing,
}: {
  data: PersonaRow[];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const setRow = (i: number, field: keyof PersonaRow, value: string) => {
    const next = data.map((row, idx) =>
      idx === i ? { ...row, [field]: value } : row
    );
    update({ personas: next });
  };
  const addRow = () =>
    update({
      personas: [
        ...data,
        { persona: "", caresAbout: "", challenge: "", valuePromise: "" },
      ],
    });
  const removeRow = (i: number) =>
    update({ personas: data.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <TabHeader title="Personas" description="Key buyer personas and what each cares about." />
      {editing ? (
        <>
          {data.map((row, i) => (
            <div
              key={i}
              className="relative rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/50 p-4 space-y-3"
            >
              <button
                onClick={() => removeRow(i)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-rust)]/10 hover:text-[var(--solvyn-rust)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <EditText label="Persona" value={row.persona} onChange={(v) => setRow(i, "persona", v)} placeholder="e.g. Hotel GM" rows={1} />
                <EditText label="Cares about" value={row.caresAbout} onChange={(v) => setRow(i, "caresAbout", v)} placeholder="What matters most..." rows={1} />
                <EditText label="Challenge" value={row.challenge} onChange={(v) => setRow(i, "challenge", v)} placeholder="Their core challenge..." rows={1} />
                <EditText label="Value we promise" value={row.valuePromise} onChange={(v) => setRow(i, "valuePromise", v)} placeholder="What we deliver..." rows={1} />
              </div>
            </div>
          ))}
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-2 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
          >
            <Plus className="h-3 w-3" />
            Add persona
          </button>
        </>
      ) : (
        <div className="space-y-4">
          {data.map((row, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4"
            >
              <h3 className="text-sm font-semibold text-[var(--solvyn-text-primary)]">
                {row.persona}
              </h3>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--solvyn-text-tertiary)]">Cares about</span>
                  <p className="mt-0.5 text-sm text-[var(--solvyn-text-secondary)]">{row.caresAbout}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--solvyn-text-tertiary)]">Challenge</span>
                  <p className="mt-0.5 text-sm text-[var(--solvyn-text-secondary)]">{row.challenge}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--solvyn-text-tertiary)]">Value we promise</span>
                  <p className="mt-0.5 text-sm text-[var(--solvyn-text-secondary)]">{row.valuePromise}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pain Points ─────────────────────────────────────────────
function TabPainPoints({
  data,
  update,
  editing,
}: {
  data: ProductContext["painPoints"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (field: keyof typeof data, value: string | string[]) =>
    update({ painPoints: { ...data, [field]: value } });

  return (
    <div className="space-y-5">
      <TabHeader title="Problems & Pain Points" description="What your customers struggle with before finding you." />
      {editing ? (
        <>
          <EditText label="Core problem" value={data.coreProblem} onChange={(v) => set("coreProblem", v)} rows={3} />
          <EditList label="Why alternatives fall short" items={data.whyAlternativesFallShort} onChange={(items) => set("whyAlternativesFallShort", items)} placeholder="How current solutions fail..." />
          <EditText label="What it costs them" value={data.whatItCosts} onChange={(v) => set("whatItCosts", v)} rows={2} />
          <EditText label="Emotional tension" value={data.emotionalTension} onChange={(v) => set("emotionalTension", v)} rows={2} />
        </>
      ) : (
        <>
          <ReadText label="Core problem" value={data.coreProblem} />
          <ReadList label="Why alternatives fall short" items={data.whyAlternativesFallShort} />
          <ReadText label="What it costs them" value={data.whatItCosts} />
          <ReadText label="Emotional tension" value={data.emotionalTension} />
        </>
      )}
    </div>
  );
}

// ── Competitors ─────────────────────────────────────────────
function TabCompetitors({
  data,
  update,
  editing,
}: {
  data: ProductContext["competitiveLandscape"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (field: keyof typeof data, value: string | string[]) =>
    update({ competitiveLandscape: { ...data, [field]: value } });

  return (
    <div className="space-y-5">
      <TabHeader title="Competitive Landscape" description="Who you're up against and how they fall short." />
      {editing ? (
        <>
          <EditList label="Direct competitors" items={data.direct} onChange={(items) => set("direct", items)} placeholder="Same solution, same problem..." />
          <EditList label="Secondary competitors" items={data.secondary} onChange={(items) => set("secondary", items)} placeholder="Different solution, same problem..." />
          <EditList label="Indirect competitors" items={data.indirect} onChange={(items) => set("indirect", items)} placeholder="Conflicting approach..." />
          <EditText label="How each falls short" value={data.howEachFallsShort} onChange={(v) => set("howEachFallsShort", v)} rows={3} />
        </>
      ) : (
        <>
          <ReadList label="Direct competitors" items={data.direct} />
          <ReadList label="Secondary competitors" items={data.secondary} />
          <ReadList label="Indirect competitors" items={data.indirect} />
          <ReadText label="How each falls short" value={data.howEachFallsShort} />
        </>
      )}
    </div>
  );
}

// ── Differentiation ─────────────────────────────────────────
function TabDifferentiation({
  data,
  update,
  editing,
}: {
  data: ProductContext["differentiation"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (field: keyof typeof data, value: string | string[]) =>
    update({ differentiation: { ...data, [field]: value } });

  return (
    <div className="space-y-5">
      <TabHeader title="Differentiation" description="What makes Solvyn uniquely better." />
      {editing ? (
        <>
          <EditList label="Key differentiators" items={data.keyDifferentiators} onChange={(items) => set("keyDifferentiators", items)} placeholder="Capabilities alternatives lack..." />
          <EditText label="How we do it differently" value={data.howDifferently} onChange={(v) => set("howDifferently", v)} rows={2} />
          <EditText label="Why that's better" value={data.whyBetter} onChange={(v) => set("whyBetter", v)} rows={2} />
          <EditText label="Why customers choose us" value={data.whyChooseUs} onChange={(v) => set("whyChooseUs", v)} rows={2} />
        </>
      ) : (
        <>
          <ReadList label="Key differentiators" items={data.keyDifferentiators} />
          <ReadText label="How we do it differently" value={data.howDifferently} />
          <ReadText label="Why that's better" value={data.whyBetter} />
          <ReadText label="Why customers choose us" value={data.whyChooseUs} />
        </>
      )}
    </div>
  );
}

// ── Objections ──────────────────────────────────────────────
function TabObjections({
  data,
  update,
  editing,
}: {
  data: ProductContext["objections"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const setRow = (i: number, field: keyof ObjectionRow, value: string) => {
    const next = data.items.map((row, idx) =>
      idx === i ? { ...row, [field]: value } : row
    );
    update({ objections: { ...data, items: next } });
  };
  const addRow = () =>
    update({
      objections: {
        ...data,
        items: [...data.items, { objection: "", response: "" }],
      },
    });
  const removeRow = (i: number) =>
    update({
      objections: {
        ...data,
        items: data.items.filter((_, idx) => idx !== i),
      },
    });

  return (
    <div className="space-y-5">
      <TabHeader title="Objections & Anti-Personas" description="Common pushback and who isn't a good fit." />
      {editing ? (
        <>
          {data.items.map((row, i) => (
            <div
              key={i}
              className="relative rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/50 p-4 space-y-3"
            >
              <button
                onClick={() => removeRow(i)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-rust)]/10 hover:text-[var(--solvyn-rust)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <EditText label="Objection" value={row.objection} onChange={(v) => setRow(i, "objection", v)} rows={1} />
              <EditText label="Response" value={row.response} onChange={(v) => setRow(i, "response", v)} rows={2} />
            </div>
          ))}
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-2 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
          >
            <Plus className="h-3 w-3" />
            Add objection
          </button>
          <EditText label="Anti-persona" value={data.antiPersona} onChange={(v) => update({ objections: { ...data, antiPersona: v } })} rows={2} />
        </>
      ) : (
        <>
          <div className="space-y-4">
            {data.items.map((row, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4"
              >
                <p className="text-sm font-medium text-[var(--solvyn-text-primary)]">
                  &ldquo;{row.objection}&rdquo;
                </p>
                <p className="mt-2 text-sm text-[var(--solvyn-text-secondary)]">
                  {row.response}
                </p>
              </div>
            ))}
          </div>
          <ReadText label="Anti-persona" value={data.antiPersona} />
        </>
      )}
    </div>
  );
}

// ── Switching ───────────────────────────────────────────────
function TabSwitching({
  data,
  update,
  editing,
}: {
  data: ProductContext["switchingDynamics"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (field: keyof typeof data, value: string) =>
    update({ switchingDynamics: { ...data, [field]: value } });

  return (
    <div className="space-y-5">
      <TabHeader title="Switching Dynamics" description="The four forces that drive or block switching behavior." />
      {editing ? (
        <>
          <EditText label="Push — What drives them away from current solution" value={data.push} onChange={(v) => set("push", v)} rows={3} />
          <EditText label="Pull — What attracts them to you" value={data.pull} onChange={(v) => set("pull", v)} rows={3} />
          <EditText label="Habit — What keeps them stuck" value={data.habit} onChange={(v) => set("habit", v)} rows={3} />
          <EditText label="Anxiety — What worries them about switching" value={data.anxiety} onChange={(v) => set("anxiety", v)} rows={3} />
        </>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4">
            <FieldLabel>Push</FieldLabel>
            <p className="text-sm text-[var(--solvyn-text-secondary)]">{data.push}</p>
          </div>
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4">
            <FieldLabel>Pull</FieldLabel>
            <p className="text-sm text-[var(--solvyn-text-secondary)]">{data.pull}</p>
          </div>
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4">
            <FieldLabel>Habit</FieldLabel>
            <p className="text-sm text-[var(--solvyn-text-secondary)]">{data.habit}</p>
          </div>
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4">
            <FieldLabel>Anxiety</FieldLabel>
            <p className="text-sm text-[var(--solvyn-text-secondary)]">{data.anxiety}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Language ────────────────────────────────────────────────
function TabLanguage({
  data,
  update,
  editing,
}: {
  data: ProductContext["customerLanguage"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (
    field: keyof typeof data,
    value: string | string[] | typeof data.glossary
  ) => update({ customerLanguage: { ...data, [field]: value } });

  const setGlossaryRow = (
    i: number,
    field: keyof GlossaryRow,
    value: string
  ) => {
    const next = data.glossary.map((row, idx) =>
      idx === i ? { ...row, [field]: value } : row
    );
    set("glossary", next);
  };
  const addGlossaryRow = () =>
    set("glossary", [...data.glossary, { term: "", meaning: "" }]);
  const removeGlossaryRow = (i: number) =>
    set(
      "glossary",
      data.glossary.filter((_, idx) => idx !== i)
    );

  return (
    <div className="space-y-5">
      <TabHeader title="Customer Language" description="Exact words and phrases to use (and avoid) in messaging." />
      {editing ? (
        <>
          <EditList label="How they describe the problem" items={data.problemDescriptions} onChange={(items) => set("problemDescriptions", items)} placeholder="Verbatim quotes..." />
          <EditList label="How they describe us" items={data.solutionDescriptions} onChange={(items) => set("solutionDescriptions", items)} placeholder="Verbatim quotes..." />
          <EditText label="Words to use" value={data.wordsToUse} onChange={(v) => set("wordsToUse", v)} rows={2} />
          <EditText label="Words to avoid" value={data.wordsToAvoid} onChange={(v) => set("wordsToAvoid", v)} rows={2} />
          <div>
            <FieldLabel>Glossary</FieldLabel>
            <div className="space-y-2">
              {data.glossary.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={row.term}
                    onChange={(e) => setGlossaryRow(i, "term", e.target.value)}
                    placeholder="Term"
                    className="w-1/3 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2 text-sm font-medium text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
                  />
                  <input
                    value={row.meaning}
                    onChange={(e) => setGlossaryRow(i, "meaning", e.target.value)}
                    placeholder="Meaning"
                    className="flex-1 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
                  />
                  <button
                    onClick={() => removeGlossaryRow(i)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-rust)]/30 hover:bg-[var(--solvyn-rust)]/5 hover:text-[var(--solvyn-rust)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addGlossaryRow}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-2 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
              >
                <Plus className="h-3 w-3" />
                Add term
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <ReadList label="How they describe the problem" items={data.problemDescriptions} />
          <ReadList label="How they describe us" items={data.solutionDescriptions} />
          <ReadText label="Words to use" value={data.wordsToUse} />
          <ReadText label="Words to avoid" value={data.wordsToAvoid} />
          {data.glossary.length > 0 && (
            <div>
              <FieldLabel>Glossary</FieldLabel>
              <div className="mt-1 overflow-hidden rounded-lg border border-[var(--solvyn-border-subtle)]">
                {data.glossary.map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-4 px-4 py-2.5 text-sm",
                      i % 2 === 0 ? "bg-[var(--solvyn-bg-elevated)]/30" : "bg-[var(--solvyn-bg-raised)]"
                    )}
                  >
                    <span className="w-1/3 shrink-0 font-medium text-[var(--solvyn-text-primary)] sm:w-1/4">
                      {row.term}
                    </span>
                    <span className="text-[var(--solvyn-text-secondary)]">{row.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Voice ───────────────────────────────────────────────────
function TabVoice({
  data,
  update,
  editing,
}: {
  data: ProductContext["brandVoice"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (field: keyof typeof data, value: string) =>
    update({ brandVoice: { ...data, [field]: value } });

  return (
    <div className="space-y-5">
      <TabHeader title="Brand Voice" description="How Solvyn sounds across all communications." />
      {editing ? (
        <>
          <EditText label="Tone" value={data.tone} onChange={(v) => set("tone", v)} rows={2} />
          <EditText label="Style" value={data.style} onChange={(v) => set("style", v)} rows={2} />
          <EditText label="Personality" value={data.personality} onChange={(v) => set("personality", v)} rows={2} />
          <EditText label="What we're NOT" value={data.whatWereNot} onChange={(v) => set("whatWereNot", v)} rows={2} />
        </>
      ) : (
        <>
          <ReadText label="Tone" value={data.tone} />
          <ReadText label="Style" value={data.style} />
          <ReadText label="Personality" value={data.personality} />
          <ReadText label="What we're NOT" value={data.whatWereNot} />
        </>
      )}
    </div>
  );
}

// ── Proof Points ────────────────────────────────────────────
function TabProofPoints({
  data,
  update,
  editing,
}: {
  data: ProductContext["proofPoints"];
  update: (p: Partial<ProductContext>) => void;
  editing: boolean;
}) {
  const set = (
    field: keyof typeof data,
    value: string | string[] | ValueThemeRow[]
  ) => update({ proofPoints: { ...data, [field]: value } });

  const setThemeRow = (
    i: number,
    field: keyof ValueThemeRow,
    value: string
  ) => {
    const next = data.valueThemes.map((row, idx) =>
      idx === i ? { ...row, [field]: value } : row
    );
    set("valueThemes", next);
  };
  const addThemeRow = () =>
    set("valueThemes", [...data.valueThemes, { theme: "", proof: "" }]);
  const removeThemeRow = (i: number) =>
    set(
      "valueThemes",
      data.valueThemes.filter((_, idx) => idx !== i)
    );

  return (
    <div className="space-y-5">
      <TabHeader
        title="Proof Points"
        description="Evidence and credibility that backs up your claims."
      />
      {editing ? (
        <>
          <EditText label="Key metrics" value={data.metrics} onChange={(v) => set("metrics", v)} placeholder="Stats, numbers, results..." rows={2} />
          <EditText label="Notable customers" value={data.customers} onChange={(v) => set("customers", v)} rows={2} />
          <EditText label="Testimonials" value={data.testimonials} onChange={(v) => set("testimonials", v)} placeholder="Customer quotes..." rows={3} />
          <EditText label="Medical credibility" value={data.medicalCredibility} onChange={(v) => set("medicalCredibility", v)} rows={3} />
          <EditList label="Certifications" items={data.certifications} onChange={(items) => set("certifications", items)} placeholder="Certification name..." />
          <div>
            <FieldLabel>Value themes</FieldLabel>
            <div className="space-y-2">
              {data.valueThemes.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={row.theme}
                    onChange={(e) => setThemeRow(i, "theme", e.target.value)}
                    placeholder="Theme"
                    className="w-1/3 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2 text-sm font-medium text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
                  />
                  <input
                    value={row.proof}
                    onChange={(e) => setThemeRow(i, "proof", e.target.value)}
                    placeholder="Supporting proof"
                    className="flex-1 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
                  />
                  <button
                    onClick={() => removeThemeRow(i)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-rust)]/30 hover:bg-[var(--solvyn-rust)]/5 hover:text-[var(--solvyn-rust)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addThemeRow}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-2 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
              >
                <Plus className="h-3 w-3" />
                Add theme
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <ReadText label="Key metrics" value={data.metrics} />
          <ReadText label="Notable customers" value={data.customers} />
          <ReadText label="Testimonials" value={data.testimonials} />
          <ReadText label="Medical credibility" value={data.medicalCredibility} />
          {data.certifications.length > 0 && (
            <div>
              <FieldLabel>Certifications</FieldLabel>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.certifications.map((cert, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-[var(--solvyn-olive)]/20 bg-[var(--solvyn-olive)]/5 px-3 py-1 text-xs font-medium text-[var(--solvyn-olive)]"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.valueThemes.length > 0 && (
            <div>
              <FieldLabel>Value themes</FieldLabel>
              <div className="mt-1 overflow-hidden rounded-lg border border-[var(--solvyn-border-subtle)]">
                {data.valueThemes.map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-4 px-4 py-2.5 text-sm",
                      i % 2 === 0 ? "bg-[var(--solvyn-bg-elevated)]/30" : "bg-[var(--solvyn-bg-raised)]"
                    )}
                  >
                    <span className="w-1/3 shrink-0 font-medium text-[var(--solvyn-text-primary)] sm:w-1/4">
                      {row.theme}
                    </span>
                    <span className="text-[var(--solvyn-text-secondary)]">{row.proof}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
