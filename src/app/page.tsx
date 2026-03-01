import fs from "fs";
import path from "path";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Notepad } from "@/components/dashboard/notepad";
import type { ProjectData } from "@/lib/types";

export const dynamic = "force-dynamic";

function getTaskData(): ProjectData {
  const filePath = path.join(process.cwd(), "data", "tasks.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function Page() {
  const data = getTaskData();

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-[family-name:var(--font-inter)]">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-12">
        <Notepad />
        <div className="min-w-0 flex-1">
          <Dashboard data={data} />
        </div>
      </div>
    </div>
  );
}
