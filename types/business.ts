import type { BusinessProduct } from "@/types/business-product"
import type { TrustTier } from "@/types/gamification"
import type { ConnectScoreTier } from "@/lib/connect-score-tier"

export interface Business {
  id: string
  slug: string
  nama: string
  deskripsi: string
  lamaUsaha: string
  alamat: string
  kotaProvinsi: string
  jumlahCabang: string
  logoUrl: string
  produkUrls: string[]
  products: BusinessProduct[]
  linkGaleri: string
  website: string
  instagram: string
  facebook: string
  tiktok: string
  jenisUsaha: string
  jenisPeluang: string
  deskripsiKemitraan: string
  linkKemitraan: string
  namaPIC: string
  jabatanPIC: string
  kontakPIC: string
  connectScore?: number | null
  connectScoreBreakdown?: Record<string, number> | null
  connectScoreTier?: ConnectScoreTier | null
  trustTier?: TrustTier | null
}
