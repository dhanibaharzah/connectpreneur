"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Business } from "@/types/business"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { sanitizeHTML, sanitizeURL } from "@/lib/sanitize"
import {
  MapPin,
  Clock,
  Building2,
  Globe,
  Instagram,
  Facebook,
  Phone,
  User,
  Briefcase,
  Handshake,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
} from "lucide-react"

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

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

interface BusinessDetailContentProps {
  business: Business
}

export function BusinessDetailContent({ business }: BusinessDetailContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Filter valid image URLs for carousel
  const validImages = business.produkUrls.filter((url) => isValidImageUrl(url))
  const hasValidLogo = isValidImageUrl(business.logoUrl)

  // Combine logo and valid product images for carousel
  const carouselImages = hasValidLogo ? [business.logoUrl, ...validImages] : validImages

  const nextImage = () => {
    if (carouselImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }
  }

  const prevImage = () => {
    if (carouselImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
    }
  }

  const whatsappNumber = business.kontakPIC.replace(/[^0-9]/g, "")
  const whatsappLink = `https://wa.me/${whatsappNumber.startsWith("0") ? "62" + whatsappNumber.slice(1) : whatsappNumber}?text=Halo, saya tertarik dengan program kemitraan ${business.nama}`

  return (
    <div className="container mx-auto px-4">
      {/* Back Button */}
      <Link
        href="/katalog"
        className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Carousel */}
        <div>
          {carouselImages.length > 0 ? (
            <div className="relative">
              <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
                <Image
                  src={carouselImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`${business.nama} - Gambar ${currentImageIndex + 1}`}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Carousel Controls */}
              {carouselImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center gap-2 mt-4">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary">{business.nama.charAt(0).toUpperCase()}</span>
                </div>
                <p className="text-lg font-medium text-muted-foreground">{business.nama}</p>
              </div>
            </div>
          )}

          {/* Thumbnail Strip */}
          {carouselImages.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {carouselImages.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={url || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Business Info */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-primary text-white">{business.jenisUsaha}</Badge>
              {business.jenisPeluang && (
                <Badge variant="outline" className="border-primary text-primary">{business.jenisPeluang}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{business.nama}</h1>
            <div 
              className="text-muted-foreground text-lg prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(business.deskripsi || "") }}
            />
          </div>

          {/* Business Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Informasi Usaha</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Alamat</p>
                    <p className="text-muted-foreground">{business.alamat}</p>
                    <p className="text-muted-foreground">{business.kotaProvinsi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Lama Usaha</p>
                    <p className="text-muted-foreground">{business.lamaUsaha}</p>
                  </div>
                </div>
                {shouldShowBranch(business.jumlahCabang) && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Jumlah Cabang</p>
                      <p className="text-muted-foreground">{business.jumlahCabang} Cabang</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Partnership Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Program Kemitraan</h3>
              </div>
              <div 
                className="text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(business.deskripsiKemitraan || "") }}
              />
              {business.linkKemitraan && (
                <a
                  href={business.linkKemitraan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Info Kemitraan Selengkapnya
                </a>
              )}
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Kontak</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{business.namaPIC}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <p className="text-muted-foreground">{business.jabatanPIC}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="text-muted-foreground">{business.kontakPIC}</p>
                </div>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Phone className="h-4 w-4 mr-2" />
                  Hubungi via WhatsApp
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Website & Social Media */}
          {(business.website || business.instagram || business.facebook || business.tiktok) && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Website & Media Sosial</h3>
                <div className="flex flex-wrap gap-3">
                  {business.website && sanitizeURL(business.website) && (
                    <a
                      href={sanitizeURL(business.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Globe className="h-4 w-4" />
                        Website
                      </Button>
                    </a>
                  )}
                  {business.instagram && (
                    <a href={business.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </Button>
                    </a>
                  )}
                  {business.facebook && (
                    <a href={business.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Button>
                    </a>
                  )}
                  {business.tiktok && (
                    <a href={business.tiktok} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <TikTokIcon className="h-4 w-4" />
                        TikTok
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>⚠️ Peringatan:</strong> Selalu berhati-hati dalam melakukan transaksi bisnis. Lakukan verifikasi dan riset terlebih dahulu sebelum menjalin kerjasama. 
              ConnectPreneur dan BOEMKraf tidak bertanggung jawab atas segala bentuk wanprestasi atau kerugian yang mungkin timbul dari kerjasama bisnis.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
