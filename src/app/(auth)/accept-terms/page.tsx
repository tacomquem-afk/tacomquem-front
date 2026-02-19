import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptTermsForm } from "./accept-terms-form";

export const metadata: Metadata = {
  title: "Aceitar Termos de Uso",
};

export default function AcceptTermsPage() {
  return (
    <Suspense>
      <AcceptTermsForm />
    </Suspense>
  );
}
