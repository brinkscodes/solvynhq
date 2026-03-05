"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import type { TeamMember } from "@/lib/team-types";

export function MentionInput({
  onSubmit,
  placeholder = "Write a comment...",
  initialValue = "",
  autoFocus = false,
  onCancel,
}: {
  onSubmit: (content: string, mentions: string[]) => void;
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showMentions && !membersLoaded) {
      fetch("/api/team")
        .then((r) => r.json())
        .then((d) => { setMembers(d.members || []); setMembersLoaded(true); })
        .catch(() => setMembersLoaded(true));
    }
  }, [showMentions, membersLoaded]);

  const filtered = members.filter((m) =>
    m.fullName.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Check for @ trigger
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (atMatch) {
      setShowMentions(true);
      setMentionSearch(atMatch[1]);
      setSelectedIndex(0);
    } else {
      setShowMentions(false);
    }
  }, []);

  const insertMention = useCallback((member: TeamMember) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBefore = value.substring(0, cursorPos);
    const textAfter = value.substring(cursorPos);
    const atIndex = textBefore.lastIndexOf("@");

    const newValue = textBefore.substring(0, atIndex) + `@${member.fullName} ` + textAfter;
    setValue(newValue);
    setShowMentions(false);

    setTimeout(() => {
      const newCursorPos = atIndex + member.fullName.length + 2;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(filtered[selectedIndex]);
        return;
      }
      if (e.key === "Escape") {
        setShowMentions(false);
        return;
      }
    }

    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (e.key === "Escape" && onCancel) {
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) return;

    // Extract mentioned user IDs
    const mentionedNames = [...value.matchAll(/@([^@\n]+?)(?=\s|$)/g)].map((m) => m[1].trim());
    const mentionedIds = members
      .filter((m) => mentionedNames.includes(m.fullName))
      .map((m) => m.userId);

    onSubmit(value.trim(), mentionedIds);
    setValue("");
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2 rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 focus-within:border-[var(--solvyn-olive)]/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          autoFocus={autoFocus}
          className="flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--solvyn-olive)] text-white transition-all hover:brightness-110 disabled:opacity-30"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Mention autocomplete dropdown */}
      {showMentions && filtered.length > 0 && (
        <div className="absolute bottom-full left-0 z-30 mb-1 w-56 rounded-lg border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-1 shadow-lg shadow-black/20">
          {filtered.slice(0, 5).map((member, i) => (
            <button
              key={member.userId}
              onClick={() => insertMention(member)}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-[12px] transition-colors",
                i === selectedIndex
                  ? "bg-[var(--solvyn-bg-base)] text-[var(--solvyn-text-primary)]"
                  : "text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-base)]"
              )}
            >
              <Avatar name={member.fullName} avatarUrl={member.avatarUrl} size="xs" />
              <span className="truncate">{member.fullName}</span>
            </button>
          ))}
        </div>
      )}

      <p className="mt-1 text-[10px] text-[var(--solvyn-text-tertiary)]">
        <kbd className="rounded bg-[var(--solvyn-bg-elevated)] px-1 py-0.5 text-[9px]">Cmd+Enter</kbd> to send
        {" "}&middot;{" "}
        <kbd className="rounded bg-[var(--solvyn-bg-elevated)] px-1 py-0.5 text-[9px]">@</kbd> to mention
      </p>
    </div>
  );
}
