"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, CheckCircle2, ArrowLeft } from "lucide-react"

export default function BayarPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState<{
    transaction: { referenceNo: string; buyerName: string; invoiceTotal: number | null; status: string }
    business: { nama: string; bank_name: string; bank_account_number: string; bank_account_name: string }
    already_uploaded: boolean
  } | null>(null)

  useEffect(() => {
    params.then((p) => setToken(p.token))
  }, [params])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function load(retry = 0) {
      try {
        const res = await fetch(`/api/transaksi/bukti/${token}`)
        const json = await res.json()
        if (!res.ok) {
          if (res.status === 503 && retry < 2) {
            await new Promise((r) => setTimeout(r, 2000))
            if (!cancelled) return load(retry + 1)
            return
          }
          throw new Error(json.error || "Link tidak valid")
        }
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat halaman")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return

    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/api/transaksi/bukti/${token}`, { method: "POST", body: formData })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Upload gagal")
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">{error}</p>
        <Link href="/katalog">
          <Button variant="outline">Kembali ke Katalog</Button>
        </Link>
      </div>
    )
  }

  if (!data) return null

  const done = success || data.already_uploaded

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-md mx-auto space-y-4">
        <Link href="/katalog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Katalog
          </Button>
        </Link>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h1 className="text-xl font-bold">Upload Bukti Transfer</h1>
            <p className="text-sm text-muted-foreground">
              Ref: <strong>{data.transaction.referenceNo}</strong>
            </p>
            <p className="text-sm">
              Transfer ke rekening <strong>{data.business.nama}</strong>:
            </p>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p>{data.business.bank_name}</p>
              <p className="font-mono">{data.business.bank_account_number}</p>
              <p>{data.business.bank_account_name}</p>
            </div>

            {data.transaction.invoiceTotal != null && (
              <p className="text-lg font-semibold">
                Total: Rp {data.transaction.invoiceTotal.toLocaleString("id-ID")}
              </p>
            )}

            {done ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="text-sm">Bukti transfer berhasil diupload. UMKM akan segera memverifikasi.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block">
                  <span className="sr-only">Upload bukti</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    id="bukti-upload"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                  <Button asChild className="w-full" disabled={uploading}>
                    <label htmlFor="bukti-upload" className="cursor-pointer">
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Mengupload...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Pilih Foto Bukti Transfer
                        </>
                      )}
                    </label>
                  </Button>
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <p className="text-xs text-muted-foreground">Format: JPG, PNG, WebP. Maks 5MB.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
