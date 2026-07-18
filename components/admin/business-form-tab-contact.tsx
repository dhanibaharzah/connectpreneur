"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { PicWhatsappOtpField } from "@/components/forms/pic-whatsapp-otp-field"
import type { AdminBusinessFormState } from "./business-form-types"

interface BusinessFormTabContactProps {
  form: AdminBusinessFormState
  onFieldChange: <K extends keyof AdminBusinessFormState>(field: K, value: AdminBusinessFormState[K]) => void
  kontakPicProofToken: string
  onKontakPicProofChange: (token: string) => void
  initialKontakPic?: string
  excludeBusinessId?: number | null
}

export function BusinessFormTabContact({
  form,
  onFieldChange,
  kontakPicProofToken,
  onKontakPicProofChange,
  initialKontakPic = "",
  excludeBusinessId = null,
}: BusinessFormTabContactProps) {
  return (
    <TabsContent value="contact" forceMount className="data-[state=inactive]:hidden space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama_pic">Nama PIC</Label>
          <Input
            id="nama_pic"
            value={form.nama_pic}
            onChange={(e) => onFieldChange("nama_pic", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jabatan_pic">Jabatan PIC</Label>
          <Input
            id="jabatan_pic"
            value={form.jabatan_pic}
            onChange={(e) => onFieldChange("jabatan_pic", e.target.value)}
          />
        </div>
      </div>

      <PicWhatsappOtpField
        id="kontak_pic"
        label="Kontak PIC (WhatsApp)"
        value={form.kontak_pic}
        onChange={(value) => onFieldChange("kontak_pic", value)}
        proofToken={kontakPicProofToken}
        onProofChange={onKontakPicProofChange}
        initialPhone={initialKontakPic}
        excludeBusinessId={excludeBusinessId}
        required={false}
        hint="Jika nomor diganti, verifikasi OTP wajib sebelum menyimpan. Nomor tidak boleh sama dengan mitra/pembeli lain."
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">@</span>
            <Input
              id="instagram"
              value={form.instagram}
              onChange={(e) => onFieldChange("instagram", e.target.value)}
              placeholder="username"
            />
          </div>
          <p className="text-xs text-muted-foreground">Masukkan username saja, contoh: rasakoe</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">@</span>
            <Input
              id="facebook"
              value={form.facebook}
              onChange={(e) => onFieldChange("facebook", e.target.value)}
              placeholder="username"
            />
          </div>
          <p className="text-xs text-muted-foreground">Masukkan username saja, contoh: rasakoe.id</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tiktok">TikTok</Label>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">@</span>
            <Input
              id="tiktok"
              value={form.tiktok}
              onChange={(e) => onFieldChange("tiktok", e.target.value)}
              placeholder="username"
            />
          </div>
          <p className="text-xs text-muted-foreground">Masukkan username saja, contoh: rasakoe</p>
        </div>
      </div>
    </TabsContent>
  )
}
