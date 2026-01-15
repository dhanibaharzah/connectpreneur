import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/businesses - Get all businesses with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        b.*,
        c.name as category_name,
        c.slug as category_slug
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.is_active = true
    `
    const params: (string | number | boolean)[] = []
    let paramIndex = 1

    // Filter by category
    if (category && category !== "Semua") {
      query += ` AND c.name = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    // Filter by search term
    if (search) {
      query += ` AND (
        LOWER(b.nama) LIKE LOWER($${paramIndex}) OR
        LOWER(b.deskripsi) LIKE LOWER($${paramIndex}) OR
        LOWER(b.kota_provinsi) LIKE LOWER($${paramIndex}) OR
        LOWER(c.name) LIKE LOWER($${paramIndex})
      )`
      params.push(`%${search}%`)
      paramIndex++
    }

    // Filter by featured
    if (featured === "true") {
      query += ` AND b.is_featured = true`
    }

    // Get total count for pagination
    const countQuery = query.replace(
      "SELECT \n        b.*,\n        c.name as category_name,\n        c.slug as category_slug",
      "SELECT COUNT(*)",
    )
    const countResult = await sql(countQuery, params)
    const totalCount = Number.parseInt(countResult[0]?.count || "0")

    // Add ordering and pagination
    query += ` ORDER BY b.is_featured DESC, b.created_at DESC`
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const businesses = await sql(query, params)

    // Get product images for each business
    const businessIds = businesses.map((b: { id: number }) => b.id)
    let productImages: { business_id: number; image_url: string; sort_order: number }[] = []

    if (businessIds.length > 0) {
      const placeholders = businessIds.map((_: number, i: number) => `$${i + 1}`).join(",")
      productImages = await sql(
        `SELECT business_id, image_url, sort_order 
         FROM product_images 
         WHERE business_id IN (${placeholders})
         ORDER BY sort_order`,
        businessIds,
      )
    }

    // Map product images to businesses
    const businessesWithImages = businesses.map((business: { id: number }) => ({
      ...business,
      product_images: productImages.filter((img) => img.business_id === business.id),
    }))

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

    // Insert business
    const result = await sql`
      INSERT INTO businesses (
        nama, slug, deskripsi, lama_usaha, alamat, kota_provinsi,
        jumlah_cabang, jenis_peluang, deskripsi_kemitraan, link_website,
        link_galeri, instagram, facebook, tiktok, nama_pic, jabatan_pic,
        kontak_pic, logo_url, category_id, is_featured, is_active
      ) VALUES (
        ${nama}, ${slug}, ${deskripsi}, ${lama_usaha}, ${alamat}, ${kota_provinsi},
        ${jumlah_cabang || "0"}, ${jenis_peluang}, ${deskripsi_kemitraan}, ${link_website},
        ${link_galeri}, ${instagram}, ${facebook}, ${tiktok}, ${nama_pic}, ${jabatan_pic},
        ${kontak_pic}, ${logo_url}, ${category_id}, ${is_featured || false}, true
      )
      RETURNING *
    `

    const business = result[0]

    // Insert product images if provided
    if (product_images && product_images.length > 0) {
      for (let i = 0; i < product_images.length; i++) {
        await sql`
          INSERT INTO product_images (business_id, image_url, sort_order)
          VALUES (${business.id}, ${product_images[i]}, ${i + 1})
        `
      }
    }

    return NextResponse.json({ data: business, message: "Business created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating business:", error)
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 })
  }
}
