"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Friend } from "@/types";

type FriendCardProps = {
  friend: Friend;
};

export function FriendCard({ friend }: FriendCardProps) {
  const initials = friend.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-border-700 hover:shadow-xl hover:shadow-black/20 transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 border-2 border-border-700">
              <AvatarImage
                src={friend.avatarUrl ?? undefined}
                alt={friend.name}
              />
              <AvatarFallback className="text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold font-display truncate">
                {friend.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Mail className="size-3 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground truncate">
                  {friend.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-800">
              <ArrowUpRight className="size-4 text-accent-green shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Emprestou</p>
                <p className="text-sm font-bold">{friend.lentCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-800">
              <ArrowDownLeft className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Pegou</p>
                <p className="text-sm font-bold">{friend.borrowedCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
