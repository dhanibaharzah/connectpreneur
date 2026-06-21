"use client"

import { BelanjaFooter } from "@/components/belanja/belanja-footer"
import { BelanjaHeader } from "@/components/belanja/belanja-header"
import { ProductDetailContent } from "@/components/belanja/product-detail-content"
import type { MarketplaceProduct } from "@/types/marketplace-product"

interface BelanjaProductDetailClientProps {
  product: MarketplaceProduct
  homePath: string
  onSubdomain: boolean
}

function BelanjaProductDetailInner({
  product,
  homePath,
  onSubdomain,
}: BelanjaProductDetailClientProps) {
  return (
    <div className="min-h-screen bg-muted/20">
      <BelanjaHeader homePath={homePath} onSubdomain={onSubdomain} />
      <main className="container mx-auto px-4 py-6">
        <ProductDetailContent product={product} homePath={homePath} />
      </main>
      <BelanjaFooter homePath={homePath} onSubdomain={onSubdomain} />
    </div>
  )
}

export function BelanjaProductDetailClient(props: BelanjaProductDetailClientProps) {
  return <BelanjaProductDetailInner {...props} />
}
