import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "sunticodes@gmail.com";

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

    // Fetch all auth users
    const { data: authData, error: authError } =
      await admin.auth.admin.listUsers({ perPage: 1000 });

    if (authError) throw authError;

    // Fetch all profiles
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name, email, avatar_url, created_at, last_seen_at");

    // Fetch all project memberships with project info
    const { data: memberships } = await admin
      .from("project_members")
      .select("user_id, role, project_id, joined_at, projects(name)");

    // Fetch task counts per project
    const { data: taskCounts } = await admin
      .from("tasks")
      .select("project_id, status");

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    const membershipMap = new Map<string, typeof memberships>();
    for (const m of memberships ?? []) {
      if (!membershipMap.has(m.user_id)) membershipMap.set(m.user_id, []);
      membershipMap.get(m.user_id)!.push(m);
    }

    // Aggregate task stats per project
    const projectTaskStats = new Map<
      string,
      { total: number; done: number }
    >();
    for (const t of taskCounts ?? []) {
      if (!projectTaskStats.has(t.project_id)) {
        projectTaskStats.set(t.project_id, { total: 0, done: 0 });
      }
      const stats = projectTaskStats.get(t.project_id)!;
      stats.total++;
      if (t.status === "done") stats.done++;
    }

    const users = authData.users.map((authUser) => {
      const profile = profileMap.get(authUser.id);
      const userMemberships = membershipMap.get(authUser.id) ?? [];

      return {
        id: authUser.id,
        email: authUser.email ?? "",
        fullName: profile?.full_name ?? "",
        avatarUrl: profile?.avatar_url ?? null,
        createdAt: authUser.created_at,
        lastSeenAt: profile?.last_seen_at ?? null,
        lastSignInAt: authUser.last_sign_in_at ?? null,
        provider: authUser.app_metadata?.provider ?? "email",
        projects: userMemberships.map((m) => ({
          id: m.project_id,
          name: (m.projects as unknown as { name: string } | null)?.name ?? "Unknown",
          role: m.role,
          joinedAt: m.joined_at,
          taskStats: projectTaskStats.get(m.project_id) ?? {
            total: 0,
            done: 0,
          },
        })),
      };
    });

    // Sort by most recently active first
    users.sort((a, b) => {
      const aTime = a.lastSeenAt ?? a.lastSignInAt ?? "";
      const bTime = b.lastSeenAt ?? b.lastSignInAt ?? "";
      return bTime.localeCompare(aTime);
    });

    return NextResponse.json({
      users,
      totalUsers: users.length,
    });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
