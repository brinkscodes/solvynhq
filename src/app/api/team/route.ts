import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProjectId } from "@/lib/supabase/get-project";

// GET: List team members + invites
export async function GET() {
  try {
    const projectId = await getProjectId();
    const admin = createAdminClient();

    const [membersRes, invitesRes] = await Promise.all([
      admin
        .from("project_members")
        .select("id, user_id, role, joined_at")
        .eq("project_id", projectId)
        .order("joined_at"),
      admin
        .from("project_invites")
        .select("id, invite_code, email, role, invited_by, expires_at, accepted_at, created_at")
        .eq("project_id", projectId)
        .is("accepted_at", null)
        .order("created_at", { ascending: false }),
    ]);

    if (membersRes.error) throw membersRes.error;
    if (invitesRes.error) throw invitesRes.error;

    // Fetch profiles separately to avoid FK join issues
    const userIds = membersRes.data.map((m: any) => m.user_id);
    let profileMap: Record<string, { full_name: string; email: string; avatar_url: string | null }> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", userIds);
      if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map((p: any) => [p.id, { full_name: p.full_name, email: p.email, avatar_url: p.avatar_url }])
        );
      }
    }

    const members = membersRes.data.map((m: any) => {
      const profile = profileMap[m.user_id];
      return {
        id: m.id,
        userId: m.user_id,
        fullName: profile?.full_name || "Unknown",
        email: profile?.email || "",
        avatarUrl: profile?.avatar_url || null,
        role: m.role,
        joinedAt: m.joined_at,
      };
    });

    // Resolve inviter names
    const inviterIds = [...new Set(invitesRes.data.map((i: any) => i.invited_by))];
    let inviterMap: Record<string, string> = {};
    if (inviterIds.length > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name")
        .in("id", inviterIds);
      if (profiles) {
        inviterMap = Object.fromEntries(profiles.map((p: any) => [p.id, p.full_name || "Unknown"]));
      }
    }

    const invites = invitesRes.data.map((i: any) => ({
      id: i.id,
      inviteCode: i.invite_code,
      email: i.email,
      role: i.role,
      invitedBy: i.invited_by,
      invitedByName: inviterMap[i.invited_by] || "Unknown",
      expiresAt: i.expires_at,
      acceptedAt: i.accepted_at,
      createdAt: i.created_at,
    }));

    return NextResponse.json({ members, invites });
  } catch (err) {
    console.error("GET /api/team error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST: Create invite
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const admin = createAdminClient();

    // Check caller is owner or admin
    const { data: membership } = await admin
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!membership || membership.role === "member") {
      return NextResponse.json({ error: "Only owners and admins can invite" }, { status: 403 });
    }

    const body = await req.json();
    const { email, role } = body as { email?: string; role: "admin" | "member" };

    const { data: invite, error } = await admin
      .from("project_invites")
      .insert({
        project_id: projectId,
        email: email || null,
        invited_by: user.id,
        role: role || "member",
      })
      .select("id, invite_code, email, role, expires_at, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: invite.id,
      inviteCode: invite.invite_code,
      email: invite.email,
      role: invite.role,
      invitedBy: user.id,
      invitedByName: "You",
      expiresAt: invite.expires_at,
      acceptedAt: null,
      createdAt: invite.created_at,
    });
  } catch (err) {
    console.error("POST /api/team error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
