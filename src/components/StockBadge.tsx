import type { components } from '@/api/schema'
import { Badge } from '@/components/ui/badge'

type Product = components['schemas']['Product']

type StockBadgeProps = {
  stock: Product['stock']
  reorderLevel: Product['reorderLevel']
}

export function StockBadge({ stock, reorderLevel }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge variant="destructive">
        <span aria-hidden="true">✕</span>
        Out of stock
      </Badge>
    )
  }

  if (stock <= reorderLevel) {
    return (
      <Badge variant="secondary">
        <span aria-hidden="true">⚠</span>
        Low stock
      </Badge>
    )
  }

  return (
    <Badge variant="outline">
      <span aria-hidden="true">✓</span>
      In stock
    </Badge>
  )
}