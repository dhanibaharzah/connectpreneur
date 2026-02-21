import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { getOrUpdateScore } from "@/lib/connect-score"

// GET /api/businesses/[slug] - Get single business by slug (PUBLIC)
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const business = businesses[0]

    // Get product images
    const productImages = await sql`
      SELECT id, image_url, sort_order
      FROM product_images
      WHERE business_id = ${business.id}
      ORDER BY sort_order
    `

    // Lazy backfill ConnectScore
    const scoreResult = await getOrUpdateScore(business.id, business as any)

    return NextResponse.json({
      data: {
        ...business,
        product_images: productImages,
        connect_score: scoreResult?.score ?? null,
        connect_score_breakdown: scoreResult?.breakdown ?? null,
      },
    })
  } catch (error) {
    console.error("Error fetching business:", error)
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 })
  }
}

// PUT /api/businesses/[slug] - Update business (REQUIRES AUTH)
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Require authentication
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()

    // Check if business exists
    const existing = await sql`SELECT id FROM businesses WHERE slug = ${slug}`
    if (existing.length === 0) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const businessId = existing[0].id

    const {
      nama,
      slug: newSlug,
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

    // Update business
    const result = await sql`
      UPDATE businesses SET
        nama = COALESCE(${nama}, nama),
        slug = COALESCE(${newSlug}, slug),
        deskripsi = COALESCE(${deskripsi}, deskripsi),
        lama_usaha = COALESCE(${lama_usaha}, lama_usaha),
        alamat = COALESCE(${alamat}, alamat),
        kota_provinsi = COALESCE(${kota_provinsi}, kota_provinsi),
        jumlah_cabang = COALESCE(${jumlah_cabang}, jumlah_cabang),
        jenis_peluang = COALESCE(${jenis_peluang}, jenis_peluang),
        deskripsi_kemitraan = COALESCE(${deskripsi_kemitraan}, deskripsi_kemitraan),
        link_website = COALESCE(${link_website}, link_website),
        link_galeri = COALESCE(${link_galeri}, link_galeri),
        instagram = COALESCE(${instagram}, instagram),
        facebook = COALESCE(${facebook}, facebook),
        tiktok = COALESCE(${tiktok}, tiktok),
        nama_pic = COALESCE(${nama_pic}, nama_pic),
        jabatan_pic = COALESCE(${jabatan_pic}, jabatan_pic),
        kontak_pic = COALESCE(${kontak_pic}, kontak_pic),
        logo_url = COALESCE(${logo_url}, logo_url),
        category_id = COALESCE(${category_id}, category_id),
        is_featured = COALESCE(${is_featured}, is_featured),
        updated_at = NOW()
      WHERE slug = ${slug}
      RETURNING *
    `

    // Update product images if provided
    if (product_images !== undefined) {
      // Delete existing images
      await sql`DELETE FROM product_images WHERE business_id = ${businessId}`

      // Insert new images
      if (product_images && product_images.length > 0) {
        for (let i = 0; i < product_images.length; i++) {
          await sql`
            INSERT INTO product_images (business_id, image_url, sort_order)
            VALUES (${businessId}, ${product_images[i]}, ${i + 1})
          `
        }
      }
    }

    return NextResponse.json({ data: result[0], message: "Business updated successfully" })
  } catch (error) {
    console.error("Error updating business:", error)
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 })
  }
}

// DELETE /api/businesses/[slug] - Delete business (REQUIRES AUTH)
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Require authentication
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params

    // Check if business exists
    const existing = await sql`SELECT id FROM businesses WHERE slug = ${slug}`
    if (existing.length === 0) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Soft delete - set is_active to false
    await sql`
      UPDATE businesses 
      SET is_active = false, updated_at = NOW()
      WHERE slug = ${slug}
    `

    return NextResponse.json({ message: "Business deleted successfully" })
  } catch (error) {
    console.error("Error deleting business:", error)
    return NextResponse.json({ error: "Failed to delete business" }, { status: 500 })
  }
}
