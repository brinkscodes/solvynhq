import { ContextEditor } from "@/components/product-context/context-editor";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import type { ProductContext } from "@/lib/product-context-types";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Product Marketing Context",
  description: "Editable product marketing context for Solvyn",
};

async function getProductContext(): Promise<ProductContext> {
  const supabase = await createClient();
  const projectId = await getProjectId();

  const { data, error } = await supabase
    .from("product_context")
    .select("data, updated_at")
    .eq("project_id", projectId)
    .single();

  if (error && error.code === "PGRST116") {
    // No row yet — return empty context
    return { lastUpdated: new Date().toISOString() } as ProductContext;
  }
  if (error) throw error;

  return {
    ...data.data,
    lastUpdated: data.updated_at,
  } as ProductContext;
}

export default async function ProductContextPage() {
  const data = await getProductContext();

  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <ContextEditor initialData={data} />
        </div>
      </main>
      <FloatingNotepad />
    </div>
  );
}
