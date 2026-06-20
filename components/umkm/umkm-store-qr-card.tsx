"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Loader2, Printer, QrCode } from "lucide-react"
import { StoreQrSticker } from "@/components/umkm/store-qr-sticker"
import { renderStoreQrStickerPng } from "@/lib/umkm/qr-sticker-canvas"

interface QrData {
  businessName: string
  slug: string
  catalogUrl: string
  logoUrl: string | null
  qrLarge: string
  qrSmall: string
}

export function UmkmStoreQrCard() {
  const [data, setData] = useState<QrData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<"large" | "small" | null>(null)
  const [error, setError] = useState("")

  const loadQr = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/umkm/qrcode", { credentials: "include" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal memuat QR code")
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat QR code")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQr().catch(() => setError("Gagal memuat QR code"))
  }, [loadQr])

  const downloadSticker = async (variant: "large" | "small") => {
    if (!data) return
    setDownloading(variant)
    try {
      const png = await renderStoreQrStickerPng({
        variant,
        qrDataUrl: variant === "large" ? data.qrLarge : data.qrSmall,
        businessName: data.businessName,
        catalogUrl: data.catalogUrl,
      })
      const link = document.createElement("a")
      link.href = png
      link.download = `sticker-qr-${data.slug}-${variant}.png`
      link.click()
    } catch {
      setError("Gagal mengunduh sticker")
    } finally {
      setDownloading(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Memuat QR code...
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <p className="text-sm text-destructive">{error || "QR code tidak tersedia"}</p>
          <Button size="sm" variant="outline" onClick={loadQr}>
            Coba lagi
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <QrCode className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          <div>
            <h2 className="font-semibold">QR Code Toko</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Sticker siap tempel dengan logo ConnectPreneur. Pelanggan scan untuk buka katalog
              dan minta penawaran.
            </p>
          </div>
        </div>

        <div className="flex justify-center rounded-lg bg-[#fdede8]/50 p-4">
          <StoreQrSticker
            variant="large"
            qrDataUrl={data.qrLarge}
            businessName={data.businessName}
            catalogUrl={data.catalogUrl}
            className="scale-90 sm:scale-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="bg-[#ec4e14] hover:bg-[#b13b0f]">
            <Link href="/umkm/cetak-qr" target="_blank" rel="noopener noreferrer">
              <Printer className="h-4 w-4 mr-1" />
              Cetak Sticker
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={downloading !== null}
            onClick={() => downloadSticker("large")}
          >
            {downloading === "large" ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            Unduh Sticker Besar
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={downloading !== null}
            onClick={() => downloadSticker("small")}
          >
            {downloading === "small" ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            Unduh Sticker Kecil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
