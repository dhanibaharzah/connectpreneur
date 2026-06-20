import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { isAdminResponse, requireAdmin } from "@/lib/admin-api"
import { deleteObject, isDeletableStorageUrl } from "@/lib/storage"
import {
  getBannerById,
  parseBannerImageUrl,
  parseBannerLinkUrl,
  parseBannerSortOrder,
  parseBannerTitle,
  transformDbBanner,
  type DbShopBanner,
} from "@/lib/shop-banners"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const bannerId = Number(id)
    if (!Number.isFinite(bannerId) || bannerId <= 0) {
      return NextResponse.json({ error: "ID banner tidak valid" }, { status: 400 })
    }

    const banner = await getBannerById(bannerId)
    if (!banner) {
      return NextResponse.json({ error: "Banner tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ banner })
  } catch (error) {
    console.error("Error fetching banner:", error)
    return NextResponse.json({ error: "Gagal memuat banner" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const bannerId = Number(id)
    if (!Number.isFinite(bannerId) || bannerId <= 0) {
      return NextResponse.json({ error: "ID banner tidak valid" }, { status: 400 })
    }

    const existing = await getBannerById(bannerId)
    if (!existing) {
      return NextResponse.json({ error: "Banner tidak ditemukan" }, { status: 404 })
    }

    const body = await request.json()
    const title =
      body.title !== undefined ? parseBannerTitle(body.title) : existing.title
    const imageUrl =
      body.image_url !== undefined || body.imageUrl !== undefined
        ? parseBannerImageUrl(body.image_url ?? body.imageUrl)
        : existing.imageUrl
    const linkUrl =
      body.link_url !== undefined || body.linkUrl !== undefined
        ? parseBannerLinkUrl(body.link_url ?? body.linkUrl)
        : existing.linkUrl
    const sortOrder =
      body.sort_order !== undefined || body.sortOrder !== undefined
        ? parseBannerSortOrder(body.sort_order ?? body.sortOrder)
        : existing.sortOrder
    const isActive =
      body.is_active !== undefined || body.isActive !== undefined
        ? Boolean(body.is_active ?? body.isActive)
        : existing.isActive

    if (body.title !== undefined && title === null && body.title) {
      return NextResponse.json({ error: "Judul banner tidak valid" }, { status: 400 })
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "Gambar banner tidak valid" }, { status: 400 })
    }
    if (
      (body.link_url !== undefined || body.linkUrl !== undefined) &&
      linkUrl === null &&
      (body.link_url || body.linkUrl)
    ) {
      return NextResponse.json({ error: "Link banner tidak valid" }, { status: 400 })
    }
    if (sortOrder === null) {
      return NextResponse.json({ error: "Urutan banner tidak valid" }, { status: 400 })
    }

    const oldImageUrl = existing.imageUrl
    const result = await sql`
      UPDATE shop_banners
      SET
        title = ${title},
        image_url = ${imageUrl},
        link_url = ${linkUrl},
        sort_order = ${sortOrder},
        is_active = ${isActive},
        updated_at = NOW()
      WHERE id = ${bannerId}
      RETURNING id, title, image_url, link_url, sort_order, is_active, created_at, updated_at
    `

    if (imageUrl !== oldImageUrl && isDeletableStorageUrl(oldImageUrl)) {
      await deleteObject(oldImageUrl).catch(() => {})
    }

    return NextResponse.json({
      banner: transformDbBanner(result[0] as DbShopBanner),
      message: "Banner berhasil diperbarui",
    })
  } catch (error) {
    console.error("Error updating banner:", error)
    return NextResponse.json({ error: "Gagal memperbarui banner" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const bannerId = Number(id)
    if (!Number.isFinite(bannerId) || bannerId <= 0) {
      return NextResponse.json({ error: "ID banner tidak valid" }, { status: 400 })
    }

    const existing = await getBannerById(bannerId)
    if (!existing) {
      return NextResponse.json({ error: "Banner tidak ditemukan" }, { status: 404 })
    }

    await sql`DELETE FROM shop_banners WHERE id = ${bannerId}`

    if (isDeletableStorageUrl(existing.imageUrl)) {
      await deleteObject(existing.imageUrl).catch(() => {})
    }

    return NextResponse.json({ message: "Banner berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting banner:", error)
    return NextResponse.json({ error: "Gagal menghapus banner" }, { status: 500 })
  }
}
