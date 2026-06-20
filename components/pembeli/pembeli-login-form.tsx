"use client"

import { useState } from "react"
import { Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { usePembeliAuth } from "@/components/pembeli/pembeli-auth-context"
import { PembeliOtpStep, requestPembeliOtp } from "@/components/pembeli/pembeli-otp-step"

type LoginStep = "phone" | "otp"

interface PembeliLoginFormProps {
  variant?: "card" | "plain"
  onSuccess?: () => void
}

export function PembeliLoginForm({ variant = "card", onSuccess }: PembeliLoginFormProps) {
  const { refreshSession } = usePembeliAuth()
  const [step, setStep] = useState<LoginStep>("phone")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await requestPembeliOtp(phone)
      setStep("otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal kirim OTP")
    } finally {
      setLoading(false)
    }
  }

  const phoneForm = (
    <form onSubmit={requestOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pembeli-phone">Nomor WhatsApp</Label>
        <Input
          id="pembeli-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim OTP"}
      </Button>
    </form>
  )

  const inner = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">{step === "phone" ? "Masuk Akun Pembeli" : "Verifikasi OTP"}</h2>
      </div>
      {step === "phone" ? (
        <>
          <p className="text-sm text-muted-foreground">
            Masukkan nomor WhatsApp Anda. Kode OTP akan dikirim via WhatsApp.
          </p>
          {phoneForm}
        </>
      ) : (
        <PembeliOtpStep
          phone={phone}
          onBack={() => setStep("phone")}
          onVerified={async () => {
            await refreshSession()
            onSuccess?.()
          }}
        />
      )}
    </div>
  )

  if (variant === "plain") return inner

  return (
    <Card>
      <CardContent className="p-6">{inner}</CardContent>
    </Card>
  )
}
