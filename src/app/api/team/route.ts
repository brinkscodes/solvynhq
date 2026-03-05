import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

// GET: List team members + invites
export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const [membersRes, invitesRes] = await Promise.all([
      supabase
        .from("project_members")
        .select("id, user_id, role, joined_at, profiles!inner(full_name, email, avatar_url)")
        .eq("project_id", projectId)
        .order("joined_at"),
      supabase
        .from("project_invites")
        .select("id, invite_code, email, role, invited_by, expires_at, accepted_at, created_at")
        .eq("project_id", projectId)
        .is("accepted_at", null)
        .order("created_at", { ascending: false }),
    ]);

    if (membersRes.error) throw membersRes.error;
    if (invitesRes.error) throw invitesRes.error;

    const members = membersRes.data.map((m: any) => ({
      id: m.id,
      userId: m.user_id,
      fullName: m.profiles.full_name || "Unknown",
      email: m.profiles.email || "",
      avatarUrl: m.profiles.avatar_url,
      role: m.role,
      joinedAt: m.joined_at,
    }));

    // Resolve inviter names
    const inviterIds = [...new Set(invitesRes.data.map((i: any) => i.invited_by))];
    let inviterMap: Record<string, string> = {};
    if (inviterIds.length > 0) {
      const { data: profiles } = await supabase
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
    return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
  }
}

// POST: Create invite
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Check caller is owner or admin
    const { data: membership } = await supabase
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

    const { data: invite, error } = await supabase
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
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
}
