"use client"

import type { FormEvent } from "react"
import { Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export type UmkmAuthStep = "phone" | "otp"

interface UmkmAuthStepsProps {
  step: UmkmAuthStep
  phone: string
  otp: string
  error: string
  loading: boolean
  onPhoneChange: (value: string) => void
  onOtpChange: (value: string) => void
  onRequestOtp: (event: FormEvent) => void
  onVerifyOtp: (event: FormEvent) => void
  onBackToPhone: () => void
}

export function UmkmAuthSteps({
  step,
  phone,
  otp,
  error,
  loading,
  onPhoneChange,
  onOtpChange,
  onRequestOtp,
  onVerifyOtp,
  onBackToPhone,
}: UmkmAuthStepsProps) {
  if (step === "phone") {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Masuk Portal UMKM</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Masukkan nomor WhatsApp PIC yang terdaftar. Kode OTP akan dikirim via WhatsApp.
          </p>
          <form onSubmit={onRequestOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="umkm-phone">Nomor WhatsApp</Label>
              <Input
                id="umkm-phone"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h1 className="text-xl font-bold">Verifikasi OTP</h1>
        <p className="text-sm text-muted-foreground">Kode OTP dikirim ke {phone}</p>
        <form onSubmit={onVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="umkm-otp">Kode OTP</Label>
            <Input
              id="umkm-otp"
              value={otp}
              onChange={(e) => onOtpChange(e.target.value)}
              placeholder="6 digit"
              maxLength={6}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verifikasi"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onBackToPhone}>
            Ganti nomor
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
