import { type NextRequest, NextResponse } from "next/server"
import { businessCatalogUrl } from "@/lib/business/catalog-url"
import { generateStoreQrDataUrl, STORE_QR_SIZES } from "@/lib/umkm/generate-store-qr"
import { getBusinessCatalogInfo, getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const business = await getBusinessCatalogInfo(session.businessId)
  if (!business) {
    return NextResponse.json({ error: "Bisnis tidak ditemukan atau belum aktif" }, { status: 404 })
  }

  const catalogUrl = businessCatalogUrl(business.slug)
  const [qrLarge, qrSmall] = await Promise.all([
    generateStoreQrDataUrl(catalogUrl, STORE_QR_SIZES.large),
    generateStoreQrDataUrl(catalogUrl, STORE_QR_SIZES.small),
  ])

  return NextResponse.json({
    businessName: business.nama,
    slug: business.slug,
    catalogUrl,
    logoUrl: business.logoUrl,
    qrLarge,
    qrSmall,
  })
}
