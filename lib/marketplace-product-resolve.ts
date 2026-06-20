import {
  getMarketplaceProductById,
  getMarketplaceProductBySlug,
} from "@/lib/marketplace-products"
import type { MarketplaceProduct } from "@/types/marketplace-product"

export function isLegacyMarketplaceProductId(slug: string): boolean {
  return /^\d+$/.test(slug)
}

export async function resolveMarketplaceProductByParam(
  slug: string,
): Promise<MarketplaceProduct | null> {
  if (isLegacyMarketplaceProductId(slug)) {
    return getMarketplaceProductById(Number(slug))
  }
  return getMarketplaceProductBySlug(slug)
}
