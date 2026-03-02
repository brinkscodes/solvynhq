import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { MeetingsViewer } from "@/components/meetings/meetings-viewer";
import { meetings } from "../../../data/meetings";

export const metadata = {
  title: "Meetings — SolvynHQ",
  description: "Meeting history, decisions, and action items",
};

export default function MeetingsPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F7F4] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="ml-[232px] flex-1">
        <div className="mx-auto max-w-[960px] px-8 py-10">
          <MeetingsViewer meetings={meetings} />
        </div>
      </main>
      <FloatingNotepad />
    </div>
  );
}
