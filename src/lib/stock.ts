export type StockStatus = 'out of stock' | 'low stock' | 'in stock'

export function getStockStatus(stock: number, reorderLevel: number): StockStatus 
{
  if (stock === 0) return 'out of stock'
  if (stock <= reorderLevel) return 'low stock'
  return 'in stock'
}

export function updatedAgo(updatedAt: string, now: number): string 
{
  const timestamp = Date.parse(updatedAt)

  if (!Number.isFinite(timestamp)) return 'Updated time unavailable'

  const elapsedMinutes = Math.max(0, Math.floor((now - timestamp) / 60_000))

  if (elapsedMinutes < 1) return 'Updated just now'
  if (elapsedMinutes < 60) return `Updated ${elapsedMinutes} minutes ago`

  const hours = Math.floor(elapsedMinutes / 60)
  if (hours < 24) return `Updated ${hours} hours ago`

  const days = Math.floor(hours / 24)
  return `Updated ${days} ${days === 1 ? 'day' : 'days'} ago`
}
