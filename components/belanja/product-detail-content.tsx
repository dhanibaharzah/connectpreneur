"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, FileText, MapPin, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RfqRequestModal } from "@/components/shared/rfq-request-modal"
import { PRODUCT_TIPE_LABELS } from "@/types/business-product"
import type { MarketplaceProduct } from "@/types/marketplace-product"
import { isDisplayableImageUrl } from "@/lib/integrations/storage-urls"
import { appUrl } from "@/lib/shared/app-url"

interface ProductDetailContentProps {
  product: MarketplaceProduct
  homePath: string
}

export function ProductDetailContent({ product, homePath }: ProductDetailContentProps) {
  const [rfqOpen, setRfqOpen] = useState(false)

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={homePath}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
          {product.imageUrl && isDisplayableImageUrl(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={product.nama}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Tanpa foto
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Badge variant="secondary">{PRODUCT_TIPE_LABELS[product.tipeBisnis]}</Badge>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{product.nama}</h1>
            <p className="text-2xl font-bold text-primary">
              Mulai dari Rp {product.hargaMulai.toLocaleString("id-ID")}
            </p>
          </div>

          {product.deskripsi && (
            <div className="rounded-lg border bg-card p-4">
              <h2 className="mb-2 text-sm font-semibold text-foreground">Deskripsi</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {product.deskripsi}
              </p>
            </div>
          )}

          <Button
            type="button"
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white sm:w-auto"
            onClick={() => setRfqOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Minta Penawaran
          </Button>

          <p className="text-xs text-muted-foreground">
            Harga bersifat indikatif. Detail spesifikasi, varian, dan negosiasi dapat didiskusikan
            langsung dengan mitra.
          </p>
        </div>
      </div>

      <Card className="mt-8">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
              {product.businessLogoUrl && isDisplayableImageUrl(product.businessLogoUrl) ? (
                <Image
                  src={product.businessLogoUrl}
                  alt={product.businessNama}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-lg font-bold text-primary">
                  {product.businessNama.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Store className="h-3.5 w-3.5" />
                <span>Mitra</span>
              </div>
              <p className="font-semibold text-foreground">{product.businessNama}</p>
              {product.kotaProvinsi && (
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {product.kotaProvinsi}
                </div>
              )}
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={appUrl(`/bisnis/${product.businessSlug}`)}>Lihat Profil Mitra</Link>
          </Button>
        </CardContent>
      </Card>

      <RfqRequestModal
        businessSlug={product.businessSlug}
        businessName={product.businessNama}
        productName={product.nama}
        productDeskripsi={product.deskripsi}
        open={rfqOpen}
        onOpenChange={setRfqOpen}
      />
    </>
  )
}
