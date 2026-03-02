"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  MessageSquare,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

type SubmitState = "idle" | "submitting" | "success" | "error" | "warning";

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setMessage("");
        setState("idle");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async () => {
    if (!message.trim() || state === "submitting") return;

    setState("submitting");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (res.status === 207) {
        setState("warning");
      } else if (res.ok) {
        setState("success");
        setTimeout(() => onClose(), 1500);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C7B5A]/10">
              <MessageSquare className="h-4 w-4 text-[#6C7B5A]" />
            </div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">
              Send Feedback
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[#F8F7F4]"
          >
            <X className="h-4 w-4 text-[#1A1A1A]/30" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-5">
          {state === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C7B5A]/10">
                <CheckCircle className="h-6 w-6 text-[#6C7B5A]" />
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Feedback sent!
              </p>
              <p className="text-xs text-[#1A1A1A]/35">
                Thanks for your message.
              </p>
            </div>
          ) : state === "warning" ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B96E5C]/10">
                <AlertTriangle className="h-6 w-6 text-[#B96E5C]" />
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Feedback saved
              </p>
              <p className="text-center text-xs text-[#1A1A1A]/35">
                Your message was saved but email delivery failed. The developer
                will still see it.
              </p>
            </div>
          ) : (
            <>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind? Feature requests, bugs, questions..."
                className="h-32 w-full resize-none rounded-xl border border-[#E8E4DE] bg-[#F8F7F4]/50 px-4 py-3.5 text-[13px] leading-relaxed text-[#1A1A1A] placeholder-[#1A1A1A]/20 outline-none transition-all focus:border-[#6C7B5A]/30 focus:bg-white focus:shadow-sm"
                disabled={state === "submitting"}
              />

              {state === "error" && (
                <p className="mt-2 text-xs text-[#B96E5C]">
                  Something went wrong. Please try again.
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {state !== "success" && state !== "warning" && (
          <div className="flex justify-end border-t border-[#E8E4DE]/60 px-6 py-4">
            <button
              onClick={handleSubmit}
              disabled={!message.trim() || state === "submitting"}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all duration-200",
                message.trim() && state !== "submitting"
                  ? "bg-[#1A1B23] text-white hover:bg-[#2A2B33] shadow-sm"
                  : "cursor-not-allowed bg-[#E8E4DE]/40 text-[#1A1A1A]/20"
              )}
            >
              <Send className="h-3.5 w-3.5" />
              {state === "submitting" ? "Sending..." : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
