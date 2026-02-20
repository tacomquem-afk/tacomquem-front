import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/legal-document";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade da plataforma TáComQuem.",
};

export default function PrivacyPage() {
  const content = readFileSync(
    join(process.cwd(), "docs/legal/politica-de-privacidade.md"),
    "utf-8"
  );

  return <LegalDocument content={content} />;
}
