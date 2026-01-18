"use client"

import type { Business } from "@/types/business"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Building2, Eye, Handshake } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

// Strip HTML tags for plain text preview
function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

export function BusinessCard({ business }: BusinessCardProps) {
  const logoUrl = business.logoUrl
  const hasValidLogo = isValidImageUrl(logoUrl)

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/50 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
        {hasValidLogo ? (
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={business.nama}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="text-center p-4">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{business.nama.charAt(0).toUpperCase()}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground line-clamp-2">{business.nama}</p>
            </div>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary text-white">{business.jenisUsaha}</Badge>
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{business.nama}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{stripHtml(business.deskripsi)}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{business.kotaProvinsi}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Berdiri: {business.lamaUsaha}</span>
          </div>
          {shouldShowBranch(business.jumlahCabang) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{business.jumlahCabang} Cabang</span>
            </div>
          )}
          {business.jenisPeluang && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Handshake className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{business.jenisPeluang}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Link href={`/bisnis/${business.slug}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-secondary text-white">
            <Eye className="h-4 w-4 mr-2" />
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
