import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProjectId } from "@/lib/supabase/get-project";

// POST — Elementor webhook (public, authenticated via secret key)
export async function POST(req: NextRequest) {
  // Validate webhook secret
  const secret = req.nextUrl.searchParams.get("key");
  const expectedSecret = process.env.FORM_WEBHOOK_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = {};
      formData.forEach((value, key) => {
        body[key] = typeof value === "string" ? value : String(value);
      });
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      body = Object.fromEntries(params.entries());
    } else if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      // Try JSON first, fall back to form-urlencoded
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch {
        const params = new URLSearchParams(text);
        body = Object.fromEntries(params.entries());
      }
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Extract form name from Elementor data or fallback
  const formName =
    (body.form_name as string) ||
    (body.form_id as string) ||
    "Unknown Form";

  // Store raw fields and meta separately
  const fields = body.fields || body;
  const meta = body.meta || {};

  // Use admin client to bypass RLS
  const admin = createAdminClient();

  // Get the first project (main project)
  const { data: project } = await admin
    .from("projects")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (!project) {
    return NextResponse.json({ error: "No project found" }, { status: 500 });
  }

  const { error } = await admin.from("form_submissions").insert({
    project_id: project.id,
    form_name: formName,
    fields,
    meta,
  });

  if (error) {
    console.error("Failed to save form submission:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// GET — Fetch submissions for the dashboard (authenticated)
export async function GET() {
  const supabase = await createClient();
  const projectId = await getProjectId();

  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const submissions = (data || []).map((row) => ({
    id: row.id,
    formName: row.form_name,
    fields: row.fields,
    meta: row.meta,
    status: row.status,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ submissions });
}

// DELETE — Delete a submission (authenticated)
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const projectId = await getProjectId();
  const body = await req.json();
  const { id } = body as { id: string };

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("form_submissions")
    .delete()
    .eq("id", id)
    .eq("project_id", projectId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PATCH — Update submission status (authenticated)
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const projectId = await getProjectId();
  const body = await req.json();
  const { id, status } = body as { id: string; status: string };

  if (!id || !["new", "read", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabase
    .from("form_submissions")
    .update({ status })
    .eq("id", id)
    .eq("project_id", projectId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
