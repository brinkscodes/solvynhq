import { createClient } from "./server";
import { createAdminClient } from "./admin";

export async function getProjectId(): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Check project_members first (covers both owner and invited members)
  const { data: memberships, error: memberError } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true })
    .limit(1);

  if (!memberError && memberships && memberships.length > 0) {
    return memberships[0].project_id;
  }

  // Use admin client (bypasses RLS) to bootstrap new users
  const admin = createAdminClient();

  // Fallback: legacy check via projects.owner_id
  const { data: projects, error: fetchError } = await admin
    .from("projects")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1);

  if (fetchError) throw fetchError;

  if (projects && projects.length > 0) {
    // Project exists but membership is missing — fix it
    await admin
      .from("project_members")
      .upsert(
        { project_id: projects[0].id, user_id: user.id, role: "owner" },
        { onConflict: "project_id,user_id" }
      );
    return projects[0].id;
  }

  // No project yet — auto-create one
  const { data: newProject, error: insertError } = await admin
    .from("projects")
    .insert({
      owner_id: user.id,
      name: "My Project",
      description: "Project dashboard",
    })
    .select("id")
    .single();

  if (insertError) throw insertError;

  // Ensure membership exists (don't rely solely on DB trigger)
  await admin
    .from("project_members")
    .upsert(
      { project_id: newProject!.id, user_id: user.id, role: "owner" },
      { onConflict: "project_id,user_id" }
    );

  return newProject!.id;
}
