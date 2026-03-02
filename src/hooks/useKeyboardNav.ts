"use client";

import { useEffect, useCallback, useState } from "react";

interface UseKeyboardNavOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  onEdit?: (index: number) => void;
  onMarkDone?: (index: number) => void;
  onSetPriority?: (index: number, priority: "low" | "medium" | "high") => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  itemCount,
  onSelect,
  onEdit,
  onMarkDone,
  onSetPriority,
  enabled = true,
}: UseKeyboardNavOptions) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.getAttribute?.("role") === "combobox";

      if (isInput) return;

      switch (e.key) {
        case "j":
        case "ArrowDown":
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setFocusedIndex((prev) => Math.min(prev + 1, itemCount - 1));
          }
          break;

        case "k":
        case "ArrowUp":
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setFocusedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;

        case "Enter":
          if (focusedIndex >= 0) {
            e.preventDefault();
            onSelect?.(focusedIndex);
          }
          break;

        case "e":
          if (!e.metaKey && !e.ctrlKey && !e.altKey && focusedIndex >= 0) {
            e.preventDefault();
            onEdit?.(focusedIndex);
          }
          break;

        case "d":
          if (!e.metaKey && !e.ctrlKey && !e.altKey && focusedIndex >= 0) {
            e.preventDefault();
            onMarkDone?.(focusedIndex);
          }
          break;

        case "1":
          if (!e.metaKey && !e.ctrlKey && !e.altKey && focusedIndex >= 0) {
            e.preventDefault();
            onSetPriority?.(focusedIndex, "low");
          }
          break;

        case "2":
          if (!e.metaKey && !e.ctrlKey && !e.altKey && focusedIndex >= 0) {
            e.preventDefault();
            onSetPriority?.(focusedIndex, "medium");
          }
          break;

        case "3":
          if (!e.metaKey && !e.ctrlKey && !e.altKey && focusedIndex >= 0) {
            e.preventDefault();
            onSetPriority?.(focusedIndex, "high");
          }
          break;

        case "Escape":
          setFocusedIndex(-1);
          break;
      }
    },
    [enabled, itemCount, focusedIndex, onSelect, onEdit, onMarkDone, onSetPriority]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset focus when item count changes
  useEffect(() => {
    if (focusedIndex >= itemCount) {
      setFocusedIndex(Math.max(itemCount - 1, -1));
    }
  }, [itemCount, focusedIndex]);

  return { focusedIndex, setFocusedIndex };
}
