import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { isAdminResponse, requireSuperAdmin } from "@/lib/auth/admin-api"
import {
  listAllBanners,
  parseBannerImageUrl,
  parseBannerLinkUrl,
  parseBannerSortOrder,
  parseBannerTitle,
  transformDbBanner,
  type DbShopBanner,
} from "@/lib/marketplace/shop-banners"

export async function GET(request: NextRequest) {
  try {
    const user = await requireSuperAdmin(request)
    if (isAdminResponse(user)) return user

    const banners = await listAllBanners()
    return NextResponse.json({ banners })
  } catch (error) {
    console.error("Error fetching admin banners:", error)
    return NextResponse.json({ error: "Gagal memuat banner" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireSuperAdmin(request)
    if (isAdminResponse(user)) return user

    const body = await request.json()
    const title = parseBannerTitle(body.title)
    const imageUrl = parseBannerImageUrl(body.image_url ?? body.imageUrl)
    const linkUrl = parseBannerLinkUrl(body.link_url ?? body.linkUrl)
    const sortOrder = parseBannerSortOrder(body.sort_order ?? body.sortOrder ?? 0)
    const isActive = body.is_active ?? body.isActive ?? true

    if (title === null && body.title) {
      return NextResponse.json({ error: "Judul banner tidak valid" }, { status: 400 })
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "Gambar banner harus diupload" }, { status: 400 })
    }
    if (linkUrl === null && (body.link_url || body.linkUrl)) {
      return NextResponse.json({ error: "Link banner tidak valid" }, { status: 400 })
    }
    if (sortOrder === null) {
      return NextResponse.json({ error: "Urutan banner tidak valid" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO shop_banners (title, image_url, link_url, sort_order, is_active)
      VALUES (${title}, ${imageUrl}, ${linkUrl}, ${sortOrder}, ${Boolean(isActive)})
      RETURNING id, title, image_url, link_url, sort_order, is_active, created_at, updated_at
    `

    return NextResponse.json(
      { banner: transformDbBanner(result[0] as DbShopBanner), message: "Banner berhasil dibuat" },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating banner:", error)
    return NextResponse.json({ error: "Gagal membuat banner" }, { status: 500 })
  }
}
