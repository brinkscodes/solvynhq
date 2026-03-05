import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: Accept invite by code
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { code } = body as { code: string };

    if (!code) return NextResponse.json({ error: "Invite code required" }, { status: 400 });

    // Find the invite
    const { data: invite, error: inviteError } = await supabase
      .from("project_invites")
      .select("id, project_id, email, role, expires_at, accepted_at")
      .eq("invite_code", code)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }

    if (invite.accepted_at) {
      return NextResponse.json({ error: "This invite has already been used" }, { status: 400 });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: "This invite has expired" }, { status: 400 });
    }

    // If email-specific invite, verify email matches
    if (invite.email && invite.email.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json({ error: "This invite was sent to a different email" }, { status: 403 });
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", invite.project_id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "You are already a member of this project" }, { status: 400 });
    }

    // Add as member
    const { error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: invite.project_id,
        user_id: user.id,
        role: invite.role,
        invited_by: user.id,
      });

    if (memberError) throw memberError;

    // Mark invite as accepted
    await supabase
      .from("project_invites")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invite.id);

    return NextResponse.json({ success: true, projectId: invite.project_id });
  } catch (err) {
    console.error("POST /api/team/join error:", err);
    return NextResponse.json({ error: "Failed to join project" }, { status: 500 });
  }
}
