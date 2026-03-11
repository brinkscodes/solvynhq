import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

export default async function globalTeardown() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("[global-teardown] Missing env vars, skipping cleanup");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = process.env.TEST_USER_EMAIL!;

  const { data: users } = await supabase.auth.admin.listUsers();
  const testUser = users?.users?.find((u) => u.email === email);

  if (!testUser) {
    console.log("[global-teardown] Test user not found, nothing to clean up");
    return;
  }

  // Remove from shared project memberships (don't delete the shared project!)
  await supabase.from("project_members").delete().eq("user_id", testUser.id);

  // Delete any solo projects owned by test user
  await supabase.from("projects").delete().eq("owner_id", testUser.id);

  // Clean personal data
  await supabase.from("user_tasks").delete().eq("user_id", testUser.id);
  await supabase.from("user_task_sections").delete().eq("user_id", testUser.id);
  await supabase.from("notes").delete().eq("user_id", testUser.id);

  // Delete the user
  const { error } = await supabase.auth.admin.deleteUser(testUser.id);
  if (error) {
    console.error(`[global-teardown] Failed to delete test user: ${error.message}`);
  } else {
    console.log(`[global-teardown] Deleted test user: ${email}`);
  }
}
