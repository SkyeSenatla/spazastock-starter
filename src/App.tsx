import { ModeToggle } from '@/components/ModeToggle'
import { sampleProducts } from './data/sample'
import { Boxes } from 'lucide-react'
import { ProductCard } from './components/ProductCard'
import { useEffect, useState } from 'react'

// Start here. Round 1 builds the shelf from src/data/sample.ts, Round 2
// replaces it with the API, and Round 3 adds the "Record a sale" form.
export default function App() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(intervalId)}, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2 text-primary-foreground">
              <Boxes aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">SpazaStock</h1>
            </div>
          </div>
          <h1 className="text-lg font-semibold">SpazaStock</h1>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cold drinks</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Product shelf</h2>
            <p className="text-sm text-muted-foreground">Check prices, stock availability and recent changes.</p>
          </div>
          <p className="rounded-full border px-3 py-1 text-sm text-muted-foreground">{sampleProducts.length} products</p>
        </div>
        <section aria-label="Cold drinks product shelf" className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleProducts.map((product) => (<ProductCard key={product.id} product={product} now={now} />))}
        </section>
      </main>

    </div>
  )
}