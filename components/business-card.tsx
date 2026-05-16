"use client"

import type { Business } from "@/types/business"
import { MapPin, Clock, Building2, Handshake, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConnectScoreBadge } from "@/components/connect-score-badge"

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

function shouldShowBranch(jumlahCabang: string | undefined): boolean {
  if (!jumlahCabang) return false
  if (jumlahCabang === "-" || jumlahCabang === "0") return false
  if (jumlahCabang.toLowerCase().includes("tidak ada")) return false
  return true
}

function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

export function BusinessCard({ business }: BusinessCardProps) {
  const logoUrl = business.logoUrl
  const hasValidLogo = isValidImageUrl(logoUrl)

  return (
    <div className="group flex h-full flex-col gap-4 rounded-2xl p-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-[0_0_4px_rgba(0,0,0,0.1)]">
        {hasValidLogo ? (
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={business.nama}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#fdede8]/60 to-white p-6">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <span className="text-2xl font-bold text-primary">{business.nama.charAt(0).toUpperCase()}</span>
              </div>
              <p className="line-clamp-2 text-xs font-medium text-[#838383]">{business.nama}</p>
            </div>
          </div>
        )}
        {business.connectScore != null && (
          <div className="absolute right-2 top-2 z-[1]">
            <ConnectScoreBadge score={business.connectScore} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start gap-2">
          <h3 className="min-w-0 flex-1 text-sm font-semibold leading-tight text-[#1f1f1f] line-clamp-2">
            {business.nama}
          </h3>
          <span className="shrink-0 rounded-full bg-[#fdede8] px-3 py-2 text-[10px] font-medium text-[#b13b0f] backdrop-blur-sm">
            {business.jenisUsaha}
          </span>
        </div>

        <p className="line-clamp-2 text-xs font-medium text-[#838383]">{stripHtml(business.deskripsi)}</p>

        <div className="space-y-2 text-xs font-medium text-[#838383]">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 shrink-0 text-[#838383]" aria-hidden />
            <span className="line-clamp-2">{business.kotaProvinsi}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 shrink-0 text-[#838383]" aria-hidden />
            <span>{business.lamaUsaha}</span>
          </div>
          {shouldShowBranch(business.jumlahCabang) && (
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 shrink-0 text-[#838383]" aria-hidden />
              <span>{business.jumlahCabang} Cabang</span>
            </div>
          )}
          {business.jenisPeluang && (
            <div className="flex items-center gap-2">
              <Handshake className="h-5 w-5 shrink-0 text-[#838383]" aria-hidden />
              <span className="line-clamp-2">{business.jenisPeluang}</span>
            </div>
          )}
        </div>

        <Link
          href={`/bisnis/${business.slug}`}
          className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#d44612] transition hover:text-[#b13b0f]"
        >
          Lihat Detail
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
