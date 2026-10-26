import { useEffect, useState } from 'react'
import { describeError } from '../lib/errorMessages'
import type { components } from '@/api/schema'

interface Props {
  error: unknown
  onRetry?: () => void
  onBack?: () => void   
}

function useCountdown(start: number | undefined) {
  const [left, setLeft] = useState(start ?? 0)
  useEffect(() => {
    if (!start) return
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 500)
    return () => clearInterval(id) 
  }, [start])
  return left
}

export function ErrorView({ error, onRetry, onBack }: Props) {
  const d = describeError(error)
  const left = useCountdown(d.retryAfter)
  const message = d.kind === 'rateLimited' && d.retryAfter !== undefined ? `Please try again in ${left} seconds.` : undefined

  export function ErrorView({ error, onRetry, onBack }: Props) {
  const d = describeError(error)
  const left = useCountdown(d.retryAfter)
  const message = d.kind === 'rateLimited' && d.retryAfter !== undefined
    ? `Too many requests. Try again in ${left} ${left === 1 ? 'second' : 'seconds'}.`
    : d.message

  return (
    {d.kind ===CategorynotFound' && Discontinued})
  )

type Product = components['schemas']['Product']

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString()

// Round 1 only: six products from the Cold drinks shelf, shaped exactly like
// the API's Product. In Round 2 you replace this with live data.
export const sampleProducts: Product[] = [
  { id: 'cola-2l', name: 'Cola 2L', priceInCents: 2999, stock: 14, reorderLevel: 6, updatedAt: minutesAgo(3) },
  { id: 'lemon-2l', name: 'Lemonade 2L', priceInCents: 2799, stock: 4, reorderLevel: 6, updatedAt: minutesAgo(12) },
  { id: 'ginger-beer-2l', name: 'Ginger beer 2L', priceInCents: 2799, stock: 0, reorderLevel: 4, updatedAt: minutesAgo(45) },
  { id: 'orange-squash-2l', name: 'Orange squash 2L', priceInCents: 4599, stock: 7, reorderLevel: 3, updatedAt: minutesAgo(80) },
  { id: 'iced-tea-1-5l', name: 'Iced tea 1.5L', priceInCents: 2499, stock: 9, reorderLevel: 4, updatedAt: minutesAgo(6) },
  { id: 'energy-250ml', name: 'Energy drink 250ml', priceInCents: 2899, stock: 3, reorderLevel: 5, updatedAt: minutesAgo(30) },
]
 export const stockBadge = sampleProducts[] =[


 ]
 }
