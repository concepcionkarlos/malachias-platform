// Fourthwall Storefront API — types, helpers, and server-side client

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FWImage {
  url: string
  width?: number
  height?: number
}

export interface FWPriceAmount {
  value: string    // cents as string — "2500" = $25.00
  currency: string // "USD"
}

export interface FWStock {
  limited: boolean
  count: number | null
}

export interface FWVariantAttribute {
  name: string   // e.g. "Size", "Color"
  value: string  // e.g. "Large", "Black"
}

export interface FWVariant {
  id: string
  name: string
  unitPrice: FWPriceAmount
  stock: FWStock
  attributes: FWVariantAttribute[]
}

export interface FWProduct {
  id: string
  name: string
  slug: string
  description: string  // HTML
  images: FWImage[]
  variants: FWVariant[]
  url: string          // Fourthwall storefront product URL (checkout handled by Fourthwall)
}

export interface FWCollection {
  id: string
  name: string
  slug: string
  description?: string
  images?: FWImage[]
}

// ── Price helpers ──────────────────────────────────────────────────────────────

export function fwCents(variant: FWVariant): number {
  return parseInt(variant.unitPrice.value, 10)
}

export function fwFormatPrice(cents: number): string {
  const d = cents / 100
  return `$${d % 1 === 0 ? d.toFixed(0) : d.toFixed(2)}`
}

export function fwMinPrice(product: FWProduct): number {
  if (!product.variants.length) return 0
  return Math.min(...product.variants.map(fwCents))
}

export function fwMaxPrice(product: FWProduct): number {
  if (!product.variants.length) return 0
  return Math.max(...product.variants.map(fwCents))
}

export function fwPriceRange(product: FWProduct): string {
  const min = fwMinPrice(product)
  const max = fwMaxPrice(product)
  if (min === max || max === 0) return fwFormatPrice(min)
  return `${fwFormatPrice(min)} – ${fwFormatPrice(max)}`
}

export function fwIsAvailable(product: FWProduct): boolean {
  return product.variants.some(v => !v.stock.limited || (v.stock.count ?? 0) > 0)
}

export function fwFirstImage(product: FWProduct): string | null {
  return product.images[0]?.url ?? null
}

// Derive a simple category tag from product name / description for display
export function fwCategory(product: FWProduct): string {
  const text = (product.name + ' ' + product.description).toLowerCase()
  if (text.includes('hoodie') || text.includes('tee') || text.includes('shirt') || text.includes('apparel') || text.includes('hat') || text.includes('cap')) return 'Apparel'
  if (text.includes('vinyl') || text.includes('cd') || text.includes('album') || text.includes('music') || text.includes('lp') || text.includes('ep')) return 'Music'
  if (text.includes('patch') || text.includes('sticker') || text.includes('pin') || text.includes('accessory')) return 'Accessories'
  return 'Merch'
}

// ── API client (server-only — never call from client components) ───────────────

const BASE = 'https://storefront.fourthwall.com/v1'

function getToken(): string | null {
  const t = process.env.FOURTHWALL_STOREFRONT_TOKEN
  if (!t || t === '' || t.startsWith('PASTE_')) return null
  return t
}

async function fwFetch<T>(path: string): Promise<T | null> {
  const token = getToken()
  if (!token) return null

  const sep = path.includes('?') ? '&' : '?'
  const url = `${BASE}${path}${sep}storefront_token=${token}`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

export async function fetchFWProducts(): Promise<FWProduct[]> {
  const data = await fwFetch<{ results: FWProduct[] }>('/products')
  return data?.results ?? []
}

export async function fetchFWProduct(slugOrId: string): Promise<FWProduct | null> {
  // Try direct ID lookup first, fall back to slug search in the full list
  const direct = await fwFetch<FWProduct>(`/products/${slugOrId}`)
  if (direct) return direct

  const all = await fetchFWProducts()
  return all.find(p => p.slug === slugOrId || p.id === slugOrId) ?? null
}

export async function fetchFWCollections(): Promise<FWCollection[]> {
  const data = await fwFetch<{ results: FWCollection[] }>('/collections')
  return data?.results ?? []
}
