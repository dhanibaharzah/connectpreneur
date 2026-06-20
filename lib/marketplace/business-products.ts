import { sql } from "@/lib/sql"
import { slugifyNameOrFallback } from "@/lib/shared/slug"
import { isAllowedImageHost, isDeletableStorageUrl } from "@/lib/integrations/storage-urls"
import type { BusinessProduct, ProductTipeBisnis } from "@/types/business-product"

export interface DbBusinessProduct {
  id: number
  slug: string
  business_id: number
  nama: string
  deskripsi: string | null
  image_url: string | null
  harga_mulai: number
  tipe_bisnis: ProductTipeBisnis
  sort_order: number
  is_active: boolean
}

export function isValidProductImageUrl(url: string): boolean {
  return isAllowedImageHost(url)
}

export function transformDbProduct(row: DbBusinessProduct): BusinessProduct {
  return {
    id: String(row.id),
    slug: row.slug,
    nama: row.nama,
    deskripsi: row.deskripsi?.trim() ?? "",
    imageUrl: row.image_url?.trim() ?? "",
    hargaMulai: Number(row.harga_mulai),
    tipeBisnis: row.tipe_bisnis === "jasa" ? "jasa" : "produk",
  }
}

export async function generateUniqueProductSlug(
  nama: string,
  excludeProductId?: number,
): Promise<string> {
  const base = slugifyNameOrFallback(nama, "produk")
  let candidate = base
  let suffix = 2

  while (true) {
    const rows =
      excludeProductId != null
        ? await sql`
            SELECT 1 FROM business_products
            WHERE slug = ${candidate} AND id <> ${excludeProductId}
            LIMIT 1
          `
        : await sql`
            SELECT 1 FROM business_products WHERE slug = ${candidate} LIMIT 1
          `
    if (rows.length === 0) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

export async function getProductsForBusiness(
  businessId: number,
  options?: { includeInactive?: boolean },
): Promise<BusinessProduct[]> {
  const activeFilter = options?.includeInactive ? sql`` : sql`AND is_active = true`
  const rows = await sql`
    SELECT id, slug, business_id, nama, deskripsi, image_url, harga_mulai, tipe_bisnis, sort_order, is_active
    FROM business_products
    WHERE business_id = ${businessId}
    ${activeFilter}
    ORDER BY sort_order ASC, id ASC
  `
  return (rows as DbBusinessProduct[]).map(transformDbProduct)
}

export async function getProductsByBusinessId(businessId: number): Promise<BusinessProduct[]> {
  return getProductsForBusiness(businessId)
}

export async function getProductsForUmkm(businessId: number): Promise<BusinessProduct[]> {
  return getProductsForBusiness(businessId, { includeInactive: true })
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

/** @deprecated Use isDeletableStorageUrl from @/lib/integrations/storage-urls */
export function isDeletableBlobUrl(url: string): boolean {
  return isDeletableStorageUrl(url)
}

export { isDeletableStorageUrl } from "@/lib/integrations/storage-urls"
