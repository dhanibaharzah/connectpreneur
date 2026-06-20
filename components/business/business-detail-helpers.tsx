"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import Image from "next/image"
import type { Business } from "@/types/business"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { sanitizeHTML, sanitizeURL } from "@/lib/shared/sanitize"
import { htmlToPlainText } from "@/lib/shared/html-text"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"
import { ConnectScoreDetail } from "@/components/shared/connect-score-badge"
import { ConnectScoreTierBadge } from "@/components/shared/connect-score-tier-badge"
import { cn } from "@/lib/shared/utils"

export type DetailTab = "products" | "about" | "gallery" | "info" | "contact" | "kemitraan"

export function shouldShowBranch(jumlahCabang: string | undefined): boolean {
  if (!jumlahCabang) return false
  if (jumlahCabang === "-" || jumlahCabang === "0") return false
  if (jumlahCabang.toLowerCase().includes("tidak ada")) return false
  return true
}

function formatSocialDisplay(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "")
}

const SOCIAL_PLATFORM_LABELS: Record<NonNullable<ReturnType<typeof getPrimarySocialMedia>["platform"]>, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
}

export function getPrimarySocialMedia(business: Business): {
  label: string
  display: string
  href?: string
  platform?: "website" | "instagram" | "facebook" | "tiktok"
} {
  const website = business.website && sanitizeURL(business.website)
  if (website) {
    return {
      label: SOCIAL_PLATFORM_LABELS.website,
      display: formatSocialDisplay(business.website),
      href: website,
      platform: "website",
    }
  }
  if (business.instagram) {
    return {
      label: SOCIAL_PLATFORM_LABELS.instagram,
      display: formatSocialDisplay(business.instagram),
      href: business.instagram,
      platform: "instagram",
    }
  }
  if (business.facebook) {
    return {
      label: SOCIAL_PLATFORM_LABELS.facebook,
      display: formatSocialDisplay(business.facebook),
      href: business.facebook,
      platform: "facebook",
    }
  }
  if (business.tiktok) {
    return {
      label: SOCIAL_PLATFORM_LABELS.tiktok,
      display: formatSocialDisplay(business.tiktok),
      href: business.tiktok,
      platform: "tiktok",
    }
  }
  return { label: "Media Sosial", display: "-" }
}

export function BusinessDescriptionPreview({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el || expanded) return

    const checkOverflow = () => {
      setHasMore(el.scrollHeight > el.clientHeight + 1)
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [html, expanded])

  if (!htmlToPlainText(html)) return null

  return (
    <div>
      <div
        ref={contentRef}
        className={cn(
          "mt-2 text-muted-foreground prose prose-sm max-w-none",
          !expanded && "line-clamp-5",
        )}
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
      />
      {(hasMore || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Tampilkan lebih sedikit" : "Selengkapnya"}
        </button>
      )}
    </div>
  )
}

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

const CONNECT_SCORE_CHECKLIST: { key: string; label: string }[] = [
  { key: "deskripsi", label: "Profil lengkap" },
  { key: "logo_url", label: "Logo bisnis" },
  { key: "product_images", label: "Foto produk" },
  { key: "kontak_pic", label: "Kontak responsif" },
  { key: "website", label: "Website tersedia" },
  { key: "akta_pendirian_url", label: "Dokumen legalitas" },
]

export function ConnectScoreSidebarCard({
  score,
  breakdown,
  tier,
  className,
}: {
  score: number
  breakdown?: Record<string, number> | null
  tier?: Business["connectScoreTier"]
  className?: string
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const progressColor = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : "bg-yellow-500"

  const checklist = CONNECT_SCORE_CHECKLIST.map((item) => ({
    ...item,
    completed: (breakdown?.[item.key] ?? 0) > 0,
  }))

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground">ConnectScore</h3>
          {tier && <ConnectScoreTierBadge tier={tier} size="sm" />}
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-green-600">{score}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", progressColor)} style={{ width: `${score}%` }} />
          </div>
        </div>

        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              <CheckCircle2
                className={cn("h-4 w-4 shrink-0", item.completed ? "text-green-600" : "text-muted-foreground/40")}
              />
              <span className={cn(item.completed ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
            </li>
          ))}
        </ul>

        {breakdown && (
          <>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex w-full items-center justify-between text-sm font-medium text-primary hover:underline"
            >
              Lihat detail skor
              <ChevronDown className="h-4 w-4" />
            </button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex flex-wrap items-center gap-2">
                    Detail ConnectScore
                    {tier && <ConnectScoreTierBadge tier={tier} size="sm" />}
                  </DialogTitle>
                </DialogHeader>
                <ConnectScoreDetail score={score} breakdown={breakdown} />
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function BusinessGalleryGrid({
  images,
  businessName,
}: {
  images: string[]
  businessName: string
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const goPrev = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
  }

  const goNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % images.length)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="relative aspect-square overflow-hidden rounded-lg border bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Image
              src={url}
              alt={`${businessName} - Foto ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 200px"
            />
          </button>
        ))}
      </div>

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-lg border-none bg-black p-0 sm:max-w-3xl">
          {lightboxIndex !== null && (
            <div className="relative aspect-[4/3] w-full sm:aspect-video">
              <Image
                src={images[lightboxIndex]}
                alt={`${businessName} - Foto ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              {images.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    onClick={goPrev}
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    onClick={goNext}
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/80">
                {lightboxIndex + 1} / {images.length}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export function SidebarInfoRow({
  icon: Icon,
  label,
  value,
  href,
  onClick,
  valueClassName,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
  onClick?: () => void
  valueClassName?: string
}) {
  const content = (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-medium", href ? "truncate" : "break-words", valueClassName ?? "text-foreground")}>{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className="block hover:opacity-80">
        {content}
      </a>
    )
  }

  return content
}
