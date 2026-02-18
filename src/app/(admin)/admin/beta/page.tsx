import type { Metadata } from "next";
import { BetaUsersTable } from "@/components/admin/beta/beta-users-table";

export const metadata: Metadata = { title: "Admin – Programa Beta" };

export default function BetaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Programa Beta</h1>
        <p className="text-muted-foreground">
          Gerencie os participantes do programa beta da plataforma.
        </p>
      </div>
      <BetaUsersTable />
    </div>
  );
}
