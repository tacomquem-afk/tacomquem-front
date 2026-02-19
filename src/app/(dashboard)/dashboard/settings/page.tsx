"use client";

import { LogOut, Mail, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DeleteAccountDialog } from "@/components/dashboard/delete-account-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    logout();
    router.push("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold font-display mb-6">Configurações</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Avatar & Info */}
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage src={user?.avatarUrl ?? undefined} />
              <AvatarFallback className="text-2xl">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Info Fields */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="size-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Nome:</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="size-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Função:</span>
              <span className="font-medium capitalize">
                {user?.role.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="size-4 mr-2" />
              Sair da Conta
            </Button>
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4 mr-2" />
              Excluir minha conta
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
