import { Logo } from "@/components/shared/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthCard({
  title,
  description,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-4 sm:mb-8">
        <Logo size="lg" />
      </div>

      <Card className={cn("w-full max-w-md", className)}>
        <CardHeader className="space-y-1 text-center">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-balance">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
