"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/use-dashboard";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const feelings = [
  { emoji: "😄", label: "Tranquilo", value: "calm" },
  { emoji: "😐", label: "Neutro", value: "neutral" },
  { emoji: "😰", label: "Preocupado", value: "worried" },
];

export function WellnessCheckIn() {
  const [selected, setSelected] = useState<string | null>(null);
  const { data } = useDashboard();
  const highlightedItem = data?.activeLoans[0]?.itemName;

  return (
    <Card className="border-border-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400">
            <Smile className="size-5" />
          </div>
          <CardTitle className="text-base">Check-in Social</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Emprestar itens fortalece laços, mas pode causar ansiedade. Como você
          se sente sobre{` `}
          {highlightedItem
            ? `o empréstimo de ${highlightedItem}?`
            : "seus empréstimos?"}
        </p>

        <div className="flex gap-2">
          {feelings.map((feeling) => (
            <Button
              key={feeling.value}
              variant="outline"
              size="lg"
              className={cn(
                "flex-1 text-2xl h-auto py-3 hover:scale-105 transition-transform",
                selected === feeling.value && "bg-primary/10 border-primary"
              )}
              onClick={() => setSelected(feeling.value)}
              title={feeling.label}
            >
              {feeling.emoji}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
