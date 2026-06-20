import { type NextRequest, NextResponse } from "next/server"
import { parseMarketplaceFilters } from "@/lib/marketplace/marketplace-product-filters"
import { listMarketplaceProducts } from "@/lib/marketplace/marketplace-products"

export async function GET(request: NextRequest) {
  try {
    const filters = parseMarketplaceFilters(request.nextUrl.searchParams)
    const { products, pagination } = await listMarketplaceProducts(filters)
    return NextResponse.json({ products, pagination })
  } catch (error) {
    console.error("Error fetching marketplace products:", error)
    return NextResponse.json({ error: "Gagal memuat produk" }, { status: 500 })
  }
}
