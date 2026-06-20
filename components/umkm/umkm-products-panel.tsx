"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Package, Pencil, Plus, Trash2, X, Check } from "lucide-react"
import type { BusinessProduct, ProductTipeBisnis } from "@/types/business-product"
import { PRODUCT_TIPE_LABELS } from "@/types/business-product"
import { ProductListPagination } from "@/components/shared/product-list-pagination"
import { paginateArray, PRODUCT_PAGE_SIZE } from "@/lib/shared/pagination"
import { isDeletableStorageUrl } from "@/lib/integrations/storage-urls"
import { UmkmProductImageField } from "@/components/umkm/umkm-product-image-field"

interface UmkmProductsPanelProps {
  businessName: string
}

type ProductForm = {
  nama: string
  deskripsi: string
  image_url: string
  harga_mulai: string
  tipe_bisnis: ProductTipeBisnis | ""
}

const emptyForm = (): ProductForm => ({
  nama: "",
  deskripsi: "",
  image_url: "",
  harga_mulai: "",
  tipe_bisnis: "",
})

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`
}

export function UmkmProductsPanel({ businessName }: UmkmProductsPanelProps) {
  const [products, setProducts] = useState<BusinessProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [form, setForm] = useState<ProductForm>(emptyForm())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<ProductForm>(emptyForm())
  const [page, setPage] = useState(1)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/umkm/products", { credentials: "include" })
      if (res.status === 401) throw new Error("Sesi berakhir, silakan masuk kembali")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal memuat produk")
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat produk")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(products.length / PRODUCT_PAGE_SIZE))
    if (page > totalPages) setPage(totalPages)
  }, [products.length, page])

  const { items: pagedProducts, pagination } = useMemo(
    () => paginateArray(products, page, PRODUCT_PAGE_SIZE),
    [products, page],
  )

  const uploadImage = async (file: File): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5MB")
      return null
    }

    setUploadingImage(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "products")

      const res = await fetch("/api/register-mitra/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal upload foto")
      return data.url as string
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload foto")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFormImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const url = await uploadImage(file)
    if (url) setForm((prev) => ({ ...prev, image_url: url }))
  }

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const url = await uploadImage(file)
    if (url) setEditForm((prev) => ({ ...prev, image_url: url }))
  }

  const removeFormImage = async () => {
    if (isDeletableStorageUrl(form.image_url)) {
      try {
        await fetch("/api/register-mitra/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: form.image_url }),
        })
      } catch {
        // ignore blob cleanup errors on client
      }
    }
    setForm((prev) => ({ ...prev, image_url: "" }))
  }

  const removeEditImage = () => {
    setEditForm((prev) => ({ ...prev, image_url: "" }))
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.tipe_bisnis) {
      setError("Tipe bisnis wajib dipilih (Produk atau Jasa)")
      return
    }
    setSaving(true)
    setError("")
    setMessage("")
    try {
      const res = await fetch("/api/umkm/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menambah produk")
      setForm(emptyForm())
      setMessage("Produk berhasil ditambahkan.")
      const nextTotal = products.length + 1
      setPage(Math.max(1, Math.ceil(nextTotal / PRODUCT_PAGE_SIZE)))
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah produk")
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (product: BusinessProduct) => {
    setEditingId(product.id)
    setEditForm({
      nama: product.nama,
      deskripsi: product.deskripsi,
      image_url: product.imageUrl,
      harga_mulai: String(product.hargaMulai),
      tipe_bisnis: product.tipeBisnis,
    })
    setError("")
    setMessage("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(emptyForm())
  }

  const saveEdit = async (productId: string) => {
    if (!editForm.tipe_bisnis) {
      setError("Tipe bisnis wajib dipilih (Produk atau Jasa)")
      return
    }
    setSaving(true)
    setError("")
    setMessage("")
    try {
      const res = await fetch(`/api/umkm/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan produk")
      setEditingId(null)
      setMessage("Produk berhasil diperbarui.")
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan produk")
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Hapus produk ini dari katalog?")) return
    setSaving(true)
    setError("")
    setMessage("")
    try {
      const res = await fetch(`/api/umkm/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menghapus produk")
      setMessage("Produk berhasil dihapus.")
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus produk")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Produk & Jasa</h1>
        <p className="text-muted-foreground text-sm">{businessName}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Daftar produk atau jasa ini akan tampil di halaman detail katalog bisnis Anda.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Tambah Produk / Jasa</h2>
          </div>
          <form onSubmit={addProduct} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="product-tipe">Tipe Bisnis *</Label>
              <select
                id="product-tipe"
                value={form.tipe_bisnis}
                onChange={(e) => setForm({ ...form, tipe_bisnis: e.target.value as ProductTipeBisnis | "" })}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Pilih tipe...</option>
                <option value="produk">Produk</option>
                <option value="jasa">Jasa</option>
              </select>
            </div>
            <UmkmProductImageField
              imageUrl={form.image_url}
              uploading={uploadingImage}
              onUpload={handleFormImageUpload}
              onRemove={removeFormImage}
              inputId="product-image-add"
            />
            <div className="space-y-2">
              <Label htmlFor="product-nama">
                Nama {form.tipe_bisnis === "jasa" ? "Jasa" : form.tipe_bisnis === "produk" ? "Produk" : "Produk/Jasa"}
              </Label>
              <Input
                id="product-nama"
                placeholder="Contoh: Kopi Arabica 250gr"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-deskripsi">Deskripsi (opsional)</Label>
              <Textarea
                id="product-deskripsi"
                placeholder="Contoh: Biji kopi pilihan, roasted medium, cocok untuk espresso"
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-harga">Harga Mulai Dari (Rp)</Label>
              <Input
                id="product-harga"
                type="number"
                min={0}
                step={1}
                placeholder="50000"
                value={form.harga_mulai}
                onChange={(e) => setForm({ ...form, harga_mulai: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={saving || uploadingImage}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tambah"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Daftar Produk & Jasa ({products.length})</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground text-center">
              Belum ada produk. Tambahkan produk pertama Anda di atas.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {pagedProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  {editingId === product.id ? (
                    <div className="space-y-3">
                      <UmkmProductImageField
                        imageUrl={editForm.image_url}
                        uploading={uploadingImage}
                        onUpload={handleEditImageUpload}
                        onRemove={removeEditImage}
                        inputId={`product-image-edit-${product.id}`}
                      />
                      <select
                        value={editForm.tipe_bisnis}
                        onChange={(e) => setEditForm({ ...editForm, tipe_bisnis: e.target.value as ProductTipeBisnis | "" })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Pilih tipe...</option>
                        <option value="produk">Produk</option>
                        <option value="jasa">Jasa</option>
                      </select>
                      <Input
                        value={editForm.nama}
                        onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                        placeholder="Nama produk/jasa"
                        maxLength={255}
                      />
                      <Textarea
                        value={editForm.deskripsi}
                        onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                        placeholder="Deskripsi produk/jasa"
                        rows={3}
                        maxLength={1000}
                      />
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={editForm.harga_mulai}
                        onChange={(e) => setEditForm({ ...editForm, harga_mulai: e.target.value })}
                        placeholder="Harga mulai"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(product.id)} disabled={saving || uploadingImage}>
                          <Check className="h-4 w-4 mr-1" /> Simpan
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={saving}>
                          <X className="h-4 w-4 mr-1" /> Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {product.imageUrl ? (
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted shrink-0">
                            <Image src={product.imageUrl} alt={product.nama} fill className="object-cover" />
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{product.nama}</p>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {PRODUCT_TIPE_LABELS[product.tipeBisnis]}
                            </span>
                          </div>
                          {product.deskripsi && (
                            <p className="text-sm text-muted-foreground mt-1">{product.deskripsi}</p>
                          )}
                          <p className="text-sm text-primary font-semibold mt-1">
                            Mulai dari {formatRupiah(product.hargaMulai)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(product)} disabled={saving}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteProduct(product.id)}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <ProductListPagination
              pagination={pagination}
              onPageChange={(nextPage) => {
                setEditingId(null)
                setPage(nextPage)
              }}
              loading={loading || saving}
            />
          </div>
        )}
      </div>
    </div>
  )
}
