import { sql } from "@/lib/sql"
import {
  extractSocialUsername,
  usernameToSocialUrl,
  type SocialPlatform,
} from "@/lib/business/form-utils"
import { normalizePhoneDigits } from "@/lib/shared/phone"

export type UmkmBusinessProfile = {
  id: number
  nama: string
  slug: string
  deskripsi: string
  lama_usaha: string
  alamat: string
  kota_provinsi: string
  location_id: number | null
  category_id: number | null
  category_name: string | null
  jenis_peluang: string
  deskripsi_kemitraan: string
  website: string
  instagram: string
  facebook: string
  tiktok: string
  nama_pic: string
  jabatan_pic: string
  kontak_pic: string
  logo_url: string
  jumlah_cabang: string
  product_images: Array<{ id: number; url: string }>
}

export type UmkmBusinessProfileUpdateInput = {
  nama?: string
  deskripsi?: string
  lama_usaha?: string
  alamat?: string
  kota_provinsi?: string
  location_id?: number | null
  category_id?: number | null
  jenis_peluang?: string
  deskripsi_kemitraan?: string
  website?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  nama_pic?: string
  jabatan_pic?: string
  kontak_pic?: string
  logo_url?: string
  jumlah_cabang?: string
  product_images?: Array<{ url?: string; image_url?: string }>
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback
  return value
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function normalizeSocial(value: unknown, platform: SocialPlatform): string {
  const raw = asString(value).trim()
  if (!raw) return ""
  return usernameToSocialUrl(extractSocialUsername(raw, platform) || raw, platform)
}

export function parseUmkmBusinessProfileUpdate(
  body: Record<string, unknown>,
): { data: UmkmBusinessProfileUpdateInput } | { error: string } {
  const nama = body.nama !== undefined ? asString(body.nama).trim() : undefined
  if (nama !== undefined && !nama) {
    return { error: "Nama bisnis wajib diisi" }
  }

  const categoryId =
    body.category_id !== undefined ? asNullableNumber(body.category_id) : undefined
  if (categoryId !== undefined && categoryId === null) {
    return { error: "Kategori harus dipilih" }
  }

  const kontakPic =
    body.kontak_pic !== undefined ? normalizePhoneDigits(asString(body.kontak_pic)) : undefined
  if (kontakPic !== undefined && !kontakPic) {
    return { error: "Kontak PIC (WhatsApp) wajib diisi" }
  }

  const logoUrl = body.logo_url !== undefined ? asString(body.logo_url).trim() : undefined
  if (logoUrl !== undefined && logoUrl && !logoUrl.startsWith("https://")) {
    return { error: "URL logo tidak valid" }
  }

  let productImages: UmkmBusinessProfileUpdateInput["product_images"]
  if (body.product_images !== undefined) {
    if (!Array.isArray(body.product_images)) {
      return { error: "Gambar produk tidak valid" }
    }
    const parsed: Array<{ url: string }> = []
    for (const img of body.product_images) {
      if (!img || typeof img !== "object") continue
      const record = img as { url?: unknown; image_url?: unknown }
      const url = asString(record.url || record.image_url).trim()
      if (!url) continue
      if (!url.startsWith("https://")) {
        return { error: "URL gambar produk tidak valid" }
      }
      parsed.push({ url })
    }
    if (parsed.length > 5) {
      return { error: "Maksimal 5 gambar produk" }
    }
    productImages = parsed
  }

  return {
    data: {
      nama,
      deskripsi: body.deskripsi !== undefined ? asString(body.deskripsi) : undefined,
      lama_usaha: body.lama_usaha !== undefined ? asString(body.lama_usaha).trim() : undefined,
      alamat: body.alamat !== undefined ? asString(body.alamat).trim() : undefined,
      kota_provinsi:
        body.kota_provinsi !== undefined ? asString(body.kota_provinsi).trim() : undefined,
      location_id: body.location_id !== undefined ? asNullableNumber(body.location_id) : undefined,
      category_id: categoryId,
      jenis_peluang:
        body.jenis_peluang !== undefined ? asString(body.jenis_peluang).trim() : undefined,
      deskripsi_kemitraan:
        body.deskripsi_kemitraan !== undefined ? asString(body.deskripsi_kemitraan) : undefined,
      website: body.website !== undefined ? asString(body.website).trim() : undefined,
      instagram: body.instagram !== undefined ? normalizeSocial(body.instagram, "instagram") : undefined,
      facebook: body.facebook !== undefined ? normalizeSocial(body.facebook, "facebook") : undefined,
      tiktok: body.tiktok !== undefined ? normalizeSocial(body.tiktok, "tiktok") : undefined,
      nama_pic: body.nama_pic !== undefined ? asString(body.nama_pic).trim() : undefined,
      jabatan_pic: body.jabatan_pic !== undefined ? asString(body.jabatan_pic).trim() : undefined,
      kontak_pic: kontakPic,
      logo_url: logoUrl,
      jumlah_cabang:
        body.jumlah_cabang !== undefined ? asString(body.jumlah_cabang).trim() || "0" : undefined,
      product_images: productImages,
    },
  }
}

export async function getUmkmBusinessProfile(
  businessId: number,
): Promise<UmkmBusinessProfile | null> {
  const rows = await sql`
    SELECT
      b.id,
      b.nama,
      b.slug,
      b.deskripsi,
      b.lama_usaha,
      b.alamat,
      b.kota_provinsi,
      b.location_id,
      b.category_id,
      c.name as category_name,
      b.jenis_peluang,
      b.deskripsi_kemitraan,
      b.website,
      b.instagram,
      b.facebook,
      b.tiktok,
      b.nama_pic,
      b.jabatan_pic,
      b.kontak_pic,
      b.logo_url,
      b.jumlah_cabang
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.id = ${businessId}
  `

  if (rows.length === 0) return null

  const business = rows[0]
  const productImages = await sql`
    SELECT id, image_url
    FROM product_images
    WHERE business_id = ${businessId}
    ORDER BY sort_order
  `

  return {
    id: Number(business.id),
    nama: asString(business.nama),
    slug: asString(business.slug),
    deskripsi: asString(business.deskripsi),
    lama_usaha: asString(business.lama_usaha),
    alamat: asString(business.alamat),
    kota_provinsi: asString(business.kota_provinsi),
    location_id: asNullableNumber(business.location_id),
    category_id: asNullableNumber(business.category_id),
    category_name: business.category_name ? asString(business.category_name) : null,
    jenis_peluang: asString(business.jenis_peluang),
    deskripsi_kemitraan: asString(business.deskripsi_kemitraan),
    website: asString(business.website),
    instagram: asString(business.instagram),
    facebook: asString(business.facebook),
    tiktok: asString(business.tiktok),
    nama_pic: asString(business.nama_pic),
    jabatan_pic: asString(business.jabatan_pic),
    kontak_pic: asString(business.kontak_pic),
    logo_url: asString(business.logo_url),
    jumlah_cabang: asString(business.jumlah_cabang, "0"),
    product_images: productImages.map((img) => ({
      id: Number(img.id),
      url: asString(img.image_url),
    })),
  }
}

export async function updateUmkmBusinessProfile(
  businessId: number,
  input: UmkmBusinessProfileUpdateInput,
): Promise<UmkmBusinessProfile | { error: string; status: number }> {
  const existing = await sql`SELECT * FROM businesses WHERE id = ${businessId}`
  if (existing.length === 0) {
    return { error: "Bisnis tidak ditemukan", status: 404 }
  }

  const current = existing[0]

  if (input.category_id !== undefined && input.category_id !== null) {
    const category = await sql`SELECT id FROM categories WHERE id = ${input.category_id}`
    if (category.length === 0) {
      return { error: "Kategori tidak ditemukan", status: 400 }
    }
  }

  await sql`
    UPDATE businesses SET
      nama = ${input.nama !== undefined ? input.nama : current.nama},
      deskripsi = ${input.deskripsi !== undefined ? input.deskripsi : current.deskripsi},
      lama_usaha = ${input.lama_usaha !== undefined ? input.lama_usaha : current.lama_usaha},
      alamat = ${input.alamat !== undefined ? input.alamat : current.alamat},
      kota_provinsi = ${input.kota_provinsi !== undefined ? input.kota_provinsi : current.kota_provinsi},
      location_id = ${
        input.location_id !== undefined
          ? input.location_id
          : current.location_id
      },
      category_id = ${
        input.category_id !== undefined
          ? input.category_id
          : current.category_id
      },
      jenis_peluang = ${input.jenis_peluang !== undefined ? input.jenis_peluang : current.jenis_peluang},
      deskripsi_kemitraan = ${
        input.deskripsi_kemitraan !== undefined
          ? input.deskripsi_kemitraan
          : current.deskripsi_kemitraan
      },
      website = ${input.website !== undefined ? input.website : current.website},
      instagram = ${input.instagram !== undefined ? input.instagram : current.instagram},
      facebook = ${input.facebook !== undefined ? input.facebook : current.facebook},
      tiktok = ${input.tiktok !== undefined ? input.tiktok : current.tiktok},
      nama_pic = ${input.nama_pic !== undefined ? input.nama_pic : current.nama_pic},
      jabatan_pic = ${input.jabatan_pic !== undefined ? input.jabatan_pic : current.jabatan_pic},
      kontak_pic = ${input.kontak_pic !== undefined ? input.kontak_pic : current.kontak_pic},
      logo_url = ${input.logo_url !== undefined ? input.logo_url || null : current.logo_url},
      jumlah_cabang = ${input.jumlah_cabang !== undefined ? input.jumlah_cabang : current.jumlah_cabang},
      updated_at = NOW()
    WHERE id = ${businessId}
  `

  if (input.product_images !== undefined) {
    await sql`DELETE FROM product_images WHERE business_id = ${businessId}`
    for (let i = 0; i < input.product_images.length; i++) {
      const imageUrl = input.product_images[i].url || input.product_images[i].image_url
      if (!imageUrl) continue
      await sql`
        INSERT INTO product_images (business_id, image_url, sort_order)
        VALUES (${businessId}, ${imageUrl}, ${i + 1})
      `
    }
  }

  const profile = await getUmkmBusinessProfile(businessId)
  if (!profile) {
    return { error: "Bisnis tidak ditemukan", status: 404 }
  }
  return profile
}
