"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  History,
  Package,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoansHistory } from "@/hooks/use-loans";
import { useAuth } from "@/providers/auth-provider";
import type { Loan } from "@/types";

function groupByMonth(loans: Loan[]): Array<{ label: string; loans: Loan[] }> {
  const map = new Map<string, Loan[]>();

  for (const loan of loans) {
    const key = format(
      new Date(loan.returnedAt ?? loan.createdAt),
      "MMMM 'de' yyyy",
      {
        locale: ptBR,
      }
    );
    if (!map.has(key)) map.set(key, []);
    map.get(key)?.push(loan);
  }

  return Array.from(map.entries()).map(([label, loans]) => ({ label, loans }));
}

function HistoryItem({ loan, userId }: { loan: Loan; userId: string }) {
  const isLender = loan.lender.id === userId;
  const otherParty = isLender ? loan.borrower : loan.lender;
  const otherName = otherParty?.name ?? loan.borrowerEmail ?? "—";
  const otherInitials = otherName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const itemImage = loan.item.images[0];

  const returnedDate = loan.returnedAt
    ? format(new Date(loan.returnedAt), "d 'de' MMM yyyy", { locale: ptBR })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-surface-800 border border-border-700 hover:border-primary/30 transition-colors"
    >
      {/* Item image */}
      <div className="relative size-14 rounded-xl overflow-hidden shrink-0 bg-surface-900">
        {itemImage ? (
          <Image
            src={itemImage}
            alt={loan.item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{loan.item.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Avatar className="size-4">
            <AvatarImage
              src={
                isLender
                  ? ((loan.borrower as { avatarUrl?: string | null } | null)
                      ?.avatarUrl ?? undefined)
                  : undefined
              }
            />
            <AvatarFallback className="text-[8px]">
              {otherInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {isLender ? "Para " : "De "}
            <span className="text-foreground font-medium">{otherName}</span>
          </span>
        </div>
        {returnedDate && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Devolvido em {returnedDate}
          </p>
        )}
      </div>

      {/* Direction badge */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <Badge
          variant={isLender ? "success" : "default"}
          className="gap-1 text-xs"
        >
          {isLender ? (
            <>
              <ArrowUpRight className="size-3" />
              Emprestei
            </>
          ) : (
            <>
              <ArrowDownLeft className="size-3" />
              Peguei
            </>
          )}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-accent-green">
          <CheckCircle className="size-3" />
          <span>Devolvido</span>
        </div>
      </div>
    </motion.div>
  );
}

function HistoryGroup({
  label,
  loans,
  userId,
}: {
  label: string;
  loans: Loan[];
  userId: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="flex-1 h-px bg-border-700" />
        <span className="text-xs text-muted-foreground">{loans.length}</span>
      </div>
      {loans.map((loan) => (
        <HistoryItem key={loan.id} loan={loan} userId={userId} />
      ))}
    </div>
  );
}

function EmptyHistory({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
      <History className="size-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">{label}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Os empréstimos concluídos aparecerão aqui automaticamente.
      </p>
    </div>
  );
}

function HistoryList({
  loans,
  userId,
  emptyLabel,
}: {
  loans: Loan[];
  userId: string;
  emptyLabel: string;
}) {
  const groups = useMemo(() => groupByMonth(loans), [loans]);

  if (loans.length === 0) {
    return <EmptyHistory label={emptyLabel} />;
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <HistoryGroup
          key={group.label}
          label={group.label}
          loans={group.loans}
          userId={userId}
        />
      ))}
    </div>
  );
}

function HistorySkeletons() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [direction, setDirection] = useState<"all" | "lent" | "borrowed">(
    "all"
  );
  const { data: historyData, isLoading } = useLoansHistory(direction);

  const userId = user?.id ?? "";
  const loans = historyData?.loans ?? [];
  const counts = historyData?.counts ?? { all: 0, lent: 0, borrowed: 0 };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Histórico</h1>
          <p className="text-muted-foreground">
            Todos os empréstimos já concluídos.
          </p>
        </div>
        {!isLoading && counts.all > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-800 border border-border-700 text-sm">
            <CheckCircle className="size-4 text-accent-green" />
            <span className="font-medium">{counts.all}</span>
            <span className="text-muted-foreground">concluídos</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        value={direction}
        onValueChange={(v) => setDirection(v as typeof direction)}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="gap-2">
            <History className="size-4" />
            Todos
            {!isLoading && (
              <span className="text-xs opacity-60">({counts.all})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="lent" className="gap-2">
            <ArrowUpRight className="size-4" />
            Emprestei
            {!isLoading && (
              <span className="text-xs opacity-60">({counts.lent})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="borrowed" className="gap-2">
            <ArrowDownLeft className="size-4" />
            Peguei
            {!isLoading && (
              <span className="text-xs opacity-60">({counts.borrowed})</span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <HistorySkeletons />
          ) : (
            <HistoryList
              loans={loans}
              userId={userId}
              emptyLabel="Nenhum empréstimo concluído"
            />
          )}
        </TabsContent>

        <TabsContent value="lent">
          {isLoading ? (
            <HistorySkeletons />
          ) : (
            <HistoryList
              loans={loans}
              userId={userId}
              emptyLabel="Nenhum item emprestado concluído"
            />
          )}
        </TabsContent>

        <TabsContent value="borrowed">
          {isLoading ? (
            <HistorySkeletons />
          ) : (
            <HistoryList
              loans={loans}
              userId={userId}
              emptyLabel="Nenhum item pegado emprestado concluído"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
