"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sanitizeHTML } from "@/lib/sanitize"
import { MapPin, Clock, Building2, Globe, Phone, User, Briefcase, Instagram, Facebook, Handshake, FileText, ExternalLink } from "lucide-react"
import { ConnectScoreDetail } from "@/components/connect-score-badge"

interface BusinessViewModalProps {
  business: any
  onClose: () => void
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function LegalitasDocument({
  title,
  url,
  description,
  isImage = false,
  ocrVerified,
}: {
  title: string
  url?: string | null
  description?: string
  isImage?: boolean
  ocrVerified?: boolean | null
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">{title}</p>
        {url != null && ocrVerified != null && (
          <Badge variant={ocrVerified ? "default" : "secondary"} className={ocrVerified ? "bg-green-600" : "bg-amber-500 text-white"}>
            OCR {ocrVerified ? "Lulus" : "Perlu Review"}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {url ? (
        isImage ? (
          <div className="p-3 border rounded-lg bg-muted/30">
            <img src={url} alt={title} className="max-h-64 rounded border object-contain" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              Lihat file
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
          <FileText className="h-8 w-8 text-red-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{title}.pdf</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
            >
              Lihat file
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        )
      ) : (
        <div className="p-4 border border-dashed rounded-lg bg-muted/30 text-sm text-muted-foreground">
          Belum diupload
        </div>
      )}
    </div>
  )
}

export default function BusinessViewModal({ business, onClose }: BusinessViewModalProps) {
  if (!business) return null

  const productImages = business.product_images || []

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {business.logo_url && (
              <Image
                src={business.logo_url}
                alt={business.nama}
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
            )}
            <div>
              <span>{business.nama}</span>
              <div className="flex gap-2 mt-1">
                <Badge variant={business.is_active ? "default" : "secondary"}>
                  {business.is_active ? "Terverifikasi" : "Menunggu Verifikasi"}
                </Badge>
                {business.is_featured && (
                  <Badge className="bg-yellow-500">Featured</Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full mt-4 overflow-hidden">
          <div className="overflow-x-auto scrollbar-none">
          <TabsList className="inline-flex w-max min-w-full">
            <TabsTrigger value="basic" className="flex-shrink-0">Dasar</TabsTrigger>
            <TabsTrigger value="detail" className="flex-shrink-0">Detail</TabsTrigger>
            <TabsTrigger value="contact" className="flex-shrink-0">Kontak</TabsTrigger>
            <TabsTrigger value="legalitas" className="flex-shrink-0">Legalitas</TabsTrigger>
            <TabsTrigger value="images" className="flex-shrink-0">Gambar</TabsTrigger>
            <TabsTrigger value="score" className="flex-shrink-0">ConnectScore</TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nama Bisnis</p>
                <p className="font-medium">{business.nama || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="font-medium">{business.slug || "-"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Deskripsi</p>
              <div 
                className="text-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(business.deskripsi) || "-" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Kategori</p>
                <p className="font-medium">{business.category_name || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lama Usaha</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{business.lama_usaha || "-"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jumlah Cabang</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>{business.jumlah_cabang || "0"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jenis Peluang</p>
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-primary" />
                  <span>{business.jenis_peluang || "-"}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detail" className="space-y-4 mt-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Alamat Lengkap</p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span>{business.alamat || "-"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Kota, Provinsi</p>
              <p className="font-medium">{business.kota_provinsi || "-"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Deskripsi Kemitraan</p>
              <div 
                className="text-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(business.deskripsi_kemitraan) || "-" }}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Website</p>
              {business.website ? (
                <a 
                  href={business.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  {business.website}
                </a>
              ) : (
                <p>-</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nama PIC</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>{business.nama_pic || "-"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jabatan PIC</p>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>{business.jabatan_pic || "-"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Kontak PIC (WhatsApp)</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{business.kontak_pic || "-"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Media Sosial</p>
              <div className="flex flex-wrap gap-3">
                {business.instagram && (
                  <a 
                    href={business.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-600 hover:underline"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                )}
                {business.facebook && (
                  <a 
                    href={business.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </a>
                )}
                {business.tiktok && (
                  <a 
                    href={business.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground hover:underline"
                  >
                    <TikTokIcon className="h-4 w-4" />
                    TikTok
                  </a>
                )}
                {!business.instagram && !business.facebook && !business.tiktok && (
                  <p className="text-muted-foreground">-</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="legalitas" className="space-y-6 mt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
              Dokumen legalitas hanya dapat dilihat oleh admin. Tidak ditampilkan di halaman publik mitra.
            </div>
            <LegalitasDocument
              title="KTP Pemilik / PIC"
              url={business.ktp_url}
              isImage
              ocrVerified={business.ktp_ocr_verified}
            />
            <LegalitasDocument
              title="Akta Pendirian Perusahaan beserta Perubahannya"
              url={business.akta_pendirian_url}
              ocrVerified={business.akta_ocr_verified}
            />
            <LegalitasDocument
              title="Legalitas Perusahaan"
              url={business.legalitas_url}
              description="SIUP, TDP, NIB, Domisili Perusahaan, SKT, NPWP Perusahaan, HAKI — digabung dalam 1 file PDF"
            />
          </TabsContent>

          <TabsContent value="images" className="space-y-6 mt-4">
            {/* Logo */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Logo Bisnis</p>
              {business.logo_url ? (
                <Image
                  src={business.logo_url}
                  alt="Logo"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover border"
                />
              ) : (
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Tidak ada logo</span>
                </div>
              )}
            </div>

            {/* Product Images */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Gambar Produk</p>
              {productImages.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {productImages.map((img: any, index: number) => (
                    <div key={index} className="relative">
                      <Image
                        src={img.image_url || img.url}
                        alt={`Product ${index + 1}`}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover border"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Tidak ada gambar</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="score" className="mt-4 space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              ConnectScore adalah skor kelengkapan data mitra (0–100). Semakin lengkap data yang diisi, semakin tinggi skornya. Skor ini membantu admin menilai kesiapan profil mitra untuk dipublikasikan.
            </div>
            {business.connect_score != null && business.connect_score_breakdown ? (
              <ConnectScoreDetail
                score={business.connect_score}
                breakdown={business.connect_score_breakdown}
              />
            ) : business.connect_score != null ? (
              <div className="text-center py-8">
                <p className="text-3xl font-bold">{business.connect_score}/100</p>
                <p className="text-sm text-muted-foreground mt-1">ConnectScore</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Score belum dihitung. Score akan dihitung otomatis saat halaman detail dibuka.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
          <p>Dibuat: {business.created_at ? new Date(business.created_at).toLocaleString("id-ID") : "-"}</p>
          <p>Diupdate: {business.updated_at ? new Date(business.updated_at).toLocaleString("id-ID") : "-"}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
