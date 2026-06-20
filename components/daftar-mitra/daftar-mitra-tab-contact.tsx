"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import type { DaftarMitraFormState } from "./daftar-mitra-types"

interface DaftarMitraTabContactProps {
  form: DaftarMitraFormState
  onFieldChange: <K extends keyof DaftarMitraFormState>(field: K, value: DaftarMitraFormState[K]) => void
  onNamaPicChange: (value: string) => void
  uploadingKtp: boolean
  ktpVerifyError: string
  ktpOcrVerified: boolean
  ktpInputRef: React.RefObject<HTMLInputElement | null>
  onUploadKtp: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveKtp: () => void
}

export function DaftarMitraTabContact({
  form,
  onFieldChange,
  onNamaPicChange,
  uploadingKtp,
  ktpVerifyError,
  ktpOcrVerified,
  ktpInputRef,
  onUploadKtp,
  onRemoveKtp,
}: DaftarMitraTabContactProps) {
  return (
    <TabsContent value="contact" forceMount className="data-[state=inactive]:hidden space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama_pic">Nama PIC / Pemilik *</Label>
          <Input
            id="nama_pic"
            value={form.nama_pic}
            onChange={(e) => onNamaPicChange(e.target.value)}
            required
            placeholder="Nama lengkap (sesuai KTP)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jabatan_pic">Jabatan</Label>
          <Input
            id="jabatan_pic"
            value={form.jabatan_pic}
            onChange={(e) => onFieldChange("jabatan_pic", e.target.value)}
            placeholder="Contoh: Pemilik, Manager"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kontak_pic">Nomor WhatsApp *</Label>
        <Input
          id="kontak_pic"
          value={form.kontak_pic}
          onChange={(e) => onFieldChange("kontak_pic", e.target.value)}
          required
          placeholder="Contoh: 6281234567890"
        />
        <p className="text-xs text-muted-foreground">Gunakan format internasional (62xxx)</p>
      </div>

      <div className="space-y-2">
        <Label>Foto KTP (Depan) *</Label>
        <p className="text-xs text-muted-foreground">
          Upload foto depan KTP. Nama dan NIK akan diverifikasi otomatis dengan Nama PIC.
        </p>
        {form.ktp_url ? (
          <div className={`flex items-center gap-3 p-3 border rounded-lg ${ktpOcrVerified ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            {ktpOcrVerified ? (
              <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${ktpOcrVerified ? "text-green-800" : "text-amber-800"}`}>
                {ktpOcrVerified ? "KTP terverifikasi otomatis" : "KTP terupload — menunggu review admin"}
              </p>
              <a
                href={form.ktp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Lihat file
              </a>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onRemoveKtp}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => !uploadingKtp && ktpInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {uploadingKtp ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Memverifikasi KTP...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload Foto KTP</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — maks. 5MB</p>
              </>
            )}
          </div>
        )}
        {ktpVerifyError && (
          <p className={`text-sm flex items-start gap-2 ${ktpOcrVerified ? "text-destructive" : "text-amber-800"}`}>
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {ktpVerifyError}
          </p>
        )}
        <input
          ref={ktpInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          onChange={onUploadKtp}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>
    </TabsContent>
  )
}
