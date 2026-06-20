import type { ProductTipeBisnis } from "@/types/business-product"

export type MarketplaceSort = "terbaru" | "harga_asc" | "harga_desc" | "nama_asc"

export const MARKETPLACE_SORT_LABELS: Record<MarketplaceSort, string> = {
  terbaru: "Terbaru",
  harga_asc: "Harga Terendah",
  harga_desc: "Harga Tertinggi",
  nama_asc: "Nama A–Z",
}

export interface MarketplaceProduct {
  id: string
  slug: string
  nama: string
  deskripsi: string
  imageUrl: string
  hargaMulai: number
  tipeBisnis: ProductTipeBisnis
  businessId: number
  businessSlug: string
  businessNama: string
  businessLogoUrl: string
  kotaProvinsi: string
}

export interface MarketplaceProductFilters {
  search?: string
  tipe?: ProductTipeBisnis | "all"
  location?: string
  sort?: MarketplaceSort
  page?: number
  limit?: number
}
