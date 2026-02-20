import type { Metadata } from "next";
import { BetaInvitesList } from "@/components/admin/beta/beta-invites-list";
import { BetaUsersTable } from "@/components/admin/beta/beta-users-table";
import { BetaWaitlistTable } from "@/components/admin/beta/beta-waitlist-table";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Admin – Programa Beta" };

export default function BetaPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Programa Beta</h1>
        <p className="text-muted-foreground">
          Gerencie os convites e participantes do programa beta da plataforma.
        </p>
      </div>

      {/* Whitelist de convites */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Convites (Whitelist)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Emails adicionados aqui ganham acesso beta automaticamente ao se
            cadastrar.
          </p>
        </div>
        <BetaInvitesList />
      </section>

      <Separator className="border-border-700" />

      {/* Waitlist de auto-cadastro */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Waitlist (Auto-cadastro)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Usuarios que se cadastraram durante o modo beta e aguardam
            aprovacao.
          </p>
        </div>
        <BetaWaitlistTable />
      </section>

      <Separator className="border-border-700" />

      {/* Usuários com acesso beta */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Usuários Beta</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Usuários que já possuem acesso ao programa beta.
          </p>
        </div>
        <BetaUsersTable />
      </section>
    </div>
  );
}
