"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen font-[family-name:var(--font-inter)]">
      {/* Left panel - branding with olive gradient overlay */}
      <div className="hidden w-[480px] shrink-0 bg-gradient-to-b from-[#111110] via-[#141614] to-[#111110] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <img
          src="/solvyn-logo.png"
          alt="Solvyn"
          className="w-36 brightness-0 invert opacity-80"
        />
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--solvyn-text-tertiary)]">
          Project Dashboard
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex flex-1 items-center justify-center bg-[var(--solvyn-bg-base)] px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 text-center lg:hidden">
            <img
              src="/solvyn-logo.png"
              alt="Solvyn"
              className="mx-auto mb-3 w-32 brightness-0 invert opacity-80"
            />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--solvyn-text-tertiary)]">
              Project Dashboard
            </p>
          </div>

          <div className="hidden lg:block">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--solvyn-text-primary)]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[var(--solvyn-text-tertiary)]">
              Sign in to your account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                autoFocus
                required
                className="w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-4 py-3.5 text-[var(--solvyn-text-primary)] outline-none transition-all placeholder:text-[var(--solvyn-text-tertiary)] focus:border-[var(--solvyn-olive)]/40 focus:bg-[var(--solvyn-bg-base)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                required
                className="w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-4 py-3.5 text-[var(--solvyn-text-primary)] outline-none transition-all placeholder:text-[var(--solvyn-text-tertiary)] focus:border-[var(--solvyn-olive)]/40 focus:bg-[var(--solvyn-bg-base)]"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-[var(--solvyn-rust-bg)] px-4 py-2.5">
                <p className="text-[13px] font-medium text-[var(--solvyn-rust)]">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--solvyn-olive)] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[var(--solvyn-text-tertiary)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[var(--solvyn-olive)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
