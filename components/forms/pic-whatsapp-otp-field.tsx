"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OtpInput } from "@/components/ui/otp-input"
import { OTP_LENGTH } from "@/lib/auth/otp-session"
import { normalizePhoneDigits } from "@/lib/shared/phone"

interface PicWhatsappOtpFieldProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  proofToken: string
  onProofChange: (token: string) => void
  /** Existing saved phone — treated as already verified until changed */
  initialPhone?: string
  /** When editing a mitra, exclude their own business from duplicate checks */
  excludeBusinessId?: number | null
  required?: boolean
  disabled?: boolean
  hint?: string
}

export function PicWhatsappOtpField({
  id = "kontak_pic",
  label = "Nomor WhatsApp *",
  value,
  onChange,
  proofToken,
  onProofChange,
  initialPhone = "",
  excludeBusinessId = null,
  required = true,
  disabled = false,
  hint = "Gunakan format internasional (62xxx). Nomor ini akan diverifikasi via OTP.",
}: PicWhatsappOtpFieldProps) {
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")

  const normalizedValue = normalizePhoneDigits(value)
  const normalizedInitial = normalizePhoneDigits(initialPhone)
  const unchangedFromInitial =
    Boolean(normalizedInitial) &&
    Boolean(normalizedValue) &&
    normalizedValue === normalizedInitial
  const verified =
    unchangedFromInitial ||
    (Boolean(proofToken) && Boolean(normalizedValue))

  const handlePhoneChange = (next: string) => {
    onChange(next)
    onProofChange("")
    setOtpSent(false)
    setOtp("")
    setError("")
  }

  const requestOtp = async () => {
    if (!value.trim()) {
      setError("Isi nomor WhatsApp terlebih dahulu")
      return
    }
    setSending(true)
    setError("")
    try {
      const res = await fetch("/api/pic-phone/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: value.trim(),
          ...(excludeBusinessId != null ? { exclude_business_id: excludeBusinessId } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal kirim OTP")
      if (data.phone && data.phone !== normalizePhoneDigits(value)) {
        onChange(data.phone)
      }
      setOtpSent(true)
      setOtp("")
      onProofChange("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal kirim OTP")
    } finally {
      setSending(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Masukkan ${OTP_LENGTH} digit OTP`)
      return
    }
    setVerifying(true)
    setError("")
    try {
      const res = await fetch("/api/pic-phone/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: value.trim(),
          otp,
          ...(excludeBusinessId != null ? { exclude_business_id: excludeBusinessId } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "OTP tidak valid")
      onProofChange(data.proof_token || "")
      if (data.phone) onChange(data.phone)
      setOtpSent(false)
      setOtp("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP tidak valid")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            id={id}
            value={value}
            onChange={(e) => handlePhoneChange(e.target.value)}
            required={required}
            disabled={disabled || sending || verifying}
            placeholder="Contoh: 6281234567890"
            className="sm:flex-1"
          />
          {!verified && (
            <Button
              type="button"
              variant="outline"
              onClick={requestOtp}
              disabled={disabled || sending || verifying || !value.trim()}
              className="sm:shrink-0"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? "Kirim ulang OTP" : "Kirim OTP"}
            </Button>
          )}
        </div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>

      {verified ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {unchangedFromInitial
            ? "Nomor WhatsApp tersimpan (sudah terverifikasi)."
            : "Nomor WhatsApp berhasil diverifikasi."}
        </div>
      ) : otpSent ? (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <p className="text-sm text-muted-foreground">
            Masukkan kode OTP yang dikirim ke WhatsApp <strong>{value}</strong>
          </p>
          <OtpInput
            id={`${id}-otp`}
            value={otp}
            onChange={setOtp}
            disabled={disabled || verifying || sending}
            aria-invalid={!!error}
            autoFocus
          />
          <Button
            type="button"
            onClick={verifyOtp}
            disabled={disabled || verifying || sending || otp.length !== OTP_LENGTH}
          >
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verifikasi OTP"}
          </Button>
        </div>
      ) : (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Harap verifikasi nomor WhatsApp terlebih dahulu sebelum submit. Pastikan nomor aktif dan dapat menerima WhatsApp.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function isPicWhatsappVerified(params: {
  phone: string
  proofToken: string
  initialPhone?: string
}): boolean {
  const phone = normalizePhoneDigits(params.phone)
  if (!phone) return false
  const initial = normalizePhoneDigits(params.initialPhone || "")
  if (initial && phone === initial) return true
  return Boolean(params.proofToken)
}
