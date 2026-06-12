"use client"

import type { Business } from "@/types/business"
import { MapPin, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConnectScoreTierBadge } from "@/components/connect-score-tier-badge"
import { cn } from "@/lib/utils"

interface BusinessCardProps {
  business: Business
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  const isDirectImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
  const isBlobUrl =
    url.includes("blob.v0.app") || url.includes("blob.vercel-storage.com") || url.includes("vusercontent.net")
  const isPlaceholder = url.includes("placeholder.svg")
  const isLocalImage = url.startsWith("/images/") || url.startsWith("/public/") || url.startsWith("/")

  return isDirectImage || isBlobUrl || isPlaceholder || isLocalImage
}

function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

export function BusinessCard({ business }: BusinessCardProps) {
  const logoUrl = business.logoUrl
  const hasValidLogo = isValidImageUrl(logoUrl)
  const detailHref = `/bisnis/${business.slug}`
  const description = stripHtml(business.deskripsi)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] bg-white">
        {business.connectScoreTier && (
          <div className="absolute right-2 top-2 z-[1]">
            <ConnectScoreTierBadge tier={business.connectScoreTier} size="sm" />
          </div>
        )}

        {hasValidLogo ? (
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={business.nama}
            fill
            className="object-contain p-6"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#fdede8]/60 to-white p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
              <span className="text-3xl font-bold text-primary">{business.nama.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="text-base font-bold leading-snug text-foreground line-clamp-2">
          <Link href={detailHref} className="transition hover:text-primary">
            {business.nama}
          </Link>
        </h3>

        <span className="w-fit rounded-full bg-[#fdede8] px-3 py-1 text-[10px] font-medium text-[#b13b0f]">
          {business.jenisUsaha}
        </span>

        {business.kotaProvinsi && (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-2">{business.kotaProvinsi}</span>
          </div>
        )}

        {description && (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}

        {(business.connectScore != null || business.lamaUsaha) && (
          <p className="text-xs font-semibold text-green-600">
            {business.connectScore != null && <>ConnectScore {business.connectScore}/100</>}
            {business.connectScore != null && business.lamaUsaha && " · "}
            {business.lamaUsaha}
          </p>
        )}

        <Link
          href={detailHref}
          className={cn(
            "mt-auto flex w-full items-center justify-center gap-1 rounded-lg border border-border py-2.5",
            "text-sm font-semibold text-foreground transition hover:bg-muted/50",
          )}
        >
          Lihat Profil
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
