"use client";

import { useState, useRef, useEffect } from "react";
import { SmilePlus } from "lucide-react";

const PRESET_EMOJIS = ["👍", "❤️", "🔥", "👀", "🎉", "✅"];

export function ReactionPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-secondary)]"
      >
        <SmilePlus className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-30 mb-1 flex gap-0.5 rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] px-1.5 py-1 shadow-lg shadow-black/20">
          {PRESET_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-base transition-transform hover:scale-125 hover:bg-[var(--solvyn-bg-base)]"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
