import { Clock, Box } from 'lucide-react'
import type { components } from '@/api/schema'
import {Card, CardContent, CardFooter, CardHeader,CardTitle} from '@/components/ui/card'
import { StockBadge } from '@/components/StockBadge'
import { formatCents } from '@/lib/money'
import { updatedAgo } from '@/lib/stock'


type Product = components['schemas']['Product']

export function ProductCard({ product, now }: { product: Product; now: number }) 
{
  return (
    <Card className="min-w-0 justify-between gap-4">
      <CardHeader className="gap-3">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <span className="rounded-lg bg-muted p-2.5 text-muted-foreground">
            <Box aria-hidden="true" className="size-5" />
          </span>
          <StockBadge stock={product.stock} reorderLevel={product.reorderLevel} />
        </div>
        <CardTitle className="break-words text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Shelf price</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{formatCents(product.priceInCents)}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums">{product.stock}</p>
          <p className="text-xs text-muted-foreground">on shelf</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock aria-hidden="true" className="size-3.5 shrink-0" />
        <time dateTime={product.updatedAt}>{updatedAgo(product.updatedAt, now)}</time>
      </CardFooter>
    </Card>
  )
}
