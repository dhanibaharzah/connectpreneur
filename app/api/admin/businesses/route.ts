import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { getSessionFromRequest, getAdminLocationScope } from "@/lib/auth"
import { getConnectScoreTier, hasDocument } from "@/lib/connect-score-tier"

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const tierFilter = searchParams.get("tier") || "all"
    const useTierFilter = tierFilter !== "all"
    const offset = (page - 1) * limit
    const queryLimit = useTierFilter ? 10000 : limit
    const queryOffset = useTierFilter ? 0 : offset

    // Get admin's location scope
    const locationScope = await getAdminLocationScope(user)
    const hasLocationFilter = locationScope !== null

    // Get pending count (scoped to admin's location)
    let pendingCount: number
    if (hasLocationFilter) {
      const pendingCountResult = await sql`
        SELECT COUNT(*) as count FROM businesses 
        WHERE is_active = false AND location_id = ANY(${locationScope})
      `
      pendingCount = Number.parseInt(pendingCountResult[0].count)
    } else {
      const pendingCountResult = await sql`SELECT COUNT(*) as count FROM businesses WHERE is_active = false`
      pendingCount = Number.parseInt(pendingCountResult[0].count)
    }

    let businesses
    let total

    // Query with location scope, status filter, and search
    if (hasLocationFilter) {
      // Location-scoped admin
      if (search) {
        if (status === "pending") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = false
              AND b.location_id = ANY(${locationScope})
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses
            WHERE nama ILIKE ${"%" + search + "%"} AND is_active = false
              AND location_id = ANY(${locationScope})
          `
          total = Number.parseInt(countResult[0].count)
        } else if (status === "active") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = true
              AND b.location_id = ANY(${locationScope})
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses
            WHERE nama ILIKE ${"%" + search + "%"} AND is_active = true
              AND location_id = ANY(${locationScope})
          `
          total = Number.parseInt(countResult[0].count)
        } else {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.nama ILIKE ${"%" + search + "%"}
              AND b.location_id = ANY(${locationScope})
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses
            WHERE nama ILIKE ${"%" + search + "%"}
              AND location_id = ANY(${locationScope})
          `
          total = Number.parseInt(countResult[0].count)
        }
      } else {
        if (status === "pending") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.is_active = false AND b.location_id = ANY(${locationScope})
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses 
            WHERE is_active = false AND location_id = ANY(${locationScope})
          `
          total = Number.parseInt(countResult[0].count)
        } else if (status === "active") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.is_active = true AND b.location_id = ANY(${locationScope})
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses 
            WHERE is_active = true AND location_id = ANY(${locationScope})
          `
          total = Number.parseInt(countResult[0].count)
        } else {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.location_id = ANY(${locationScope})
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses 
            WHERE location_id = ANY(${locationScope})
          `
          total = Number.parseInt(countResult[0].count)
        }
      }
    } else {
      // Superadmin — no location filter
      if (search) {
        if (status === "pending") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = false
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses
            WHERE nama ILIKE ${"%" + search + "%"} AND is_active = false
          `
          total = Number.parseInt(countResult[0].count)
        } else if (status === "active") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = true
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses
            WHERE nama ILIKE ${"%" + search + "%"} AND is_active = true
          `
          total = Number.parseInt(countResult[0].count)
        } else {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.nama ILIKE ${"%" + search + "%"}
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`
            SELECT COUNT(*) as count FROM businesses
            WHERE nama ILIKE ${"%" + search + "%"}
          `
          total = Number.parseInt(countResult[0].count)
        }
      } else {
        if (status === "pending") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.is_active = false
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`SELECT COUNT(*) as count FROM businesses WHERE is_active = false`
          total = Number.parseInt(countResult[0].count)
        } else if (status === "active") {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.is_active = true
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`SELECT COUNT(*) as count FROM businesses WHERE is_active = true`
          total = Number.parseInt(countResult[0].count)
        } else {
          businesses = await sql`
            SELECT b.*, c.name as category_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT ${queryLimit} OFFSET ${queryOffset}
          `
          const countResult = await sql`SELECT COUNT(*) as count FROM businesses`
          total = Number.parseInt(countResult[0].count)
        }
      }
    }

    // Get product images and scores for each business
    const businessIds = businesses.map((b: any) => b.id as number)
    let scoresMap = new Map<number, number | null>()
    if (businessIds.length > 0) {
      const scores = await sql`
        SELECT business_id, score FROM connect_scores
        WHERE business_id = ANY(${businessIds})
      `
      scoresMap = new Map(scores.map((s: any) => [s.business_id, s.score]))
    }

    const businessesWithImages = await Promise.all(
      businesses.map(async (b: any) => {
        const productImages = await sql`
          SELECT * FROM product_images 
          WHERE business_id = ${b.id}
          ORDER BY sort_order
        `
        const connect_score = scoresMap.get(b.id) ?? null
        return {
          ...b,
          product_images: productImages,
          connect_score,
          connect_score_tier: getConnectScoreTier(connect_score, {
            hasAkta: hasDocument(b.akta_pendirian_url),
            hasLegalitas: hasDocument(b.legalitas_url),
            isVerified: b.is_active === true,
          }),
        }
      }),
    )

    let filteredBusinesses = businessesWithImages
    if (useTierFilter) {
      filteredBusinesses = businessesWithImages.filter((b) => b.connect_score_tier === tierFilter)
      total = filteredBusinesses.length
      filteredBusinesses = filteredBusinesses.slice(offset, offset + limit)
    }

    return NextResponse.json({
      businesses: filteredBusinesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      pendingCount,
    })
  } catch (error) {
    console.error("Get businesses error:", error)
    return NextResponse.json({ error: "Gagal mengambil data bisnis" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] POST body received:", JSON.stringify(body, null, 2))

    const {
      nama,
      slug,
      deskripsi,
      lama_usaha,
      alamat,
      kota_provinsi,
      location_id,
      category_id,
      jenis_peluang,
      deskripsi_kemitraan,
      link_kemitraan,
      link_galeri,
      website,
      instagram,
      facebook,
      tiktok,
      nama_pic,
      jabatan_pic,
      kontak_pic,
      logo_url,
      jumlah_cabang,
      is_featured,
      product_images,
      akta_pendirian_url,
      legalitas_url,
    } = body

    if (!nama || !slug) {
      return NextResponse.json({ error: "Nama dan slug harus diisi" }, { status: 400 })
    }

    if (!category_id) {
      return NextResponse.json({ error: "Kategori harus dipilih" }, { status: 400 })
    }

    // Check slug uniqueness
    const existingSlug = await sql`SELECT id FROM businesses WHERE slug = ${slug}`
    if (existingSlug.length > 0) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO businesses (
        nama, slug, deskripsi, lama_usaha, alamat, kota_provinsi, location_id,
        category_id, jenis_peluang, deskripsi_kemitraan, link_kemitraan, link_galeri, website,
        instagram, facebook, tiktok, nama_pic, jabatan_pic, kontak_pic,
        logo_url, jumlah_cabang, akta_pendirian_url, legalitas_url,
        is_featured, is_active
      ) VALUES (
        ${nama}, 
        ${slug}, 
        ${deskripsi ?? null}, 
        ${lama_usaha ?? null},
        ${alamat ?? null}, 
        ${kota_provinsi ?? null}, 
        ${location_id ? Number(location_id) : null},
        ${category_id ? Number(category_id) : null},
        ${jenis_peluang ?? null},
        ${deskripsi_kemitraan ?? null}, 
        ${link_kemitraan ?? null},
        ${link_galeri ?? null},
        ${website ?? null},
        ${instagram ?? null}, 
        ${facebook ?? null}, 
        ${tiktok ?? null},
        ${nama_pic ?? null}, 
        ${jabatan_pic ?? null}, 
        ${kontak_pic ?? null},
        ${logo_url ?? null}, 
        ${jumlah_cabang ?? "0"}, 
        ${akta_pendirian_url ?? null},
        ${legalitas_url ?? null},
        ${is_featured ?? false}, 
        true
      )
      RETURNING *
    `

    console.log("[v0] Business created:", result[0])

    const business = result[0]

    // Insert product images
    if (product_images && product_images.length > 0) {
      console.log("[v0] Inserting product images:", product_images)
      for (let i = 0; i < product_images.length; i++) {
        const img = product_images[i]
        const imageUrl = img.url || img.image_url
        if (imageUrl) {
          await sql`
            INSERT INTO product_images (business_id, image_url, sort_order)
            VALUES (${business.id}, ${imageUrl}, ${i + 1})
          `
        }
      }
    }

    return NextResponse.json({ success: true, business }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create business error:", error)
    return NextResponse.json(
      {
        error: "Gagal membuat bisnis baru",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
