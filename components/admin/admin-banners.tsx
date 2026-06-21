"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AdminShell, { getAdminAuthHeaders, type AdminUser } from "./admin-shell"
import { BannerFormModal } from "./banner-form-modal"
import type { ShopBanner } from "@/types/shop-banner"
import { isAllowedImageHost } from "@/lib/integrations/storage-urls"

interface AdminBannersProps {
  user: AdminUser
}

function isValidImage(url: string): boolean {
  if (!url) return false
  if (isAllowedImageHost(url)) return true
  return url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
}

export default function AdminBanners({ user }: AdminBannersProps) {
  const [banners, setBanners] = useState<ShopBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<ShopBanner | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/banners", {
        credentials: "include",
        headers: getAdminAuthHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        setBanners(data.banners || [])
      }
    } catch {
      console.error("Failed to load banners")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus banner ini?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAdminAuthHeaders(),
      })
      if (res.ok) loadBanners()
      else alert("Gagal menghapus banner")
    } catch {
      alert("Gagal menghapus banner")
    } finally {
      setDeletingId(null)
    }
  }

  const openCreate = () => {
    setEditingBanner(null)
    setModalOpen(true)
  }

  const openEdit = (banner: ShopBanner) => {
    setEditingBanner(banner)
    setModalOpen(true)
  }

  if (user.role !== "superadmin") {
    return (
      <AdminShell user={user}>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Hanya Superadmin yang dapat mengakses halaman ini.</p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell user={user}>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Banner Belanja</h1>
            <p className="text-sm text-muted-foreground">
              Kelola banner carousel di belanja.connectpreneur.id
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Banner
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : banners.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Belum ada banner.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="relative h-12 w-28 overflow-hidden rounded border bg-muted">
                        {isValidImage(banner.imageUrl) ? (
                          <Image
                            src={banner.imageUrl}
                            alt={banner.title || "Banner"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                            —
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{banner.title || "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {banner.linkUrl || "—"}
                    </TableCell>
                    <TableCell>{banner.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={banner.isActive ? "default" : "secondary"}>
                        {banner.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(banner)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deletingId === banner.id}
                          onClick={() => handleDelete(banner.id)}
                        >
                          {deletingId === banner.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <BannerFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        banner={editingBanner}
        onSaved={loadBanners}
      />
    </AdminShell>
  )
}
