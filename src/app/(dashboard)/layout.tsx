import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth";
import { DashboardShell } from "@/components/layouts/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
