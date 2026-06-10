import { sql } from "@/lib/db"
import { stripSensitiveBusinessFields } from "@/lib/strip-sensitive-business-fields"
import { getConnectScoreTier, hasDocument } from "@/lib/connect-score-tier"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/businesses - Get all businesses with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
    const offset = (page - 1) * limit

    // Sanitize search pattern for LIKE queries
    const searchPattern = search ? `%${search.replace(/[%_]/g, "\\$&")}%` : null

    // Build queries based on filters
    let businesses
    let totalCount: number

    if (category && category !== "Semua" && searchPattern) {
      // Both category and search
      const countResult = await sql`
        SELECT COUNT(*) as count
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true 
          AND c.name = ${category}
          AND (
            LOWER(b.nama) LIKE LOWER(${searchPattern}) OR
            LOWER(b.deskripsi) LIKE LOWER(${searchPattern}) OR
            LOWER(b.kota_provinsi) LIKE LOWER(${searchPattern}) OR
            LOWER(c.name) LIKE LOWER(${searchPattern})
          )
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
      `
      totalCount = Number.parseInt(countResult[0]?.count || "0")

      businesses = await sql`
        SELECT b.*, c.name as category_name, c.slug as category_slug
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true 
          AND c.name = ${category}
          AND (
            LOWER(b.nama) LIKE LOWER(${searchPattern}) OR
            LOWER(b.deskripsi) LIKE LOWER(${searchPattern}) OR
            LOWER(b.kota_provinsi) LIKE LOWER(${searchPattern}) OR
            LOWER(c.name) LIKE LOWER(${searchPattern})
          )
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (category && category !== "Semua") {
      // Category only
      const countResult = await sql`
        SELECT COUNT(*) as count
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true AND c.name = ${category}
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
      `
      totalCount = Number.parseInt(countResult[0]?.count || "0")

      businesses = await sql`
        SELECT b.*, c.name as category_name, c.slug as category_slug
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true AND c.name = ${category}
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (searchPattern) {
      // Search only
      const countResult = await sql`
        SELECT COUNT(*) as count
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true 
          AND (
            LOWER(b.nama) LIKE LOWER(${searchPattern}) OR
            LOWER(b.deskripsi) LIKE LOWER(${searchPattern}) OR
            LOWER(b.kota_provinsi) LIKE LOWER(${searchPattern}) OR
            LOWER(c.name) LIKE LOWER(${searchPattern})
          )
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
      `
      totalCount = Number.parseInt(countResult[0]?.count || "0")

      businesses = await sql`
        SELECT b.*, c.name as category_name, c.slug as category_slug
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true 
          AND (
            LOWER(b.nama) LIKE LOWER(${searchPattern}) OR
            LOWER(b.deskripsi) LIKE LOWER(${searchPattern}) OR
            LOWER(b.kota_provinsi) LIKE LOWER(${searchPattern}) OR
            LOWER(c.name) LIKE LOWER(${searchPattern})
          )
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      // No filters (or only featured)
      const countResult = await sql`
        SELECT COUNT(*) as count
        FROM businesses b
        WHERE b.is_active = true
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
      `
      totalCount = Number.parseInt(countResult[0]?.count || "0")

      businesses = await sql`
        SELECT b.*, c.name as category_name, c.slug as category_slug
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true
          ${featured === "true" ? sql`AND b.is_featured = true` : sql``}
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Get product images for businesses
    const businessIds = businesses.map((b) => b.id as number)
    let productImages: Array<Record<string, unknown>> = []

    if (businessIds.length > 0) {
      productImages = await sql`
        SELECT business_id, image_url, sort_order 
        FROM product_images 
        WHERE business_id = ANY(${businessIds})
        ORDER BY sort_order
      `
    }

    // Get cached scores
    let scores: Array<Record<string, unknown>> = []
    if (businessIds.length > 0) {
      scores = await sql`
        SELECT business_id, score FROM connect_scores
        WHERE business_id = ANY(${businessIds})
      `
    }
    const scoreMap = new Map(scores.map((s) => [s.business_id, s.score]))

    // Map product images and scores to businesses
    const businessesWithImages = businesses.map((business) =>
      stripSensitiveBusinessFields({
        ...business,
        product_images: productImages.filter((img) => img.business_id === business.id),
        connect_score: scoreMap.get(business.id) ?? null,
        connect_score_tier: getConnectScoreTier(scoreMap.get(business.id) ?? null, {
          hasAkta: hasDocument(business.akta_pendirian_url as string | null),
          hasLegalitas: hasDocument(business.legalitas_url as string | null),
          isVerified: business.is_active === true,
        }),
      }),
    )

    return NextResponse.json({
      data: businessesWithImages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching businesses:", error)
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 })
  }
}

// POST /api/businesses - Create a new business (PUBLIC for registration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      nama,
      slug,
      deskripsi,
      lama_usaha,
      alamat,
      kota_provinsi,
      jumlah_cabang,
      jenis_peluang,
      deskripsi_kemitraan,
      link_website,
      link_galeri,
      instagram,
      facebook,
      tiktok,
      nama_pic,
      jabatan_pic,
      kontak_pic,
      logo_url,
      category_id,
      is_featured,
      product_images,
    } = body

    // Basic validation
    if (!nama || !slug) {
      return NextResponse.json({ error: "Nama dan slug harus diisi" }, { status: 400 })
    }

    // Check slug uniqueness
    const existingSlug = await sql`SELECT id FROM businesses WHERE slug = ${slug}`
    if (existingSlug.length > 0) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 })
    }

    // Insert business (is_active = false for public registration, needs admin approval)
    const result = await sql`
      INSERT INTO businesses (
        nama, slug, deskripsi, lama_usaha, alamat, kota_provinsi,
        jumlah_cabang, jenis_peluang, deskripsi_kemitraan, website,
        link_galeri, instagram, facebook, tiktok, nama_pic, jabatan_pic,
        kontak_pic, logo_url, category_id, is_featured, is_active
      ) VALUES (
        ${nama}, ${slug}, ${deskripsi || null}, ${lama_usaha || null}, ${alamat || null}, ${kota_provinsi || null},
        ${jumlah_cabang || "0"}, ${jenis_peluang || null}, ${deskripsi_kemitraan || null}, ${link_website || null},
        ${link_galeri || null}, ${instagram || null}, ${facebook || null}, ${tiktok || null}, ${nama_pic || null}, ${jabatan_pic || null},
        ${kontak_pic || null}, ${logo_url || null}, ${category_id || null}, ${is_featured || false}, false
      )
      RETURNING *
    `

    const business = result[0]

    // Insert product images if provided
    if (product_images && product_images.length > 0) {
      for (let i = 0; i < product_images.length; i++) {
        const imageUrl = typeof product_images[i] === 'string' ? product_images[i] : product_images[i].url
        if (imageUrl) {
          await sql`
            INSERT INTO product_images (business_id, image_url, sort_order)
            VALUES (${business.id}, ${imageUrl}, ${i + 1})
          `
        }
      }
    }

    return NextResponse.json({ data: business, message: "Business created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating business:", error)
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 })
  }
}
