"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Search,
  MessageSquare,
  Crosshair,
  LayoutDashboard,
  LogOut,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedbackModal } from "./feedback-modal";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/product-context", label: "Marketing", icon: Crosshair },
  { href: "/seo", label: "SEO Research", icon: Search },
  { href: "/meetings", label: "Meetings", icon: Calendar },
];

export function Sidebar() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[232px] flex-col bg-[#1A1B23]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-7 pb-2">
        <img
          src="/solvyn-logo.png"
          alt="Solvyn"
          className="w-24 brightness-0 invert"
        />
      </div>
      <p className="px-6 pb-6 text-[11px] font-medium uppercase tracking-[0.15em] text-white/25">
        Project HQ
      </p>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/[0.06]" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#6C7B5A]" />
              )}
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive ? "text-[#9CAF88]" : "text-white/30 group-hover:text-white/50"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mx-5 h-px bg-white/[0.06]" />
      <div className="flex flex-col gap-1 px-3 py-4">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium text-white/40 transition-all duration-200 hover:bg-white/[0.04] hover:text-white/70"
        >
          <MessageSquare className="h-[18px] w-[18px] shrink-0 text-white/30" />
          Feedback
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium text-white/40 transition-all duration-200 hover:bg-white/[0.04] hover:text-white/70"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0 text-white/30" />
          Log out
        </button>
      </div>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </aside>
  );
}
