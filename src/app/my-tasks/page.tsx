import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { FloatingAgenda } from "@/components/meetings/floating-agenda";
import { MyTasksViewer } from "@/components/my-tasks/my-tasks-viewer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - My Tasks",
  description: "Personal task manager",
};

export default function MyTasksPage() {
  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <MyTasksViewer />
        </div>
      </main>
      <FloatingAgenda />
      <FloatingNotepad />
    </div>
  );
}
