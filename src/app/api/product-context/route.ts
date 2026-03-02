import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function GET() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const { data, error } = await supabase
      .from("product_context")
      .select("data, updated_at")
      .eq("project_id", projectId)
      .single();

    if (error && error.code === "PGRST116") {
      // No row yet — return empty with lastUpdated
      return NextResponse.json({ lastUpdated: new Date().toISOString() });
    }
    if (error) throw error;

    // Return the JSONB data with lastUpdated mapped from updated_at
    return NextResponse.json({
      ...data.data,
      lastUpdated: data.updated_at,
    });
  } catch (err) {
    console.error("GET /api/product-context error:", err);
    return NextResponse.json({ error: "Failed to load context" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const updates = await req.json();
    const supabase = await createClient();
    const projectId = await getProjectId();

    // Strip lastUpdated from the data — we use updated_at column instead
    const { lastUpdated: _, ...contextData } = updates;

    // Fetch existing data to merge
    const { data: existing } = await supabase
      .from("product_context")
      .select("data")
      .eq("project_id", projectId)
      .single();

    const mergedData = { ...(existing?.data || {}), ...contextData };

    const { error } = await supabase
      .from("product_context")
      .upsert(
        {
          project_id: projectId,
          data: mergedData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "project_id" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/product-context error:", err);
    return NextResponse.json({ error: "Failed to save context" }, { status: 500 });
  }
}
