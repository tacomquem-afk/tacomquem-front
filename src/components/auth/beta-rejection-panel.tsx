import { Lock } from "lucide-react";

export function BetaRejectionPanel() {
  return (
    <div className="rounded-xl border border-[#2b8cee]/30 bg-[#2b8cee]/5 p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 rounded-full bg-[#2b8cee]/20 p-1.5">
          <Lock className="h-4 w-4 text-[#2b8cee]" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm">Acesso Beta Privado</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O TáComQuem está em acesso antecipado por convite. Em breve
            abriremos para todos!
          </p>
        </div>
      </div>
    </div>
  );
}
