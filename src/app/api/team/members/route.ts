import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProjectId } from "@/lib/supabase/get-project";

// PATCH: Update member role
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const admin = createAdminClient();

    // Check caller is owner or admin
    const { data: callerMembership } = await admin
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!callerMembership || callerMembership.role === "member") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await req.json();
    const { memberId, role } = body as { memberId: string; role: string };

    // Prevent changing owner role
    const { data: targetMember } = await admin
      .from("project_members")
      .select("role")
      .eq("id", memberId)
      .eq("project_id", projectId)
      .single();

    if (!targetMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (targetMember.role === "owner") {
      return NextResponse.json({ error: "Cannot change owner role" }, { status: 403 });
    }

    // Only owner can promote to admin
    if (role === "admin" && callerMembership.role !== "owner") {
      return NextResponse.json({ error: "Only owners can promote to admin" }, { status: 403 });
    }

    const { error } = await admin
      .from("project_members")
      .update({ role })
      .eq("id", memberId)
      .eq("project_id", projectId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/team/members error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE: Remove member
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");
    if (!memberId) return NextResponse.json({ error: "memberId required" }, { status: 400 });

    const admin = createAdminClient();

    // Check caller is owner or admin
    const { data: callerMembership } = await admin
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!callerMembership || callerMembership.role === "member") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Prevent removing owner
    const { data: targetMember } = await admin
      .from("project_members")
      .select("role, user_id")
      .eq("id", memberId)
      .eq("project_id", projectId)
      .single();

    if (!targetMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (targetMember.role === "owner") {
      return NextResponse.json({ error: "Cannot remove the project owner" }, { status: 403 });
    }

    // Admins can only remove members, not other admins (only owners can)
    if (targetMember.role === "admin" && callerMembership.role !== "owner") {
      return NextResponse.json({ error: "Only owners can remove admins" }, { status: 403 });
    }

    const { error } = await admin
      .from("project_members")
      .delete()
      .eq("id", memberId)
      .eq("project_id", projectId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/team/members error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
