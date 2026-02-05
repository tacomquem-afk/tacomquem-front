import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <main id="main-content">{children}</main>
    </div>
  );
}
