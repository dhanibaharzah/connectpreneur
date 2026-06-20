"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { Business } from "@/types/business"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { sanitizeHTML, sanitizeURL } from "@/lib/shared/sanitize"
import { htmlToPlainText } from "@/lib/shared/html-text"
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
  Images,
} from "lucide-react"
import { BusinessProductsSection, type RfqProductSelection } from "@/components/business/business-products-section"
import { trackEvent } from "@/lib/analytics/client"
import { RfqRequestModal } from "@/components/shared/rfq-request-modal"
import { cn } from "@/lib/shared/utils"
import { isDisplayableImageUrl } from "@/lib/integrations/storage-urls"
import { BusinessDetailHero } from "./business-detail-hero"
import {
  type DetailTab,
  shouldShowBranch,
  BusinessGalleryGrid,
  SidebarInfoRow,
  TikTokIcon,
} from "./business-detail-helpers"

interface BusinessDetailContentProps {
  business: Business
}

export function BusinessDetailContent({ business }: BusinessDetailContentProps) {
  const [rfqOpen, setRfqOpen] = useState(false)
  const [rfqProduct, setRfqProduct] = useState<RfqProductSelection | null>(null)
  const [kemitraanOpen, setKemitraanOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<DetailTab>("products")

  const validImages = business.produkUrls.filter((url) => isDisplayableImageUrl(url))
  const hasValidLogo = isDisplayableImageUrl(business.logoUrl)
  const galleryImages = hasValidLogo ? [business.logoUrl, ...validImages] : validImages
  const hasGallery = galleryImages.length > 0
  const hasProducts = business.products.length > 0
  const hasKemitraan = Boolean(htmlToPlainText(business.deskripsiKemitraan) || business.linkKemitraan)
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

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <Link
        href="/katalog"
        className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      <BusinessDetailHero
        business={business}
        hasValidLogo={hasValidLogo}
        onRequestQuote={() => openRfq()}
        onTrackClick={trackBusinessClick}
      />

      <div className="space-y-6">
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
                {business.alamat && (
                  <SidebarInfoRow icon={MapPin} label="Alamat" value={business.alamat} />
                )}
                {business.kotaProvinsi && (
                  <SidebarInfoRow icon={MapPin} label="Area" value={business.kotaProvinsi} />
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
                {business.alamat && (
                  <SidebarInfoRow icon={MapPin} label="Alamat" value={business.alamat} />
                )}
                {business.kotaProvinsi && (
                  <SidebarInfoRow icon={MapPin} label="Area" value={business.kotaProvinsi} />
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
              {htmlToPlainText(business.deskripsiKemitraan) && (
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
