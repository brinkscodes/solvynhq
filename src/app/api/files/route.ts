import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const tag = req.nextUrl.searchParams.get("tag");
    const search = req.nextUrl.searchParams.get("search");

    let query = supabase
      .from("project_files")
      .select("*, profiles:uploaded_by(full_name, avatar_url)")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (tag && tag !== "all") {
      query = query.eq("tag", tag);
    }

    if (search) {
      query = query.ilike("file_name", `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/files error:", err);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tag = (formData.get("tag") as string) || "other";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${projectId}/${timestamp}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-files")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: record, error: dbError } = await supabase
      .from("project_files")
      .insert({
        project_id: projectId,
        uploaded_by: user.id,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: storagePath,
        tag,
      })
      .select("*, profiles:uploaded_by(full_name, avatar_url)")
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(record);
  } catch (err) {
    console.error("POST /api/files error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const projectId = await getProjectId();
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    // Get storage path before deleting record
    const { data: file, error: fetchError } = await supabase
      .from("project_files")
      .select("storage_path")
      .eq("id", fileId)
      .eq("project_id", projectId)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    await supabase.storage.from("project-files").remove([file.storage_path]);

    // Delete DB record
    const { error: deleteError } = await supabase
      .from("project_files")
      .delete()
      .eq("id", fileId)
      .eq("project_id", projectId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/files error:", err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
