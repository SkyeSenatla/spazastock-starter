import { SaleForm } from '@/components/SaleForm'
import { getSalesToday } from '@/api/sales'
import { formatCents } from '@/lib/money'
import { useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ModeToggle } from '@/components/ModeToggle'
import { ProductCard } from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { getCategories, getProducts, ApiError } from '@/api/stock'

// Start here. Round 1 builds the shelf from src/data/sample.ts, Round 2
// replaces it with the API, and Round 3 adds the "Record a sale" form.
export default function App() {
  const [categoryId, setCategoryId] = useState('')

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const categories = categoriesQuery.data ?? []

  const selectedCategoryId = categoryId || categories[0]?.id || ''

  const productsQuery = useInfiniteQuery({
    queryKey: ['products', selectedCategoryId],
    queryFn: ({ pageParam }) =>
      getProducts(selectedCategoryId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextPageToken ?? undefined,
    enabled: Boolean(selectedCategoryId),
  })

  const products =
    productsQuery.data?.pages.flatMap((page) => page.items) ?? []

  // Round 3: Fetch today's sales summary.
  const salesTodayQuery = useQuery({
    queryKey: ['sales', 'today'],
    queryFn: getSalesToday,
  })

  function renderError(error: Error, retry: () => void) {
    if (error instanceof ApiError) {
      let message = error.message

      if (error.status === 404) {
        message = 'Category not found.'
      } else if (error.status === 429) {
        message = `Too many requests. Please wait ${
          error.retryAfter ?? 'a few'
        } seconds before trying again.`
      } else if (error.status >= 500) {
        message = 'The server is temporarily unavailable.'
      }

      return (
        <div
          role="alert"
          className="space-y-3 rounded-lg border border-destructive p-4"
        >
          <p className="font-medium">{message}</p>
          <p className="text-sm text-muted-foreground">
            Reference: {error.correlationId}
          </p>
          <Button type="button" variant="outline" onClick={retry}>
            Try again
          </Button>
        </div>
      )
    }

    return (
      <div role="alert" className="space-y-3 rounded-lg border p-4">
        <p>Unable to load data. Please check your connection.</p>
        <Button type="button" onClick={retry}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-lg font-semibold">SpazaStock</h1>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Thandeka's Shelves</h2>
            <p className="text-muted-foreground">
              View products, prices, and stock availability.
            </p>
          </div>

          {categoriesQuery.isPending ? (
            <Skeleton className="h-10 w-full max-w-sm" />
          ) : categoriesQuery.isError ? (
            renderError(categoriesQuery.error, () => {
              void categoriesQuery.refetch()
            })
          ) : categories.length === 0 ? (
            <p>No categories available.</p>
          ) : (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium"
                >
                  Select category
                </label>

                <select
                  id="category"
                  value={selectedCategoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                  className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {productsQuery.isPending ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {Array.from({ length: 6 }, (_, index) => (
                    <Skeleton
                      key={index}
                      className="h-48 rounded-lg"
                    />
                  ))}
                </div>
              ) : productsQuery.isError ? (
                renderError(productsQuery.error, () => {
                  void productsQuery.refetch()
                })
              ) : products.length === 0 ? (
                <p className="rounded-lg border p-6 text-muted-foreground">
                  No products available in this category.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>

                  {productsQuery.hasNextPage && (
                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        disabled={productsQuery.isFetchingNextPage}
                        onClick={() => {
                          void productsQuery.fetchNextPage()
                        }}
                      >
                        {productsQuery.isFetchingNextPage
                          ? 'Loading more...'
                          : 'Load more'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>

        {/* Round 3: Today's sales summary */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Sales</h2>

          {salesTodayQuery.isPending ? (
            <Skeleton className="h-24 w-full rounded-lg" />
          ) : salesTodayQuery.isError ? (
            renderError(salesTodayQuery.error, () => {
              void salesTodayQuery.refetch()
            })
          ) : (
            <div className="rounded-lg border p-5">
              <p className="text-sm text-muted-foreground">
                Sales recorded today
              </p>

              <p className="text-xl font-semibold">
                {salesTodayQuery.data.count}
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                Total sales
              </p>

              <p className="text-2xl font-bold">
                {formatCents(salesTodayQuery.data.totalInCents)}
              </p>
            </div>
          )}
        </section>

        {/* Round 3: Record a sale */}
        <SaleForm
          key={selectedCategoryId}
          products={products}
          categoryId={selectedCategoryId}
        />
      </main>
    </div>
  )
}