"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import type { AdminBusinessFormState } from "./business-form-types"

interface BusinessFormTabContactProps {
  form: AdminBusinessFormState
  onFieldChange: <K extends keyof AdminBusinessFormState>(field: K, value: AdminBusinessFormState[K]) => void
}

export function BusinessFormTabContact({ form, onFieldChange }: BusinessFormTabContactProps) {
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

      <div className="space-y-2">
        <Label htmlFor="kontak_pic">Kontak PIC (WhatsApp)</Label>
        <Input
          id="kontak_pic"
          value={form.kontak_pic}
          onChange={(e) => onFieldChange("kontak_pic", e.target.value)}
          placeholder="6281234567890"
        />
      </div>

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
