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

  // Try to find existing project for this user
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .single();

  if (project) return project.id;

  // No project yet — auto-create one
  if (fetchError && fetchError.code === "PGRST116") {
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

  throw fetchError;
}
