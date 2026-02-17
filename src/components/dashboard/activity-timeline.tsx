import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, CheckCircle, CircleCheckBig, Handshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";

const iconMap = {
  loan_created: Handshake,
  loan_confirmed: CircleCheckBig,
  loan_returned: CheckCircle,
  loan_reminder: Bell,
};

const colorMap = {
  loan_created: "text-blue-400 bg-blue-900/20",
  loan_confirmed: "text-cyan-400 bg-cyan-900/20",
  loan_returned: "text-green-400 bg-green-900/20",
  loan_reminder: "text-amber-400 bg-amber-900/20",
};

export function ActivityTimeline() {
  const { data, isLoading } = useDashboard();
  const activities = data?.recentActivity ?? [];

  return (
    <Card className="border-border-700 flex-1">
      <CardHeader>
        <CardTitle className="text-base">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-14 w-full" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda não há atividade recente.
          </p>
        ) : (
          <div className="relative flex flex-col gap-4">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border-700" />

            {activities.map((activity) => {
              const Icon = iconMap[activity.type];
              const colorClass = colorMap[activity.type];

              return (
                <div key={activity.id} className="flex gap-4 relative">
                  <div
                    className={cn(
                      "size-10 rounded-full border-2 border-surface-900 z-10 flex items-center justify-center shrink-0",
                      colorClass
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col py-0.5">
                    <p className="text-sm text-foreground">
                      {activity.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button variant="ghost" size="sm" className="w-full mt-6 text-xs" asChild>
          <Link href="/dashboard/notifications">Ver histórico completo</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
