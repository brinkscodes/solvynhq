import fs from "fs";
import path from "path";
import { ContextEditor } from "@/components/product-context/context-editor";
import type { ProductContext } from "@/lib/product-context-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solvyn - Product Marketing Context",
  description: "Editable product marketing context for Solvyn",
};

export default function ProductContextPage() {
  const file = path.join(process.cwd(), "data", "product-context.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data: ProductContext = JSON.parse(raw);

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-[family-name:var(--font-inter)]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ContextEditor initialData={data} />
      </div>
    </div>
  );
}
