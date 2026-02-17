"use client";

import { Loader2, Menu, Package, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown";
import { RegisterLoanDialog } from "@/components/dashboard/register-loan-dialog";
import { DashboardMobileMenu } from "@/components/layouts/dashboard-mobile-menu";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDashboardSearch } from "@/hooks/use-dashboard-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function DashboardHeader() {
  const [registerLoanOpen, setRegisterLoanOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();
  const hasSearchText = searchQuery.trim().length > 0;
  const { data, isFetching, isError } = useDashboardSearch(normalizedQuery);
  const hasResults = !!data && (data.items.length > 0 || data.friends.length > 0);

  return (
    <>
      <header className="sticky top-0 z-10 bg-background-950/80 backdrop-blur-md border-b border-border-700 px-4 sm:px-6 py-4 flex items-center justify-between gap-2 sm:gap-4">
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
              <DashboardMobileMenu
                onRegisterLoan={() => setRegisterLoanOpen(true)}
              />
            </SheetContent>
          </Sheet>
          <Logo size="sm" linkToHome={false} />
        </div>

        {/* Search (desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar itens, amigos..."
              className="pl-10 bg-surface-900 border-border-700"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Buscar itens e amigos"
            />

            {hasSearchText && (
              <div
                className="absolute isolate z-[100] top-[calc(100%+0.5rem)] left-0 right-0 rounded-xl border border-border-700 shadow-2xl shadow-black/70 ring-1 ring-black/30 overflow-hidden"
                style={{ backgroundColor: "#070f26" }}
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: "#070f26" }}
                  aria-hidden
                />
                <div className="relative z-10">
                {isFetching ? (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Buscando...
                  </div>
                ) : isError ? (
                  <div className="px-4 py-3 text-sm text-destructive">
                    Não foi possível carregar a busca agora.
                  </div>
                ) : !hasResults ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    Nenhum resultado encontrado.
                  </div>
                ) : (
                  <div className="max-h-[28rem] overflow-y-auto p-2">
                    {data.items.length > 0 && (
                      <div className="mb-2">
                        <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                          Itens
                        </p>
                        <div className="space-y-1">
                          {data.items.map((item) => (
                            <Link
                              key={item.id}
                              href={`/dashboard/items?q=${encodeURIComponent(searchQuery.trim())}`}
                              className="flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-surface-800 transition-colors"
                              onClick={() => setSearchQuery("")}
                            >
                              <Package className="size-4 mt-0.5 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                  {item.name}
                                </p>
                                {item.description && (
                                  <p className="text-xs text-slate-300 truncate">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.friends.length > 0 && (
                      <div>
                        <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                          Amigos
                        </p>
                        <div className="space-y-1">
                          {data.friends.map((friend) => (
                            <Link
                              key={friend.id}
                              href={`/dashboard/friends?q=${encodeURIComponent(searchQuery.trim())}`}
                              className="flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-surface-800 transition-colors"
                              onClick={() => setSearchQuery("")}
                            >
                              <Users className="size-4 mt-0.5 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                  {friend.name}
                                </p>
                                <p className="text-xs text-slate-300 truncate">
                                  {friend.email}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* CTA Button */}
          <Button
            size="icon"
            className="sm:hidden"
            onClick={() => setRegisterLoanOpen(true)}
            aria-label="Registrar empréstimo"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            className="hidden sm:flex gap-2"
            onClick={() => setRegisterLoanOpen(true)}
          >
            <Plus className="size-4" />
            Registrar Empréstimo
          </Button>
        </div>
      </header>

      <RegisterLoanDialog
        open={registerLoanOpen}
        onOpenChange={setRegisterLoanOpen}
      />
    </>
  );
}
