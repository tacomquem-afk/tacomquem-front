import type { Metadata } from "next";
import { UsersTable } from "@/components/admin/users/users-table";

export const metadata: Metadata = { title: "Admin – Usuários" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie todos os usuários da plataforma.
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
