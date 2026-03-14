import { NextRequest, NextResponse } from "next/server";
import { getProjectId } from "@/lib/supabase/get-project";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const projectId = await getProjectId();
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("credentials")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ credentials: data || [] });
  } catch (err) {
    console.error("GET /api/credentials error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service_name, username, password, url, notes } = body;

    if (!service_name || typeof service_name !== "string") {
      return NextResponse.json({ error: "service_name is required" }, { status: 400 });
    }
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "username is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "password is required" }, { status: 400 });
    }

    const projectId = await getProjectId();
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("credentials")
      .insert({
        project_id: projectId,
        service_name: service_name.trim(),
        username: username.trim(),
        password: password.trim(),
        url: (url || "").trim(),
        notes: (notes || "").trim(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ credential: data });
  } catch (err) {
    console.error("POST /api/credentials error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await getProjectId(); // auth check
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("credentials")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ credential: data });
  } catch (err) {
    console.error("PATCH /api/credentials error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await getProjectId(); // auth check
    const admin = createAdminClient();

    const { error } = await admin
      .from("credentials")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/credentials error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
