import { ModeToggle } from '@/components/ModeToggle'
//import { sampleProducts } from './data/sample'
import { Boxes, PackageSearch } from 'lucide-react'
import { ProductCard } from './components/ProductCard'
import { useEffect, useState } from 'react'
import { InventoryError } from './components/InventoryError'
import { useCategories, useCategoryProducts } from './api/inventory'
import { Skeleton } from './components/ui/skeleton'
import { NativeSelect } from './components/ui/native-select'
import { Button } from './components/ui/button'
// Start here. Round 1 builds the shelf from src/data/sample.ts, Round 2
// replaces it with the API, and Round 3 adds the "Record a sale" form.
export default function App() {
  const [now, setNow] = useState(() => Date.now())
  const [chosenCategoryId, setChosenCategoryId] = useState<string | null>(null)
  const categoriesQuery = useCategories()
  const categories = categoriesQuery.data ?? []
  const categoryId = chosenCategoryId ?? categories[0]?.id ?? null
  const selectedCategory = categories.find(category => category.id === categoryId)
  const productsQuery = useCategoryProducts(categoryId)
  const products = productsQuery.data?.pages.flatMap(page => page.items) ?? []

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(intervalId)}, [])

  return (
    <div className="min-h-svh min-w-0 bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2 text-primary-foreground">
              <Boxes aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">SpazaStock</h1>
              <p className="text-xs text-muted-foreground">Live shelf inventory</p>
            </div>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {selectedCategory?.name ?? 'Your shop'}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Product shelf</h2>
            <p className="text-sm text-muted-foreground">
              Browse category stock, shelf prices and recent changes.
            </p>
          </div>

          {categoriesQuery.isPending ? (
            <div role="status" aria-label="Loading categories" className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-52" />
            </div>
          ) : !categoriesQuery.isError && categories.length > 0 ? (
            <div className="min-w-0 space-y-1.5">
              <label htmlFor="shelf-category" className="block text-sm font-medium">Category</label>
              <NativeSelect
                id="shelf-category"
                aria-label="Product category"
                className="w-full min-w-48 sm:w-56"
                value={categoryId ?? ''}
                onChange={event => setChosenCategoryId(event.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </NativeSelect>
            </div>
          ) : null}
        </div>

        {categoriesQuery.isPending ? (
          <ProductSkeletons />
        ) : categoriesQuery.isError ? (
          <InventoryError error={categoriesQuery.error} onRetry={() => void categoriesQuery.refetch()} />
        ) : categories.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            No categories are available.
          </div>
        ) : productsQuery.isPending ? (
          <ProductSkeletons />
        ) : productsQuery.isError && !productsQuery.data ? (
          <InventoryError
            error={productsQuery.error}
            categoryProducts
            onRetry={() => void productsQuery.refetch()}
          />
        ) : products.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            <PackageSearch aria-hidden="true" className="size-5 shrink-0" />
            There are no products in this category.
          </div>
        ) : (
          <section aria-label={`${selectedCategory?.name ?? 'Selected category'} product shelf`}>
            <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
              {products.length} {products.length === 1 ? 'product' : 'products'} loaded
            </p>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} now={now} />
              ))}
            </div>
            {(productsQuery.isFetchNextPageError || productsQuery.isRefetchError) && (
              <div className="mt-5">
                <InventoryError error={productsQuery.error} onRetry={() => void (productsQuery.isFetchNextPageError ? productsQuery.fetchNextPage() : productsQuery.refetch())} />
              </div>
            )}
            {productsQuery.hasNextPage && !productsQuery.isFetchNextPageError && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={productsQuery.isFetchingNextPage}
                  onClick={() => void productsQuery.fetchNextPage()}
                >
                  {productsQuery.isFetchingNextPage ? 'Loading more…' : 'Load more products'}
                </Button>
              </div>
            )}
          </section>
        )}
      </main>

    </div>
  )
}

function ProductSkeletons() {
  return (
    <div role="status" aria-label="Loading products" className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="space-y-5 rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="size-10" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <div className="flex justify-between gap-4">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-12" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
      <span className="sr-only">Loading product shelf</span>
    </div>
  )
}