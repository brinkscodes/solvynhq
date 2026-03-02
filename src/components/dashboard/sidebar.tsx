"use client";

import { useState, useEffect } from "react";
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
  Menu,
  X,
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

type UserProfile = {
  full_name: string | null;
  avatar_url: string | null;
};

export function Sidebar() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.full_name !== undefined) {
          setUserProfile({ full_name: data.full_name, avatar_url: data.avatar_url });
        }
      })
      .catch(() => {});
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1B23] text-white shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[232px] flex-col bg-[#1A1B23] transition-transform duration-300",
          "lg:z-40 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

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
          {/* User profile link */}
          <Link
            href="/profile"
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-200",
              pathname === "/profile"
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
            )}
          >
            <div className="relative h-[18px] w-[18px] shrink-0 overflow-hidden rounded-full bg-[#6C7B5A]">
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[8px] font-semibold text-white">
                  {userProfile?.full_name
                    ? userProfile.full_name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "?"}
                </span>
              )}
            </div>
            Profile
          </Link>
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
    </>
  );
}
