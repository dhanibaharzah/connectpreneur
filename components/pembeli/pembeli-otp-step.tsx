"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BuyerBadgeLevel } from "@/types/gamification"

export interface PembeliVerifiedProfile {
  phone: string
  displayName: string | null
  totalPoints: number
  badgeLevel: BuyerBadgeLevel
  completedOrders: number
}

interface PembeliOtpStepProps {
  phone: string
  displayName?: string
  onVerified: (profile: PembeliVerifiedProfile) => void | Promise<void>
  onBack?: () => void
}

async function requestPembeliOtp(phone: string): Promise<void> {
  const res = await fetch("/api/pembeli/otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Gagal kirim OTP")
}

async function verifyPembeliOtp(
  phone: string,
  otp: string,
  displayName?: string,
): Promise<PembeliVerifiedProfile> {
  const res = await fetch("/api/pembeli/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      phone,
      otp,
      ...(displayName?.trim() ? { displayName: displayName.trim() } : {}),
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "OTP tidak valid")
  return data.profile as PembeliVerifiedProfile
}

export { requestPembeliOtp, verifyPembeliOtp }

export function PembeliOtpStep({ phone, displayName, onVerified, onBack }: PembeliOtpStepProps) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const profile = await verifyPembeliOtp(phone, otp, displayName)
      await onVerified(profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP tidak valid")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError("")
    try {
      await requestPembeliOtp(phone)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal kirim OTP")
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Kode OTP dikirim ke <strong>{phone}</strong>
      </p>
      <div className="space-y-2">
        <Label htmlFor="pembeli-otp">Kode OTP</Label>
        <Input
          id="pembeli-otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6 digit"
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verifikasi"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        disabled={resending || loading}
        onClick={handleResend}
      >
        {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim ulang OTP"}
      </Button>
      {onBack && (
        <Button type="button" variant="outline" className="w-full" onClick={onBack} disabled={loading}>
          Kembali
        </Button>
      )}
    </form>
  )
}
