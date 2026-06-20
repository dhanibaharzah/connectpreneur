"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, Printer } from "lucide-react"
import { StoreQrSticker } from "@/components/umkm/store-qr-sticker"

interface QrData {
  businessName: string
  catalogUrl: string
  qrLarge: string
  qrSmall: string
}

export default function CetakQrPage() {
  const [data, setData] = useState<QrData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/umkm/qrcode", { credentials: "include" })
      const json = await res.json()
      if (res.status === 401) {
        window.location.href = "/umkm"
        return
      }
      if (!res.ok) throw new Error(json.error)
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-destructive">{error || "Data tidak tersedia"}</p>
        <Button asChild variant="outline">
          <Link href="/umkm">Kembali ke Portal UMKM</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-sheet {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#fdede8]/40 p-4 print:bg-white print:p-0">
        <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/umkm">← Kembali</Link>
          </Button>
          <Button size="sm" onClick={() => window.print()} className="bg-[#ec4e14] hover:bg-[#b13b0f]">
            <Printer className="h-4 w-4 mr-1" />
            Cetak Sticker
          </Button>
        </div>

        <div className="print-sheet mx-auto max-w-3xl space-y-10 px-2 print:space-y-12">
          <div className="no-print text-center">
            <h1 className="text-xl font-bold text-[#1f1f1f]">Sticker QR Code Toko</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.businessName} — cetak, potong, tempel di toko
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="no-print text-xs font-semibold uppercase tracking-wide text-[#ec4e14]">
              Sticker Besar — dinding / pintu toko
            </p>
            <StoreQrSticker
              variant="large"
              qrDataUrl={data.qrLarge}
              businessName={data.businessName}
              catalogUrl={data.catalogUrl}
            />
          </div>

          <div className="flex flex-col items-center gap-3 print:break-before-auto">
            <p className="no-print text-xs font-semibold uppercase tracking-wide text-[#ec4e14]">
              Sticker Kecil — meja kasir
            </p>
            <StoreQrSticker
              variant="small"
              qrDataUrl={data.qrSmall}
              businessName={data.businessName}
              catalogUrl={data.catalogUrl}
            />
          </div>

          <div className="no-print mx-auto max-w-md space-y-2 pb-8 text-center text-xs text-muted-foreground">
            <p className="font-medium text-[#1f1f1f]">Tips cetak &amp; tempel</p>
            <ul className="space-y-1 text-left list-disc list-inside">
              <li>Potong di garis border oranye, lalu tempel di toko</li>
              <li>Sticker besar → dinding atau pintu toko</li>
              <li>Sticker kecil → meja kasir</li>
              <li>Gunakan kertas sticker A4, atau print biasa + double tape</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
