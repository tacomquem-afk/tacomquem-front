import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/api/auth";
import { manrope, sourceSans } from "@/lib/fonts";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TáComQuem - Empréstimos entre amigos",
    template: "%s | TáComQuem",
  },
  description:
    "Plataforma de empréstimos de itens pessoais entre amigos. Empreste e pegue emprestado com confiança.",
  keywords: ["empréstimo", "amigos", "compartilhamento", "itens"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#101922",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${sourceSans.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background-950 antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider initialUser={user}>{children}</AuthProvider>
          </QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
