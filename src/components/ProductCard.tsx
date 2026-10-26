import { useEffect, useState } from 'react'
import type { components } from '@/api/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockBadge } from '@/components/StockBadge'
import { formatCents } from '@/lib/money'

type Product = components['schemas']['Product']

type ProductCardProps = {
  product: Product
}

function getMinutesAgo(updatedAt: string, now: number): number {
  return Math.max(
    0,
    Math.floor((now - new Date(updatedAt).getTime()) / 60_000),
  )
}

export function ProductCard({ product }: ProductCardProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 30_000)

    return () => window.clearInterval(timer)
  }, [])

  const minutesAgo = getMinutesAgo(product.updatedAt, now)

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="break-words">{product.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-2xl font-semibold">
          {formatCents(product.priceInCents)}
        </p>

        <StockBadge
          stock={product.stock}
          reorderLevel={product.reorderLevel}
        />

        <p className="text-sm text-muted-foreground">
          Available stock: {product.stock}
        </p>

        <p className="text-xs text-muted-foreground">
          Updated {minutesAgo} min ago
        </p>
      </CardContent>
    </Card>
  )
}