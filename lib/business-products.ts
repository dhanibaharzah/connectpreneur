import { sql } from "@/lib/sql"
import type { BusinessProduct, ProductTipeBisnis } from "@/types/business-product"

export interface DbBusinessProduct {
  id: number
  business_id: number
  nama: string
  deskripsi: string | null
  image_url: string | null
  harga_mulai: number
  tipe_bisnis: ProductTipeBisnis
  sort_order: number
  is_active: boolean
}

import { isAllowedImageHost, isDeletableStorageUrl } from "@/lib/storage-urls"

export function isValidProductImageUrl(url: string): boolean {
  return isAllowedImageHost(url)
}

export function transformDbProduct(row: DbBusinessProduct): BusinessProduct {
  return {
    id: String(row.id),
    nama: row.nama,
    deskripsi: row.deskripsi?.trim() ?? "",
    imageUrl: row.image_url?.trim() ?? "",
    hargaMulai: Number(row.harga_mulai),
    tipeBisnis: row.tipe_bisnis === "jasa" ? "jasa" : "produk",
  }
}

export async function getProductsByBusinessId(businessId: number): Promise<BusinessProduct[]> {
  const rows = await sql`
    SELECT id, business_id, nama, deskripsi, image_url, harga_mulai, tipe_bisnis, sort_order, is_active
    FROM business_products
    WHERE business_id = ${businessId} AND is_active = true
    ORDER BY sort_order ASC, id ASC
  `
  return (rows as DbBusinessProduct[]).map(transformDbProduct)
}

export async function getProductsForUmkm(businessId: number): Promise<BusinessProduct[]> {
  const rows = await sql`
    SELECT id, business_id, nama, deskripsi, image_url, harga_mulai, tipe_bisnis, sort_order, is_active
    FROM business_products
    WHERE business_id = ${businessId}
    ORDER BY sort_order ASC, id ASC
  `
  return (rows as DbBusinessProduct[]).map(transformDbProduct)
}

export function parseHargaMulai(value: unknown): number | null {
  const num = typeof value === "string" ? Number(value.replace(/\./g, "").replace(/,/g, "")) : Number(value)
  if (!Number.isFinite(num) || num < 0 || !Number.isInteger(num)) return null
  return num
}

export function parseProductName(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 255) return null
  return trimmed
}

const MAX_DESKRIPSI_LENGTH = 1000

export function parseProductDeskripsi(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return ""
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length > MAX_DESKRIPSI_LENGTH) return null
  return trimmed
}

export function parseProductImageUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return ""
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return ""
  if (!isValidProductImageUrl(trimmed)) return null
  return trimmed
}

export function parseProductTipeBisnis(value: unknown): ProductTipeBisnis | null {
  if (value === "produk" || value === "jasa") return value
  return null
}

/** @deprecated Use isDeletableStorageUrl from @/lib/storage-urls */
export function isDeletableBlobUrl(url: string): boolean {
  return isDeletableStorageUrl(url)
}

export { isDeletableStorageUrl } from "@/lib/storage-urls"
