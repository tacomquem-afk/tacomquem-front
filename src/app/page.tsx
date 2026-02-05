import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
          TáComQuem
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Nunca mais esqueça quem está com suas coisas.
          Gerencie empréstimos entre amigos de forma simples.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Começar agora</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
