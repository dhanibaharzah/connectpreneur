import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionFromRequest, getAdminLocationScope } from "@/lib/auth"
import { del } from "@vercel/blob"

const sql = neon(process.env.DATABASE_URL!)

// Check if admin has access to a specific business based on location scope
async function checkBusinessAccess(user: any, businessLocationId: number | null): Promise<boolean> {
  const locationScope = await getAdminLocationScope(user)
  if (locationScope === null) return true // Superadmin
  if (!businessLocationId) return false // Business has no location, scoped admin can't access
  return locationScope.includes(businessLocationId)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const businesses = await sql`
      SELECT b.*, c.name as category_name
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ${id}
    `

    if (businesses.length === 0) {
      return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
    }

    // Check location access
    const hasAccess = await checkBusinessAccess(user, businesses[0].location_id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const productImages = await sql`
      SELECT * FROM product_images 
      WHERE business_id = ${id}
      ORDER BY sort_order
    `

    return NextResponse.json({
      business: {
        ...businesses[0],
        product_images: productImages,
      },
    })
  } catch (error) {
    console.error("Get business error:", error)
    return NextResponse.json({ error: "Gagal mengambil data bisnis" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    console.log("[v0] PUT body received for id", id, ":", JSON.stringify(body, null, 2))

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
      is_active,
      product_images,
    } = body

    // Check if business exists
    const existing = await sql`SELECT * FROM businesses WHERE id = ${id}`
    if (existing.length === 0) {
      return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
    }

    // Check location access
    const hasAccess = await checkBusinessAccess(user, existing[0].location_id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing[0].slug) {
      const existingSlug = await sql`SELECT id FROM businesses WHERE slug = ${slug} AND id != ${id}`
      if (existingSlug.length > 0) {
        return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 })
      }
    }

    const currentBusiness = existing[0]

    const updatedNama = nama !== undefined ? nama : currentBusiness.nama
    const updatedSlug = slug !== undefined ? slug : currentBusiness.slug
    const updatedDeskripsi = deskripsi !== undefined ? deskripsi : currentBusiness.deskripsi
    const updatedLamaUsaha = lama_usaha !== undefined ? lama_usaha : currentBusiness.lama_usaha
    const updatedAlamat = alamat !== undefined ? alamat : currentBusiness.alamat
    const updatedKotaProvinsi = kota_provinsi !== undefined ? kota_provinsi : currentBusiness.kota_provinsi
    const updatedLocationId =
      location_id !== undefined ? (location_id ? Number(location_id) : null) : currentBusiness.location_id
    const updatedCategoryId =
      category_id !== undefined ? (category_id ? Number(category_id) : null) : currentBusiness.category_id
    const updatedJenisPeluang = jenis_peluang !== undefined ? jenis_peluang : currentBusiness.jenis_peluang
    const updatedDeskripsiKemitraan =
      deskripsi_kemitraan !== undefined ? deskripsi_kemitraan : currentBusiness.deskripsi_kemitraan
    const updatedLinkKemitraan = link_kemitraan !== undefined ? link_kemitraan : currentBusiness.link_kemitraan
    const updatedLinkGaleri = link_galeri !== undefined ? link_galeri : currentBusiness.link_galeri
    const updatedWebsite = website !== undefined ? website : currentBusiness.website
    const updatedInstagram = instagram !== undefined ? instagram : currentBusiness.instagram
    const updatedFacebook = facebook !== undefined ? facebook : currentBusiness.facebook
    const updatedTiktok = tiktok !== undefined ? tiktok : currentBusiness.tiktok
    const updatedNamaPic = nama_pic !== undefined ? nama_pic : currentBusiness.nama_pic
    const updatedJabatanPic = jabatan_pic !== undefined ? jabatan_pic : currentBusiness.jabatan_pic
    const updatedKontakPic = kontak_pic !== undefined ? kontak_pic : currentBusiness.kontak_pic
    const updatedLogoUrl = logo_url !== undefined ? logo_url : currentBusiness.logo_url
    const updatedJumlahCabang = jumlah_cabang !== undefined ? jumlah_cabang : currentBusiness.jumlah_cabang
    const updatedIsFeatured = is_featured !== undefined ? is_featured : currentBusiness.is_featured
    const updatedIsActive = is_active !== undefined ? is_active : currentBusiness.is_active

    console.log("[v0] Updating business with values:", {
      updatedNama,
      updatedSlug,
      updatedCategoryId,
      updatedIsFeatured,
    })

    const result = await sql`
      UPDATE businesses SET
        nama = ${updatedNama},
        slug = ${updatedSlug},
        deskripsi = ${updatedDeskripsi},
        lama_usaha = ${updatedLamaUsaha},
        alamat = ${updatedAlamat},
        kota_provinsi = ${updatedKotaProvinsi},
        location_id = ${updatedLocationId},
        category_id = ${updatedCategoryId},
        jenis_peluang = ${updatedJenisPeluang},
        deskripsi_kemitraan = ${updatedDeskripsiKemitraan},
        link_kemitraan = ${updatedLinkKemitraan},
        link_galeri = ${updatedLinkGaleri},
        website = ${updatedWebsite},
        instagram = ${updatedInstagram},
        facebook = ${updatedFacebook},
        tiktok = ${updatedTiktok},
        nama_pic = ${updatedNamaPic},
        jabatan_pic = ${updatedJabatanPic},
        kontak_pic = ${updatedKontakPic},
        logo_url = ${updatedLogoUrl},
        jumlah_cabang = ${updatedJumlahCabang},
        is_featured = ${updatedIsFeatured},
        is_active = ${updatedIsActive},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    console.log("[v0] Business updated:", result[0])

    // Update product images if provided
    if (product_images !== undefined) {
      console.log("[v0] Updating product images:", product_images)
      // Delete existing images
      await sql`DELETE FROM product_images WHERE business_id = ${id}`

      // Insert new images
      if (product_images && product_images.length > 0) {
        for (let i = 0; i < product_images.length; i++) {
          const img = product_images[i]
          const imageUrl = img.url || img.image_url
          if (imageUrl) {
            await sql`
              INSERT INTO product_images (business_id, image_url, sort_order)
              VALUES (${id}, ${imageUrl}, ${i + 1})
            `
          }
        }
      }
    }

    return NextResponse.json({ success: true, business: result[0] })
  } catch (error) {
    console.error("[v0] Update business error:", error)
    return NextResponse.json(
      {
        error: "Gagal mengupdate bisnis",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get business data to delete associated images
    const businesses = await sql`SELECT * FROM businesses WHERE id = ${id}`
    if (businesses.length === 0) {
      return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
    }

    // Check location access — superadmin can delete all, scoped admins can delete within their scope
    const hasAccess = await checkBusinessAccess(user, businesses[0].location_id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const business = businesses[0]

    // Get product images
    const productImages = await sql`SELECT * FROM product_images WHERE business_id = ${id}`

    // Delete images from blob storage
    const imagesToDelete: string[] = []
    if (business.logo_url && business.logo_url.includes("blob.vercel-storage.com")) {
      imagesToDelete.push(business.logo_url)
    }
    for (const img of productImages) {
      if (img.image_url && img.image_url.includes("blob.vercel-storage.com")) {
        imagesToDelete.push(img.image_url)
      }
    }

    // Delete from blob storage (best effort)
    for (const url of imagesToDelete) {
      try {
        await del(url)
      } catch (e) {
        console.error("Failed to delete blob:", url, e)
      }
    }

    // Delete product images from DB
    await sql`DELETE FROM product_images WHERE business_id = ${id}`

    // Delete business from DB
    await sql`DELETE FROM businesses WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete business error:", error)
    return NextResponse.json({ error: "Gagal menghapus bisnis" }, { status: 500 })
  }
}
