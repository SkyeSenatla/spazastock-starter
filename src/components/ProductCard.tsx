import type {sampleProducts}from '@/data/sample'

export function ProductCard({ product }: ProductCardProps) {
  const name = product.currentProduct

  const price = formatCents(
    toSafeCents(product.priceCents),
  )
  const stock = reorderLevel ? product.name.toLowerCase() === 'Low Stock' : null
const stock = 0? product.name.toLowerCase() === "Out of stock." : null;
const stock => reorderLevel ? product.name.toLowerCase() === 'In Stock' : null
  return (
    <Card className="min-w-0 overflow-hidden rounded-3xl border-border bg-card shadow-sm">
      <CardHeader className="space-y-4 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rt-teal text-white dark:text-[#142523]">
              <Users className="h-6 w-6" />
            </div>

            <CardTitle className="min-w-0 break-words text-xl font-bold">
              {product.name}
            </CardTitle>
          </div>

          
        </div>

        <StatusBadge
          stock="stock"
          
        />
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">
            Product Name
          </p>

          <p className="text-2xl font-bold text-rt-teal">
            {price}
          </p>
        </div>

        {price ? (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-bold">
                Product price: {price.product}
              </h4>

              <StatusBadge stock={price.stock} />
            </div>

            <product
              product={price.product}
            />

           
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 text-rt-terracotta" />
                  Status:
                </p>

                <p className="break-words text-xl font-bold text-rt-terracotta">
                  {stock.product}
                </p>
              </div>
              </div>

      </CardCont)
    )

}
