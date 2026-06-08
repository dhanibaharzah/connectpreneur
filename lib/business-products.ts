import { sql } from "@/lib/sql"
import type { BusinessProduct } from "@/types/business-product"

export interface DbBusinessProduct {
  id: number
  business_id: number
  nama: string
  deskripsi: string | null
  image_url: string | null
  harga_mulai: number
  sort_order: number
  is_active: boolean
}

const ALLOWED_IMAGE_HOSTS = ["blob.vercel-storage.com", "blob.v0.app", "vusercontent.net"]

export function isValidProductImageUrl(url: string): boolean {
  if (!url) return false
  if (url.includes("..")) return false
  if (url.startsWith("/")) {
    return url.startsWith("/images/") || url.startsWith("/public/") || url === "/placeholder.svg"
  }
  if (url.includes("placeholder.svg")) return true

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false
    return ALLOWED_IMAGE_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
    )
  } catch {
    return false
  }
}

export function transformDbProduct(row: DbBusinessProduct): BusinessProduct {
  return {
    id: String(row.id),
    nama: row.nama,
    deskripsi: row.deskripsi?.trim() ?? "",
    imageUrl: row.image_url?.trim() ?? "",
    hargaMulai: Number(row.harga_mulai),
  }
}

export async function getProductsByBusinessId(businessId: number): Promise<BusinessProduct[]> {
  const rows = await sql`
    SELECT id, business_id, nama, deskripsi, image_url, harga_mulai, sort_order, is_active
    FROM business_products
    WHERE business_id = ${businessId} AND is_active = true
    ORDER BY sort_order ASC, id ASC
  `
  return (rows as DbBusinessProduct[]).map(transformDbProduct)
}

export async function getProductsForUmkm(businessId: number): Promise<BusinessProduct[]> {
  const rows = await sql`
    SELECT id, business_id, nama, deskripsi, image_url, harga_mulai, sort_order, is_active
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

export function isDeletableBlobUrl(url: string): boolean {
  if (!url.includes("blob.vercel-storage.com")) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" && !parsed.pathname.includes("..")
  } catch {
    return false
  }
}
