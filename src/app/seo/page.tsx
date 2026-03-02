import { seoResearch } from "../../../data/seo-research";
import { SeoViewer } from "@/components/seo/seo-viewer";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";

export const metadata = {
  title: "Solvyn - SEO Research",
  description: "Keyword research, competitor analysis & content strategy",
};

export default function SeoPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F7F4] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="ml-[232px] flex-1">
        <div className="mx-auto max-w-[960px] px-8 py-10">
          <SeoViewer data={seoResearch} />
        </div>
      </main>
      <FloatingNotepad />
    </div>
  );
}
