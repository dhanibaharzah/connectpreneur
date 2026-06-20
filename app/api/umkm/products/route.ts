import { type NextRequest, NextResponse } from "next/server"
import {
  generateUniqueProductSlug,
  getProductsForUmkm,
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

const MAX_PRODUCTS_PER_BUSINESS = 50

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const products = await getProductsForUmkm(session.businessId)
  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM business_products WHERE business_id = ${session.businessId}
  `

  if ((count as number) >= MAX_PRODUCTS_PER_BUSINESS) {
    return NextResponse.json({ error: `Maksimal ${MAX_PRODUCTS_PER_BUSINESS} produk per bisnis` }, { status: 400 })
  }

  const [{ max_order }] = await sql`
    SELECT COALESCE(MAX(sort_order), 0)::int AS max_order
    FROM business_products
    WHERE business_id = ${session.businessId}
  `

  const slug = await generateUniqueProductSlug(nama)

  const rows = await sql`
    INSERT INTO business_products (business_id, slug, nama, deskripsi, image_url, harga_mulai, tipe_bisnis, sort_order)
    VALUES (${session.businessId}, ${slug}, ${nama}, ${deskripsi || null}, ${imageUrl || null}, ${hargaMulai}, ${tipeBisnis}, ${(max_order as number) + 1})
    RETURNING id, slug, business_id, nama, deskripsi, image_url, harga_mulai, tipe_bisnis, sort_order, is_active
  `

  return NextResponse.json(
    { product: transformDbProduct(rows[0] as DbBusinessProduct) },
    { status: 201 },
  )
}
