"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // If email confirmation is disabled, redirect immediately
      router.push("/");
      router.refresh();
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-6 font-[family-name:var(--font-inter)]">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#6C7B5A]/10">
            <svg className="h-6 w-6 text-[#6C7B5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1A1A1A]">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-[#1A1A1A]/50">
            We sent a confirmation link to <strong className="text-[#1A1A1A]/70">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-[13px] font-medium text-[#6C7B5A] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-[family-name:var(--font-inter)]">
      {/* Left panel - branding */}
      <div className="hidden w-[480px] shrink-0 bg-[#1A1B23] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <img
          src="/solvyn-logo.png"
          alt="Solvyn"
          className="w-36 brightness-0 invert"
        />
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/20">
          Project Dashboard
        </p>
      </div>

      {/* Right panel - signup form */}
      <div className="flex flex-1 items-center justify-center bg-[#F8F7F4] px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 text-center lg:hidden">
            <img
              src="/solvyn-logo.png"
              alt="Solvyn"
              className="mx-auto mb-3 w-32"
            />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A1A1A]/25">
              Project Dashboard
            </p>
          </div>

          <div className="hidden lg:block">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1A1A1A]">
              Create an account
            </h1>
            <p className="mt-1 text-sm text-[#1A1A1A]/35">
              Get started with your project dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#1A1A1A]/30">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                autoFocus
                required
                className="w-full rounded-xl border border-[#E8E4DE] bg-white px-4 py-3.5 text-[#1A1A1A] outline-none transition-all placeholder:text-[#1A1A1A]/20 focus:border-[#6C7B5A]/40 focus:shadow-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#1A1A1A]/30">
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
                required
                className="w-full rounded-xl border border-[#E8E4DE] bg-white px-4 py-3.5 text-[#1A1A1A] outline-none transition-all placeholder:text-[#1A1A1A]/20 focus:border-[#6C7B5A]/40 focus:shadow-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#1A1A1A]/30">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full rounded-xl border border-[#E8E4DE] bg-white px-4 py-3.5 text-[#1A1A1A] outline-none transition-all placeholder:text-[#1A1A1A]/20 focus:border-[#6C7B5A]/40 focus:shadow-sm"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-[#B96E5C]/[0.06] px-4 py-2.5">
                <p className="text-[13px] font-medium text-[#B96E5C]">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1B23] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2A2B33] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#1A1A1A]/35">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#6C7B5A] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
