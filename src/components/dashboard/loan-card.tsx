"use client"

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useReturnLoan, useRemindLoan } from '@/hooks/use-loans'
import { Clock, CheckCircle, AlertCircle, Package } from 'lucide-react'
import type { Loan, Item, User } from '@/types'

type LoanCardProps = {
  loan: Loan & {
    item: Pick<Item, 'name' | 'images'>
    borrower: Pick<User, 'name' | 'avatarUrl'>
  }
}

export function LoanCard({ loan }: LoanCardProps) {
  const returnMutation = useReturnLoan()
  const remindMutation = useRemindLoan()

  const statusConfig = {
    PENDING: { label: 'Pendente', icon: Clock, variant: 'warning' as const },
    CONFIRMED: { label: 'Emprestado', icon: Clock, variant: 'warning' as const },
    RETURNED: { label: 'Devolvido', icon: CheckCircle, variant: 'success' as const },
    CANCELLED: { label: 'Cancelado', icon: AlertCircle, variant: 'destructive' as const },
  }

  const config = statusConfig[loan.status]
  const StatusIcon = config.icon

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
            variant={config.variant}
            className="absolute top-3 left-3 z-10 gap-1"
          >
            <StatusIcon className="size-3" />
            {config.label}
          </Badge>

          {loan.item.images[0] ? (
            <Image
              src={loan.item.images[0]}
              alt={loan.item.name}
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

          {/* Expected return */}
          {loan.expectedReturnDate && loan.status !== 'RETURNED' && (
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-medium opacity-90">
                Devolução esperada:{' '}
                {formatDistanceToNow(new Date(loan.expectedReturnDate), {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="text-base font-bold font-display mb-2">
            {loan.item.name}
          </h3>

          <div className="flex items-center gap-2">
            <Avatar className="size-6 border border-border-700">
              <AvatarImage src={loan.borrower.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xs">
                {loan.borrower.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Com{' '}
              <span className="font-medium text-foreground">
                {loan.borrower.name}
              </span>
            </span>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          {loan.status === 'CONFIRMED' ? (
            <div className="w-full flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => remindMutation.mutate(loan.id)}
                disabled={remindMutation.isPending}
              >
                Lembrar
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => returnMutation.mutate(loan.id)}
                disabled={returnMutation.isPending}
              >
                Marcar Devolvido
              </Button>
            </div>
          ) : loan.status === 'RETURNED' ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
            >
              Avaliar Estado
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
