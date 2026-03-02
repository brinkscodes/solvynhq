import { createClient } from "./server";

export async function getProjectId(): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Try to find existing project for this user (order by created_at to get the oldest/original)
  const { data: projects, error: fetchError } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1);

  if (fetchError) throw fetchError;

  if (projects && projects.length > 0) return projects[0].id;

  // No project yet — auto-create one
  const { data: newProject, error: insertError } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name: "SolvynHQ",
      description: "Project dashboard",
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return newProject!.id;
}
