"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Loader2, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { getAdminAuthHeaders } from "./admin-shell"
import type { ShopBanner } from "@/types/shop-banner"
import { BELANJA_BANNER_UPLOAD_RECOMMENDED } from "@/lib/belanja-banner-spec"
import { isAllowedImageHost } from "@/lib/storage-urls"

interface BannerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner: ShopBanner | null
  onSaved: () => void
}

export function BannerFormModal({ open, onOpenChange, banner, onSaved }: BannerFormModalProps) {
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [isActive, setIsActive] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setTitle(banner?.title || "")
    setImageUrl(banner?.imageUrl || "")
    setLinkUrl(banner?.linkUrl || "")
    setSortOrder(String(banner?.sortOrder ?? 0))
    setIsActive(banner?.isActive ?? true)
    setError("")
  }, [open, banner])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "banners")

      const headers = getAdminAuthHeaders()
      const { "Content-Type": _, ...uploadHeaders } = headers as Record<string, string>

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: uploadHeaders,
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal upload gambar")
      setImageUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload gambar")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const payload = {
        title: title.trim() || null,
        image_url: imageUrl,
        link_url: linkUrl.trim() || null,
        sort_order: Number(sortOrder) || 0,
        is_active: isActive,
      }

      const res = await fetch(banner ? `/api/admin/banners/${banner.id}` : "/api/admin/banners", {
        method: banner ? "PUT" : "POST",
        credentials: "include",
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan banner")

      onSaved()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan banner")
    } finally {
      setSaving(false)
    }
  }

  const hasValidImage = imageUrl && isAllowedImageHost(imageUrl)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{banner ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
          <DialogDescription>
            Banner ditampilkan di carousel halaman belanja.connectpreneur.id
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner-title">Judul (opsional)</Label>
            <Input
              id="banner-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Promo UMKM Lokal"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label>Gambar Banner *</Label>
            {hasValidImage && (
              <div className="relative mb-2 aspect-[21/7] overflow-hidden rounded-lg border bg-muted">
                <Image src={imageUrl} alt="Preview banner" fill className="object-cover" />
              </div>
            )}
            <div>
              <input
                id="banner-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById("banner-image-upload")?.click()}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Gambar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ukuran placeholder desktop (xl): {BELANJA_BANNER_UPLOAD_RECOMMENDED.width}×
              {BELANJA_BANNER_UPLOAD_RECOMMENDED.height}px (rasio {BELANJA_BANNER_UPLOAD_RECOMMENDED.aspectLabel}
              ), maks. 5MB
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-link">Link (opsional)</Label>
            <Input
              id="banner-link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://... atau /produk/kopi-arabica"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-sort">Urutan</Label>
            <Input
              id="banner-sort"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="banner-active">Status Aktif</Label>
              <p className="text-xs text-muted-foreground">Banner nonaktif tidak ditampilkan di portal</p>
            </div>
            <Switch id="banner-active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={saving || !hasValidImage}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
