import { neon } from "@neondatabase/serverless"
import type { Business } from "@/types/business"

// Create a SQL client with the connection string from environment variable
export const sql = neon(process.env.DATABASE_URL!)

// Types for database results
export interface DbBusiness {
  id: number
  slug: string
  nama: string
  deskripsi: string | null
  lama_usaha: string | null
  alamat: string | null
  kota_provinsi: string | null
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

// Helper function to transform DB result to Business type
export function transformDbToBusiness(dbBusiness: DbBusiness, productImages: { image_url: string }[] = []): Business {
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

    return businesses.map((b: DbBusiness) => transformDbToBusiness(b, imagesByBusiness[b.id] || []))
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

    return businesses.map((b: DbBusiness) => transformDbToBusiness(b, imagesByBusiness[b.id] || []))
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

    return transformDbToBusiness(business, productImages)
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
    return ["Semua", ...categories.map((c: { name: string }) => c.name)]
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return ["Semua"]
  }
}
