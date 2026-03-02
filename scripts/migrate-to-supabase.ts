/**
 * One-time migration script: JSON files → Supabase
 *
 * Usage:
 *   npx tsx scripts/migrate-to-supabase.ts <user-uuid>
 *
 * The user-uuid is the Supabase Auth user ID you signed up with.
 * Find it in Supabase Dashboard → Authentication → Users.
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing env vars. Run with: npx tsx -r dotenv/config scripts/migrate-to-supabase.ts <user-uuid>");
  console.error("Or set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: npx tsx scripts/migrate-to-supabase.ts <user-uuid>");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const dataDir = path.join(process.cwd(), "data");

function readJSON(filename: string) {
  const file = path.join(dataDir, filename);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

async function main() {
  console.log(`Migrating data for user: ${userId}`);

  // 1. Create project
  console.log("Creating project...");
  const tasksData = readJSON("tasks.json");
  if (!tasksData) {
    console.error("data/tasks.json not found");
    process.exit(1);
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      owner_id: userId,
      name: tasksData.project.name,
      description: tasksData.project.description,
    })
    .select("id")
    .single();

  if (projectError) {
    console.error("Failed to create project:", projectError);
    process.exit(1);
  }

  const projectId = project.id;
  console.log(`Project created: ${projectId}`);

  // 2. Insert sections
  console.log("Inserting sections...");
  const sections = tasksData.sections.map((s: { id: string; name: string; order: number; phase: number }) => ({
    id: s.id,
    project_id: projectId,
    name: s.name,
    order: s.order,
    phase: s.phase,
  }));

  const { error: sectionsError } = await supabase.from("sections").insert(sections);
  if (sectionsError) {
    console.error("Failed to insert sections:", sectionsError);
    process.exit(1);
  }
  console.log(`Inserted ${sections.length} sections`);

  // 3. Insert tasks
  console.log("Inserting tasks...");
  const tasks: Array<Record<string, unknown>> = [];
  for (const section of tasksData.sections) {
    for (const task of section.tasks) {
      tasks.push({
        id: task.id,
        project_id: projectId,
        section_id: section.id,
        name: task.name,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        tag: task.tag,
        completed_at: task.completedAt || null,
      });
    }
  }

  // Insert in batches of 50
  for (let i = 0; i < tasks.length; i += 50) {
    const batch = tasks.slice(i, i + 50);
    const { error: tasksError } = await supabase.from("tasks").insert(batch);
    if (tasksError) {
      console.error(`Failed to insert tasks batch ${i}:`, tasksError);
      process.exit(1);
    }
  }
  console.log(`Inserted ${tasks.length} tasks`);

  // 4. Insert notes
  const notesData = readJSON("notes.json");
  if (notesData && notesData.notes) {
    console.log("Inserting notes...");
    const { error: notesError } = await supabase.from("notes").insert({
      project_id: projectId,
      content: notesData.notes,
    });
    if (notesError) console.error("Failed to insert notes:", notesError);
    else console.log("Notes inserted");
  }

  // 5. Insert comments
  const commentsData = readJSON("comments.json");
  if (commentsData && Object.keys(commentsData).length > 0) {
    console.log("Inserting comments...");
    const commentRows = Object.entries(commentsData).map(([sectionId, comment]) => ({
      project_id: projectId,
      section_id: sectionId,
      comment: comment as string,
    }));
    const { error: commentsError } = await supabase.from("comments").insert(commentRows);
    if (commentsError) console.error("Failed to insert comments:", commentsError);
    else console.log(`Inserted ${commentRows.length} comments`);
  }

  // 6. Insert product context
  const contextData = readJSON("product-context.json");
  if (contextData) {
    console.log("Inserting product context...");
    const { lastUpdated, ...data } = contextData;
    const { error: contextError } = await supabase.from("product_context").insert({
      project_id: projectId,
      data,
      updated_at: lastUpdated || new Date().toISOString(),
    });
    if (contextError) console.error("Failed to insert product context:", contextError);
    else console.log("Product context inserted");
  }

  console.log("\nMigration complete!");
}

main().catch(console.error);
