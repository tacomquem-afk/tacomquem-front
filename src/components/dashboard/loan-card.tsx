"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Package } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRemindLoan, useReturnLoan } from "@/hooks/use-loans";
import type { Loan, LoanStatus } from "@/types";

type LoanCardProps = {
  loan: Loan;
  role?: "lender" | "borrower";
};

export function LoanCard({ loan, role = "lender" }: LoanCardProps) {
  const returnMutation = useReturnLoan();
  const remindMutation = useRemindLoan();
  const itemImage = loan.item.images[0];
  const counterpart = role === "borrower" ? loan.lender : loan.borrower;
  const counterpartName =
    counterpart?.name ??
    (role === "lender" ? (loan.borrowerEmail ?? "—") : "—");
  const counterpartInitials =
    counterpartName
      .split(" ")
      .map((part) => part.trim()[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

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

          {counterpartName && (
            <div className="flex items-center gap-2">
              <Avatar className="size-6 border border-border-700">
                <AvatarImage src={counterpart?.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xs">
                  {counterpartInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {role === "borrower"
                  ? loan.status === "returned"
                    ? "Devolvido para "
                    : "Emprestado por "
                  : loan.status === "returned"
                    ? "Estava com "
                    : "Com "}
                <span className="font-medium text-foreground">
                  {counterpartName}
                </span>
              </span>
            </div>
          )}
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          {role === "lender" && loan.status === "confirmed" ? (
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => remindMutation.mutate(loan.id)}
                disabled={remindMutation.isPending || returnMutation.isPending}
              >
                Solicitar Devolução
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    disabled={returnMutation.isPending}
                  >
                    {returnMutation.isPending
                      ? "Confirmando..."
                      : "Recebi de volta"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirmar que recebeu o item de volta?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao confirmar, o empréstimo de{" "}
                      <strong>{loan.item.name}</strong> será finalizado.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => returnMutation.mutate(loan.id)}
                    >
                      Confirmar devolução
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : role === "borrower" && loan.status === "confirmed" ? (
            <Button variant="secondary" size="sm" className="w-full" disabled>
              Pronto para devolver
            </Button>
          ) : role === "lender" && loan.status === "returned" ? (
            <Button variant="outline" size="sm" className="w-full">
              Avaliar Estado
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
