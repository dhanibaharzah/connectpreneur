import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
      category_id,
      jenis_peluang,
      deskripsi_kemitraan,
      website,
      instagram,
      facebook,
      tiktok,
      nama_pic,
      jabatan_pic,
      kontak_pic,
      logo_url,
      jumlah_cabang,
      product_images,
    } = body

    // Validation
    if (!nama || !slug) {
      return NextResponse.json({ error: "Nama dan slug harus diisi" }, { status: 400 })
    }

    if (!deskripsi) {
      return NextResponse.json({ error: "Deskripsi bisnis harus diisi" }, { status: 400 })
    }

    if (!alamat || !kota_provinsi) {
      return NextResponse.json({ error: "Alamat dan kota/provinsi harus diisi" }, { status: 400 })
    }

    if (!nama_pic || !kontak_pic) {
      return NextResponse.json({ error: "Nama PIC dan nomor WhatsApp harus diisi" }, { status: 400 })
    }

    if (!category_id) {
      return NextResponse.json({ error: "Kategori harus dipilih" }, { status: 400 })
    }

    // Check slug uniqueness
    const existingSlug = await sql`SELECT id FROM businesses WHERE slug = ${slug}`
    if (existingSlug.length > 0) {
      return NextResponse.json({ error: "Slug sudah digunakan, silakan pilih nama lain" }, { status: 400 })
    }

    // Insert business with is_active = false (pending verification)
    const result = await sql`
      INSERT INTO businesses (
        nama, slug, deskripsi, lama_usaha, alamat, kota_provinsi,
        category_id, jenis_peluang, deskripsi_kemitraan, website,
        instagram, facebook, tiktok, nama_pic, jabatan_pic, kontak_pic,
        logo_url, jumlah_cabang, is_featured, is_active
      ) VALUES (
        ${nama}, 
        ${slug}, 
        ${deskripsi ?? null}, 
        ${lama_usaha ?? null},
        ${alamat ?? null}, 
        ${kota_provinsi ?? null}, 
        ${category_id ? Number(category_id) : null},
        ${jenis_peluang ?? null},
        ${deskripsi_kemitraan ?? null}, 
        ${website ?? null},
        ${instagram ?? null}, 
        ${facebook ?? null}, 
        ${tiktok ?? null},
        ${nama_pic ?? null}, 
        ${jabatan_pic ?? null}, 
        ${kontak_pic ?? null},
        ${logo_url ?? null}, 
        ${jumlah_cabang ?? "0"}, 
        false,
        false
      )
      RETURNING *
    `

    const business = result[0]

    // Insert product images
    if (product_images && product_images.length > 0) {
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

    return NextResponse.json({ 
      success: true, 
      message: "Pendaftaran berhasil! Silakan tunggu proses verifikasi.",
      business: { id: business.id, nama: business.nama } 
    }, { status: 201 })
  } catch (error) {
    console.error("Register mitra error:", error)
    return NextResponse.json(
      {
        error: "Gagal mendaftarkan bisnis. Silakan coba lagi.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
