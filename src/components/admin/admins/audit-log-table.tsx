"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAuditLog } from "@/hooks/use-admin-admins";

export function AuditLogTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminAuditLog(page);

  const logs = data?.logs ?? [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border-700 bg-surface-900">
        <Table>
          <TableHeader>
            <TableRow className="border-border-700 hover:bg-surface-800">
              <TableHead className="w-[200px]">Admin</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Alvo</TableHead>
              <TableHead className="w-[180px]">Data/Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhuma ação registrada
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-border-700 hover:bg-surface-800"
                >
                  <TableCell className="font-medium">{log.admin.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.targetType
                      ? `${log.targetType} (${log.targetId})`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {pagination.totalPages} • {pagination.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
