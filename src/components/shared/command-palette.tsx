"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Crosshair,
  Search,
  Calendar,
  User,
  Plus,
  StickyNote,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const pages = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Tasks", href: "/my-tasks", icon: CheckSquare },
  { name: "Content", href: "/content", icon: FileText },
  { name: "Marketing", href: "/product-context", icon: Crosshair },
  { name: "SEO Research", href: "/seo", icon: Search },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions..." className="text-[var(--solvyn-text-primary)]" />
      <CommandList>
        <CommandEmpty className="text-[var(--solvyn-text-tertiary)]">No results found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              onSelect={() => navigate(page.href)}
              className="gap-3"
            >
              <page.icon className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { setOpen(false); router.push("/my-tasks"); }} className="gap-3">
            <Plus className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
            <span>Add new task</span>
          </CommandItem>
          <CommandItem onSelect={() => setOpen(false)} className="gap-3">
            <StickyNote className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
            <span>Open notepad</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Export a hook for opening the palette from anywhere
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  return { open, setOpen, toggle: () => setOpen((o) => !o) };
}
