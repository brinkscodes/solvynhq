"use client";

import { useEffect, useState } from "react";
import { Undo2, X } from "lucide-react";

interface UndoToastProps {
  taskName: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ taskName, onUndo, onDismiss }: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const duration = 5000;

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [onDismiss, duration]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
      <div className="relative overflow-hidden rounded-xl border border-[#6C7B5A]/20 bg-[#1A1A1A] px-5 py-3.5 shadow-lg shadow-black/10">
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
          <div
            className="h-full bg-[#6C7B5A]/60 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[13px] text-white/80">
            <span className="font-medium text-white">Done!</span>{" "}
            <span className="max-w-[200px] truncate inline-block align-bottom">
              {taskName}
            </span>
          </p>
          <button
            onClick={onUndo}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/20"
          >
            <Undo2 className="h-3 w-3" />
            Undo
          </button>
          <button
            onClick={onDismiss}
            className="text-white/30 transition-colors hover:text-white/60"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
