import { api } from '@/api/client'
import type { components } from '@/api/schema'

export type Category = components['schemas']['Category']
export type Product = components['schemas']['Product']
export type ProductPage = components['schemas']['ProductPage']
export type ProblemDetails = components['schemas']['ProblemDetails']

export class ApiError extends Error {
  public status: number
  public correlationId: string
  public retryAfter?: number

  constructor(
    status: number,
    correlationId: string,
    retryAfter?: number,
  ) {
    super(`API request failed with status ${status}`)
    this.name = 'ApiError'

    this.status = status
    this.correlationId = correlationId
    this.retryAfter = retryAfter
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data, error, response } = await api.GET('/api/v1/categories')

  if (error || !data) {
    throw new ApiError(
      response.status,
      error?.correlationId ?? 'Unknown',
      Number(response.headers.get('Retry-After')) || undefined,
    )
  }

  return data
}

export async function getProducts(
  categoryId: string,
  pageToken?: string,
): Promise<ProductPage> {
  const { data, error, response } = await api.GET(
    '/api/v1/categories/{id}/products',
    {
      params: {
        path: { id: categoryId },
        query: {
          pageSize: 6,
          ...(pageToken ? { pageToken } : {}),
        },
      },
    },
  )

  if (error || !data) {
    throw new ApiError(
      response.status,
      error?.correlationId ?? 'Unknown',
      Number(response.headers.get('Retry-After')) || undefined,
    )
  }

  return data
}