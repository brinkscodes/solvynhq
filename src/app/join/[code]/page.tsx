"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleJoin() {
    setStatus("loading");
    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to join");
        setStatus("error");
        return;
      }
      setStatus("success");
      setTimeout(() => router.push("/"), 2000);
    } catch {
      setError("Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] p-8 shadow-xl shadow-black/10">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--solvyn-olive)]/10">
            <Users className="h-7 w-7 text-[var(--solvyn-olive)]" />
          </div>
          <h1 className="text-lg font-semibold text-[var(--solvyn-text-primary)]">
            Join Project
          </h1>
          <p className="mt-1 text-center text-[13px] text-[var(--solvyn-text-tertiary)]">
            You&apos;ve been invited to collaborate on a project
          </p>
        </div>

        {status === "idle" && (
          <button
            onClick={handleJoin}
            className="w-full rounded-lg bg-[var(--solvyn-olive)] py-2.5 text-[13px] font-semibold text-white transition-all hover:brightness-110"
          >
            Accept Invite
          </button>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--solvyn-olive)]" />
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-2 py-2">
            <CheckCircle2 className="h-6 w-6 text-[var(--solvyn-olive)]" />
            <p className="text-[13px] font-medium text-[var(--solvyn-olive)]">
              You&apos;ve joined the project! Redirecting...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex items-center gap-2 text-[var(--solvyn-rust)]">
              <XCircle className="h-5 w-5" />
              <p className="text-[13px] font-medium">{error}</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-[12px] font-medium text-[var(--solvyn-text-tertiary)] underline hover:text-[var(--solvyn-text-secondary)]"
            >
              Go to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
