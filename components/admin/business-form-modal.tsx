"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Loader2, Plus } from "lucide-react"

interface BusinessFormModalProps {
  business?: any
  onClose: () => void
  onSuccess: () => void
}

interface Category {
  id: number
  name: string
}

interface ProductImage {
  id?: number
  url: string
  image_url?: string
}

function getAuthHeaders(contentType = true): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  const headers: HeadersInit = {}
  if (contentType) {
    headers["Content-Type"] = "application/json"
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

export default function BusinessFormModal({ business, onClose, onSuccess }: BusinessFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingProduct, setUploadingProduct] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const productInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nama: "",
    slug: "",
    deskripsi: "",
    lama_usaha: "",
    alamat: "",
    kota_provinsi: "",
    category_id: "",
    jenis_peluang: "",
    deskripsi_kemitraan: "",
    website: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    nama_pic: "",
    jabatan_pic: "",
    kontak_pic: "",
    logo_url: "",
    jumlah_cabang: "0",
    is_featured: false,
    is_active: true,
  })

  const [productImages, setProductImages] = useState<ProductImage[]>([])

  useEffect(() => {
    fetchCategories()

    if (business) {
      setForm({
        nama: business.nama || "",
        slug: business.slug || "",
        deskripsi: business.deskripsi || "",
        lama_usaha: business.lama_usaha || "",
        alamat: business.alamat || "",
        kota_provinsi: business.kota_provinsi || "",
        category_id: business.category_id?.toString() || "",
        jenis_peluang: business.jenis_peluang || "",
        deskripsi_kemitraan: business.deskripsi_kemitraan || "",
        website: business.website || "",
        // Extract usernames from URLs for display in form
        instagram: extractUsername(business.instagram || "", "instagram"),
        facebook: extractUsername(business.facebook || "", "facebook"),
        tiktok: extractUsername(business.tiktok || "", "tiktok"),
        nama_pic: business.nama_pic || "",
        jabatan_pic: business.jabatan_pic || "",
        kontak_pic: business.kontak_pic || "",
        logo_url: business.logo_url || "",
        jumlah_cabang: business.jumlah_cabang || "0",
        is_featured: business.is_featured || false,
        is_active: business.is_active !== false,
      })
      setProductImages(
        business.product_images?.map((img: any) => ({
          id: img.id,
          url: img.image_url || img.url,
        })) || [],
      )
    }
  }, [business])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories", {
        credentials: "include",
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (res.ok && data.categories) {
        setCategories(Array.isArray(data.categories) ? data.categories : [])
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  // Helper function to extract username from social media URL or return as-is if already a username
  const extractUsername = (url: string, platform: "instagram" | "facebook" | "tiktok"): string => {
    if (!url) return ""
    
    // If it's already just a username (no URL format), return it
    if (!url.includes("http") && !url.includes(".com")) {
      return url.replace(/^@/, "") // Remove @ prefix if present
    }
    
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
      let pathname = urlObj.pathname.replace(/\/$/, "") // Remove trailing slash
      
      // Handle different URL formats
      if (platform === "tiktok") {
        // TikTok URLs are like tiktok.com/@username
        return pathname.replace(/^\/@?/, "")
      }
      // Instagram/Facebook URLs are like instagram.com/username or facebook.com/username
      return pathname.replace(/^\//, "")
    } catch {
      // If URL parsing fails, return the original value
      return url.replace(/^@/, "")
    }
  }

  // Helper function to convert username to full social media URL
  const usernameToUrl = (username: string, platform: "instagram" | "facebook" | "tiktok"): string => {
    if (!username) return ""
    
    // If it's already a full URL, return as-is
    if (username.includes("http")) {
      return username
    }
    
    // Remove @ prefix if present
    const cleanUsername = username.replace(/^@/, "").trim()
    if (!cleanUsername) return ""
    
    switch (platform) {
      case "instagram":
        return `https://instagram.com/${cleanUsername}`
      case "facebook":
        return `https://facebook.com/${cleanUsername}`
      case "tiktok":
        return `https://tiktok.com/@${cleanUsername}`
      default:
        return username
    }
  }

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      nama: value,
      slug: !business ? generateSlug(value) : prev.slug,
    }))
  }

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "logos")

      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setForm((prev) => ({ ...prev, logo_url: data.url }))
      } else {
        alert(data.error || "Gagal upload logo")
      }
    } catch (error) {
      console.error("Error uploading logo:", error)
      alert("Gagal upload logo")
    } finally {
      setUploadingLogo(false)
      if (logoInputRef.current) logoInputRef.current.value = ""
    }
  }

  const handleUploadProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingProduct(true)
    try {
      const token = localStorage.getItem("admin_token")
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "products")

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        })

        const data = await res.json()
        if (res.ok) {
          setProductImages((prev) => [...prev, { url: data.url }])
        } else {
          alert(data.error || `Gagal upload ${file.name}`)
        }
      }
    } catch (error) {
      console.error("Error uploading product:", error)
      alert("Gagal upload gambar produk")
    } finally {
      setUploadingProduct(false)
      if (productInputRef.current) productInputRef.current.value = ""
    }
  }

  const handleRemoveProductImage = async (index: number) => {
    const imageToRemove = productImages[index]
    
    // Delete from blob storage if it's a blob URL
    if (imageToRemove && (imageToRemove.url || imageToRemove.image_url)) {
      const url = imageToRemove.url || imageToRemove.image_url
      if (url && url.includes("blob.vercel-storage.com")) {
        try {
          await fetch("/api/admin/upload", {
            method: "DELETE",
            headers: getAuthHeaders(),
            body: JSON.stringify({ url }),
          })
        } catch (error) {
          console.error("Failed to delete blob:", error)
        }
      }
    }
    
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveLogo = async () => {
    // Delete from blob storage if it's a blob URL
    if (form.logo_url && form.logo_url.includes("blob.vercel-storage.com")) {
      try {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: getAuthHeaders(),
          body: JSON.stringify({ url: form.logo_url }),
        })
      } catch (error) {
        console.error("Failed to delete logo blob:", error)
      }
    }
    setForm({ ...form, logo_url: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form,
        category_id: form.category_id ? Number.parseInt(form.category_id) : null,
        product_images: productImages,
        // Convert usernames to full URLs
        instagram: usernameToUrl(form.instagram, "instagram"),
        facebook: usernameToUrl(form.facebook, "facebook"),
        tiktok: usernameToUrl(form.tiktok, "tiktok"),
      }

      const url = business ? `/api/admin/businesses/${business.id}` : "/api/admin/businesses"
      const method = business ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        onSuccess()
      } else {
        alert(data.error || "Gagal menyimpan bisnis")
      }
    } catch (error) {
      console.error("Error saving business:", error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{business ? "Edit Mitra Bisnis" : "Tambah Mitra Bisnis"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Dasar</TabsTrigger>
              <TabsTrigger value="detail">Detail</TabsTrigger>
              <TabsTrigger value="contact">Kontak</TabsTrigger>
              <TabsTrigger value="images">Gambar</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Bisnis *</Label>
                  <Input id="nama" value={form.nama} onChange={(e) => handleNameChange(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori</Label>
                  <Select value={form.category_id} onValueChange={(value) => setForm({ ...form, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lama_usaha">Lama Usaha</Label>
                  <Input
                    id="lama_usaha"
                    value={form.lama_usaha}
                    onChange={(e) => setForm({ ...form, lama_usaha: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, jumlah_cabang: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jenis_peluang">Jenis Peluang</Label>
                  <Input
                    id="jenis_peluang"
                    value={form.jenis_peluang}
                    onChange={(e) => setForm({ ...form, jenis_peluang: e.target.value })}
                    placeholder="Reseller, Agen, Dropshipper"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured di Homepage</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Aktif</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detail" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Textarea
                  id="alamat"
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kota_provinsi">Kota, Provinsi</Label>
                <Input
                  id="kota_provinsi"
                  value={form.kota_provinsi}
                  onChange={(e) => setForm({ ...form, kota_provinsi: e.target.value })}
                  placeholder="Bandung, Jawa Barat"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi_kemitraan">Deskripsi Kemitraan</Label>
                <Textarea
                  id="deskripsi_kemitraan"
                  value={form.deskripsi_kemitraan}
                  onChange={(e) => setForm({ ...form, deskripsi_kemitraan: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_pic">Nama PIC</Label>
                  <Input
                    id="nama_pic"
                    value={form.nama_pic}
                    onChange={(e) => setForm({ ...form, nama_pic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jabatan_pic">Jabatan PIC</Label>
                  <Input
                    id="jabatan_pic"
                    value={form.jabatan_pic}
                    onChange={(e) => setForm({ ...form, jabatan_pic: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kontak_pic">Kontak PIC (WhatsApp)</Label>
                <Input
                  id="kontak_pic"
                  value={form.kontak_pic}
                  onChange={(e) => setForm({ ...form, kontak_pic: e.target.value })}
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
                      onChange={(e) => setForm({ ...form, instagram: e.target.value })}
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
                      onChange={(e) => setForm({ ...form, facebook: e.target.value })}
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
                      onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                      placeholder="username"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Masukkan username saja, contoh: rasakoe</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6 mt-4">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo Bisnis</Label>
                <div className="flex items-start gap-4">
                  {form.logo_url ? (
                    <div className="relative">
                      <Image
                        src={form.logo_url || "/placeholder.svg"}
                        alt="Logo"
                        width={120}
                        height={120}
                        className="rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      {uploadingLogo ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-2">Upload Logo</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLogo}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Product Images Upload */}
              <div className="space-y-2">
                <Label>Gambar Produk (Carousel)</Label>
                <div className="flex flex-wrap gap-4">
                  {productImages.map((img, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={img.url || img.image_url || ""}
                        alt={`Product ${index + 1}`}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveProductImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => productInputRef.current?.click()}
                    className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {uploadingProduct ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Plus className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-2">Tambah Gambar</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={productInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadProduct}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Maksimal 1MB per gambar. Format: JPG, PNG, WebP, GIF (otomatis dikompres)</p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : business ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Mitra"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
