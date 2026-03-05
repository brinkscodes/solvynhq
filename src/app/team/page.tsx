import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { TeamViewer } from "@/components/team/team-viewer";
import { PageHeader } from "@/components/shared/page-header";

export const dynamic = "force-dynamic";

export default function TeamPage() {
  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <PageHeader title="Team" description="Manage team members and invitations" />
          <TeamViewer />
        </div>
      </main>
      <FloatingNotepad />
    </div>
  );
}
