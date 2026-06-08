"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2, FileText } from "lucide-react"

interface RfqRequestModalProps {
  businessSlug: string
  businessName: string
  productName?: string | null
  productDeskripsi?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted?: () => void
}

export function RfqRequestModal({
  businessSlug,
  businessName,
  productName,
  productDeskripsi,
  open,
  onOpenChange,
  onSubmitted,
}: RfqRequestModalProps) {
  const [buyerName, setBuyerName] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [quantity, setQuantity] = useState("0")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ message: string; referenceNo: string } | null>(null)

  useEffect(() => {
    if (!open) return
    setSuccess(null)
    setError("")
  }, [open, productName, productDeskripsi])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSuccess(null)
      setError("")
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_slug: businessSlug,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          quantity: Number(quantity),
          notes: productName?.trim()
            ? `Produk: ${productName.trim()}${notes.trim() ? `\n${notes.trim()}` : ""}`
            : notes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Gagal mengirim permintaan")
        return
      }

      onSubmitted?.()
      setBuyerName("")
      setBuyerPhone("")
      setQuantity("0")
      setNotes("")
      setSuccess({
        message:
          data.message ||
          "Terima kasih. Harap menunggu, transaksi Anda sedang diproses oleh Mitra UMKM kami.",
        referenceNo: data.reference_no,
      })
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain">
        {success ? (
          <div className="space-y-4 py-2 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
            <DialogHeader>
              <DialogTitle>Permintaan Terkirim</DialogTitle>
              <DialogDescription className="text-base text-foreground pt-2">
                {success.message}
              </DialogDescription>
            </DialogHeader>
            {success.referenceNo && (
              <p className="text-sm text-muted-foreground font-mono">
                Ref: {success.referenceNo}
              </p>
            )}
            <Button type="button" className="w-full" onClick={() => handleOpenChange(false)}>
              Tutup
            </Button>
          </div>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle>Minta Penawaran</DialogTitle>
          <DialogDescription>
            Ajukan permintaan penawaran ke <strong>{businessName}</strong>. Permintaan akan masuk
            sebagai draft transaksi dan UMKM akan meninjau profil Anda.
          </DialogDescription>
        </DialogHeader>

        {productName?.trim() && (
          <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Produk</p>
              <p className="mt-1 font-semibold text-foreground">{productName.trim()}</p>
            </div>
            {productDeskripsi?.trim() && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deskripsi</p>
                <p className="mt-1 max-h-28 overflow-y-auto text-sm text-muted-foreground whitespace-pre-wrap">
                  {productDeskripsi.trim()}
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rfq-name">Nama *</Label>
            <Input
              id="rfq-name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfq-phone">Nomor WhatsApp *</Label>
            <Input
              id="rfq-phone"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfq-qty">Kuantitas</Label>
            <Input
              id="rfq-qty"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Isi 0 jika tidak berlaku.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfq-notes">Catatan Khusus *</Label>
            <Textarea
              id="rfq-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Saya ingin menjadi reseller di area Bekasi"
              rows={3}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Kirim Form
              </>
            )}
          </Button>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
