import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import type { Product } from '@/api/stock'
import { createSale, SaleApiError } from '@/api/sales'
import type { Sale, SaleRequest } from '@/api/sales'
import { formatCents } from '@/lib/money'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Convert integer cents into editable rand text without Intl.
function centsToText(cents: number): string {
  const rands = Math.floor(cents / 100)
  const remainder = cents % 100

  return `${rands}.${String(remainder).padStart(2, '0')}`
}

// Convert rand text into integer cents without floating-point arithmetic.
function textToCents(value: string): number | null {
  const cleaned = value.trim().replace(/\s/g, '').replace(',', '.')

  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned)

  if (!match) return null

  const rands = Number(match[1])
  const cents = Number((match[2] ?? '').padEnd(2, '0'))
  const total = rands * 100 + cents

  return Number.isSafeInteger(total) ? total : null
}

const saleSchema = z.object({
  productId: z.string().min(1, 'Select a product.'),
  quantity: z
    .number()
    .int('Quantity must be a whole number.')
    .min(1, 'Quantity must be at least 1.'),
  price: z.string().refine(
    (value) => {
      const cents = textToCents(value)
      return cents !== null && cents > 0
    },
    'Enter a valid price greater than zero.',
  ),
})

type SaleFormValues = z.infer<typeof saleSchema>

type SaleFormProps = {
  products: Product[]
  categoryId: string
}

export function SaleForm({ products, categoryId }: SaleFormProps) {
  const queryClient = useQueryClient()
  const submittingRef = useRef(false)

  const [successMessage, setSuccessMessage] = useState('')
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      price: '',
    },
  })

  const selectedProductId = watch('productId')

  const mutation = useMutation<Sale, Error, SaleRequest>({
  mutationFn: (sale: SaleRequest) => createSale(sale),

    onSuccess: async (sale) => {
      const message = `Sold ${sale.quantity} × ${sale.productName} for ${formatCents(sale.totalInCents)}`

      setSuccessMessage(message)
      setFormError('')

      reset({
        productId: '',
        quantity: 1,
        price: '',
      })

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['products', categoryId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['sales', 'today'],
        }),
      ])
    },
  })

  async function onSubmit(values: SaleFormValues) {
    if (submittingRef.current || mutation.isPending) return

    const unitPriceInCents = textToCents(values.price)

    if (unitPriceInCents === null) {
      setError('price', {
        message: 'Enter a valid price.',
      })
      return
    }

    submittingRef.current = true
    setSuccessMessage('')
    setFormError('')

    try {
      await mutation.mutateAsync({
        productId: values.productId,
        quantity: values.quantity,
        unitPriceInCents,
      })
    } catch (error) {
      if (error instanceof SaleApiError) {
        if (error.status === 400 && error.errors) {
          for (const [field, messages] of Object.entries(error.errors)) {
            const message = messages.join(' ')

            if (field === 'unitPriceInCents') {
              setError('price', { message })
            } else if (field === 'quantity') {
              setError('quantity', { message })
            } else if (field === 'productId') {
              setError('productId', { message })
            } else {
              setFormError(message)
            }
          }
        }

        if (error.status === 409) {
          setFormError(error.detail ?? 'Not enough stock available.')
        } else if (error.status === 429) {
          setFormError(
            `Too many requests. Wait ${error.retryAfter ?? 'a few'} seconds before trying again.`,
          )
        } else if (error.status !== 400) {
          setFormError(error.detail ?? 'Unable to record sale.')
        }

        if (error.status !== 400 || !error.errors) {
          setFormError((current) => current || 'Unable to record sale.')
        }

        setFormError((current) =>
          current
            ? `${current} Reference: ${error.correlationId}`
            : `Reference: ${error.correlationId}`,
        )
      } else {
        setFormError('Network error. Please try again.')
      }
    } finally {
      submittingRef.current = false
    }
  }

  function handleProductChange(productId: string) {
    const product = products.find((item) => item.id === productId)

    setValue('productId', productId, { shouldValidate: true })
    setValue(
      'price',
      product ? centsToText(product.priceInCents) : '',
      { shouldValidate: true },
    )

    setSuccessMessage('')
    setFormError('')
  }

  return (
    <section className="space-y-4 rounded-lg border p-5">
      <div>
        <h2 className="text-xl font-semibold">Record a Sale</h2>
        <p className="text-sm text-muted-foreground">
          Select a product, enter the quantity and confirm the price.
        </p>
      </div>

      {successMessage && (
        <div
          role="status"
          className="rounded-md border border-green-600 p-3 text-sm"
        >
          {successMessage}
        </div>
      )}

      {formError && (
        <div
          role="alert"
          className="rounded-md border border-destructive p-3 text-sm"
        >
          {formError}
        </div>
      )}

      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="sale-product">Product</Label>

          <select
            id="sale-product"
            value={selectedProductId}
            onChange={(event) =>
              handleProductChange(event.target.value)
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Select a product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — {formatCents(product.priceInCents)}
              </option>
            ))}
          </select>

          {errors.productId && (
            <p className="text-sm text-destructive">
              {errors.productId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale-quantity">Quantity</Label>

          <Input
            id="sale-quantity"
            type="number"
            min="1"
            step="1"
            {...register('quantity', { valueAsNumber: true })}
          />

          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale-price">Unit price (R)</Label>

          <Input
            id="sale-price"
            type="text"
            inputMode="decimal"
            placeholder="29.99"
            {...register('price')}
          />

          {errors.price && (
            <p className="text-sm text-destructive">
              {errors.price.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending || products.length === 0}
        >
          {mutation.isPending ? 'Recording sale...' : 'Record Sale'}
        </Button>
      </form>
    </section>
  )
}