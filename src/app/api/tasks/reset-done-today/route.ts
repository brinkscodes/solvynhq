import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function POST() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    // Remove only done tasks from today focus
    const { error } = await supabase
      .from("tasks")
      .update({ today_focus: false, today_order: 0 })
      .eq("project_id", projectId)
      .eq("today_focus", true)
      .eq("status", "done");

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/tasks/reset-done-today error:", err);
    return NextResponse.json({ error: "Failed to reset done today" }, { status: 500 });
  }
}
