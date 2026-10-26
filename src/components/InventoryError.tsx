import { AlertCircle, RefreshCcw } from 'lucide-react'
import { ApiError, parseRetryAfter } from '../api/clients'
import { Button } from '@/components/ui/button'

export function InventoryError({
  error,
  onRetry,
  categoryProducts = false,
}: {
  error: unknown
  onRetry: () => void
  categoryProducts?: boolean
}) {
  const apiError = error instanceof ApiError ? error : null
  const reference = apiError?.problem?.correlationId
  const retryAfter = parseRetryAfter(apiError?.retryAfter ?? null)

  let title = 'Unable to load stock'
  let message = 'Check your connection and try again.'

  if (apiError?.status === 404 && categoryProducts) {
    title = 'Category not found'
    message = 'This category is no longer available.'
  } else if (apiError?.status === 429) {
    title = 'Too many requests'
    message = retryAfter === null
      ? 'Please wait before trying again.'
      : `Please wait ${retryAfter} seconds before trying again.`
  } else if (apiError?.status === 500) {
    title = 'Unable to load stock'
    message = 'The server could not load these products. Please try again.'
  } else if (apiError) {
    message = apiError.problem?.detail ?? 'The request could not be completed.'
  }

  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-card p-5 text-card-foreground">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="min-w-0 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
          {reference && <p className="break-all text-xs text-muted-foreground">Reference: {reference}</p>}
          <Button type="button" variant="outline" onClick={onRetry} className="mt-2">
            <RefreshCcw aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
