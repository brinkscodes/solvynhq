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
        className="absolute inset-0 bg-[#2A2A2A]/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-xl border border-[#EAE4D9] bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE4D9]/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#6C7B5A]" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2A2A2A]">
              Send Feedback
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[#F7F5F0]"
          >
            <X className="h-4 w-4 text-[#2A2A2A]/40" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {state === "success" ? (
            <div className="flex flex-col items-center gap-2 py-6">
              <CheckCircle className="h-8 w-8 text-[#6C7B5A]" />
              <p className="text-sm font-medium text-[#2A2A2A]">
                Feedback sent!
              </p>
              <p className="text-xs text-[#2A2A2A]/40">
                Thanks for your message.
              </p>
            </div>
          ) : state === "warning" ? (
            <div className="flex flex-col items-center gap-2 py-6">
              <AlertTriangle className="h-8 w-8 text-[#B96E5C]" />
              <p className="text-sm font-medium text-[#2A2A2A]">
                Feedback saved
              </p>
              <p className="text-xs text-[#2A2A2A]/40">
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
                className="h-32 w-full resize-none rounded-lg border border-[#EAE4D9] bg-[#F7F5F0]/50 px-4 py-3 text-sm leading-relaxed text-[#2A2A2A] placeholder-[#2A2A2A]/25 outline-none transition-colors focus:border-[#6C7B5A]/40 focus:bg-white"
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
          <div className="flex justify-end border-t border-[#EAE4D9]/60 px-5 py-3">
            <button
              onClick={handleSubmit}
              disabled={!message.trim() || state === "submitting"}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                message.trim() && state !== "submitting"
                  ? "bg-[#6C7B5A] text-white hover:bg-[#5a6a4a]"
                  : "cursor-not-allowed bg-[#EAE4D9]/50 text-[#2A2A2A]/30"
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
