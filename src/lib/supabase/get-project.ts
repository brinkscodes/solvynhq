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
    .select("project_id, role")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  if (!memberError && memberships && memberships.length > 0) {
    if (memberships.length === 1) {
      return memberships[0].project_id;
    }
    // If multiple memberships, prefer the shared project (where user was invited)
    // over an auto-created solo project (where user is owner)
    const invited = memberships.find((m) => m.role !== "owner");
    if (invited) return invited.project_id;
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

  // No membership and no owned project — join the main shared project
  const { data: mainProject } = await admin
    .from("projects")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (mainProject) {
    // Auto-add user as member of the shared project
    await admin
      .from("project_members")
      .upsert(
        { project_id: mainProject.id, user_id: user.id, role: "member" },
        { onConflict: "project_id,user_id" }
      );
    return mainProject.id;
  }

  // No projects exist at all — create the first one (only happens once)
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

  await admin
    .from("project_members")
    .upsert(
      { project_id: newProject!.id, user_id: user.id, role: "owner" },
      { onConflict: "project_id,user_id" }
    );

  return newProject!.id;
}
