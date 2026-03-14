import { Sidebar } from "@/components/dashboard/sidebar";
import { FloatingNotepad } from "@/components/dashboard/floating-notepad";
import { FloatingAgenda } from "@/components/meetings/floating-agenda";
import { PageHeader } from "@/components/shared/page-header";
import { CredentialsVault } from "@/components/credentials/credentials-vault";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Login Credentials",
  description: "Securely stored login credentials",
};

export default function CredentialsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--solvyn-bg-base)] font-[family-name:var(--font-inter)]">
      <Sidebar />
      <main className="flex-1 lg:ml-[232px]">
        <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-8 sm:py-10 lg:py-10">
          <PageHeader
            title="Login Credentials"
            description="Securely stored account passwords and login details"
          />
          <CredentialsVault />
        </div>
      </main>
      <FloatingAgenda />
      <FloatingNotepad />
    </div>
  );
}
