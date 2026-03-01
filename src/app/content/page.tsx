import { websiteContent } from "../../../data/website-content";
import { ContentViewer } from "@/components/content/content-viewer";

export const metadata = {
  title: "Solvyn - Website Content",
  description: "Website copy reference for the Solvyn WordPress build",
};

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] font-[family-name:var(--font-inter)]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ContentViewer pages={websiteContent} />
      </div>
    </div>
  );
}
