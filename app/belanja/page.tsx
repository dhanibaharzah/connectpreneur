import { BelanjaClient } from "@/components/belanja/belanja-client"
import { getBelanjaPathsFromHeaders } from "@/lib/marketplace/belanja-paths"
import { getActiveBanners } from "@/lib/marketplace/shop-banners"
import { getMarketplaceLocations, listMarketplaceProducts } from "@/lib/marketplace/marketplace-products"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BelanjaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const initialSearch = search?.trim() ?? ""
  const [paths, banners, { products, pagination }, locations] = await Promise.all([
    getBelanjaPathsFromHeaders(),
    getActiveBanners(),
    listMarketplaceProducts({ page: 1, search: initialSearch || undefined }),
    getMarketplaceLocations(),
  ])

  return (
    <BelanjaClient
      homePath={paths.homePath}
      onSubdomain={paths.onSubdomain}
      initialSearch={initialSearch}
      initialBanners={banners}
      initialProducts={products}
      initialPagination={pagination}
      initialLocations={locations}
    />
  )
}
