"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0] font-[family-name:var(--font-inter)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src="/solvyn-logo.png"
            alt="Solvyn"
            className="mx-auto mb-4 w-48"
          />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#2A2A2A]/40">
            Project Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-[#2A2A2A]/10 bg-white px-4 py-3 text-[#2A2A2A] outline-none transition-colors placeholder:text-[#2A2A2A]/30 focus:border-[#6C7B5A]"
          />

          {error && (
            <p className="text-sm text-[#B96E5C]">
              Incorrect password. Try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#6C7B5A] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5a6a4a]"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
