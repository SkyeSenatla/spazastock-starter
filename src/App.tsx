import { ModeToggle } from '@/components/ModeToggle'

// Start here. Round 1 builds the shelf from src/data/sample.ts, Round 2
// replaces it with the API, and Round 3 adds the "Record a sale" form.
import { useEffect, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './api/queryClient'
import { ApiError } from './api/apiError'
import { formatCents, product} from './data/sample'
import type { Product } from './data/sample'

function stockBadge({product}: {product: Product}) {

    product.stock === 0
    {
    label: 'out of stock',
    icon:  ,
    text-green-500 ,
    color-green-500 ,

  }
  product.stock <= product.reaorderlevel
  {
    label: 'low stock',
    icon:  ,
    text-red-500 ,
    color-red-500 ,
  }
  product.stock > product.reorderLevel
  {
    label: 'in stock',
    icon:  ,
    text-yellow-500 ,
    color-yellow-500 ,
  }
}
export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-lg font-semibold">SpazaStock</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-6">
        <p className="text-muted-foreground">Thandeka's shelves go here.</p>
      </main>
    </div>
  )
}

