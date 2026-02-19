import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/legal-document";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso da plataforma TáComQuem.",
};

export default function TermsPage() {
  const content = readFileSync(
    join(process.cwd(), "docs/legal/termos-de-uso.md"),
    "utf-8"
  );

  return <LegalDocument content={content} />;
}
