import { Lock } from "lucide-react";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

export default function BetaWaitlistPage() {
  return (
    <AuthCard
      title="Acesso Beta Privado"
      description="O TáComQuem está em acesso antecipado"
    >
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            O TáComQuem está em fase de beta fechado e o acesso é exclusivo para
            usuários convidados.
          </p>
          <p>Em breve abriremos para todos!</p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Voltar ao login</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
