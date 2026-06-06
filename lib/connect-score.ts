import { sql } from "@/lib/sql"

interface BusinessData {
  id: number
  deskripsi?: string | null
  lama_usaha?: string | null
  logo_url?: string | null
  category_id?: number | null
  alamat?: string | null
  location_id?: number | null
  website?: string | null
  instagram?: string | null
  facebook?: string | null
  tiktok?: string | null
  jenis_peluang?: string | null
  deskripsi_kemitraan?: string | null
  akta_pendirian_url?: string | null
  legalitas_url?: string | null
  nama_pic?: string | null
  jabatan_pic?: string | null
  kontak_pic?: string | null
  updated_at?: string | null
}

export interface ScoreResult {
  score: number
  breakdown: Record<string, number>
}

const SCORE_RULES: { key: string; field: keyof BusinessData; points: number }[] = [
  { key: "deskripsi", field: "deskripsi", points: 8 },
  { key: "lama_usaha", field: "lama_usaha", points: 4 },
  { key: "logo_url", field: "logo_url", points: 8 },
  { key: "category_id", field: "category_id", points: 5 },
  { key: "alamat", field: "alamat", points: 5 },
  { key: "location_id", field: "location_id", points: 5 },
  { key: "website", field: "website", points: 5 },
  { key: "instagram", field: "instagram", points: 5 },
  { key: "facebook", field: "facebook", points: 3 },
  { key: "tiktok", field: "tiktok", points: 2 },
  { key: "jenis_peluang", field: "jenis_peluang", points: 5 },
  { key: "deskripsi_kemitraan", field: "deskripsi_kemitraan", points: 8 },
  { key: "akta_pendirian_url", field: "akta_pendirian_url", points: 10 },
  { key: "legalitas_url", field: "legalitas_url", points: 5 },
  { key: "nama_pic", field: "nama_pic", points: 4 },
  { key: "jabatan_pic", field: "jabatan_pic", points: 3 },
  { key: "kontak_pic", field: "kontak_pic", points: 5 },
]

function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "number") return value > 0
  return Boolean(value)
}

export function calculateScore(business: BusinessData, productImageCount: number): ScoreResult {
  const breakdown: Record<string, number> = {}
  let score = 0

  for (const rule of SCORE_RULES) {
    const earned = isFilled(business[rule.field]) ? rule.points : 0
    breakdown[rule.key] = earned
    score += earned
  }

  // Product images: 7 for >=1, extra 3 for >=3
  const imgBase = productImageCount >= 1 ? 7 : 0
  const imgBonus = productImageCount >= 3 ? 3 : 0
  breakdown["product_images"] = imgBase + imgBonus
  score += imgBase + imgBonus

  return { score, breakdown }
}

/**
 * Lazily compute and cache the ConnectScore for a business.
 * Returns cached score if still fresh, otherwise recalculates.
 */
export async function getOrUpdateScore(businessId: number, businessData?: BusinessData): Promise<ScoreResult | null> {
  try {
    let data = businessData
    let updatedAt: string | null = null

    if (!data) {
      const rows = await sql`SELECT * FROM businesses WHERE id = ${businessId}`
      if (rows.length === 0) return null
      data = rows[0] as BusinessData
    }
    updatedAt = data.updated_at || null

    // Check if we have a fresh cached score
    const cached = await sql`
      SELECT score, breakdown, calculated_at 
      FROM connect_scores 
      WHERE business_id = ${businessId}
    `

    if (cached.length > 0 && updatedAt) {
      const calcAt = new Date(cached[0].calculated_at).getTime()
      const updAt = new Date(updatedAt).getTime()
      if (calcAt >= updAt) {
        return {
          score: cached[0].score,
          breakdown: cached[0].breakdown as Record<string, number>,
        }
      }
    }

    // Need to (re)calculate
    const imgRows = await sql`
      SELECT COUNT(*) as count FROM product_images WHERE business_id = ${businessId}
    `
    const imgCount = Number.parseInt(imgRows[0].count)

    const result = calculateScore(data, imgCount)

    // Upsert
    await sql`
      INSERT INTO connect_scores (business_id, score, breakdown, calculated_at)
      VALUES (${businessId}, ${result.score}, ${JSON.stringify(result.breakdown)}::jsonb, NOW())
      ON CONFLICT (business_id)
      DO UPDATE SET score = ${result.score}, breakdown = ${JSON.stringify(result.breakdown)}::jsonb, calculated_at = NOW()
    `

    return result
  } catch (error) {
    console.error("[connect-score] Error computing score:", error)
    return null
  }
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Sangat Lengkap", color: "text-green-600" }
  if (score >= 60) return { label: "Lengkap", color: "text-blue-600" }
  if (score >= 40) return { label: "Cukup", color: "text-yellow-600" }
  return { label: "Perlu Dilengkapi", color: "text-red-600" }
}

export const SCORE_LABELS: Record<string, string> = {
  deskripsi: "Deskripsi Bisnis",
  lama_usaha: "Lama Usaha",
  logo_url: "Logo Bisnis",
  category_id: "Kategori",
  alamat: "Alamat",
  location_id: "Lokasi",
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  jenis_peluang: "Jenis Peluang",
  deskripsi_kemitraan: "Deskripsi Kemitraan",
  product_images: "Foto Produk",
  akta_pendirian_url: "Akta Pendirian",
  legalitas_url: "Legalitas Perusahaan",
  nama_pic: "Nama PIC",
  jabatan_pic: "Jabatan PIC",
  kontak_pic: "Kontak PIC",
}

export const SCORE_MAX: Record<string, number> = {
  deskripsi: 8,
  lama_usaha: 4,
  logo_url: 8,
  category_id: 5,
  alamat: 5,
  location_id: 5,
  website: 5,
  instagram: 5,
  facebook: 3,
  tiktok: 2,
  jenis_peluang: 5,
  deskripsi_kemitraan: 8,
  product_images: 10,
  akta_pendirian_url: 10,
  legalitas_url: 5,
  nama_pic: 4,
  jabatan_pic: 3,
  kontak_pic: 5,
}
