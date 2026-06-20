import { sql } from "@/lib/sql"
import { transformDbProduct, type DbBusinessProduct } from "@/lib/business-products"
import {
  DEFAULT_MARKETPLACE_PAGE_SIZE,
  MAX_MARKETPLACE_PAGE_SIZE,
} from "@/lib/marketplace-product-filters"
import type {
  MarketplaceProduct,
  MarketplaceProductFilters,
  MarketplaceSort,
} from "@/types/marketplace-product"
import { buildPaginationMeta, type PaginationMeta } from "@/lib/pagination"

export {
  DEFAULT_MARKETPLACE_PAGE_SIZE,
  MAX_MARKETPLACE_PAGE_SIZE,
  parseMarketplaceFilters,
  parseMarketplaceSort,
  parseMarketplaceTipe,
} from "@/lib/marketplace-product-filters"

interface DbMarketplaceRow extends DbBusinessProduct {
  business_slug: string
  business_nama: string
  business_logo_url: string | null
  kota_provinsi: string | null
}

export function buildSearchPattern(search: string): string | null {
  if (!search) return null
  return `%${search.replace(/[%_\\]/g, "\\$&")}%`
}

function orderByClause(sort: MarketplaceSort) {
  switch (sort) {
    case "harga_asc":
      return sql`ORDER BY bp.harga_mulai ASC, bp.id ASC`
    case "harga_desc":
      return sql`ORDER BY bp.harga_mulai DESC, bp.id DESC`
    case "nama_asc":
      return sql`ORDER BY bp.nama ASC, bp.id ASC`
    default:
      return sql`ORDER BY bp.created_at DESC, bp.id DESC`
  }
}

function marketplaceProductSelectSql() {
  return sql`
    bp.id, bp.slug, bp.business_id, bp.nama, bp.deskripsi, bp.image_url, bp.harga_mulai,
    bp.tipe_bisnis, bp.sort_order, bp.is_active,
    b.slug AS business_slug, b.nama AS business_nama, b.logo_url AS business_logo_url,
    b.kota_provinsi
  `
}

function marketplaceProductJoinSql() {
  return sql`
    FROM business_products bp
    JOIN businesses b ON b.id = bp.business_id
  `
}

function transformMarketplaceRow(row: DbMarketplaceRow): MarketplaceProduct {
  const product = transformDbProduct(row)
  return {
    ...product,
    businessId: row.business_id,
    businessSlug: row.business_slug,
    businessNama: row.business_nama,
    businessLogoUrl: row.business_logo_url?.trim() || "",
    kotaProvinsi: row.kota_provinsi?.trim() || "",
  }
}

export async function listMarketplaceProducts(
  filters: MarketplaceProductFilters = {},
): Promise<{ products: MarketplaceProduct[]; pagination: PaginationMeta }> {
  const page = Math.max(1, filters.page ?? 1)
  const limit = Math.min(
    MAX_MARKETPLACE_PAGE_SIZE,
    Math.max(1, filters.limit ?? DEFAULT_MARKETPLACE_PAGE_SIZE),
  )
  const offset = (page - 1) * limit
  const searchPattern = buildSearchPattern(filters.search?.trim() || "")
  const tipe = filters.tipe ?? "all"
  const location = filters.location?.trim() || ""
  const sort = filters.sort ?? "terbaru"
  const orderBy = orderByClause(sort)

  const tipeFilter =
    tipe === "produk" || tipe === "jasa" ? sql`AND bp.tipe_bisnis = ${tipe}` : sql``
  const searchFilter = searchPattern
    ? sql`AND LOWER(bp.nama) LIKE LOWER(${searchPattern})`
    : sql``
  const locationFilter = location ? sql`AND b.kota_provinsi ILIKE ${location}` : sql``

  const countResult = await sql`
    SELECT COUNT(*) as count
    FROM business_products bp
    JOIN businesses b ON b.id = bp.business_id
    WHERE bp.is_active = true AND b.is_active = true
    ${tipeFilter}
    ${searchFilter}
    ${locationFilter}
  `
  const total = Number(countResult[0]?.count || 0)

  const rows = await sql`
    SELECT ${marketplaceProductSelectSql()}
    ${marketplaceProductJoinSql()}
    WHERE bp.is_active = true AND b.is_active = true
    ${tipeFilter}
    ${searchFilter}
    ${locationFilter}
    ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `

  return {
    products: (rows as DbMarketplaceRow[]).map(transformMarketplaceRow),
    pagination: buildPaginationMeta(page, limit, total),
  }
}

export async function getMarketplaceProductBySlug(slug: string): Promise<MarketplaceProduct | null> {
  const rows = await sql`
    SELECT ${marketplaceProductSelectSql()}
    ${marketplaceProductJoinSql()}
    WHERE bp.slug = ${slug} AND bp.is_active = true AND b.is_active = true
  `
  if (rows.length === 0) return null
  return transformMarketplaceRow(rows[0] as DbMarketplaceRow)
}

export async function getMarketplaceProductById(id: number): Promise<MarketplaceProduct | null> {
  const rows = await sql`
    SELECT ${marketplaceProductSelectSql()}
    ${marketplaceProductJoinSql()}
    WHERE bp.id = ${id} AND bp.is_active = true AND b.is_active = true
  `
  if (rows.length === 0) return null
  return transformMarketplaceRow(rows[0] as DbMarketplaceRow)
}

export async function getMarketplaceLocations(): Promise<string[]> {
  const rows = await sql`
    SELECT DISTINCT b.kota_provinsi
    FROM business_products bp
    JOIN businesses b ON b.id = bp.business_id
    WHERE bp.is_active = true AND b.is_active = true
      AND b.kota_provinsi IS NOT NULL AND TRIM(b.kota_provinsi) <> ''
    ORDER BY b.kota_provinsi ASC
  `
  return rows.map((row) => (row.kota_provinsi as string).trim())
}
