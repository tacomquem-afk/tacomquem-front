import type { ReactNode } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Sidebar - desktop only */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:ml-64 bg-background-950">
        <DashboardHeader />
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
