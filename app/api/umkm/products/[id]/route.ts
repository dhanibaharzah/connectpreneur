import { type NextRequest, NextResponse } from "next/server"
import { deleteObject, isDeletableStorageUrl } from "@/lib/integrations/storage"
import {
  generateUniqueProductSlug,
  parseHargaMulai,
  parseProductDeskripsi,
  parseProductImageUrl,
  parseProductName,
  parseProductTipeBisnis,
  transformDbProduct,
  type DbBusinessProduct,
} from "@/lib/marketplace/business-products"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import { sql } from "@/lib/sql"

async function deleteStoredFileIfNeeded(url: string | null | undefined) {
  if (!url || !isDeletableStorageUrl(url)) return
  try {
    await deleteObject(url)
  } catch (error) {
    console.error("Failed to delete product image:", error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const productId = Number.parseInt(id, 10)
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Produk tidak valid" }, { status: 400 })
  }

  const body = await request.json()
  const nama = parseProductName(body.nama)
  const deskripsi = parseProductDeskripsi(body.deskripsi)
  const imageUrl = parseProductImageUrl(body.image_url)
  const hargaMulai = parseHargaMulai(body.harga_mulai)
  const tipeBisnis = parseProductTipeBisnis(body.tipe_bisnis)

  if (!nama) {
    return NextResponse.json({ error: "Nama produk harus diisi (maks. 255 karakter)" }, { status: 400 })
  }

  if (deskripsi === null) {
    return NextResponse.json({ error: "Deskripsi maksimal 1000 karakter" }, { status: 400 })
  }

  if (imageUrl === null) {
    return NextResponse.json({ error: "URL foto produk tidak valid" }, { status: 400 })
  }

  if (hargaMulai === null) {
    return NextResponse.json({ error: "Harga mulai harus berupa angka bulat positif" }, { status: 400 })
  }

  if (!tipeBisnis) {
    return NextResponse.json({ error: "Tipe bisnis wajib dipilih (produk atau jasa)" }, { status: 400 })
  }

  const existing = await sql`
    SELECT nama, image_url FROM business_products
    WHERE id = ${productId} AND business_id = ${session.businessId}
  `

  if (existing.length === 0) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
  }

  const previousImageUrl = existing[0].image_url as string | null
  const previousNama = (existing[0].nama as string).trim()
  const slug =
    previousNama === nama
      ? null
      : await generateUniqueProductSlug(nama, productId)

  const rows = await sql`
    UPDATE business_products
    SET
      slug = COALESCE(${slug}, slug),
      nama = ${nama},
      deskripsi = ${deskripsi || null},
      image_url = ${imageUrl || null},
      harga_mulai = ${hargaMulai},
      tipe_bisnis = ${tipeBisnis},
      updated_at = NOW()
    WHERE id = ${productId} AND business_id = ${session.businessId}
    RETURNING id, slug, business_id, nama, deskripsi, image_url, harga_mulai, tipe_bisnis, sort_order, is_active
  `

  if (previousImageUrl && previousImageUrl !== (imageUrl || null)) {
    await deleteStoredFileIfNeeded(previousImageUrl)
  }

  return NextResponse.json({ product: transformDbProduct(rows[0] as DbBusinessProduct) })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const productId = Number.parseInt(id, 10)
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Produk tidak valid" }, { status: 400 })
  }

  const rows = await sql`
    DELETE FROM business_products
    WHERE id = ${productId} AND business_id = ${session.businessId}
    RETURNING image_url
  `

  if (rows.length === 0) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
  }

  await deleteStoredFileIfNeeded(rows[0].image_url as string | null)

  return NextResponse.json({ success: true })
}
