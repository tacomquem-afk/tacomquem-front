"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useReturnLoan, useRemindLoan } from "@/hooks/use-loans";
import { Clock, CheckCircle, AlertCircle, Package } from "lucide-react";
import type { Loan, LoanStatus } from "@/types";

type LoanCardProps = {
  loan: Loan;
};

export function LoanCard({ loan }: LoanCardProps) {
  const returnMutation = useReturnLoan();
  const remindMutation = useRemindLoan();
  const itemImage = loan.item.images[0];

  const statusConfig: Record<
    LoanStatus,
    {
      label: string;
      icon: typeof Clock;
      variant: "warning" | "success" | "destructive";
    }
  > = {
    pending: { label: "Pendente", icon: Clock, variant: "warning" },
    confirmed: { label: "Emprestado", icon: Clock, variant: "warning" },
    returned: { label: "Devolvido", icon: CheckCircle, variant: "success" },
    cancelled: {
      label: "Cancelado",
      icon: AlertCircle,
      variant: "destructive",
    },
  };

  const config = statusConfig[loan.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden border-border-700 hover:shadow-xl hover:shadow-black/20 transition-shadow">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Badge
            variant={config.variant}
            className="absolute top-3 left-3 z-10 gap-1"
          >
            <StatusIcon className="size-3" />
            {config.label}
          </Badge>

          {itemImage ? (
            <Image
              src={itemImage}
              alt={loan.item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-surface-800 flex items-center justify-center">
              <Package className="size-12 text-muted-foreground" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

          {/* Expected return */}
          {loan.expectedReturnDate && loan.status !== "returned" && (
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-medium opacity-90">
                Devolução esperada:{" "}
                {format(new Date(loan.expectedReturnDate), "d 'de' MMM", {
                  locale: ptBR,
                })}
              </p>
            </div>
          )}

          {loan.returnedAt && loan.status === "returned" && (
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-medium opacity-90">
                Devolvido{" "}
                {formatDistanceToNow(new Date(loan.returnedAt), {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="text-base font-bold font-display mb-2">
            {loan.item?.name ?? "Item"}
          </h3>

          {loan.borrower && (
            <div className="flex items-center gap-2">
              <Avatar className="size-6 border border-border-700">
                <AvatarImage src={loan.borrower.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xs">
                  {loan.borrower.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {loan.status === "returned" ? "Estava com " : "Com "}
                <span className="font-medium text-foreground">
                  {loan.borrower.name}
                </span>
              </span>
            </div>
          )}
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          {loan.status === "confirmed" ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => remindMutation.mutate(loan.id)}
              disabled={remindMutation.isPending || returnMutation.isPending}
            >
              Solicitar Devolução
            </Button>
          ) : loan.status === "returned" ? (
            <Button variant="outline" size="sm" className="w-full">
              Avaliar Estado
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
