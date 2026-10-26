import createClient from 'openapi-fetch'
import type { components, paths } from './schema'

type Problem = components['schemas']['ProblemDetails']

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/$/, '')

export const api = createClient<paths>({ baseUrl })

function getProblem(value: unknown): Problem | null {
  if (typeof value !== 'object' || value === null) return null

  const object = value as Record<string, unknown>

  if (
    typeof object.title !== 'string' || typeof object.status !== 'number' ||typeof object.correlationId !== 'string') 
    { return null}

  return value as Problem
}

export class ApiError extends Error {
  readonly status: number
  readonly problem: Problem | null
  readonly retryAfter: string | null

  constructor(status: number, payload: unknown, retryAfter: string | null = null) {
    const problem = getProblem(payload)
    super(problem?.detail ?? problem?.title ?? `Request failed (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
    this.retryAfter = retryAfter
  }
}

export function unwrap<T>(result: {
  data?: T
  error?: unknown
  response: Response
}): T {
  if (!result.response.ok) {
    throw new ApiError(
      result.response.status,
      result.error,
      result.response.headers.get('Retry-After'),
    )
  }

  if (result.data === undefined) {
    throw new Error('The server returned an empty response.')
  }

  return result.data
}

export function parseRetryAfter(header: string | null, now = Date.now()): number | null {
  if (header === null) return null

  const value = header.trim()
  if (!value) return null

  if (/^\d+$/.test(value)) {
    const seconds = Number(value)
    return Number.isSafeInteger(seconds) ? seconds : null
  }

  const date = Date.parse(value)
  if (Number.isNaN(date) || new Date(date).toUTCString() !== value) return null

  return Math.max(0, Math.ceil((date - now) / 1000))
}
