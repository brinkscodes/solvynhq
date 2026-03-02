import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

export default async function globalSetup() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.test"
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;
  const name = process.env.TEST_USER_NAME!;

  // Delete existing test user if present (clean slate)
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);
  if (existing) {
    // Delete owned project data first (cascade)
    await supabase.from("tasks").delete().eq("project_id",
      (await supabase.from("projects").select("id").eq("owner_id", existing.id).single()).data?.id
    );
    await supabase.from("sections").delete().eq("project_id",
      (await supabase.from("projects").select("id").eq("owner_id", existing.id).single()).data?.id
    );
    await supabase.from("notes").delete().eq("user_id", existing.id);
    await supabase.from("projects").delete().eq("owner_id", existing.id);
    await supabase.auth.admin.deleteUser(existing.id);
  }

  // Create fresh test user with email pre-confirmed
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  console.log(`[global-setup] Created test user: ${data.user.email} (${data.user.id})`);
}
