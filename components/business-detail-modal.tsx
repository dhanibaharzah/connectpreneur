"use client"

import type { Business } from "@/types/business"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
  ExternalLink,
  ImageIcon,
} from "lucide-react"
import Image from "next/image"

interface BusinessDetailModalProps {
  business: Business | null
  isOpen: boolean
  onClose: () => void
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  const isDirectImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
  const isBlobUrl =
    url.includes("blob.v0.app") || url.includes("blob.vercel-storage.com") || url.includes("vusercontent.net")
  const isPlaceholder = url.includes("placeholder.svg")
  const isLocalImage = url.startsWith("/images/") || url.startsWith("/public/")

  return isDirectImage || isBlobUrl || isPlaceholder || isLocalImage
}

function shouldShowBranch(jumlahCabang: string | undefined): boolean {
  if (!jumlahCabang) return false
  if (jumlahCabang === "-" || jumlahCabang === "0") return false
  if (jumlahCabang.toLowerCase().includes("tidak ada")) return false
  return true
}

export function BusinessDetailModal({ business, isOpen, onClose }: BusinessDetailModalProps) {
  if (!business) return null

  const hasValidLogo = isValidImageUrl(business.logoUrl)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
              {hasValidLogo ? (
                <Image
                  src={business.logoUrl || "/placeholder.svg"}
                  alt={business.nama}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{business.nama.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-foreground">{business.nama}</DialogTitle>
              <Badge className="mt-2 bg-primary text-white">{business.jenisUsaha}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Deskripsi Usaha */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Tentang Usaha</h4>
            <p className="text-muted-foreground">{business.deskripsi}</p>
          </div>

          {/* Info Usaha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Alamat</p>
                  <p className="text-sm text-muted-foreground">{business.alamat}</p>
                  <p className="text-sm text-muted-foreground">{business.kotaProvinsi}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Lama Usaha</p>
                  <p className="text-sm text-muted-foreground">{business.lamaUsaha}</p>
                </div>
              </div>
              {shouldShowBranch(business.jumlahCabang) && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Jumlah Cabang</p>
                    <p className="text-sm text-muted-foreground">{business.jumlahCabang}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Program Kemitraan */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Program Kemitraan</h4>
            <p className="text-muted-foreground mb-3">{business.deskripsiKemitraan}</p>
            {business.linkKemitraan && (
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                <a href={business.linkKemitraan} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Lihat Detail Kemitraan
                </a>
              </Button>
            )}
          </div>

          <Separator />

          {((business.produkUrls && business.produkUrls.length > 0) || business.linkGaleri) && (
            <div>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                <a
                  href={business.linkGaleri || (business.produkUrls && business.produkUrls[0]) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Lihat Produk Lengkap
                </a>
              </Button>
            </div>
          )}

          <Separator />

          {/* Social Media & Website */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Media Sosial & Website</h4>
            <div className="flex flex-wrap gap-2">
              {business.website && (
                <Button asChild variant="outline" size="sm">
                  <a href={business.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              {business.instagram && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent"
                >
                  <a href={business.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </a>
                </Button>
              )}
              {business.facebook && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                >
                  <a href={business.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </a>
                </Button>
              )}
              {business.tiktok && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  <a href={business.tiktok} target="_blank" rel="noopener noreferrer">
                    <TikTokIcon className="h-4 w-4 mr-2" />
                    TikTok
                  </a>
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* PIC Info */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">Kontak PIC (Person In Charge)</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <span className="text-foreground">{business.namaPIC}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{business.jabatanPIC}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a
                  href={`https://wa.me/${business.kontakPIC.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {business.kontakPIC}
                </a>
              </div>
            </div>
            <Button asChild className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
              <a
                href={`https://wa.me/${business.kontakPIC.replace(/[^0-9]/g, "")}?text=Halo, saya tertarik dengan program kemitraan ${business.nama}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="h-4 w-4 mr-2" />
                Hubungi via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
