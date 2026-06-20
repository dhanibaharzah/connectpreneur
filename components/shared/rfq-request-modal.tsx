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
import { useOptionalPembeliAuth } from "@/components/pembeli/pembeli-auth-context"
import {
  PembeliOtpStep,
  requestPembeliOtp,
  type PembeliVerifiedProfile,
} from "@/components/pembeli/pembeli-otp-step"
import { formatPhoneDisplay } from "@/lib/shared/phone"

interface RfqRequestModalProps {
  businessSlug: string
  businessName: string
  productName?: string | null
  productDeskripsi?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted?: () => void
}

type RfqStep = "form" | "otp" | "success"

interface PendingRfqPayload {
  buyerName: string
  buyerPhone: string
  quantity: number
  notes: string
}

async function submitRfq(payload: PendingRfqPayload & { businessSlug: string }) {
  const res = await fetch("/api/rfq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      business_slug: payload.businessSlug,
      buyer_name: payload.buyerName,
      buyer_phone: payload.buyerPhone,
      quantity: payload.quantity,
      notes: payload.notes,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || "Gagal mengirim permintaan")
  }
  return data as { message?: string; reference_no: string }
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
  const auth = useOptionalPembeliAuth()
  const loggedInUser = auth && !auth.loading ? auth.user : null
  const buyerFieldsLocked = !!loggedInUser

  const [step, setStep] = useState<RfqStep>("form")
  const [buyerName, setBuyerName] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [quantity, setQuantity] = useState("0")
  const [notes, setNotes] = useState("")
  const [pendingRfq, setPendingRfq] = useState<PendingRfqPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ message: string; referenceNo: string } | null>(null)

  useEffect(() => {
    if (!open || auth?.loading) return
    setStep("form")
    setSuccess(null)
    setError("")
    setPendingRfq(null)
    if (loggedInUser) {
      setBuyerName(loggedInUser.displayName?.trim() ?? "")
      setBuyerPhone(formatPhoneDisplay(loggedInUser.phone))
    }
  }, [open, productName, productDeskripsi, auth?.loading, loggedInUser])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSuccess(null)
      setError("")
      setStep("form")
      setPendingRfq(null)
    }
    onOpenChange(nextOpen)
  }

  const buildNotesPayload = () =>
    productName?.trim()
      ? `Produk: ${productName.trim()}${notes.trim() ? `\n${notes.trim()}` : ""}`
      : notes

  const completeRfq = async (buyerNameFinal: string, buyerPhoneFinal: string, notesFinal: string) => {
    const data = await submitRfq({
      businessSlug,
      buyerName: buyerNameFinal,
      buyerPhone: buyerPhoneFinal,
      quantity: Number(quantity),
      notes: notesFinal,
    })

    onSubmitted?.()
    if (!buyerFieldsLocked) {
      setBuyerName("")
      setBuyerPhone("")
    }
    setQuantity("0")
    setNotes("")
    setPendingRfq(null)
    setStep("success")
    setSuccess({
      message:
        data.message ||
        "Terima kasih. Harap menunggu, transaksi Anda sedang diproses oleh Mitra UMKM kami.",
      referenceNo: data.reference_no,
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const notesPayload = buildNotesPayload()

    try {
      if (loggedInUser) {
        await completeRfq(
          loggedInUser.displayName?.trim() || buyerName.trim(),
          buyerPhone.trim(),
          notesPayload,
        )
        return
      }

      const payload: PendingRfqPayload = {
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        quantity: Number(quantity),
        notes: notesPayload,
      }
      setPendingRfq(payload)
      await requestPembeliOtp(payload.buyerPhone)
      setStep("otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.")
      setPendingRfq(null)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerified = async (profile: PembeliVerifiedProfile) => {
    if (!pendingRfq) return

    setLoading(true)
    setError("")
    try {
      await auth?.refreshSession()
      const buyerNameFinal = profile.displayName?.trim() || pendingRfq.buyerName
      await completeRfq(buyerNameFinal, pendingRfq.buyerPhone, pendingRfq.notes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim permintaan")
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
        ) : step === "otp" && pendingRfq ? (
          <>
            <DialogHeader>
              <DialogTitle>Verifikasi WhatsApp</DialogTitle>
              <DialogDescription>
                Masukkan kode OTP untuk melanjutkan permintaan penawaran ke{" "}
                <strong>{businessName}</strong>.
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PembeliOtpStep
                phone={pendingRfq.buyerPhone}
                displayName={pendingRfq.buyerName}
                onBack={() => {
                  setStep("form")
                  setPendingRfq(null)
                  setError("")
                }}
                onVerified={handleOtpVerified}
              />
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Minta Penawaran</DialogTitle>
              <DialogDescription>
                Ajukan permintaan penawaran ke <strong>{businessName}</strong>. Permintaan akan
                masuk sebagai draft transaksi dan UMKM akan meninjau profil Anda.
              </DialogDescription>
            </DialogHeader>

            {productName?.trim() && (
              <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Produk
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{productName.trim()}</p>
                </div>
                {productDeskripsi?.trim() && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Deskripsi
                    </p>
                    <p className="mt-1 max-h-28 overflow-y-auto text-sm text-muted-foreground whitespace-pre-wrap">
                      {productDeskripsi.trim()}
                    </p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rfq-name">Nama *</Label>
                <Input
                  id="rfq-name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Nama lengkap"
                  required
                  disabled={buyerFieldsLocked}
                  className={buyerFieldsLocked ? "bg-muted" : undefined}
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
                  disabled={buyerFieldsLocked}
                  className={buyerFieldsLocked ? "bg-muted" : undefined}
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

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
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
