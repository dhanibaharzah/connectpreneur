import { sql } from "@/lib/sql"
import { isAllowedImageHost } from "@/lib/integrations/storage-urls"
import type { ShopBanner } from "@/types/shop-banner"

export interface DbShopBanner {
  id: number
  title: string | null
  image_url: string
  link_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function transformDbBanner(row: DbShopBanner): ShopBanner {
  return {
    id: row.id,
    title: row.title?.trim() || null,
    imageUrl: row.image_url.trim(),
    linkUrl: row.link_url?.trim() || null,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function parseBannerTitle(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length > 255) return null
  return trimmed
}

export function parseBannerImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed || !isAllowedImageHost(trimmed)) return null
  return trimmed
}

export function parseBannerLinkUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > 2048) return null
  if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }
  return null
}

export function parseBannerSortOrder(value: unknown): number | null {
  const num = Number(value)
  if (!Number.isFinite(num) || !Number.isInteger(num) || num < 0) return null
  return num
}

export async function getActiveBanners(): Promise<ShopBanner[]> {
  const rows = await sql`
    SELECT id, title, image_url, link_url, sort_order, is_active, created_at, updated_at
    FROM shop_banners
    WHERE is_active = true
    ORDER BY sort_order ASC, id ASC
  `
  return (rows as DbShopBanner[]).map(transformDbBanner)
}

export async function listAllBanners(): Promise<ShopBanner[]> {
  const rows = await sql`
    SELECT id, title, image_url, link_url, sort_order, is_active, created_at, updated_at
    FROM shop_banners
    ORDER BY sort_order ASC, id ASC
  `
  return (rows as DbShopBanner[]).map(transformDbBanner)
}

export async function getBannerById(id: number): Promise<ShopBanner | null> {
  const rows = await sql`
    SELECT id, title, image_url, link_url, sort_order, is_active, created_at, updated_at
    FROM shop_banners
    WHERE id = ${id}
  `
  if (rows.length === 0) return null
  return transformDbBanner(rows[0] as DbShopBanner)
}
