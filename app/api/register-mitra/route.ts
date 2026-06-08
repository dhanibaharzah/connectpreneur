import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { sendRegistrationWhatsAppNotification } from "@/lib/gowa"
import { verifyAktaDocument } from "@/lib/akta-verification"
import { fetchDocumentBuffer } from "@/lib/document-fetch"
import { verifyKtpDocument } from "@/lib/ktp-verification"

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
      location_id,
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
      ktp_url,
      akta_pendirian_url,
      legalitas_url,
    } = body

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

    if (!ktp_url) {
      return NextResponse.json({ error: "KTP harus diupload" }, { status: 400 })
    }

    if (!akta_pendirian_url) {
      return NextResponse.json({ error: "Akta Pendirian harus diupload" }, { status: 400 })
    }

    if (!legalitas_url) {
      return NextResponse.json({ error: "Legalitas Perusahaan harus diupload" }, { status: 400 })
    }

    const existingSlug = await sql`SELECT id FROM businesses WHERE slug = ${slug}`
    if (existingSlug.length > 0) {
      return NextResponse.json({ error: "Slug sudah digunakan, silakan pilih nama lain" }, { status: 400 })
    }

    const [ktpBuffer, aktaBuffer] = await Promise.all([
      fetchDocumentBuffer(ktp_url),
      fetchDocumentBuffer(akta_pendirian_url),
    ])

    const [ktpVerification, aktaVerification] = await Promise.all([
      verifyKtpDocument(ktpBuffer, nama_pic),
      verifyAktaDocument(aktaBuffer, nama_pic),
    ])

    const autoApproved = ktpVerification.verified && aktaVerification.verified

    const result = await sql`
      INSERT INTO businesses (
        nama, slug, deskripsi, lama_usaha, alamat, kota_provinsi, location_id,
        category_id, jenis_peluang, deskripsi_kemitraan, website,
        instagram, facebook, tiktok, nama_pic, jabatan_pic, kontak_pic,
        logo_url, jumlah_cabang, ktp_url, akta_pendirian_url, legalitas_url,
        ktp_ocr_verified, akta_ocr_verified,
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
        ${website ?? null},
        ${instagram ?? null}, 
        ${facebook ?? null}, 
        ${tiktok ?? null},
        ${nama_pic ?? null}, 
        ${jabatan_pic ?? null}, 
        ${kontak_pic ?? null},
        ${logo_url ?? null}, 
        ${jumlah_cabang ?? "0"}, 
        ${ktp_url ?? null},
        ${akta_pendirian_url ?? null},
        ${legalitas_url ?? null},
        ${ktpVerification.verified},
        ${aktaVerification.verified},
        false,
        ${autoApproved}
      )
      RETURNING *
    `

    const business = result[0]

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

    try {
      await sendRegistrationWhatsAppNotification({
        phone: kontak_pic,
        namaPic: nama_pic,
        namaBisnis: nama,
        autoApproved,
      })
    } catch (whatsappError) {
      console.error("Register mitra WhatsApp notification error:", whatsappError)
    }

    return NextResponse.json(
      {
        success: true,
        auto_approved: autoApproved,
        message: autoApproved
          ? "Pendaftaran berhasil! Bisnis Anda sudah aktif di ConnectPreneur."
          : "Pendaftaran berhasil! Data Anda akan direview admin karena verifikasi dokumen otomatis perlu pengecekan manual.",
        business: { id: business.id, nama: business.nama },
      },
      { status: 201 },
    )
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

export const maxDuration = 120
