import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Handshake,
  CheckCircle,
  Bell,
  XCircle,
} from 'lucide-react'

const iconMap = {
  loan: Handshake,
  return: CheckCircle,
  reminder: Bell,
  cancel: XCircle,
}

const colorMap = {
  loan: 'text-blue-400 bg-blue-900/20',
  return: 'text-green-400 bg-green-900/20',
  reminder: 'text-amber-400 bg-amber-900/20',
  cancel: 'text-red-400 bg-red-900/20',
}

type Activity = {
  id: string
  type: 'loan' | 'return' | 'reminder' | 'cancel'
  itemName: string
  userName: string
  timestamp: string
}

// Mock data (substituir com dados reais)
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'loan',
    itemName: 'Jogo de Tabuleiro',
    userName: 'Ana',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'return',
    itemName: 'Mala de Viagem',
    userName: 'Carlos',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'reminder',
    itemName: 'Câmera DSLR',
    userName: 'Lucas',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function ActivityTimeline() {
  return (
    <Card className="border-border-700 flex-1">
      <CardHeader>
        <CardTitle className="text-base">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col gap-4">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border-700" />

          {mockActivities.map((activity) => {
            const Icon = iconMap[activity.type]
            const colorClass = colorMap[activity.type]

            return (
              <div key={activity.id} className="flex gap-4 relative">
                <div
                  className={cn(
                    'size-10 rounded-full border-2 border-surface-900 z-10 flex items-center justify-center shrink-0',
                    colorClass
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col py-0.5">
                  <p className="text-sm font-medium">{activity.itemName}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type === 'loan' && `Emprestado para `}
                    {activity.type === 'return' && `Devolvido por `}
                    {activity.type === 'reminder' && `Lembrete para `}
                    <span className="text-foreground">{activity.userName}</span>
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-6 text-xs"
        >
          Ver histórico completo
        </Button>
      </CardContent>
    </Card>
  )
}
