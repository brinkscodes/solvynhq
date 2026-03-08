"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Loader2,
  Pencil,
  ExternalLink,
  Users,
  Clock,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Partner,
  AdvisoryBoardMember,
  Volunteer,
  SocialProofData,
  SocialProofTable,
} from "@/lib/social-proof-types";
// ── Tab config ──────────────────────────────────────────────
const TABS = [
  { id: "partners", label: "Partners" },
  { id: "advisory", label: "Advisory Board" },
  { id: "volunteers", label: "Volunteers" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Shared primitives ───────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--solvyn-text-secondary)]">
      {children}
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
      />
    </div>
  );
}

function TextareaField({
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-3.5 py-2 text-sm text-[var(--solvyn-text-primary)] outline-none transition-colors focus:border-[var(--solvyn-olive)] focus:ring-1 focus:ring-[var(--solvyn-olive)]/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusBadge({
  status,
  colorMap,
}: {
  status: string;
  colorMap: Record<string, string>;
}) {
  const color = colorMap[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", color)}>
      {status.replace("-", " ")}
    </span>
  );
}

// ── API helpers ─────────────────────────────────────────────
async function createRecord(table: SocialProofTable, data: Record<string, unknown>) {
  const res = await fetch("/api/social-proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, data }),
  });
  return res.json();
}

async function updateRecord(id: string, table: SocialProofTable, data: Record<string, unknown>) {
  await fetch(`/api/social-proof/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, data }),
  });
}

async function deleteRecord(id: string, table: SocialProofTable) {
  await fetch(`/api/social-proof/${id}?table=${table}`, { method: "DELETE" });
}

// ── Main component ──────────────────────────────────────────
export function SocialProofEditor({
  initialData,
}: {
  initialData: SocialProofData;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("partners");
  const [partners, setPartners] = useState<Partner[]>(initialData.partners);
  const [advisors, setAdvisors] = useState<AdvisoryBoardMember[]>(initialData.advisors);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialData.volunteers);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-[var(--solvyn-text-primary)]">
              Social Proof
            </h1>
            <p className="mt-1 text-sm text-[var(--solvyn-text-secondary)]">
              Partners, advisors, and brand ambassadors
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
        {activeTab === "partners" && (
          <TabPartners
            data={partners}
            setData={setPartners}
            editing={editing}
            setSaving={setSaving}
          />
        )}
        {activeTab === "advisory" && (
          <TabAdvisory
            data={advisors}
            setData={setAdvisors}
            editing={editing}
            setSaving={setSaving}
          />
        )}
        {activeTab === "volunteers" && (
          <TabVolunteers
            data={volunteers}
            setData={setVolunteers}
            editing={editing}
            setSaving={setSaving}
          />
        )}

        {/* Edit toggle + saving indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin text-[var(--solvyn-text-tertiary)]" />}
          <button
            onClick={() => setEditing(!editing)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105",
              editing
                ? "bg-[var(--solvyn-olive)] text-white shadow-sm hover:brightness-110"
                : "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-olive)] hover:bg-[var(--solvyn-olive)]/10"
            )}
            title={editing ? "Done editing" : "Edit"}
          >
            {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Partners Tab ────────────────────────────────────────────
const PARTNER_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "distribution", label: "Distribution" },
  { value: "co-brand", label: "Co-Brand" },
  { value: "media", label: "Media" },
  { value: "other", label: "Other" },
];

const PARTNER_STATUSES = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "past", label: "Past" },
];

const partnerStatusColors: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  past: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const partnerTypeColors: Record<string, string> = {
  retail: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  distribution: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "co-brand": "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  media: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function TabPartners({
  data,
  setData,
  editing,
  setSaving,
}: {
  data: Partner[];
  setData: React.Dispatch<React.SetStateAction<Partner[]>>;
  editing: boolean;
  setSaving: (v: boolean) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = async () => {
    setSaving(true);
    const record = await createRecord("partners", {
      name: "New Partner",
      type: "retail",
      status: "pending",
    });
    setData((prev) => [...prev, record]);
    setEditingId(record.id);
    setSaving(false);
  };

  const handleUpdate = async (id: string, updates: Partial<Partner>) => {
    setData((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    await updateRecord(id, "partners", updates);
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setData((prev) => prev.filter((p) => p.id !== id));
    await deleteRecord(id, "partners");
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--solvyn-text-primary)]">
          Partners
        </h2>
        <p className="mt-1 text-sm text-[var(--solvyn-text-secondary)]">
          Brand partnerships, retail partners, and distribution channels.
        </p>
      </div>

      {data.length === 0 && !editing && (
        <p className="py-8 text-center text-sm text-[var(--solvyn-text-tertiary)]">
          No partners added yet. Click the edit button to get started.
        </p>
      )}

      <div className="space-y-3">
        {data.map((partner) => {
          const isEditing = editing && editingId === partner.id;

          if (isEditing) {
            return (
              <PartnerEditCard
                key={partner.id}
                partner={partner}
                onUpdate={(updates) => handleUpdate(partner.id, updates)}
                onDone={() => setEditingId(null)}
                onDelete={() => handleDelete(partner.id)}
              />
            );
          }

          return (
            <div
              key={partner.id}
              onClick={() => editing && setEditingId(partner.id)}
              className={cn(
                "rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4",
                editing && "cursor-pointer hover:border-[var(--solvyn-olive)]/40"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--solvyn-text-primary)]">
                      {partner.name}
                    </h3>
                    <StatusBadge status={partner.type} colorMap={partnerTypeColors} />
                    <StatusBadge status={partner.status} colorMap={partnerStatusColors} />
                  </div>
                  {partner.description && (
                    <p className="mt-1.5 text-sm text-[var(--solvyn-text-secondary)] line-clamp-2">
                      {partner.description}
                    </p>
                  )}
                </div>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-olive)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-3 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
        >
          <Plus className="h-3 w-3" />
          Add Partner
        </button>
      )}
    </div>
  );
}

function PartnerEditCard({
  partner,
  onUpdate,
  onDone,
  onDelete,
}: {
  partner: Partner;
  onUpdate: (updates: Partial<Partner>) => void;
  onDone: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-bg-elevated)]/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--solvyn-olive)]">Editing partner</span>
        <div className="flex gap-1">
          <button
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-rust)]/10 hover:text-[var(--solvyn-rust)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDone}
            className="flex h-7 items-center gap-1 rounded-md bg-[var(--solvyn-olive)] px-2 text-xs font-medium text-white"
          >
            <Check className="h-3 w-3" />
            Done
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="Name" value={partner.name} onChange={(v) => onUpdate({ name: v })} placeholder="Partner name..." />
        <SelectField label="Type" value={partner.type} onChange={(v) => onUpdate({ type: v as Partner["type"] })} options={PARTNER_TYPES} />
        <SelectField label="Status" value={partner.status} onChange={(v) => onUpdate({ status: v as Partner["status"] })} options={PARTNER_STATUSES} />
        <InputField label="Website" value={partner.website} onChange={(v) => onUpdate({ website: v })} placeholder="https://..." />
      </div>
      <TextareaField label="Description" value={partner.description} onChange={(v) => onUpdate({ description: v })} placeholder="Brief description of the partnership..." rows={2} />
    </div>
  );
}

// ── Advisory Board Tab ──────────────────────────────────────
const ADVISORY_STATUSES = [
  { value: "active", label: "Active" },
  { value: "emeritus", label: "Emeritus" },
];

const advisoryStatusColors: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  emeritus: "bg-[var(--solvyn-olive)]/10 text-[var(--solvyn-olive)]",
};

function TabAdvisory({
  data,
  setData,
  editing,
  setSaving,
}: {
  data: AdvisoryBoardMember[];
  setData: React.Dispatch<React.SetStateAction<AdvisoryBoardMember[]>>;
  editing: boolean;
  setSaving: (v: boolean) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = async () => {
    setSaving(true);
    const record = await createRecord("advisory_board", {
      name: "New Advisor",
      status: "active",
    });
    setData((prev) => [...prev, record]);
    setEditingId(record.id);
    setSaving(false);
  };

  const handleUpdate = async (id: string, updates: Partial<AdvisoryBoardMember>) => {
    setData((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    await updateRecord(id, "advisory_board", updates);
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setData((prev) => prev.filter((a) => a.id !== id));
    await deleteRecord(id, "advisory_board");
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--solvyn-text-primary)]">
          Advisory Board
        </h2>
        <p className="mt-1 text-sm text-[var(--solvyn-text-secondary)]">
          Expert advisors and board members guiding the brand.
        </p>
      </div>

      {data.length === 0 && !editing && (
        <p className="py-8 text-center text-sm text-[var(--solvyn-text-tertiary)]">
          No advisory board members added yet. Click the edit button to get started.
        </p>
      )}

      <div className="space-y-3">
        {data.map((member) => {
          const isEditing = editing && editingId === member.id;

          if (isEditing) {
            return (
              <AdvisoryEditCard
                key={member.id}
                member={member}
                onUpdate={(updates) => handleUpdate(member.id, updates)}
                onDone={() => setEditingId(null)}
                onDelete={() => handleDelete(member.id)}
              />
            );
          }

          return (
            <div
              key={member.id}
              onClick={() => editing && setEditingId(member.id)}
              className={cn(
                "flex items-start gap-4 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4",
                editing && "cursor-pointer hover:border-[var(--solvyn-olive)]/40"
              )}
            >
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--solvyn-olive)]/10 text-sm font-semibold text-[var(--solvyn-olive)]">
                {member.headshot_url ? (
                  <img src={member.headshot_url} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  member.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--solvyn-text-primary)]">
                    {member.name}
                  </h3>
                  <StatusBadge status={member.status} colorMap={advisoryStatusColors} />
                </div>
                {(member.title || member.organization) && (
                  <p className="mt-0.5 text-xs text-[var(--solvyn-text-secondary)]">
                    {[member.title, member.organization].filter(Boolean).join(" at ")}
                  </p>
                )}
                {member.expertise_area && (
                  <span className="mt-1.5 inline-block rounded-full bg-[var(--solvyn-olive)]/5 border border-[var(--solvyn-olive)]/20 px-2.5 py-0.5 text-[11px] font-medium text-[var(--solvyn-olive)]">
                    {member.expertise_area}
                  </span>
                )}
                {member.bio && (
                  <p className="mt-2 text-sm text-[var(--solvyn-text-secondary)] line-clamp-2">
                    {member.bio}
                  </p>
                )}
              </div>
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-olive)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-3 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
        >
          <Plus className="h-3 w-3" />
          Add Advisor
        </button>
      )}
    </div>
  );
}

function AdvisoryEditCard({
  member,
  onUpdate,
  onDone,
  onDelete,
}: {
  member: AdvisoryBoardMember;
  onUpdate: (updates: Partial<AdvisoryBoardMember>) => void;
  onDone: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-bg-elevated)]/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--solvyn-olive)]">Editing advisor</span>
        <div className="flex gap-1">
          <button
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-rust)]/10 hover:text-[var(--solvyn-rust)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDone}
            className="flex h-7 items-center gap-1 rounded-md bg-[var(--solvyn-olive)] px-2 text-xs font-medium text-white"
          >
            <Check className="h-3 w-3" />
            Done
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="Name" value={member.name} onChange={(v) => onUpdate({ name: v })} placeholder="Full name..." />
        <InputField label="Title" value={member.title} onChange={(v) => onUpdate({ title: v })} placeholder="e.g. Chief Dermatologist" />
        <InputField label="Organization" value={member.organization} onChange={(v) => onUpdate({ organization: v })} placeholder="Company or institution..." />
        <InputField label="Expertise" value={member.expertise_area} onChange={(v) => onUpdate({ expertise_area: v })} placeholder="Area of expertise..." />
        <SelectField label="Status" value={member.status} onChange={(v) => onUpdate({ status: v as AdvisoryBoardMember["status"] })} options={ADVISORY_STATUSES} />
        <InputField label="LinkedIn URL" value={member.linkedin_url} onChange={(v) => onUpdate({ linkedin_url: v })} placeholder="https://linkedin.com/in/..." />
      </div>
      <TextareaField label="Bio" value={member.bio} onChange={(v) => onUpdate({ bio: v })} placeholder="Brief bio..." rows={3} />
    </div>
  );
}

// ── Volunteers Tab ──────────────────────────────────────────
const VOLUNTEER_ROLES = [
  { value: "ambassador", label: "Ambassador" },
  { value: "event-coordinator", label: "Event Coordinator" },
  { value: "content-creator", label: "Content Creator" },
  { value: "community-lead", label: "Community Lead" },
  { value: "field-rep", label: "Field Rep" },
];

const VOLUNTEER_STATUSES = [
  { value: "applied", label: "Applied" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "alumni", label: "Alumni" },
];

const volunteerStatusColors: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  alumni: "bg-[var(--solvyn-olive)]/10 text-[var(--solvyn-olive)]",
};

const volunteerRoleColors: Record<string, string> = {
  ambassador: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "event-coordinator": "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "content-creator": "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "community-lead": "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "field-rep": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function TabVolunteers({
  data,
  setData,
  editing,
  setSaving,
}: {
  data: Volunteer[];
  setData: React.Dispatch<React.SetStateAction<Volunteer[]>>;
  editing: boolean;
  setSaving: (v: boolean) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = async () => {
    setSaving(true);
    const record = await createRecord("volunteers", {
      name: "New Volunteer",
      role: "ambassador",
      status: "applied",
    });
    setData((prev) => [...prev, record]);
    setEditingId(record.id);
    setSaving(false);
  };

  const handleUpdate = async (id: string, updates: Partial<Volunteer>) => {
    setData((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    await updateRecord(id, "volunteers", updates);
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setData((prev) => prev.filter((v) => v.id !== id));
    await deleteRecord(id, "volunteers");
    setSaving(false);
  };

  // Stats
  const activeCount = data.filter((v) => v.status === "active").length;
  const pendingCount = data.filter((v) => v.status === "applied").length;
  const totalHours = data.reduce((sum, v) => sum + (Number(v.total_hours) || 0), 0);
  const totalEvents = data.reduce((sum, v) => sum + (v.events_attended || 0), 0);

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--solvyn-text-primary)]">
          Volunteers
        </h2>
        <p className="mt-1 text-sm text-[var(--solvyn-text-secondary)]">
          Brand ambassadors, event coordinators, and community volunteers.
        </p>
      </div>

      {/* Stats summary */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--solvyn-text-tertiary)]">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-lg font-semibold text-[var(--solvyn-text-primary)]">{activeCount}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">Active</p>
          </div>
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--solvyn-text-tertiary)]">
              <Users className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-lg font-semibold text-[var(--solvyn-text-primary)]">{pendingCount}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">Pending</p>
          </div>
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--solvyn-text-tertiary)]">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-lg font-semibold text-[var(--solvyn-text-primary)]">{totalHours}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">Hours</p>
          </div>
          <div className="rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--solvyn-text-tertiary)]">
              <CalendarDays className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-lg font-semibold text-[var(--solvyn-text-primary)]">{totalEvents}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--solvyn-text-tertiary)]">Events</p>
          </div>
        </div>
      )}

      {data.length === 0 && !editing && (
        <p className="py-8 text-center text-sm text-[var(--solvyn-text-tertiary)]">
          No volunteers added yet. Click the edit button to get started.
        </p>
      )}

      <div className="space-y-3">
        {data.map((volunteer) => {
          const isEditing = editing && editingId === volunteer.id;

          if (isEditing) {
            return (
              <VolunteerEditCard
                key={volunteer.id}
                volunteer={volunteer}
                onUpdate={(updates) => handleUpdate(volunteer.id, updates)}
                onDone={() => setEditingId(null)}
                onDelete={() => handleDelete(volunteer.id)}
              />
            );
          }

          return (
            <div
              key={volunteer.id}
              onClick={() => editing && setEditingId(volunteer.id)}
              className={cn(
                "flex items-start gap-4 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)]/30 p-4",
                editing && "cursor-pointer hover:border-[var(--solvyn-olive)]/40"
              )}
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--solvyn-olive)]/10 text-xs font-semibold text-[var(--solvyn-olive)]">
                {volunteer.photo_url ? (
                  <img src={volunteer.photo_url} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  volunteer.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--solvyn-text-primary)]">
                    {volunteer.name}
                  </h3>
                  <StatusBadge status={volunteer.role} colorMap={volunteerRoleColors} />
                  <StatusBadge status={volunteer.status} colorMap={volunteerStatusColors} />
                </div>
                <div className="mt-1.5 flex items-center gap-4 text-xs text-[var(--solvyn-text-tertiary)]">
                  {volunteer.start_date && (
                    <span>Since {new Date(volunteer.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  )}
                  {Number(volunteer.total_hours) > 0 && <span>{volunteer.total_hours}h contributed</span>}
                  {volunteer.events_attended > 0 && <span>{volunteer.events_attended} events</span>}
                </div>
                {volunteer.bio && (
                  <p className="mt-1.5 text-sm text-[var(--solvyn-text-secondary)] line-clamp-1">
                    {volunteer.bio}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--solvyn-border-subtle)] px-3 py-3 text-xs font-medium text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-olive)]/40 hover:text-[var(--solvyn-olive)]"
        >
          <Plus className="h-3 w-3" />
          Add Volunteer
        </button>
      )}
    </div>
  );
}

function VolunteerEditCard({
  volunteer,
  onUpdate,
  onDone,
  onDelete,
}: {
  volunteer: Volunteer;
  onUpdate: (updates: Partial<Volunteer>) => void;
  onDone: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-bg-elevated)]/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--solvyn-olive)]">Editing volunteer</span>
        <div className="flex gap-1">
          <button
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-rust)]/10 hover:text-[var(--solvyn-rust)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDone}
            className="flex h-7 items-center gap-1 rounded-md bg-[var(--solvyn-olive)] px-2 text-xs font-medium text-white"
          >
            <Check className="h-3 w-3" />
            Done
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="Name" value={volunteer.name} onChange={(v) => onUpdate({ name: v })} placeholder="Full name..." />
        <InputField label="Email" value={volunteer.email} onChange={(v) => onUpdate({ email: v })} placeholder="email@example.com" />
        <InputField label="Phone" value={volunteer.phone} onChange={(v) => onUpdate({ phone: v })} placeholder="+1 (555) 000-0000" />
        <SelectField label="Role" value={volunteer.role} onChange={(v) => onUpdate({ role: v as Volunteer["role"] })} options={VOLUNTEER_ROLES} />
        <SelectField label="Status" value={volunteer.status} onChange={(v) => onUpdate({ status: v as Volunteer["status"] })} options={VOLUNTEER_STATUSES} />
        <InputField label="Instagram" value={volunteer.instagram_url} onChange={(v) => onUpdate({ instagram_url: v })} placeholder="https://instagram.com/..." />
        <InputField label="Start Date" value={volunteer.start_date || ""} onChange={(v) => onUpdate({ start_date: v || null })} type="date" />
        <InputField label="Total Hours" value={volunteer.total_hours} onChange={(v) => onUpdate({ total_hours: parseFloat(v) || 0 })} type="number" />
        <InputField label="Events Attended" value={volunteer.events_attended} onChange={(v) => onUpdate({ events_attended: parseInt(v) || 0 })} type="number" />
      </div>
      <TextareaField label="Bio" value={volunteer.bio} onChange={(v) => onUpdate({ bio: v })} placeholder="Brief bio..." rows={2} />
      <TextareaField label="Internal Notes" value={volunteer.notes} onChange={(v) => onUpdate({ notes: v })} placeholder="Admin notes (not public)..." rows={2} />
    </div>
  );
}

