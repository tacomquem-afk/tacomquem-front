"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Item } from "@/types";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const itemImage = item.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden border-border-700 hover:shadow-xl hover:shadow-black/20 transition-shadow">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Badge
            variant={item.isActive ? "success" : "destructive"}
            className="absolute top-3 left-3 z-10 gap-1"
          >
            {item.isActive ? "Disponível" : "Inativo"}
          </Badge>

          {itemImage ? (
            <Image
              src={itemImage}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-surface-800 flex items-center justify-center">
              <Package className="size-12 text-muted-foreground" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

          {/* Created date */}
          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-xs font-medium opacity-90">
              Cadastrado em{" "}
              {format(new Date(item.createdAt), "d 'de' MMM, yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="text-base font-bold font-display mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" size="sm" className="w-full">
            Emprestar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
