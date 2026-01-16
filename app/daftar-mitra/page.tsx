"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Loader2, Plus, CheckCircle, ArrowLeft } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface ProductImage {
  url: string
}

export default function DaftarMitraPage() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingProduct, setUploadingProduct] = useState(false)
  const [success, setSuccess] = useState(false)
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
  })

  const [productImages, setProductImages] = useState<ProductImage[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      if (res.ok && data.categories) {
        setCategories(Array.isArray(data.categories) ? data.categories : [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
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

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      nama: value,
      slug: generateSlug(value),
    }))
  }

  // Helper function to convert username to full social media URL
  const usernameToUrl = (username: string, platform: "instagram" | "facebook" | "tiktok"): string => {
    if (!username) return ""
    if (username.includes("http")) return username
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

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "logos")

      const res = await fetch("/api/register-mitra/upload", {
        method: "POST",
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
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "products")

        const res = await fetch("/api/register-mitra/upload", {
          method: "POST",
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
    if (imageToRemove && imageToRemove.url && imageToRemove.url.includes("blob.vercel-storage.com")) {
      try {
        await fetch("/api/register-mitra/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: imageToRemove.url }),
        })
      } catch (error) {
        console.error("Failed to delete blob:", error)
      }
    }
    
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveLogo = async () => {
    // Delete from blob storage if it's a blob URL
    if (form.logo_url && form.logo_url.includes("blob.vercel-storage.com")) {
      try {
        await fetch("/api/register-mitra/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        instagram: usernameToUrl(form.instagram, "instagram"),
        facebook: usernameToUrl(form.facebook, "facebook"),
        tiktok: usernameToUrl(form.tiktok, "tiktok"),
      }

      const res = await fetch("/api/register-mitra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        alert(data.error || "Gagal mendaftarkan bisnis")
      }
    } catch (error) {
      console.error("Error submitting:", error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Pendaftaran Berhasil!</h2>
            <p className="text-muted-foreground mb-6">
              Terima kasih telah mendaftar sebagai mitra ConnectPreneur. Tim kami akan memverifikasi data Anda dalam 1-3 hari kerja.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Anda akan dihubungi melalui WhatsApp yang terdaftar setelah proses verifikasi selesai.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur"
              width={150}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">Daftar Menjadi Mitra</CardTitle>
              <CardDescription className="text-base">
                Bergabunglah dengan ConnectPreneur dan kembangkan bisnis Anda bersama kami.
                Lengkapi formulir di bawah ini untuk mendaftar sebagai mitra.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Dasar</TabsTrigger>
                    <TabsTrigger value="detail">Detail</TabsTrigger>
                    <TabsTrigger value="contact">Kontak</TabsTrigger>
                    <TabsTrigger value="images">Gambar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Bisnis *</Label>
                        <Input 
                          id="nama" 
                          value={form.nama} 
                          onChange={(e) => handleNameChange(e.target.value)} 
                          required 
                          placeholder="Contoh: Warung Makan Bu Ani"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug URL *</Label>
                        <Input
                          id="slug"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          required
                          placeholder="warung-makan-bu-ani"
                        />
                        <p className="text-xs text-muted-foreground">URL: connectpreneur.com/bisnis/{form.slug || "..."}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deskripsi">Deskripsi Bisnis *</Label>
                      <Textarea
                        id="deskripsi"
                        value={form.deskripsi}
                        onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                        rows={3}
                        required
                        placeholder="Jelaskan tentang bisnis Anda..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category_id">Kategori *</Label>
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
                          onChange={(e) => setForm({ ...form, jumlah_cabang: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jenis_peluang">Jenis Peluang Kemitraan</Label>
                        <Input
                          id="jenis_peluang"
                          value={form.jenis_peluang}
                          onChange={(e) => setForm({ ...form, jenis_peluang: e.target.value })}
                          placeholder="Contoh: Reseller, Agen, Dropshipper"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="detail" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="alamat">Alamat Lengkap *</Label>
                      <Textarea
                        id="alamat"
                        value={form.alamat}
                        onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                        rows={2}
                        required
                        placeholder="Alamat lengkap bisnis Anda"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kota_provinsi">Kota, Provinsi *</Label>
                      <Input
                        id="kota_provinsi"
                        value={form.kota_provinsi}
                        onChange={(e) => setForm({ ...form, kota_provinsi: e.target.value })}
                        required
                        placeholder="Contoh: Bandung, Jawa Barat"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deskripsi_kemitraan">Deskripsi Program Kemitraan</Label>
                      <Textarea
                        id="deskripsi_kemitraan"
                        value={form.deskripsi_kemitraan}
                        onChange={(e) => setForm({ ...form, deskripsi_kemitraan: e.target.value })}
                        rows={3}
                        placeholder="Jelaskan program kemitraan yang Anda tawarkan..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (opsional)</Label>
                      <Input
                        id="website"
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama_pic">Nama PIC / Pemilik *</Label>
                        <Input
                          id="nama_pic"
                          value={form.nama_pic}
                          onChange={(e) => setForm({ ...form, nama_pic: e.target.value })}
                          required
                          placeholder="Nama lengkap"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jabatan_pic">Jabatan</Label>
                        <Input
                          id="jabatan_pic"
                          value={form.jabatan_pic}
                          onChange={(e) => setForm({ ...form, jabatan_pic: e.target.value })}
                          placeholder="Contoh: Pemilik, Manager"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kontak_pic">Nomor WhatsApp *</Label>
                      <Input
                        id="kontak_pic"
                        value={form.kontak_pic}
                        onChange={(e) => setForm({ ...form, kontak_pic: e.target.value })}
                        required
                        placeholder="Contoh: 6281234567890"
                      />
                      <p className="text-xs text-muted-foreground">Gunakan format internasional (62xxx)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-6 mt-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label>Logo Bisnis</Label>
                      <div className="flex items-start gap-4">
                        {form.logo_url ? (
                          <div className="relative">
                            <Image
                              src={form.logo_url}
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
                      <Label>Gambar Produk (maksimal 5)</Label>
                      <div className="flex flex-wrap gap-4">
                        {productImages.map((img, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={img.url}
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
                          </div>
                        ))}
                        {productImages.length < 5 && (
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
                        )}
                        <input
                          ref={productInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadProduct}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Maksimal 5MB per gambar. Format: JPG, PNG, WebP (otomatis dikompres)</p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 pt-6 border-t">
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground">
                      <strong>Catatan:</strong> Setelah mendaftar, data Anda akan direview oleh tim kami. 
                      Proses verifikasi membutuhkan waktu 1-3 hari kerja. Anda akan dihubungi melalui WhatsApp 
                      setelah proses verifikasi selesai.
                    </p>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Mendaftarkan...
                      </>
                    ) : (
                      "Daftar Sekarang"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ConnectPreneur. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
