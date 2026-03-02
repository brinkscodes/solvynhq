import { seoResearch } from "../../../data/seo-research";
import { SeoViewer } from "@/components/seo/seo-viewer";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - SEO Research",
  description: "Keyword research, competitor analysis & content strategy",
};

export default function SeoPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F7F4] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <SeoViewer data={seoResearch} />
        </div>
      </main>
      <FloatingNotepad />
    </div>
  );
}
