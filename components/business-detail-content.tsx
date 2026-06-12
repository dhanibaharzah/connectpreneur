"use client"

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Business } from "@/types/business"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { sanitizeHTML, sanitizeURL } from "@/lib/sanitize"
import {
  MapPin,
  Clock,
  Building2,
  Globe,
  Instagram,
  Facebook,
  User,
  Briefcase,
  Handshake,
  ExternalLink,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  Images,
} from "lucide-react"
import { BusinessProductsSection, type RfqProductSelection } from "@/components/business-products-section"
import { ConnectScoreDetail } from "@/components/connect-score-badge"
import { ConnectScoreTierBadge } from "@/components/connect-score-tier-badge"
import { VerifiedSellerBadge } from "@/components/verified-seller-badge"
import { UmkmTrustBadge } from "@/components/umkm-trust-badge"
import { trackEvent } from "@/lib/analytics/client"
import { RfqRequestModal } from "@/components/rfq-request-modal"
import { cn } from "@/lib/utils"
import { isAllowedImageHost } from "@/lib/storage-urls"

type DetailTab = "products" | "about" | "gallery" | "info" | "contact" | "kemitraan"

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  if (isAllowedImageHost(url)) return true
  return url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
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

function formatSocialDisplay(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "")
}

const SOCIAL_PLATFORM_LABELS: Record<NonNullable<ReturnType<typeof getPrimarySocialMedia>["platform"]>, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
}

function getPrimarySocialMedia(business: Business): {
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

function BusinessDescriptionPreview({ html }: { html: string }) {
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

  if (!stripHtml(html)) return null

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

function TikTokIcon({ className }: { className?: string }) {
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

function ConnectScoreSidebarCard({
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

function BusinessGalleryGrid({
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

function SidebarInfoRow({
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

interface BusinessDetailContentProps {
  business: Business
}

export function BusinessDetailContent({ business }: BusinessDetailContentProps) {
  const [rfqOpen, setRfqOpen] = useState(false)
  const [rfqProduct, setRfqProduct] = useState<RfqProductSelection | null>(null)
  const [kemitraanOpen, setKemitraanOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<DetailTab>("products")

  const validImages = business.produkUrls.filter((url) => isValidImageUrl(url))
  const hasValidLogo = isValidImageUrl(business.logoUrl)
  const galleryImages = hasValidLogo ? [business.logoUrl, ...validImages] : validImages
  const hasGallery = galleryImages.length > 0
  const hasProducts = business.products.length > 0
  const hasKemitraan = Boolean(stripHtml(business.deskripsiKemitraan) || business.linkKemitraan)
  const hasContact =
    Boolean(business.namaPIC || business.jabatanPIC) ||
    Boolean(business.website && sanitizeURL(business.website)) ||
    Boolean(business.instagram || business.facebook || business.tiktok) ||
    Boolean(business.alamat || business.kotaProvinsi)

  const tabs = useMemo(() => {
    const items: { id: DetailTab; label: string }[] = []
    if (hasProducts) items.push({ id: "products", label: "Produk & Layanan" })
    items.push({ id: "about", label: "Tentang Kami" })
    if (hasGallery || business.linkGaleri) items.push({ id: "gallery", label: "Galeri" })
    items.push({ id: "info", label: "Informasi Usaha" })
    if (hasContact) items.push({ id: "contact", label: "Kontak" })
    if (hasKemitraan) items.push({ id: "kemitraan", label: "Program Kemitraan" })
    return items
  }, [hasProducts, hasGallery, business.linkGaleri, hasContact, hasKemitraan])

  const defaultTab = tabs[0]?.id ?? "about"
  const currentTab = tabs.some((t) => t.id === activeTab) ? activeTab : defaultTab

  const businessId = Number.parseInt(business.id, 10)

  const trackRfqSubmit = () => {
    trackBusinessClick("whatsapp_click")
  }

  const trackBusinessClick = (
    eventType: "whatsapp_click" | "website_click" | "social_click",
    platform?: string,
  ) => {
    if (Number.isNaN(businessId)) return
    trackEvent({
      eventType,
      businessId,
      metadata: platform ? { platform } : undefined,
    })
  }

  const openRfq = (product?: RfqProductSelection) => {
    setRfqProduct(
      product?.nama?.trim()
        ? { nama: product.nama.trim(), deskripsi: product.deskripsi?.trim() ?? "" }
        : null,
    )
    setRfqOpen(true)
  }

  const handleRfqOpenChange = (open: boolean) => {
    setRfqOpen(open)
    if (!open) setRfqProduct(null)
  }

  const locationText = [business.alamat, business.kotaProvinsi].filter(Boolean).join(", ")
  const primarySocial = getPrimarySocialMedia(business)

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <Link
        href="/katalog"
        className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      {/* Header + ConnectScore */}
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

                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => openRfq()}
                >
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

      {/* Quick Stats */}
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
                    trackBusinessClick(
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

      {/* Tabs Content */}
      <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "shrink-0 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                    currentTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {currentTab === "products" && hasProducts && (
            <BusinessProductsSection
              products={business.products}
              onRequestQuote={(product) => openRfq(product)}
              layout="detail"
            />
          )}

          {currentTab === "about" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Tentang Kami</h2>
                <div
                  className="text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(business.deskripsi || "") }}
                />
              </CardContent>
            </Card>
          )}

          {currentTab === "info" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Informasi Usaha</h2>
                <div className="space-y-4">
                  <SidebarInfoRow icon={User} label="Nama Usaha" value={business.nama} />
                  {business.lamaUsaha && (
                    <SidebarInfoRow icon={Clock} label="Lama Usaha" value={business.lamaUsaha} />
                  )}
                  <SidebarInfoRow icon={Briefcase} label="Bidang Usaha" value={business.jenisUsaha} />
                  {locationText && (
                    <SidebarInfoRow icon={MapPin} label="Alamat" value={locationText} />
                  )}
                  {shouldShowBranch(business.jumlahCabang) && (
                    <SidebarInfoRow icon={Building2} label="Jumlah Cabang" value={`${business.jumlahCabang} Cabang`} />
                  )}
                  {business.jenisPeluang && (
                    <SidebarInfoRow icon={Handshake} label="Jenis Peluang" value={business.jenisPeluang} />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "contact" && hasContact && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Kontak</h2>
                <div className="space-y-4">
                  {business.namaPIC && (
                    <SidebarInfoRow icon={User} label="Nama PIC" value={business.namaPIC} />
                  )}
                  {business.jabatanPIC && (
                    <SidebarInfoRow icon={Briefcase} label="Jabatan" value={business.jabatanPIC} />
                  )}
                  {locationText && (
                    <SidebarInfoRow icon={MapPin} label="Alamat" value={locationText} />
                  )}
                  {business.website && sanitizeURL(business.website) && (
                    <SidebarInfoRow
                      icon={Globe}
                      label="Website"
                      value={business.website.replace(/^https?:\/\//, "")}
                      href={sanitizeURL(business.website)!}
                      onClick={() => trackBusinessClick("website_click")}
                      valueClassName="text-green-600"
                    />
                  )}
                  {business.instagram && (
                    <SidebarInfoRow
                      icon={Instagram}
                      label="Instagram"
                      value={business.instagram.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                      href={business.instagram}
                      onClick={() => trackBusinessClick("social_click", "instagram")}
                      valueClassName="text-green-600"
                    />
                  )}
                  {business.facebook && (
                    <SidebarInfoRow
                      icon={Facebook}
                      label="Facebook"
                      value={business.facebook.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                      href={business.facebook}
                      onClick={() => trackBusinessClick("social_click", "facebook")}
                      valueClassName="text-green-600"
                    />
                  )}
                  {business.tiktok && (
                    <SidebarInfoRow
                      icon={TikTokIcon}
                      label="TikTok"
                      value={business.tiktok.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                      href={business.tiktok}
                      onClick={() => trackBusinessClick("social_click", "tiktok")}
                      valueClassName="text-green-600"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "kemitraan" && hasKemitraan && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Program Kemitraan</h2>
                </div>
                {stripHtml(business.deskripsiKemitraan) && (
                  <>
                    <div
                      className={cn(
                        "text-muted-foreground prose prose-sm max-w-none",
                        !kemitraanOpen && "line-clamp-3",
                      )}
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(business.deskripsiKemitraan) }}
                    />
                    <button
                      type="button"
                      onClick={() => setKemitraanOpen(!kemitraanOpen)}
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {kemitraanOpen ? "Tutup detail" : "Lihat detail program"}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", kemitraanOpen && "rotate-180")} />
                    </button>
                  </>
                )}
                {business.linkKemitraan && (
                  <a
                    href={business.linkKemitraan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Info kemitraan selengkapnya
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {currentTab === "gallery" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Galeri</h2>
                <p className="text-sm text-muted-foreground">
                  {hasGallery ? `${galleryImages.length} foto` : "Belum ada foto"}
                </p>
              </div>

              {hasGallery ? (
                <BusinessGalleryGrid images={galleryImages} businessName={business.nama} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Images className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Belum ada foto galeri.</p>
                  </CardContent>
                </Card>
              )}

              {business.linkGaleri && (
                <a
                  href={business.linkGaleri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Buka galeri eksternal
                </a>
              )}
            </div>
          )}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>⚠️ Peringatan:</strong> ConnectPreneur memfasilitasi permintaan penawaran dan invoice digital.
          Pembayaran dilakukan langsung ke rekening mitra bisnis — platform tidak menampung dana. Lakukan verifikasi
          mitra dan bukti transfer sebelum menyelesaikan transaksi. ConnectPreneur tidak bertanggung jawab atas
          wanprestasi atau kerugian dari kerjasama bisnis.
        </p>
      </div>

      <RfqRequestModal
        businessSlug={business.slug}
        businessName={business.nama}
        productName={rfqProduct?.nama ?? null}
        productDeskripsi={rfqProduct?.deskripsi ?? null}
        open={rfqOpen}
        onOpenChange={handleRfqOpenChange}
        onSubmitted={trackRfqSubmit}
      />
    </div>
  )
}
