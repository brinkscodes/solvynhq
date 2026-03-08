import { websiteContent } from "../../../data/website-content";
import { ContentViewer } from "@/components/content/content-viewer";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { FloatingAgenda } from "@/components/meetings/floating-agenda";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Website Content",
  description: "Website copy reference for the Solvyn WordPress build",
};

export default function ContentPage() {
  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <ContentViewer pages={websiteContent} />
        </div>
      </main>
      <FloatingAgenda />
      <FloatingNotepad />
    </div>
  );
}
