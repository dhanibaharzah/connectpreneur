import { type NextRequest, NextResponse } from "next/server"
import { resolveMarketplaceProductByParam } from "@/lib/marketplace-product-resolve"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    const product = await resolveMarketplaceProductByParam(slug)

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error fetching marketplace product:", error)
    return NextResponse.json({ error: "Gagal memuat produk" }, { status: 500 })
  }
}
