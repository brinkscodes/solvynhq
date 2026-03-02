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
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-[#E8E4DE] bg-white/60 px-4 py-2.5 transition-colors focus-within:border-[#6C7B5A]/30 focus-within:bg-white">
        <Plus className="h-4 w-4 shrink-0 text-[#1A1A1A]/20" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Quick add task... (press Enter)"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1A1A1A] placeholder-[#1A1A1A]/25 outline-none"
        />
        {value.trim() && (
          <span className="shrink-0 text-[10px] font-medium text-[#1A1A1A]/25">
            Enter
          </span>
        )}
      </div>
    </form>
  );
}
