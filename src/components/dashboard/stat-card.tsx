import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: number
  trend?: string
  variant?: 'default' | 'warning' | 'success'
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'border-border-700',
    warning: 'border-accent-amber/30 bg-accent-amber/5',
    success: 'border-accent-green/30 bg-accent-green/5',
  }

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          {trend && (
            <span className="text-xs text-muted-foreground">{trend}</span>
          )}
        </div>
        <p className="text-3xl font-bold font-display">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-9 w-9 mb-4" />
        <Skeleton className="h-9 w-16 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  )
}
