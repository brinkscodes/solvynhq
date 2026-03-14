"use client";

import { useState } from "react";
import { Copy, Check, Link2, Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function InviteForm({
  onInvite,
}: {
  onInvite: (payload: { email?: string; role: "admin" | "member" }) => Promise<{ inviteCode: string } | null>;
}) {
  const [mode, setMode] = useState<"link" | "email">("link");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onInvite({
        email: mode === "email" ? email : undefined,
        role: "member",
      });
      if (result) {
        const link = `${window.location.origin}/join/${result.inviteCode}`;
        setGeneratedLink(link);
        setEmail("");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-1 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] p-1">
        <button
          onClick={() => { setMode("link"); setGeneratedLink(null); }}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
            mode === "link"
              ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-sm"
              : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
          )}
        >
          <Link2 className="h-3.5 w-3.5" />
          Invite Link
        </button>
        <button
          onClick={() => { setMode("email"); setGeneratedLink(null); }}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
            mode === "email"
              ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-sm"
              : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
          )}
        >
          <Mail className="h-3.5 w-3.5" />
          Email Invite
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "email" && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
            className="w-full rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-[13px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none focus:border-[var(--solvyn-olive)]/40"
          />
        )}

        <button
          type="submit"
          disabled={loading || (mode === "email" && !email)}
          className="flex items-center gap-2 rounded-lg bg-[var(--solvyn-olive)] px-4 py-2 text-[12px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {mode === "link" ? "Generate Link" : "Send Invite"}
        </button>
      </form>

      {/* Generated link display */}
      {generatedLink && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--solvyn-olive)]/20 bg-[var(--solvyn-olive)]/5 px-3 py-2.5">
          <code className="min-w-0 flex-1 truncate text-[12px] text-[var(--solvyn-text-secondary)]">
            {generatedLink}
          </code>
          <button
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--solvyn-bg-elevated)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:text-[var(--solvyn-text-primary)]"
          >
            {copied ? <Check className="h-3 w-3 text-[var(--solvyn-olive)]" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
