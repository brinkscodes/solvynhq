import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { ChangelogViewer } from "@/components/changelog/changelog-viewer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Patch Notes",
  description: "Changelog of recent updates and improvements",
};

export default function ChangelogPage() {
  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <div className="mb-8">
            <h1 className="text-[22px] font-semibold text-[var(--solvyn-text-primary)]">
              Patch Notes
            </h1>
            <p className="mt-1 text-[13px] text-[var(--solvyn-text-tertiary)]">
              Recent updates and changes to the dashboard.
            </p>
          </div>
          <ChangelogViewer />
        </div>
      </main>
      <FloatingNotepad />
    </div>
  );
}
