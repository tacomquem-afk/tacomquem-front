"use client";

import { FileText, Shield } from "lucide-react";
import { AdminsTable } from "@/components/admin/admins/admins-table";
import { AuditLogTable } from "@/components/admin/admins/audit-log-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminsPageClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          Administradores
        </h1>
        <p className="text-muted-foreground">
          Gerencie contas administrativas e visualize o registro de auditoria.
        </p>
      </div>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="bg-surface-900 border border-border-700">
          <TabsTrigger value="admins" className="gap-2">
            <Shield className="size-4" />
            Administradores
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="size-4" />
            Registro de Auditoria
          </TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="mt-6">
          <AdminsTable />
        </TabsContent>
        <TabsContent value="audit" className="mt-6">
          <AuditLogTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
