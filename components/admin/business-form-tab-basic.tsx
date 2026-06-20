"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TabsContent } from "@/components/ui/tabs"
import CategoryCombobox from "@/components/forms/category-combobox"
import RichTextEditor from "@/components/forms/rich-text-editor"
import { getAdminAuthHeaders } from "./admin-shell"
import type { AdminBusinessFormState } from "./business-form-types"

interface BusinessFormTabBasicProps {
  form: AdminBusinessFormState
  onNameChange: (value: string) => void
  onFieldChange: <K extends keyof AdminBusinessFormState>(field: K, value: AdminBusinessFormState[K]) => void
}

export function BusinessFormTabBasic({ form, onNameChange, onFieldChange }: BusinessFormTabBasicProps) {
  return (
    <TabsContent value="basic" forceMount className="data-[state=inactive]:hidden space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Bisnis *</Label>
          <Input id="nama" value={form.nama} onChange={(e) => onNameChange(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug URL (otomatis)</Label>
          <Input id="slug" value={form.slug} disabled className="bg-muted" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <RichTextEditor
          value={form.deskripsi}
          onChange={(value) => onFieldChange("deskripsi", value)}
          placeholder="Jelaskan tentang bisnis Anda..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">Kategori</Label>
          <CategoryCombobox
            value={form.category_id}
            onChange={(value) => onFieldChange("category_id", value)}
            allowCreate={true}
            apiEndpoint="/api/admin/categories"
            authHeaders={getAdminAuthHeaders()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lama_usaha">Lama Usaha</Label>
          <Input
            id="lama_usaha"
            value={form.lama_usaha}
            onChange={(e) => onFieldChange("lama_usaha", e.target.value)}
            placeholder="5 tahun"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jumlah_cabang">Jumlah Cabang</Label>
          <Input
            id="jumlah_cabang"
            value={form.jumlah_cabang}
            onChange={(e) => onFieldChange("jumlah_cabang", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jenis_peluang">Jenis Peluang</Label>
          <Input
            id="jenis_peluang"
            value={form.jenis_peluang}
            onChange={(e) => onFieldChange("jenis_peluang", e.target.value)}
            placeholder="Reseller, Agen, Dropshipper"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="is_featured"
            checked={form.is_featured}
            onCheckedChange={(checked) => onFieldChange("is_featured", checked)}
          />
          <Label htmlFor="is_featured">Featured di Homepage</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="is_active"
            checked={form.is_active}
            onCheckedChange={(checked) => onFieldChange("is_active", checked)}
          />
          <Label htmlFor="is_active">Aktif</Label>
        </div>
      </div>
    </TabsContent>
  )
}
