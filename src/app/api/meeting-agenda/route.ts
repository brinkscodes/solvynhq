import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

// GET: List all agenda items for the project
export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    // Try with image_url first; fall back without it if column doesn't exist yet
    let items: any[];
    const { data, error } = await supabase
      .from("meeting_agenda_items")
      .select("id, user_id, type, content, completed, created_at, image_url")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error && error.code === "42703") {
      // image_url column doesn't exist yet — query without it
      const fallback = await supabase
        .from("meeting_agenda_items")
        .select("id, user_id, type, content, completed, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (fallback.error) throw fallback.error;
      items = fallback.data;
    } else if (error) {
      throw error;
    } else {
      items = data;
    }

    // Resolve profiles
    const userIds = [...new Set(items.map((i: any) => i.user_id))];
    let profileMap: Record<string, { fullName: string; avatarUrl: string | null }> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);
      if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map((p: any) => [p.id, { fullName: p.full_name || "Unknown", avatarUrl: p.avatar_url }])
        );
      }
    }

    const result = items.map((i: any) => ({
      id: i.id,
      userId: i.user_id,
      fullName: profileMap[i.user_id]?.fullName || "Unknown",
      avatarUrl: profileMap[i.user_id]?.avatarUrl || null,
      type: i.type,
      content: i.content,
      completed: i.completed,
      createdAt: i.created_at,
      imageUrl: i.image_url || null,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/meeting-agenda error:", err);
    return NextResponse.json({ error: "Failed to load agenda items" }, { status: 500 });
  }
}

// POST: Create an agenda item
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { type, content, imageUrl } = body as { type: string; content: string; imageUrl?: string };

    if (!content?.trim()) {
      return NextResponse.json({ error: "content required" }, { status: 400 });
    }

    const validTypes = ["note", "question", "action"];
    const itemType = validTypes.includes(type) ? type : "note";

    const insertData: Record<string, unknown> = {
      project_id: projectId,
      user_id: user.id,
      type: itemType,
      content: content.trim(),
    };
    if (imageUrl) insertData.image_url = imageUrl;

    let item: any;
    const { data, error } = await supabase
      .from("meeting_agenda_items")
      .insert(insertData)
      .select("id, user_id, type, content, completed, created_at, image_url")
      .single();

    if (error && error.code === "42703") {
      // image_url column doesn't exist yet — insert without it
      const fallback = await supabase
        .from("meeting_agenda_items")
        .insert({ project_id: projectId, user_id: user.id, type: itemType, content: content.trim() })
        .select("id, user_id, type, content, completed, created_at")
        .single();
      if (fallback.error) throw fallback.error;
      item = fallback.data;
    } else if (error) {
      throw error;
    } else {
      item = data;
    }

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      id: item.id,
      userId: item.user_id,
      fullName: profile?.full_name || "Unknown",
      avatarUrl: profile?.avatar_url || null,
      type: item.type,
      content: item.content,
      completed: item.completed,
      createdAt: item.created_at,
      imageUrl: item.image_url || null,
    });
  } catch (err) {
    console.error("POST /api/meeting-agenda error:", err);
    return NextResponse.json({ error: "Failed to create agenda item" }, { status: 500 });
  }
}

// PATCH: Toggle completed or update content (own items only)
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { id, completed, content } = body as { id: string; completed?: boolean; content?: string };

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updates: Record<string, any> = {};
    if (typeof completed === "boolean") updates.completed = completed;
    if (typeof content === "string" && content.trim()) updates.content = content.trim();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const { error } = await supabase
      .from("meeting_agenda_items")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/meeting-agenda error:", err);
    return NextResponse.json({ error: "Failed to update agenda item" }, { status: 500 });
  }
}

// DELETE: Remove own agenda item
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const { error } = await supabase
      .from("meeting_agenda_items")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/meeting-agenda error:", err);
    return NextResponse.json({ error: "Failed to delete agenda item" }, { status: 500 });
  }
}
