import { SocialProofEditor } from "@/components/marketing/social-proof-editor";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { FloatingAgenda } from "@/components/meetings/floating-agenda";
import type { SocialProofData } from "@/lib/social-proof-types";
import { createClient } from "@/lib/supabase/server";
import { getProjectId } from "@/lib/supabase/get-project";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Social Proof",
  description: "Partners, advisory board, and volunteers",
};

async function getSocialProofData(): Promise<SocialProofData> {
  const supabase = await createClient();
  const projectId = await getProjectId();

  const [partners, advisors, volunteers] = await Promise.all([
    supabase.from("partners").select("*").eq("project_id", projectId).order("sort_order"),
    supabase.from("advisory_board").select("*").eq("project_id", projectId).order("sort_order"),
    supabase.from("volunteers").select("*").eq("project_id", projectId).order("sort_order"),
  ]);

  return {
    partners: partners.data || [],
    advisors: advisors.data || [],
    volunteers: volunteers.data || [],
  };
}

export default async function SocialProofPage() {
  const data = await getSocialProofData();

  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <SocialProofEditor initialData={data} />
        </div>
      </main>
      <FloatingAgenda />
      <FloatingNotepad />
    </div>
  );
}
