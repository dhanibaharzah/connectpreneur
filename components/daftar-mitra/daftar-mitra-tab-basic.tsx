"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import CategoryCombobox from "@/components/forms/category-combobox"
import RichTextEditor from "@/components/forms/rich-text-editor"
import type { DaftarMitraFormState } from "./daftar-mitra-types"

interface DaftarMitraTabBasicProps {
  form: DaftarMitraFormState
  onNameChange: (value: string) => void
  onFieldChange: <K extends keyof DaftarMitraFormState>(field: K, value: DaftarMitraFormState[K]) => void
}

export function DaftarMitraTabBasic({ form, onNameChange, onFieldChange }: DaftarMitraTabBasicProps) {
  return (
    <TabsContent value="basic" forceMount className="data-[state=inactive]:hidden space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Bisnis *</Label>
          <Input
            id="nama"
            value={form.nama}
            onChange={(e) => onNameChange(e.target.value)}
            required
            placeholder="Contoh: Warung Makan Bu Ani"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug URL (otomatis)</Label>
          <Input
            id="slug"
            value={form.slug}
            disabled
            className="bg-muted"
            placeholder="warung-makan-bu-ani"
          />
          <p className="text-xs text-muted-foreground">URL: connectpreneur.com/bisnis/{form.slug || "..."}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi Bisnis *</Label>
        <RichTextEditor
          value={form.deskripsi}
          onChange={(value) => onFieldChange("deskripsi", value)}
          placeholder="Jelaskan tentang bisnis Anda..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">Kategori *</Label>
          <CategoryCombobox
            value={form.category_id}
            onChange={(value) => onFieldChange("category_id", value)}
            allowCreate={false}
            apiEndpoint="/api/categories"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lama_usaha">Lama Usaha</Label>
          <Input
            id="lama_usaha"
            value={form.lama_usaha}
            onChange={(e) => onFieldChange("lama_usaha", e.target.value)}
            placeholder="Contoh: 5 tahun"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="jenis_peluang">Jenis Peluang Kemitraan</Label>
          <Input
            id="jenis_peluang"
            value={form.jenis_peluang}
            onChange={(e) => onFieldChange("jenis_peluang", e.target.value)}
            placeholder="Contoh: Reseller, Agen, Dropshipper"
          />
        </div>
      </div>
    </TabsContent>
  )
}
