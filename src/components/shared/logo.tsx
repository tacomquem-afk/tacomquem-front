import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  linkToHome?: boolean;
};

const sizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ size = "md", linkToHome = true }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="TáComQuem logo"
        width={256}
        height={256}
        className={`${sizeClasses[size]} w-auto shrink-0`}
        priority
      />
      <span
        className={`font-heading font-bold text-foreground ${textSizeClasses[size]}`}
      >
        TáComQuem
      </span>
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
