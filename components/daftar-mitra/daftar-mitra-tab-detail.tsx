"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TabsContent } from "@/components/ui/tabs"
import RichTextEditor from "@/components/forms/rich-text-editor"
import { LocationDropdown } from "@/components/forms/location-dropdown"
import type { DaftarMitraFormState } from "./daftar-mitra-types"

interface DaftarMitraTabDetailProps {
  form: DaftarMitraFormState
  onFieldChange: <K extends keyof DaftarMitraFormState>(field: K, value: DaftarMitraFormState[K]) => void
  onLocationChange: (locationId: number | null, locationName: string) => void
}

export function DaftarMitraTabDetail({ form, onFieldChange, onLocationChange }: DaftarMitraTabDetailProps) {
  return (
    <TabsContent value="detail" forceMount className="data-[state=inactive]:hidden space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="alamat">Alamat Lengkap *</Label>
        <Textarea
          id="alamat"
          value={form.alamat}
          onChange={(e) => onFieldChange("alamat", e.target.value)}
          rows={2}
          required
          placeholder="Alamat lengkap bisnis Anda"
        />
      </div>

      <div className="space-y-2">
        <LocationDropdown onLocationChange={onLocationChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi_kemitraan">Deskripsi Program Kemitraan</Label>
        <RichTextEditor
          value={form.deskripsi_kemitraan}
          onChange={(value) => onFieldChange("deskripsi_kemitraan", value)}
          placeholder="Jelaskan program kemitraan yang Anda tawarkan..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (opsional)</Label>
        <Input
          id="website"
          type="url"
          value={form.website}
          onChange={(e) => onFieldChange("website", e.target.value)}
          placeholder="https://example.com"
        />
      </div>
    </TabsContent>
  )
}
