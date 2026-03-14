import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import * as tls from "tls";

const ADMIN_EMAIL = "sunticodes@gmail.com";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime?: number;
  details?: Record<string, string | number | boolean | null> | null;
}

function checkSSL(hostname: string): Promise<{
  valid: boolean;
  issuer: string;
  expiresAt: string;
  daysRemaining: number;
}> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, hostname, { servername: hostname }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();

      if (!cert || !cert.valid_to) {
        return reject(new Error("No certificate found"));
      }

      const expiresAt = new Date(cert.valid_to);
      const daysRemaining = Math.floor(
        (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      resolve({
        valid: daysRemaining > 0,
        issuer: String(cert.issuer?.O || cert.issuer?.CN || "Unknown"),
        expiresAt: expiresAt.toISOString(),
        daysRemaining,
      });
    });

    socket.setTimeout(5000, () => {
      socket.destroy();
      reject(new Error("SSL check timed out"));
    });

    socket.on("error", reject);
  });
}

async function timedFetch(
  url: string,
  timeout = 10000
): Promise<{ status: number; time: number }> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
    });
    return { status: res.status, time: Date.now() - start };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admin = createAdminClient();
    const checks: HealthCheck[] = [];

    // --- SolvynHQ Checks ---

    // 1. Supabase Database
    const dbStart = Date.now();
    try {
      const { error } = await admin
        .from("profiles")
        .select("*", { count: "exact", head: true });
      const dbTime = Date.now() - dbStart;
      checks.push({
        name: "Supabase Database",
        status: error ? "down" : dbTime > 3000 ? "degraded" : "healthy",
        responseTime: dbTime,
        details: error ? { error: error.message } : null,
      });
    } catch {
      checks.push({
        name: "Supabase Database",
        status: "down",
        responseTime: Date.now() - dbStart,
      });
    }

    // 2. Supabase Auth
    const authStart = Date.now();
    try {
      const { error } = await admin.auth.admin.listUsers({ perPage: 1 });
      const authTime = Date.now() - authStart;
      checks.push({
        name: "Supabase Auth",
        status: error ? "down" : authTime > 3000 ? "degraded" : "healthy",
        responseTime: authTime,
        details: error ? { error: error.message } : null,
      });
    } catch {
      checks.push({
        name: "Supabase Auth",
        status: "down",
        responseTime: Date.now() - authStart,
      });
    }

    // 3. Supabase Storage
    const storageStart = Date.now();
    try {
      const { error } = await admin.storage.listBuckets();
      const storageTime = Date.now() - storageStart;
      checks.push({
        name: "Supabase Storage",
        status: error ? "down" : storageTime > 3000 ? "degraded" : "healthy",
        responseTime: storageTime,
        details: error ? { error: error.message } : null,
      });
    } catch {
      checks.push({
        name: "Supabase Storage",
        status: "down",
        responseTime: Date.now() - storageStart,
      });
    }

    // 4. Database stats
    const [
      { count: taskCount },
      { count: noteCount },
      { count: profileCount },
      { count: sectionCount },
    ] = await Promise.all([
      admin.from("tasks").select("*", { count: "exact", head: true }),
      admin.from("notes").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("sections").select("*", { count: "exact", head: true }),
    ]);

    // --- solvynskin.com Checks ---

    // 5. Website HTTP
    try {
      const { status, time } = await timedFetch("https://solvynskin.com");
      checks.push({
        name: "solvynskin.com",
        status:
          status >= 200 && status < 400
            ? time > 5000
              ? "degraded"
              : "healthy"
            : "down",
        responseTime: time,
        details: { httpStatus: status },
      });
    } catch {
      checks.push({
        name: "solvynskin.com",
        status: "down",
        details: { error: "Could not reach site" },
      });
    }

    // 6. Website SSL
    try {
      const ssl = await checkSSL("solvynskin.com");
      checks.push({
        name: "SSL Certificate",
        status: !ssl.valid
          ? "down"
          : ssl.daysRemaining < 14
            ? "degraded"
            : "healthy",
        details: {
          issuer: ssl.issuer,
          expiresAt: ssl.expiresAt,
          daysRemaining: ssl.daysRemaining,
          valid: ssl.valid,
        },
      });
    } catch {
      checks.push({
        name: "SSL Certificate",
        status: "down",
        details: { error: "Could not check SSL" },
      });
    }

    // 7. SolvynHQ production
    try {
      const { status, time } = await timedFetch(
        "https://solvynhq.vercel.app/login"
      );
      checks.push({
        name: "SolvynHQ (Vercel)",
        status:
          status >= 200 && status < 400
            ? time > 5000
              ? "degraded"
              : "healthy"
            : "down",
        responseTime: time,
        details: { httpStatus: status },
      });
    } catch {
      checks.push({
        name: "SolvynHQ (Vercel)",
        status: "down",
        details: { error: "Could not reach site" },
      });
    }

    return NextResponse.json({
      checks,
      dbStats: {
        tasks: taskCount ?? 0,
        notes: noteCount ?? 0,
        users: profileCount ?? 0,
        sections: sectionCount ?? 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GET /api/admin/health error:", err);
    return NextResponse.json(
      { error: "Failed to run health checks" },
      { status: 500 }
    );
  }
}
