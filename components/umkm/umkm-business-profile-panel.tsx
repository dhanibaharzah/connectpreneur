"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CategoryCombobox from "@/components/forms/category-combobox"
import RichTextEditor from "@/components/forms/rich-text-editor"
import { LocationDropdown } from "@/components/forms/location-dropdown"
import { isDeletableStorageUrl } from "@/lib/integrations/storage-urls"
import { extractSocialUsername } from "@/lib/business/form-utils"
import { PicWhatsappOtpField, isPicWhatsappVerified } from "@/components/forms/pic-whatsapp-otp-field"
import { Loader2, Plus, Upload, X } from "lucide-react"

type ProfileFormState = {
  nama: string
  slug: string
  deskripsi: string
  lama_usaha: string
  alamat: string
  kota_provinsi: string
  location_id: number | null
  category_id: string
  jenis_peluang: string
  deskripsi_kemitraan: string
  website: string
  instagram: string
  facebook: string
  tiktok: string
  nama_pic: string
  jabatan_pic: string
  kontak_pic: string
  logo_url: string
  jumlah_cabang: string
}

type ProductImage = { id?: number; url: string }

const EMPTY_FORM: ProfileFormState = {
  nama: "",
  slug: "",
  deskripsi: "",
  lama_usaha: "",
  alamat: "",
  kota_provinsi: "",
  location_id: null,
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
}

interface UmkmBusinessProfilePanelProps {
  onBusinessNameChange?: (name: string) => void
}

export function UmkmBusinessProfilePanel({ onBusinessNameChange }: UmkmBusinessProfilePanelProps) {
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM)
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingProduct, setUploadingProduct] = useState(false)
  const [kontakPicProofToken, setKontakPicProofToken] = useState("")
  const [initialKontakPic, setInitialKontakPic] = useState("")
  const [businessId, setBusinessId] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const productInputRef = useRef<HTMLInputElement>(null)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/umkm/profile", { credentials: "include" })
      if (res.status === 401) throw new Error("Sesi berakhir, silakan masuk kembali")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal memuat profil")

      const profile = data.profile
      setForm({
        nama: profile.nama || "",
        slug: profile.slug || "",
        deskripsi: profile.deskripsi || "",
        lama_usaha: profile.lama_usaha || "",
        alamat: profile.alamat || "",
        kota_provinsi: profile.kota_provinsi || "",
        location_id: profile.location_id ?? null,
        category_id: profile.category_id?.toString() || "",
        jenis_peluang: profile.jenis_peluang || "",
        deskripsi_kemitraan: profile.deskripsi_kemitraan || "",
        website: profile.website || "",
        instagram: extractSocialUsername(profile.instagram || "", "instagram"),
        facebook: extractSocialUsername(profile.facebook || "", "facebook"),
        tiktok: extractSocialUsername(profile.tiktok || "", "tiktok"),
        nama_pic: profile.nama_pic || "",
        jabatan_pic: profile.jabatan_pic || "",
        kontak_pic: profile.kontak_pic || "",
        logo_url: profile.logo_url || "",
        jumlah_cabang: profile.jumlah_cabang || "0",
      })
      setInitialKontakPic(profile.kontak_pic || "")
      setKontakPicProofToken("")
      setBusinessId(typeof profile.id === "number" ? profile.id : null)
      setProductImages(
        (profile.product_images || []).map((img: { id?: number; url: string }) => ({
          id: img.id,
          url: img.url,
        })),
      )
      if (profile.nama) onBusinessNameChange?.(profile.nama)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat profil")
    } finally {
      setLoading(false)
    }
  }, [onBusinessNameChange])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const setField = <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setMessage("")
  }

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)
    const res = await fetch("/api/register-mitra/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Gagal upload file")
    return data.url as string
  }

  const deleteUploadedFile = async (url: string) => {
    if (!isDeletableStorageUrl(url)) return
    try {
      await fetch("/api/register-mitra/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
    } catch (err) {
      console.error("Failed to delete uploaded file:", err)
    }
  }

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setUploadingLogo(true)
    setError("")
    try {
      const url = await uploadFile(file, "logos")
      if (!url) return
      if (form.logo_url) await deleteUploadedFile(form.logo_url)
      setField("logo_url", url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload logo")
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleRemoveLogo = async () => {
    if (form.logo_url) await deleteUploadedFile(form.logo_url)
    setField("logo_url", "")
  }

  const handleUploadProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    e.target.value = ""
    if (!files || files.length === 0) return

    const remaining = 5 - productImages.length
    if (remaining <= 0) {
      setError("Maksimal 5 gambar produk")
      return
    }

    setUploadingProduct(true)
    setError("")
    try {
      const next: ProductImage[] = [...productImages]
      for (const file of Array.from(files).slice(0, remaining)) {
        const url = await uploadFile(file, "products")
        if (url) next.push({ url })
      }
      setProductImages(next)
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload gambar produk")
    } finally {
      setUploadingProduct(false)
    }
  }

  const handleRemoveProductImage = async (index: number) => {
    const image = productImages[index]
    if (image?.url) await deleteUploadedFile(image.url)
    setProductImages((prev) => prev.filter((_, i) => i !== index))
    setMessage("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nama.trim()) {
      setError("Nama bisnis wajib diisi")
      return
    }
    if (!form.category_id) {
      setError("Kategori harus dipilih")
      return
    }
    if (!form.kontak_pic.trim()) {
      setError("Kontak PIC (WhatsApp) wajib diisi")
      return
    }
    if (
      !isPicWhatsappVerified({
        phone: form.kontak_pic,
        proofToken: kontakPicProofToken,
        initialPhone: initialKontakPic,
      })
    ) {
      setError("Verifikasi OTP nomor WhatsApp PIC terlebih dahulu (tab Kontak)")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")
    try {
      const res = await fetch("/api/umkm/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          category_id: Number(form.category_id),
          location_id: form.location_id,
          product_images: productImages,
          kontak_pic_proof_token: kontakPicProofToken || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan profil")

      setMessage("Profil bisnis berhasil disimpan.")
      if (data.profile?.nama) onBusinessNameChange?.(data.profile.nama)
      if (data.profile?.kontak_pic) {
        setInitialKontakPic(data.profile.kontak_pic)
        setKontakPicProofToken("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div>
          <h2 className="font-semibold">Profil Bisnis</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Perbarui data bisnis yang tampil di katalog. Status Featured/Aktif hanya bisa diubah admin.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
              <TabsTrigger value="basic">Dasar</TabsTrigger>
              <TabsTrigger value="detail">Detail</TabsTrigger>
              <TabsTrigger value="contact">Kontak</TabsTrigger>
              <TabsTrigger value="images">Gambar</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="umkm-nama">Nama Bisnis *</Label>
                  <Input
                    id="umkm-nama"
                    value={form.nama}
                    onChange={(e) => setField("nama", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkm-slug">Slug URL</Label>
                  <Input id="umkm-slug" value={form.slug} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Slug tidak bisa diubah sendiri.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <RichTextEditor
                  value={form.deskripsi}
                  onChange={(value) => setField("deskripsi", value)}
                  placeholder="Jelaskan tentang bisnis Anda..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Kategori *</Label>
                  <CategoryCombobox
                    value={form.category_id}
                    onChange={(value) => setField("category_id", value)}
                    allowCreate={false}
                    apiEndpoint="/api/categories"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkm-lama-usaha">Lama Usaha</Label>
                  <Input
                    id="umkm-lama-usaha"
                    value={form.lama_usaha}
                    onChange={(e) => setField("lama_usaha", e.target.value)}
                    placeholder="5 tahun"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="umkm-cabang">Jumlah Cabang</Label>
                  <Input
                    id="umkm-cabang"
                    value={form.jumlah_cabang}
                    onChange={(e) => setField("jumlah_cabang", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkm-jenis-peluang">Jenis Peluang</Label>
                  <Input
                    id="umkm-jenis-peluang"
                    value={form.jenis_peluang}
                    onChange={(e) => setField("jenis_peluang", e.target.value)}
                    placeholder="Reseller, Agen, Dropshipper"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detail" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="umkm-alamat">Alamat Lengkap</Label>
                <Textarea
                  id="umkm-alamat"
                  value={form.alamat}
                  onChange={(e) => setField("alamat", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <LocationDropdown
                  initialKecamatanId={form.location_id || undefined}
                  onLocationChange={(locationId, locationName) => {
                    setForm((prev) => ({
                      ...prev,
                      location_id: locationId,
                      kota_provinsi: locationName,
                    }))
                    setMessage("")
                  }}
                />
                {form.kota_provinsi && !form.location_id && (
                  <p className="text-xs text-muted-foreground">Data lama: {form.kota_provinsi}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Deskripsi Kemitraan</Label>
                <RichTextEditor
                  value={form.deskripsi_kemitraan}
                  onChange={(value) => setField("deskripsi_kemitraan", value)}
                  placeholder="Jelaskan peluang kemitraan yang ditawarkan..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="umkm-website">Website</Label>
                <Input
                  id="umkm-website"
                  type="url"
                  value={form.website}
                  onChange={(e) => setField("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="umkm-nama-pic">Nama PIC</Label>
                  <Input
                    id="umkm-nama-pic"
                    value={form.nama_pic}
                    onChange={(e) => setField("nama_pic", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkm-jabatan-pic">Jabatan PIC</Label>
                  <Input
                    id="umkm-jabatan-pic"
                    value={form.jabatan_pic}
                    onChange={(e) => setField("jabatan_pic", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <PicWhatsappOtpField
                  id="umkm-kontak-pic"
                  label="Kontak PIC (WhatsApp) *"
                  value={form.kontak_pic}
                  onChange={(value) => setField("kontak_pic", value)}
                  proofToken={kontakPicProofToken}
                  onProofChange={setKontakPicProofToken}
                  initialPhone={initialKontakPic}
                  excludeBusinessId={businessId}
                  hint="Nomor ini dipakai untuk login portal mitra. Tidak boleh sama dengan mitra/pembeli lain."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="umkm-instagram">Instagram</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">@</span>
                    <Input
                      id="umkm-instagram"
                      value={form.instagram}
                      onChange={(e) => setField("instagram", e.target.value)}
                      placeholder="username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkm-facebook">Facebook</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">@</span>
                    <Input
                      id="umkm-facebook"
                      value={form.facebook}
                      onChange={(e) => setField("facebook", e.target.value)}
                      placeholder="username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umkm-tiktok">TikTok</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">@</span>
                    <Input
                      id="umkm-tiktok"
                      value={form.tiktok}
                      onChange={(e) => setField("tiktok", e.target.value)}
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6 mt-4">
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
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-muted/50 transition-colors"
                    >
                      {uploadingLogo ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-2">Upload Logo</span>
                        </>
                      )}
                    </button>
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

              <div className="space-y-2">
                <Label>Gambar Produk (Carousel, maks. 5)</Label>
                <div className="flex flex-wrap gap-4">
                  {productImages.map((img, index) => (
                    <div key={`${img.url}-${index}`} className="relative">
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
                    <button
                      type="button"
                      onClick={() => productInputRef.current?.click()}
                      disabled={uploadingProduct}
                      className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-muted/50 transition-colors"
                    >
                      {uploadingProduct ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Plus className="h-8 w-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-2">Tambah Gambar</span>
                        </>
                      )}
                    </button>
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
              </div>
            </TabsContent>
          </Tabs>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <Button type="submit" disabled={saving || uploadingLogo || uploadingProduct}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Profil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
