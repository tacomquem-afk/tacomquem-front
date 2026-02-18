import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layouts/admin-shell";
import { getCurrentUser } from "@/lib/api/auth";
import type { UserRole } from "@/types";

const ADMIN_ROLES: UserRole[] = [
  "MODERATOR",
  "ANALYST",
  "SUPPORT",
  "SUPER_ADMIN",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
