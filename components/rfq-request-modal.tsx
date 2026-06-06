"use client"

import { useState } from "react"
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
import { Loader2, FileText } from "lucide-react"

interface RfqRequestModalProps {
  businessSlug: string
  businessName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted?: () => void
}

export function RfqRequestModal({
  businessSlug,
  businessName,
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
          notes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Gagal mengirim permintaan")
        return
      }

      onSubmitted?.()
      onOpenChange(false)
      setBuyerName("")
      setBuyerPhone("")
      setQuantity("0")
      setNotes("")

      if (data.whatsapp_url) {
        window.open(data.whatsapp_url, "_blank", "noopener,noreferrer")
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Minta Penawaran</DialogTitle>
          <DialogDescription>
            Ajukan permintaan penawaran kemitraan ke <strong>{businessName}</strong>. Permintaan
            akan masuk sebagai draft transaksi dan UMKM akan meninjau profil Anda.
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  )
}
