import createClient from 'openapi-fetch'
import type { paths } from '@/api/schema'

// Typed API client based on the generated OpenAPI contract.
export const api = createClient<paths>({
  baseUrl: window.location.origin,
})