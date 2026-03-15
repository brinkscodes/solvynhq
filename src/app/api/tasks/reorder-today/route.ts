import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderedIds } = body as { orderedIds: string[] };

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: "orderedIds required" }, { status: 400 });
    }

    const supabase = await createClient();
    const projectId = await getProjectId();

    await Promise.all(
      orderedIds.map((taskId, index) =>
        supabase
          .from("tasks")
          .update({ today_order: index })
          .eq("id", taskId)
          .eq("project_id", projectId)
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/tasks/reorder-today error:", err);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
