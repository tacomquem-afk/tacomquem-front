"use client";

import {
  BadgeCheck,
  Calendar,
  Mail,
  Package,
  ShieldBan,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminUser,
  useBlockUser,
  useUnblockUser,
} from "@/hooks/use-admin-users";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MODERATOR: "Moderador",
  ANALYST: "Analista",
  SUPPORT: "Suporte",
  USER: "Usuário",
};

const roleColors: Record<
  string,
  "default" | "outline" | "success" | "warning"
> = {
  SUPER_ADMIN: "success",
  MODERATOR: "warning",
  ANALYST: "default",
  SUPPORT: "default",
  USER: "outline",
};

type UserDetailSheetProps = {
  userId: string;
  onClose: () => void;
};

export function UserDetailSheet({ userId, onClose }: UserDetailSheetProps) {
  const { data, isLoading } = useAdminUser(userId);
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  const user = data?.user;

  useEffect(() => {
    if (blockUser.isSuccess) {
      toast.success("Usuário bloqueado com sucesso");
      onClose();
    }
  }, [blockUser.isSuccess, onClose]);

  useEffect(() => {
    if (unblockUser.isSuccess) {
      toast.success("Usuário desbloqueado com sucesso");
      onClose();
    }
  }, [unblockUser.isSuccess, onClose]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <SheetHeader>
          <SheetTitle>Usuário não encontrado</SheetTitle>
        </SheetHeader>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>Detalhes do Usuário</SheetTitle>
        <SheetDescription>Informações completas do usuário</SheetDescription>
      </SheetHeader>

      {/* User Profile */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="size-20">
          <AvatarImage src={user.avatarUrl ?? undefined} />
          <AvatarFallback className="text-xl">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <Badge variant={roleColors[user.role] ?? "outline"} className="mt-2">
            {roleLabels[user.role] ?? user.role}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-surface-800 border border-border-700">
          <Package className="size-5 text-muted-foreground mb-2" />
          <p className="text-2xl font-bold">{user.itemsCount}</p>
          <p className="text-xs text-muted-foreground">Itens cadastrados</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-800 border border-border-700">
          <Package className="size-5 text-muted-foreground mb-2" />
          <p className="text-2xl font-bold">{user.loansCount}</p>
          <p className="text-xs text-muted-foreground">Empréstimos</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">
          Informações
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="size-4 text-muted-foreground" />
            <span className="text-sm">ID: {user.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-sm">
              Cadastrado em{" "}
              {new Date(user.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user.isBlocked ? (
              <>
                <ShieldBan className="size-4 text-destructive" />
                <span className="text-sm text-destructive">
                  Usuário bloqueado
                </span>
              </>
            ) : (
              <>
                <BadgeCheck className="size-4 text-accent-green" />
                <span className="text-sm text-accent-green">Usuário ativo</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-border-700">
        {user.isBlocked ? (
          <Button
            variant="outline"
            className="w-full text-accent-green hover:text-accent-green"
            onClick={() => unblockUser.mutate(user.id)}
            disabled={unblockUser.isPending}
          >
            Desbloquear Usuário
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => blockUser.mutate(user.id)}
            disabled={blockUser.isPending}
          >
            Bloquear Usuário
          </Button>
        )}
      </div>
    </div>
  );
}
