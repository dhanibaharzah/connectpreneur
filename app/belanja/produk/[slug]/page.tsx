import { notFound, permanentRedirect } from "next/navigation"
import { BelanjaProductDetailClient } from "@/components/belanja/belanja-product-detail-client"
import { buildBelanjaProductPath, getBelanjaPathsFromHeaders } from "@/lib/belanja-paths"
import {
  isLegacyMarketplaceProductId,
  resolveMarketplaceProductByParam,
} from "@/lib/marketplace-product-resolve"
import { getMarketplaceProductBySlug } from "@/lib/marketplace-products"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function BelanjaProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const paths = await getBelanjaPathsFromHeaders()

  if (isLegacyMarketplaceProductId(slug)) {
    const legacyProduct = await resolveMarketplaceProductByParam(slug)
    if (!legacyProduct) {
      notFound()
    }
    permanentRedirect(buildBelanjaProductPath(legacyProduct.slug, paths.onSubdomain))
  }

  const product = await getMarketplaceProductBySlug(slug)
  if (!product) {
    notFound()
  }

  return (
    <BelanjaProductDetailClient
      product={product}
      homePath={paths.homePath}
      onSubdomain={paths.onSubdomain}
    />
  )
}
