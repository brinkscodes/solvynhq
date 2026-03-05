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
  Megaphone,
  LogOut,
  Calendar,
  CheckSquare,
  Menu,
  X,
  Command,
  User,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedbackModal } from "./feedback-modal";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/shared/theme-provider";

const viewItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-tasks", label: "My Tasks", icon: CheckSquare },
];

const toolItems = [
  { href: "/content", label: "Content", icon: FileText },
  { href: "/product-context", label: "Marketing", icon: Crosshair },
  { href: "/seo", label: "SEO Research", icon: Search },
  { href: "/meetings", label: "Meetings", icon: Calendar },
  { href: "/team", label: "Team", icon: Users },
  { href: "/changelog", label: "Patch Notes", icon: Megaphone },
];

type UserProfile = {
  full_name: string | null;
  avatar_url: string | null;
};

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
        isActive
          ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)]"
          : "text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-bg-elevated)]/50 hover:text-[var(--solvyn-text-secondary)]"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-[var(--solvyn-olive)]" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-[var(--solvyn-olive)]" : "text-[var(--solvyn-text-tertiary)] group-hover:text-[var(--solvyn-text-secondary)]"
        )}
      />
      {label}
    </Link>
  );
}

export function Sidebar({ onCommandPalette }: { onCommandPalette?: () => void }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

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
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)] shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[232px] flex-col border-r border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-sidebar-bg)] transition-transform duration-300",
          "lg:z-40 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-primary)] lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Workspace header */}
        <div className="flex flex-col items-center px-4 pt-6 pb-4">
          <img
            src="/solvyn-logo.png"
            alt="Solvyn"
            className={cn(
              "h-14 w-auto opacity-90",
              theme === "dark" && "brightness-0 invert"
            )}
          />
          <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--solvyn-text-tertiary)]">
            Project HQ
          </p>
        </div>

        {/* Search trigger */}
        <div className="px-3 pb-4">
          <button
            onClick={onCommandPalette}
            className="flex w-full items-center gap-2 rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-[12px] text-[var(--solvyn-text-tertiary)] transition-colors hover:border-[var(--solvyn-border-default)] hover:text-[var(--solvyn-text-secondary)]"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="flex items-center gap-0.5 rounded bg-[var(--solvyn-bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--solvyn-text-tertiary)]">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
        </div>

        <div className="mx-3 h-px bg-[var(--solvyn-border-subtle)]" />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 pt-4">
          {/* Views section */}
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--solvyn-text-tertiary)]">
            Views
          </p>
          <div className="flex flex-col gap-0.5">
            {viewItems.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </div>

          {/* Tools section */}
          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--solvyn-text-tertiary)]">
            Tools
          </p>
          <div className="flex flex-col gap-0.5">
            {toolItems.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="mx-3 h-px bg-[var(--solvyn-border-subtle)]" />
        <div className="flex flex-col gap-0.5 px-3 py-3">
          <Link
            href="/profile"
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
              pathname === "/profile"
                ? "bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-primary)]"
                : "text-[var(--solvyn-text-tertiary)] hover:bg-[var(--solvyn-bg-elevated)]/50 hover:text-[var(--solvyn-text-secondary)]"
            )}
          >
            <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-[var(--solvyn-olive)]/20">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[8px] font-semibold text-[var(--solvyn-olive)]">
                  {userProfile?.full_name
                    ? userProfile.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
                    : <User className="h-3 w-3" />}
                </span>
              )}
            </div>
            Profile
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--solvyn-text-tertiary)] transition-all duration-150 hover:bg-[var(--solvyn-bg-elevated)]/50 hover:text-[var(--solvyn-text-secondary)]"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 shrink-0" />
            ) : (
              <Moon className="h-4 w-4 shrink-0" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--solvyn-text-tertiary)] transition-all duration-150 hover:bg-[var(--solvyn-bg-elevated)]/50 hover:text-[var(--solvyn-text-secondary)]"
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            Feedback
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--solvyn-text-tertiary)] transition-all duration-150 hover:bg-[var(--solvyn-bg-elevated)]/50 hover:text-[var(--solvyn-rust)]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}
