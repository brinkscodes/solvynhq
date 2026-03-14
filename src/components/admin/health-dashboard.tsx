"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Globe,
  Lock,
  Server,
  HardDrive,
  Shield,
  FileText,
  Users,
  Layers,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime?: number;
  details?: Record<string, string | number | boolean | null> | null;
}

interface DbStats {
  tasks: number;
  notes: number;
  users: number;
  sections: number;
}

interface HealthData {
  checks: HealthCheck[];
  dbStats: DbStats;
  timestamp: string;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    label: "Healthy",
  },
  degraded: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    label: "Degraded",
  },
  down: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    label: "Down",
  },
};

const checkIcons: Record<string, React.ComponentType<{ className?: string }>> =
  {
    "Supabase Database": Database,
    "Supabase Auth": Shield,
    "Supabase Storage": HardDrive,
    "solvynskin.com": Globe,
    "SSL Certificate": Lock,
    "SolvynHQ (Vercel)": Server,
  };

function OverallStatus({ checks }: { checks: HealthCheck[] }) {
  const hasDown = checks.some((c) => c.status === "down");
  const hasDegraded = checks.some((c) => c.status === "degraded");
  const overall = hasDown ? "down" : hasDegraded ? "degraded" : "healthy";
  const config = statusConfig[overall];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-5 py-4",
        config.border,
        config.bg
      )}
    >
      <Icon className={cn("h-6 w-6", config.color)} />
      <div>
        <p className="text-sm font-semibold text-[var(--solvyn-text-primary)]">
          {overall === "healthy"
            ? "All Systems Operational"
            : overall === "degraded"
              ? "Some Services Degraded"
              : "Service Disruption Detected"}
        </p>
        <p className="text-xs text-[var(--solvyn-text-tertiary)]">
          {checks.filter((c) => c.status === "healthy").length}/{checks.length}{" "}
          checks passing
        </p>
      </div>
    </div>
  );
}

function CheckRow({ check }: { check: HealthCheck }) {
  const config = statusConfig[check.status];
  const StatusIcon = config.icon;
  const ServiceIcon = checkIcons[check.name] || Server;

  return (
    <div className="flex items-center justify-between border-b border-[var(--solvyn-border-subtle)] px-5 py-3.5 last:border-b-0">
      <div className="flex items-center gap-3">
        <ServiceIcon className="h-4 w-4 text-[var(--solvyn-text-tertiary)]" />
        <span className="text-[13px] font-medium text-[var(--solvyn-text-primary)]">
          {check.name}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {check.responseTime !== undefined && (
          <span className="text-[12px] tabular-nums text-[var(--solvyn-text-tertiary)]">
            {check.responseTime}ms
          </span>
        )}
        {check.details &&
          Object.entries(check.details).map(([key, val]) => {
            if (key === "error" || val === null) return null;
            if (key === "daysRemaining") {
              return (
                <span
                  key={key}
                  className="text-[12px] text-[var(--solvyn-text-tertiary)]"
                >
                  {val} days left
                </span>
              );
            }
            if (key === "httpStatus") {
              return (
                <span
                  key={key}
                  className="rounded bg-[var(--solvyn-bg-elevated)] px-1.5 py-0.5 text-[11px] tabular-nums text-[var(--solvyn-text-tertiary)]"
                >
                  HTTP {val}
                </span>
              );
            }
            if (key === "issuer") {
              return (
                <span
                  key={key}
                  className="text-[12px] text-[var(--solvyn-text-tertiary)]"
                >
                  {String(val)}
                </span>
              );
            }
            return null;
          })}
        <div className={cn("flex items-center gap-1.5", config.color)}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span className="text-[12px] font-medium">{config.label}</span>
        </div>
      </div>
    </div>
  );
}

function DbStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)] px-5 py-4">
      <div className="flex items-center gap-2 text-[var(--solvyn-text-tertiary)]">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1.5 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--solvyn-text-primary)]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export function HealthDashboard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const r = await fetch("/api/admin/health");
      if (r.status === 403) throw new Error("Unauthorized");
      if (!r.ok) throw new Error("Failed to fetch");
      const json = await r.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--solvyn-text-tertiary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--solvyn-border-default)] py-16">
        <ShieldAlert className="mb-3 h-8 w-8 text-[var(--solvyn-rust)]" />
        <p className="text-sm font-medium text-[var(--solvyn-text-primary)]">
          {error === "Unauthorized"
            ? "Admin access only"
            : "Something went wrong"}
        </p>
        <p className="mt-1 text-xs text-[var(--solvyn-text-tertiary)]">
          {error === "Unauthorized"
            ? "This page is restricted to the admin account."
            : error}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const solvynHQChecks = data.checks.filter(
    (c) =>
      c.name.startsWith("Supabase") || c.name.startsWith("SolvynHQ")
  );
  const websiteChecks = data.checks.filter(
    (c) =>
      c.name === "solvynskin.com" || c.name === "SSL Certificate"
  );

  return (
    <div className="space-y-8">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--solvyn-text-tertiary)]">
            Last checked{" "}
            {new Date(data.timestamp).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        <button
          onClick={() => fetchHealth(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-full border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-raised)] px-4 py-2 text-sm font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] hover:text-[var(--solvyn-text-primary)] disabled:opacity-50"
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
          />
          {refreshing ? "Checking..." : "Refresh"}
        </button>
      </div>

      {/* Overall status */}
      <OverallStatus checks={data.checks} />

      {/* SolvynHQ section */}
      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
          SolvynHQ Dashboard
        </h3>
        <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]">
          {solvynHQChecks.map((check) => (
            <CheckRow key={check.name} check={check} />
          ))}
        </div>
      </div>

      {/* solvynskin.com section */}
      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
          solvynskin.com Website
        </h3>
        <div className="overflow-hidden rounded-2xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-raised)]">
          {websiteChecks.map((check) => (
            <CheckRow key={check.name} check={check} />
          ))}
        </div>
      </div>

      {/* Database stats */}
      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--solvyn-text-tertiary)]">
          Database Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DbStatCard label="Tasks" value={data.dbStats.tasks} icon={ListChecks} />
          <DbStatCard label="Notes" value={data.dbStats.notes} icon={FileText} />
          <DbStatCard label="Users" value={data.dbStats.users} icon={Users} />
          <DbStatCard label="Sections" value={data.dbStats.sections} icon={Layers} />
        </div>
      </div>
    </div>
  );
}
