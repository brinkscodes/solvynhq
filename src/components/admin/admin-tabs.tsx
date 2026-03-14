"use client";

import { useState } from "react";
import { HeartPulse, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPanel } from "./admin-panel";
import { HealthDashboard } from "./health-dashboard";

const tabs = [
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "users", label: "Users", icon: Users },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("health");

  return (
    <div>
      {/* Tab switcher */}
      <div className="mb-8 flex gap-1 rounded-lg bg-[var(--solvyn-border-subtle)]/60 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-[var(--solvyn-bg-raised)] text-[var(--solvyn-text-primary)] shadow-sm"
                  : "text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "health" && <HealthDashboard />}
      {activeTab === "users" && <AdminPanel />}
    </div>
  );
}
