"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PRODUCT_TIPE_LABELS } from "@/types/business-product"
import type { MarketplaceProduct } from "@/types/marketplace-product"
import { buildBelanjaProductPath } from "@/lib/marketplace/belanja-paths"
import { isDisplayableImageUrl } from "@/lib/integrations/storage-urls"
import { cn } from "@/lib/shared/utils"

interface ProductCardProps {
  product: MarketplaceProduct
  onSubdomain: boolean
  className?: string
}

export function ProductCard({ product, onSubdomain, className }: ProductCardProps) {
  const href = buildBelanjaProductPath(product.slug, onSubdomain)

  return (
    <Card className={cn("group overflow-hidden transition-shadow hover:shadow-md", className)}>
      <Link href={href} className="block">
        <div className="relative aspect-square bg-muted">
          {product.imageUrl && isDisplayableImageUrl(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={product.nama}
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Tanpa foto
            </div>
          )}
          <Badge className="absolute left-2 top-2 bg-white/95 text-primary hover:bg-white/95">
            {PRODUCT_TIPE_LABELS[product.tipeBisnis]}
          </Badge>
        </div>
        <CardContent className="space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
            {product.nama}
          </h3>
          <p className="text-base font-bold text-primary">
            Rp {product.hargaMulai.toLocaleString("id-ID")}
          </p>
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Store className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{product.businessNama}</span>
          </div>
          {product.kotaProvinsi && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{product.kotaProvinsi}</span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
