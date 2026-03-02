"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface MyTaskQuickAddProps {
  onAdd: (name: string) => void;
}

export function MyTaskQuickAdd({ onAdd }: MyTaskQuickAddProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]/60 px-4 py-2.5 transition-colors focus-within:border-[var(--solvyn-olive)]/30 focus-within:bg-[var(--solvyn-bg-raised)]">
        <Plus className="h-4 w-4 shrink-0 text-[var(--solvyn-text-tertiary)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Quick add task... (press Enter)"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none"
        />
        {value.trim() && (
          <span className="shrink-0 text-[10px] font-medium text-[var(--solvyn-text-tertiary)]">
            Enter
          </span>
        )}
      </div>
    </form>
  );
}
