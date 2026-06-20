"use client"

import Image from "next/image"
import type { Business } from "@/types/business"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Clock,
  Globe,
  Briefcase,
  Handshake,
  FileText,
} from "lucide-react"
import { VerifiedSellerBadge } from "@/components/shared/verified-seller-badge"
import { UmkmTrustBadge } from "@/components/umkm/umkm-trust-badge"
import { cn } from "@/lib/shared/utils"
import {
  BusinessDescriptionPreview,
  ConnectScoreSidebarCard,
  getPrimarySocialMedia,
} from "./business-detail-helpers"

interface BusinessDetailHeroProps {
  business: Business
  hasValidLogo: boolean
  onRequestQuote: () => void
  onTrackClick: (
    eventType: "whatsapp_click" | "website_click" | "social_click",
    platform?: string,
  ) => void
}

export function BusinessDetailHero({
  business,
  hasValidLogo,
  onRequestQuote,
  onTrackClick,
}: BusinessDetailHeroProps) {
  const primarySocial = getPrimarySocialMedia(business)

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
        <Card className={cn("overflow-hidden h-full", business.connectScore == null ? "lg:col-span-4" : "lg:col-span-3")}>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border bg-white md:mx-0 md:aspect-square md:h-28 md:w-28 md:max-w-none md:shrink-0">
                {hasValidLogo ? (
                  <Image src={business.logoUrl} alt={business.nama} fill className="object-contain p-3 md:p-2" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10">
                    <span className="text-5xl font-bold text-primary md:text-3xl">{business.nama.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <VerifiedSellerBadge size="md" />
                    {business.trustTier && <UmkmTrustBadge tier={business.trustTier} size="md" />}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{business.nama}</h1>
                  <BusinessDescriptionPreview html={business.deskripsi || ""} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-full">{business.jenisUsaha}</Badge>
                  {business.jenisPeluang && (
                    <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                      {business.jenisPeluang}
                    </Badge>
                  )}
                </div>

                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onRequestQuote}>
                  <FileText className="h-4 w-4 mr-2" />
                  Minta Penawaran
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {business.connectScore != null && (
          <div className="lg:col-span-1">
            <ConnectScoreSidebarCard
              score={business.connectScore}
              breakdown={business.connectScoreBreakdown}
              tier={business.connectScoreTier}
              className="h-full"
            />
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-2">
            <Briefcase className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Bidang Usaha</p>
              <p className="text-sm font-medium line-clamp-2">{business.jenisUsaha || "-"}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Lama Usaha</p>
              <p className="text-sm font-medium">{business.lamaUsaha || "-"}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-2">
            <Handshake className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Peluang Kemitraan</p>
              <p className="text-sm font-medium line-clamp-2">{business.jenisPeluang || "-"}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-2">
            <Globe className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{primarySocial.label}</p>
              {primarySocial.href ? (
                <a
                  href={primarySocial.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    onTrackClick(
                      primarySocial.platform === "website" ? "website_click" : "social_click",
                      primarySocial.platform === "website" ? undefined : primarySocial.platform,
                    )
                  }
                  className="block truncate text-sm font-medium text-green-600 hover:underline"
                >
                  {primarySocial.display}
                </a>
              ) : (
                <p className="text-sm font-medium">-</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
