import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function POST() {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();

    const { error } = await supabase
      .from("tasks")
      .update({ today_focus: false })
      .eq("project_id", projectId)
      .eq("today_focus", true);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/tasks/reset-today error:", err);
    return NextResponse.json({ error: "Failed to reset today" }, { status: 500 });
  }
}
