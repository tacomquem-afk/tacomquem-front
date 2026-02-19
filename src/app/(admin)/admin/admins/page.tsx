import type { Metadata } from "next";
import { AdminsPageClient } from "./admins-page-client";

export const metadata: Metadata = { title: "Admin – Administradores" };

export default function AdminsPage() {
  return <AdminsPageClient />;
}
