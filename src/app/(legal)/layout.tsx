import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/">
            <Logo size="sm" linkToHome={false} />
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TáComQuem ·{" "}
        <Link href="/terms" className="hover:underline">
          Termos de Uso
        </Link>{" "}
        ·{" "}
        <Link href="/privacy" className="hover:underline">
          Política de Privacidade
        </Link>
      </footer>
    </div>
  );
}
