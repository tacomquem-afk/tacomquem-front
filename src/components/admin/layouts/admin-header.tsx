"use client";

import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminMobileMenu } from "./admin-mobile-menu";

type AdminHeaderProps = {
  title?: string;
};

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background-950/80 backdrop-blur-md border-b border-border-700 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
      {/* Mobile menu */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-sm p-0 border-border-700"
          >
            <AdminMobileMenu />
          </SheetContent>
        </Sheet>
        <Logo size="sm" linkToHome={false} />
      </div>

      {/* Title */}
      {title && (
        <h1 className="hidden lg:block text-sm font-semibold text-muted-foreground">
          Painel Admin
          {" / "}
          <span className="text-foreground">{title}</span>
        </h1>
      )}

      <div className="ml-auto">
        {/* Admin-specific header actions could go here */}
      </div>
    </header>
  );
}
