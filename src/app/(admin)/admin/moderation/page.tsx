import { Scale } from "lucide-react";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin – Moderação" };

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Moderação</h1>
        <p className="text-muted-foreground">
          Gerencie conteúdo e empréstimos sinalizados.
        </p>
      </div>

      <Card className="border-border-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="size-5" />
            Moderação de Conteúdo
          </CardTitle>
          <CardDescription>
            A fila de moderação será implementada em breve. Os endpoints
            disponíveis permitem visualizar e moderar itens e empréstimos
            específicos por ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-surface-800 border border-border-700">
              <h3 className="font-semibold mb-2">Endpoints Disponíveis</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="font-mono text-xs">
                  GET /api/admin/moderation/items/{"{id}"}
                </li>
                <li className="font-mono text-xs">
                  DELETE /api/admin/moderation/items/{"{id}"}
                </li>
                <li className="font-mono text-xs">
                  GET /api/admin/moderation/loans/{"{id}"}
                </li>
                <li className="font-mono text-xs">
                  POST /api/admin/moderation/loans/{"{id}"}/cancel
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Entre em contato com a equipe de backend para obter uma lista de
              IDs de itens/empréstimos sinalizados ou para implementar um
              endpoint de listagem.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
