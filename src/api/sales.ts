import { api } from '@/api/client'
import type { components } from '@/api/schema'
import { ApiError } from '@/api/stock'

export type SaleRequest = components['schemas']['SaleRequest']
export type Sale = components['schemas']['Sale']
export type SalesToday = components['schemas']['SalesToday']
export type ProblemDetails = components['schemas']['ProblemDetails']

export class SaleApiError extends ApiError {
  public detail?: string
  public errors?: Record<string, string[]>

  constructor(
    status: number,
    correlationId: string,
    detail?: string,
    errors?: Record<string, string[]>,
    retryAfter?: number,
  ) {
    super(status, correlationId, retryAfter)

    this.name = 'SaleApiError'
    this.detail = detail
    this.errors = errors
  }
}

export async function createSale(
  sale: SaleRequest,
  idempotencyKey?: string,
): Promise<Sale> {
  const { data, error, response } = await api.POST('/api/v1/sales', {
    body: sale,
    headers: idempotencyKey
      ? { 'Idempotency-Key': idempotencyKey }
      : undefined,
  })

  if (error || !data) {
    throw new SaleApiError(
      response.status,
      error?.correlationId ?? 'Unknown',
      error?.detail,
      error?.errors,
      Number(response.headers.get('Retry-After')) || undefined,
    )
  }

  return data
}

export async function getSalesToday(): Promise<SalesToday> {
  const { data, error, response } = await api.GET('/api/v1/sales/today')

  if (error || !data) {
    throw new ApiError(
      response.status,
      error?.correlationId ?? 'Unknown',
      Number(response.headers.get('Retry-After')) || undefined,
    )
  }

  return data
}