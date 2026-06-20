"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TabsContent } from "@/components/ui/tabs"
import RichTextEditor from "@/components/forms/rich-text-editor"
import { LocationDropdown } from "@/components/forms/location-dropdown"
import type { AdminBusinessFormState } from "./business-form-types"

interface BusinessFormTabDetailProps {
  form: AdminBusinessFormState
  adminLocationId?: number | null
  onFieldChange: <K extends keyof AdminBusinessFormState>(field: K, value: AdminBusinessFormState[K]) => void
  onLocationChange: (locationId: number | null, locationName: string) => void
}

export function BusinessFormTabDetail({
  form,
  adminLocationId,
  onFieldChange,
  onLocationChange,
}: BusinessFormTabDetailProps) {
  return (
    <TabsContent value="detail" forceMount className="data-[state=inactive]:hidden space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="alamat">Alamat Lengkap</Label>
        <Textarea
          id="alamat"
          value={form.alamat}
          onChange={(e) => onFieldChange("alamat", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <LocationDropdown
          initialKecamatanId={form.location_id || undefined}
          scopeLocationId={adminLocationId}
          onLocationChange={onLocationChange}
        />
        {form.kota_provinsi && !form.location_id && (
          <p className="text-xs text-muted-foreground">Data lama: {form.kota_provinsi}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi_kemitraan">Deskripsi Kemitraan</Label>
        <RichTextEditor
          value={form.deskripsi_kemitraan}
          onChange={(value) => onFieldChange("deskripsi_kemitraan", value)}
          placeholder="Jelaskan peluang kemitraan yang ditawarkan..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
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
