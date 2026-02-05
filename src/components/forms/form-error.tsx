import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormErrorProps = {
  message?: string;
  className?: string;
};

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-destructive",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
