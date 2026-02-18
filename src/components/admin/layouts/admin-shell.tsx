import type { ReactNode } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
  title?: string;
};

export function AdminShell({ children, title }: AdminShellProps) {
  return (
    <div className="relative flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 flex flex-col lg:ml-64 bg-background-950">
        <AdminHeader title={title} />
        <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
