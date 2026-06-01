// Fourthwall Storefront API — types, helpers, and server-side client
// Base: https://storefront-api.fourthwall.com  (NOT storefront.fourthwall.com)
// Auth: ?storefront_token=TOKEN  query param

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FWImage {
  id: string
  url: string
  transformedUrl?: string
  width?: number
  height?: number
}

export interface FWPriceAmount {
  value: number    // float — e.g. 34.99 (NOT cents string)
  currency: string // "USD"
}

export interface FWVariantColor {
  name: string   // e.g. "Navy"
  swatch: string // hex — e.g. "#141722"
}

export interface FWVariantSize {
  name: string   // e.g. "S", "M", "L", "XL"
}

export interface FWVariantAttributes {
  description: string        // e.g. "Navy, S"
  color?: FWVariantColor
  size?: FWVariantSize
}

export interface FWStock {
  type: 'UNLIMITED' | 'LIMITED' | 'SOLD_OUT'
  count?: number             // only present when type = LIMITED
}

export interface FWVariant {
  id: string
  name: string
  sku?: string
  unitPrice: FWPriceAmount
  compareAtPrice: FWPriceAmount | null
  attributes: FWVariantAttributes
  stock: FWStock
  images: FWImage[]
}

export interface FWProductState {
  type: 'AVAILABLE' | 'UNAVAILABLE' | 'ARCHIVED'
}

export interface FWProduct {
  id: string
  name: string
  slug: string
  description: string   // HTML
  state: FWProductState
  images: FWImage[]
  variants: FWVariant[]
  url: string           // Constructed — Fourthwall shop product URL (checkout by Fourthwall)
}

export interface FWCollection {
  id: string
  name: string
  slug: string
  description?: string
}

export interface FWShop {
  id: string
  name: string
  domain: string        // slug, e.g. "reboundrockband-shop"
  publicDomain: string  // full, e.g. "reboundrockband-shop.fourthwall.com"
}

export interface FWPaging {
  pageNumber: number
  pageSize: number
  elementsSize: number
  elementsTotal: number
  totalPages: number
  hasNextPage: boolean
}

// ── Price helpers ──────────────────────────────────────────────────────────────

export function fwFormatPrice(value: number): string {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`
}

export function fwMinPrice(product: FWProduct): number {
  if (!product.variants.length) return 0
  return Math.min(...product.variants.map(v => v.unitPrice.value))
}

export function fwMaxPrice(product: FWProduct): number {
  if (!product.variants.length) return 0
  return Math.max(...product.variants.map(v => v.unitPrice.value))
}

export function fwPriceRange(product: FWProduct): string {
  const min = fwMinPrice(product)
  const max = fwMaxPrice(product)
  if (!min && !max) return '—'
  if (Math.abs(min - max) < 0.01) return fwFormatPrice(min)
  return `${fwFormatPrice(min)} – ${fwFormatPrice(max)}`
}

export function fwIsAvailable(product: FWProduct): boolean {
  if (product.state.type !== 'AVAILABLE') return false
  return product.variants.some(v => v.stock.type !== 'SOLD_OUT')
}

export function fwVariantInStock(variant: FWVariant): boolean {
  return variant.stock.type !== 'SOLD_OUT'
}

export function fwFirstImage(product: FWProduct): string | null {
  return product.images[0]?.url ?? product.variants[0]?.images[0]?.url ?? null
}

export function fwCategory(product: FWProduct): string {
  const text = (product.name + ' ' + product.description).toLowerCase()
  if (text.includes('hoodie') || text.includes('tee') || text.includes('shirt') || text.includes('apparel') || text.includes('hat') || text.includes('cap') || text.includes('jacket')) return 'Apparel'
  if (text.includes('vinyl') || text.includes('cd') || text.includes('album') || text.includes('lp') || text.includes('ep')) return 'Music'
  if (text.includes('patch') || text.includes('sticker') || text.includes('pin') || text.includes('poster') || text.includes('flag')) return 'Accessories'
  return 'Merch'
}

// Unique color options across all variants
export function fwColors(product: FWProduct): FWVariantColor[] {
  const seen = new Set<string>()
  const colors: FWVariantColor[] = []
  for (const v of product.variants) {
    const c = v.attributes.color
    if (c && !seen.has(c.name)) { seen.add(c.name); colors.push(c) }
  }
  return colors
}

// Unique size options across all variants
export function fwSizes(product: FWProduct): string[] {
  const seen = new Set<string>()
  for (const v of product.variants) {
    const s = v.attributes.size
    if (s) seen.add(s.name)
  }
  // Sort by standard size order
  const order = ['XS','S','M','L','XL','2XL','3XL','4XL','5XL']
  return [...seen].sort((a, b) => {
    const ai = order.indexOf(a)
    const bi = order.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

// Find a variant matching a color+size selection
export function fwFindVariant(product: FWProduct, colorName?: string, sizeName?: string): FWVariant | null {
  return product.variants.find(v => {
    const colorMatch = !colorName || v.attributes.color?.name === colorName
    const sizeMatch = !sizeName || v.attributes.size?.name === sizeName
    return colorMatch && sizeMatch
  }) ?? null
}

// ── API client (server-only — token never exposed to client) ───────────────────

const BASE = 'https://storefront-api.fourthwall.com'

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

async function fetchShop(): Promise<FWShop | null> {
  return fwFetch<FWShop>('/v1/shop')
}

function buildProductUrl(shop: FWShop | null, slug: string): string {
  if (!shop) return '#'
  return `https://${shop.publicDomain}/products/${slug}`
}

export async function fetchFWProducts(): Promise<FWProduct[]> {
  const [raw, shop] = await Promise.all([
    fwFetch<{ results: FWProduct[]; paging: FWPaging }>('/v1/collections/all/products'),
    fetchShop(),
  ])
  if (!raw) return []
  return raw.results.map(p => ({ ...p, url: buildProductUrl(shop, p.slug) }))
}

export async function fetchFWProduct(slugOrId: string): Promise<FWProduct | null> {
  const [raw, shop] = await Promise.all([
    fwFetch<FWProduct>(`/v1/products/${slugOrId}`),
    fetchShop(),
  ])
  if (!raw) return null
  return { ...raw, url: buildProductUrl(shop, raw.slug) }
}

export async function fetchFWCollections(): Promise<FWCollection[]> {
  const data = await fwFetch<{ results: FWCollection[] }>('/v1/collections')
  return data?.results ?? []
}
