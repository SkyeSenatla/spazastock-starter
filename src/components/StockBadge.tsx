import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getStockStatus } from '@/lib/stock'

export function StockBadge({stock, reorderLevel,}: {stock: number,  reorderLevel: number}) 
{
  const status = getStockStatus(stock, reorderLevel)

  if (status === 'out of stock') {
    return (
      <Badge variant="destructive" className="gap-1.5 py-3">
        <XCircle aria-hidden="true" /> Out of Stock </Badge>
    )
  }

  if (status === 'low stock') {
    return (
      <Badge variant="outline" className="gap-1.5 border-amber-500/50 bg-amber-500/10 py-3 text-amber-800 dark:text-amber-300">
        <AlertTriangle aria-hidden="true" />Low stock</Badge>
    )
  }

  return (
    <Badge variant="secondary" className="gap-1.5 py-3">
      <CheckCircle2 aria-hidden="true" /> In stock</Badge>
  )
}
