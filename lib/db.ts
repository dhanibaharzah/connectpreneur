import type { Business } from "@/types/business"
import { getOrUpdateScore } from "@/lib/connect-score"
import { sql } from "@/lib/sql"

export { sql }

// Types for database results
export interface DbBusiness {
  id: number
  slug: string
  nama: string
  deskripsi: string | null
  lama_usaha: string | null
  alamat: string | null
  kota_provinsi: string | null
  location_id: number | null
  jumlah_cabang: string | null
  logo_url: string | null
  link_galeri: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  category_id: number | null
  category_name: string | null
  category_slug: string | null
  jenis_peluang: string | null
  deskripsi_kemitraan: string | null
  link_kemitraan: string | null
  nama_pic: string | null
  jabatan_pic: string | null
  kontak_pic: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DbCategory {
  id: number
  name: string
  slug: string
}

export interface DbProductImage {
  id: number
  business_id: number
  image_url: string
  sort_order: number
}

export interface DbLocation {
  id: number
  code: string
  name: string
  level: "provinsi" | "kabupaten_kota" | "kecamatan"
  parent_id: number | null
}

// Helper function to transform DB result to Business type
export function transformDbToBusiness(
  dbBusiness: DbBusiness,
  productImages: { image_url: string }[] = [],
  score?: { score: number; breakdown: Record<string, number> } | null
): Business {
  return {
    id: String(dbBusiness.id),
    slug: dbBusiness.slug || "",
    nama: dbBusiness.nama || "",
    deskripsi: dbBusiness.deskripsi || "",
    lamaUsaha: dbBusiness.lama_usaha || "",
    alamat: dbBusiness.alamat || "",
    kotaProvinsi: dbBusiness.kota_provinsi || "",
    jumlahCabang: dbBusiness.jumlah_cabang || "0",
    jenisUsaha: dbBusiness.category_name || "Lainnya",
    jenisPeluang: dbBusiness.jenis_peluang || "",
    deskripsiKemitraan: dbBusiness.deskripsi_kemitraan || "",
    linkKemitraan: dbBusiness.link_kemitraan || "",
    logoUrl: dbBusiness.logo_url || "",
    produkUrls: productImages.map((img) => img.image_url),
    linkGaleri: dbBusiness.link_galeri || "",
    website: dbBusiness.website || "",
    instagram: dbBusiness.instagram || "",
    facebook: dbBusiness.facebook || "",
    tiktok: dbBusiness.tiktok || "",
    namaPIC: dbBusiness.nama_pic || "",
    jabatanPIC: dbBusiness.jabatan_pic || "",
    kontakPIC: dbBusiness.kontak_pic || "",
    connectScore: score?.score ?? null,
    connectScoreBreakdown: score?.breakdown ?? null,
  }
}

// Fetch all businesses from database
export async function getAllBusinesses(): Promise<Business[]> {
  try {
    const businesses = await sql`
      SELECT 
        b.*,
        c.name as category_name,
        c.slug as category_slug
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.is_active = true
      ORDER BY b.id
    `

    // Get all product images in one query
    const allProductImages = await sql`
      SELECT business_id, image_url
      FROM product_images
      ORDER BY sort_order
    `

    // Group images by business_id
    const imagesByBusiness: Record<number, { image_url: string }[]> = {}
    for (const img of allProductImages) {
      if (!imagesByBusiness[img.business_id]) {
        imagesByBusiness[img.business_id] = []
      }
      imagesByBusiness[img.business_id].push({ image_url: img.image_url })
    }

    // Get cached scores
    const businessIds = businesses.map((b: any) => b.id as number)
    let scores: Array<Record<string, unknown>> = []
    if (businessIds.length > 0) {
      scores = await sql`
        SELECT business_id, score FROM connect_scores
        WHERE business_id = ANY(${businessIds})
      `
    }
    const scoreMap = new Map(scores.map((s) => [s.business_id as number, s.score as number]))

    return businesses.map((b: any) => transformDbToBusiness(
      b as DbBusiness,
      imagesByBusiness[b.id] || [],
      scoreMap.has(b.id) ? { score: scoreMap.get(b.id)!, breakdown: {} } : null
    ))
  } catch (error) {
    console.error("[v0] Error fetching businesses from database:", error)
    return []
  }
}

// Fetch featured businesses for homepage
export async function getFeaturedBusinesses(limit = 4): Promise<Business[]> {
  try {
    const businesses = await sql`
      SELECT 
        b.*,
        c.name as category_name,
        c.slug as category_slug
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.is_active = true AND b.is_featured = true
      ORDER BY b.id
      LIMIT ${limit}
    `

    if (businesses.length === 0) {
      return []
    }

    const imagesByBusiness: Record<number, { image_url: string }[]> = {}

    for (const b of businesses) {
      const images = await sql`
        SELECT image_url
        FROM product_images
        WHERE business_id = ${b.id}
        ORDER BY sort_order
      `
      imagesByBusiness[b.id] = images.map((img: any) => ({ image_url: img.image_url }))
    }

    // Get cached scores for featured
    const featuredIds = businesses.map((b: any) => b.id as number)
    let featuredScores: Array<Record<string, unknown>> = []
    if (featuredIds.length > 0) {
      featuredScores = await sql`
        SELECT business_id, score FROM connect_scores
        WHERE business_id = ANY(${featuredIds})
      `
    }
    const featuredScoreMap = new Map(featuredScores.map((s) => [s.business_id as number, s.score as number]))

    return businesses.map((b: any) => transformDbToBusiness(
      b as DbBusiness,
      imagesByBusiness[b.id] || [],
      featuredScoreMap.has(b.id) ? { score: featuredScoreMap.get(b.id)!, breakdown: {} } : null
    ))
  } catch (error) {
    console.error("[v0] Error fetching featured businesses:", error)
    return []
  }
}

// Fetch single business by slug
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const businesses = await sql`
      SELECT 
        b.*,
        c.name as category_name,
        c.slug as category_slug
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.slug = ${slug} AND b.is_active = true
    `

    if (businesses.length === 0) {
      return null
    }

    const business = businesses[0]

    // Get product images
    const productImages = await sql`
      SELECT image_url
      FROM product_images
      WHERE business_id = ${business.id}
      ORDER BY sort_order
    `

    // Lazy backfill ConnectScore
    const scoreResult = await getOrUpdateScore(business.id, business as any)

    return transformDbToBusiness(business as DbBusiness, productImages as { image_url: string }[], scoreResult)
  } catch (error) {
    console.error("[v0] Error fetching business by slug:", error)
    return null
  }
}

// Fetch all categories
export async function getAllCategories(): Promise<string[]> {
  try {
    const categories = await sql`
      SELECT name FROM categories ORDER BY name
    `
    return ["Semua", ...categories.map((c: any) => c.name as string)]
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return ["Semua"]
  }
}

// ==================== LOCATION FUNCTIONS ====================

// Fetch all kabupaten/kota (untuk dropdown pertama)
export async function getKabupatenKota(): Promise<{ id: number; name: string }[]> {
  try {
    const locations = await sql`
      SELECT id, name 
      FROM locations 
      WHERE level = 'kabupaten_kota' 
      ORDER BY name
    `
    return locations.map((l: any) => ({ id: l.id as number, name: l.name as string }))
  } catch (error) {
    console.error("[db] Error fetching kabupaten/kota:", error)
    return []
  }
}

// Fetch kecamatan by parent kabupaten/kota id
export async function getKecamatanByParent(parentId: number): Promise<{ id: number; name: string }[]> {
  try {
    const locations = await sql`
      SELECT id, name 
      FROM locations 
      WHERE parent_id = ${parentId} AND level = 'kecamatan'
      ORDER BY name
    `
    return locations.map((l: any) => ({ id: l.id as number, name: l.name as string }))
  } catch (error) {
    console.error("[db] Error fetching kecamatan:", error)
    return []
  }
}

// Fetch location by id
export async function getLocationById(id: number): Promise<DbLocation | null> {
  try {
    const locations = await sql`
      SELECT id, code, name, level, parent_id 
      FROM locations 
      WHERE id = ${id}
    `
    return locations.length > 0 ? locations[0] as DbLocation : null
  } catch (error) {
    console.error("[db] Error fetching location:", error)
    return null
  }
}

// Fetch full location path (kecamatan -> kab/kota -> provinsi)
export async function getLocationPath(locationId: number): Promise<string> {
  try {
    const result = await sql`
      WITH RECURSIVE location_path AS (
        SELECT id, name, level, parent_id, name AS path_name
        FROM locations WHERE id = ${locationId}
        UNION ALL
        SELECT l.id, l.name, l.level, l.parent_id, l.name || ', ' || lp.path_name
        FROM locations l
        JOIN location_path lp ON l.id = lp.parent_id
      )
      SELECT path_name FROM location_path WHERE parent_id IS NULL
    `
    return result.length > 0 ? result[0].path_name : ""
  } catch (error) {
    console.error("[db] Error fetching location path:", error)
    return ""
  }
}
