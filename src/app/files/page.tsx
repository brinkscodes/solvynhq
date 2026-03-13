import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { FloatingAgenda } from "@/components/meetings/floating-agenda";
import { PageHeader } from "@/components/shared/page-header";
import { FilesViewer } from "@/components/files/files-viewer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Files",
  description: "Shared files for your team",
};

export default function FilesPage() {
  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <PageHeader title="Files" description="Upload and share files with your team" />
          <FilesViewer />
        </div>
      </main>
      <FloatingAgenda />
      <FloatingNotepad />
    </div>
  );
}
