"use client";

import type { User } from "@/types";

interface BetaBadgeProps {
  user: User | null;
  size?: "sm" | "md";
}

export function BetaBadge({ user, size = "sm" }: BetaBadgeProps) {
  if (!user || user.accessTier !== "BETA") {
    return null;
  }

  const addedDate = user.betaAddedAt
    ? new Date(user.betaAddedAt).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 font-semibold text-purple-400 ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      title={addedDate ? `Beta desde ${addedDate}` : "Acesso Beta"}
    >
      <span aria-hidden>⚡</span>
      BETA
    </span>
  );
}
