import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { ProfileEditor } from "@/components/profile/profile-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Profile",
  description: "Manage your profile settings",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <ProfileEditor />
        </div>
      </main>
      <FloatingNotepad />
    </div>
  );
}
