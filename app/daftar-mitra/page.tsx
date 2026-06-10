"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Loader2, Plus, CheckCircle, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import CategoryCombobox from "@/components/category-combobox"
import RichTextEditor from "@/components/rich-text-editor"
import { LocationDropdown } from "@/components/location-dropdown"
import LegalitasConfirmDialog from "@/components/legalitas-confirm-dialog"

interface ProductImage {
  url: string
}

export default function DaftarMitraPage() {
  const [loading, setLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingProduct, setUploadingProduct] = useState(false)
  const [uploadingKtp, setUploadingKtp] = useState(false)
  const [uploadingAkta, setUploadingAkta] = useState(false)
  const [uploadingLegalitas, setUploadingLegalitas] = useState(false)
  const [ktpVerifyError, setKtpVerifyError] = useState("")
  const [aktaVerifyError, setAktaVerifyError] = useState("")
  const [ktpOcrVerified, setKtpOcrVerified] = useState(false)
  const [aktaOcrVerified, setAktaOcrVerified] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [autoApproved, setAutoApproved] = useState(true)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const productInputRef = useRef<HTMLInputElement>(null)
  const ktpInputRef = useRef<HTMLInputElement>(null)
  const aktaInputRef = useRef<HTMLInputElement>(null)
  const legalitasInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nama: "",
    slug: "",
    deskripsi: "",
    lama_usaha: "",
    alamat: "",
    kota_provinsi: "",
    location_id: null as number | null,
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
    ktp_url: "",
    logo_url: "",
    jumlah_cabang: "0",
    akta_pendirian_url: "",
    legalitas_url: "",
  })

  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const isRichTextEmpty = (html: string) =>
    !html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()

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

  const handleNamaPicChange = (value: string) => {
    setForm((prev) => {
      const nameChanged = prev.nama_pic.trim() !== value.trim() && (prev.ktp_url || prev.akta_pendirian_url)
      return {
        ...prev,
        nama_pic: value,
        ...(nameChanged ? { ktp_url: "", akta_pendirian_url: "" } : {}),
      }
    })
    if (form.nama_pic.trim() !== value.trim()) {
      setKtpVerifyError("")
      setAktaVerifyError("")
      setKtpOcrVerified(false)
      setAktaOcrVerified(false)
    }
  }

  const handleUploadKtp = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!form.nama_pic.trim()) {
      alert("Isi Nama PIC / Pemilik terlebih dahulu sebelum upload KTP")
      if (ktpInputRef.current) ktpInputRef.current.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto KTP maksimal 5MB")
      return
    }

    setUploadingKtp(true)
    setKtpVerifyError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("nama_pic", form.nama_pic.trim())

      const res = await fetch("/api/register-mitra/verify/ktp", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, ktp_url: data.url }))
        setKtpOcrVerified(Boolean(data.verified))
        setKtpVerifyError(
          data.verified ? "" : (data.warning || "Verifikasi otomatis gagal — akan direview admin"),
        )
      } else {
        setKtpVerifyError(data.error || "Gagal mengupload KTP")
      }
    } catch (error) {
      console.error("Error verifying KTP:", error)
      setKtpVerifyError("Gagal memverifikasi KTP. Silakan coba lagi.")
    } finally {
      setUploadingKtp(false)
      if (ktpInputRef.current) ktpInputRef.current.value = ""
    }
  }

  const handleRemoveKtp = async () => {
    if (form.ktp_url && form.ktp_url.includes("blob.vercel-storage.com")) {
      try {
        await fetch("/api/register-mitra/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: form.ktp_url }),
        })
      } catch (error) {
        console.error("Failed to delete KTP blob:", error)
      }
    }
    setForm((prev) => ({ ...prev, ktp_url: "" }))
    setKtpVerifyError("")
    setKtpOcrVerified(false)
  }

  const handleUploadAkta = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!form.nama_pic.trim()) {
      alert("Isi Nama PIC / Pemilik terlebih dahulu sebelum upload akta")
      if (aktaInputRef.current) aktaInputRef.current.value = ""
      return
    }

    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB")
      return
    }

    setUploadingAkta(true)
    setAktaVerifyError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("nama_pic", form.nama_pic.trim())

      const res = await fetch("/api/register-mitra/verify/akta", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, akta_pendirian_url: data.url }))
        setAktaOcrVerified(Boolean(data.verified))
        setAktaVerifyError(
          data.verified ? "" : (data.warning || "Verifikasi otomatis gagal — akan direview admin"),
        )
      } else {
        setAktaVerifyError(data.error || "Gagal mengupload akta")
      }
    } catch (error) {
      console.error("Error verifying akta:", error)
      setAktaVerifyError("Gagal memverifikasi akta. Silakan coba lagi.")
    } finally {
      setUploadingAkta(false)
      if (aktaInputRef.current) aktaInputRef.current.value = ""
    }
  }

  const handleRemoveAkta = async () => {
    await handleRemovePdf("akta_pendirian_url")
    setAktaVerifyError("")
    setAktaOcrVerified(false)
  }

  const handleUploadPdf = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "legalitas_url",
    setUploading: (v: boolean) => void,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate PDF type
    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan")
      return
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "documents")

      const res = await fetch("/api/register-mitra/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setForm((prev) => ({ ...prev, [field]: data.url }))
      } else {
        alert(data.error || "Gagal upload file")
      }
    } catch (error) {
      console.error("Error uploading PDF:", error)
      alert("Gagal upload file")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleRemovePdf = async (field: "akta_pendirian_url" | "legalitas_url") => {
    const url = form[field]
    if (url && url.includes("blob.vercel-storage.com")) {
      try {
        await fetch("/api/register-mitra/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        })
      } catch (error) {
        console.error("Failed to delete PDF blob:", error)
      }
    }
    setForm((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.nama.trim()) {
      alert("Nama Bisnis harus diisi (tab Dasar)")
      return
    }
    if (isRichTextEmpty(form.deskripsi)) {
      alert("Deskripsi Bisnis harus diisi (tab Dasar)")
      return
    }
    if (!form.category_id) {
      alert("Kategori harus dipilih (tab Dasar)")
      return
    }
    if (!form.alamat.trim()) {
      alert("Alamat Lengkap harus diisi (tab Detail)")
      return
    }
    if (!form.location_id) {
      alert("Kabupaten/Kota dan Kecamatan harus dipilih (tab Detail)")
      return
    }
    if (!form.nama_pic.trim()) {
      alert("Nama PIC / Pemilik harus diisi (tab Kontak)")
      return
    }
    if (!form.kontak_pic.trim()) {
      alert("Nomor WhatsApp harus diisi (tab Kontak)")
      return
    }
    if (!form.ktp_url) {
      alert("Foto KTP harus diupload (tab Kontak)")
      return
    }

    setShowConfirmDialog(true)
  }

  const doSubmit = async () => {
    setLoading(true)

    try {
      const payload = {
        ...form,
        category_id: Number.parseInt(form.category_id),
        location_id: form.location_id,
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
        setShowConfirmDialog(false)
        setAutoApproved(Boolean(data.auto_approved))
        setSuccessMessage(data.message || "Pendaftaran berhasil!")
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
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${autoApproved ? "bg-green-100" : "bg-amber-100"}`}>
              <CheckCircle className={`h-10 w-10 ${autoApproved ? "text-green-600" : "text-amber-600"}`} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Pendaftaran Berhasil!</h2>
            <p className="text-muted-foreground mb-6">{successMessage}</p>
            {!autoApproved && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                Verifikasi KTP akan direview oleh tim admin. Status bisnis Anda saat ini under review.
                {(!form.akta_pendirian_url || !form.legalitas_url) && (
                  <> Dokumen legalitas yang belum diupload dapat dilengkapi kemudian.</>
                )}
              </p>
            )}
            <p className="text-sm text-muted-foreground mb-6">
              Notifikasi telah dikirim ke WhatsApp yang Anda daftarkan.
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
              <form onSubmit={handleSubmit} noValidate>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Dasar</TabsTrigger>
                    <TabsTrigger value="detail">Detail</TabsTrigger>
                    <TabsTrigger value="contact">Kontak</TabsTrigger>
                    <TabsTrigger value="legalitas">Legalitas</TabsTrigger>
                    <TabsTrigger value="images">Gambar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" forceMount className="data-[state=inactive]:hidden space-y-4 mt-6">
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
                        onChange={(value) => setForm({ ...form, deskripsi: value })}
                        placeholder="Jelaskan tentang bisnis Anda..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category_id">Kategori *</Label>
                        <CategoryCombobox
                          value={form.category_id}
                          onChange={(value) => setForm({ ...form, category_id: value })}
                          allowCreate={false}
                          apiEndpoint="/api/categories"
                        />
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

                  <TabsContent value="detail" forceMount className="data-[state=inactive]:hidden space-y-4 mt-6">
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
                      <LocationDropdown
                        onLocationChange={(locationId, locationName) => {
                          setForm({ 
                            ...form, 
                            location_id: locationId,
                            kota_provinsi: locationName 
                          })
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deskripsi_kemitraan">Deskripsi Program Kemitraan</Label>
                      <RichTextEditor
                        value={form.deskripsi_kemitraan}
                        onChange={(value) => setForm({ ...form, deskripsi_kemitraan: value })}
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

                  <TabsContent value="contact" forceMount className="data-[state=inactive]:hidden space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama_pic">Nama PIC / Pemilik *</Label>
                        <Input
                          id="nama_pic"
                          value={form.nama_pic}
                          onChange={(e) => handleNamaPicChange(e.target.value)}
                          required
                          placeholder="Nama lengkap (sesuai KTP)"
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

                    <div className="space-y-2">
                      <Label>Foto KTP (Depan) *</Label>
                      <p className="text-xs text-muted-foreground">
                        Upload foto depan KTP. Nama dan NIK akan diverifikasi otomatis dengan Nama PIC.
                      </p>
                      {form.ktp_url ? (
                        <div className={`flex items-center gap-3 p-3 border rounded-lg ${ktpOcrVerified ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                          {ktpOcrVerified ? (
                            <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                          ) : (
                            <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${ktpOcrVerified ? "text-green-800" : "text-amber-800"}`}>
                              {ktpOcrVerified ? "KTP terverifikasi otomatis" : "KTP terupload — menunggu review admin"}
                            </p>
                            <a
                              href={form.ktp_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              Lihat file
                            </a>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={handleRemoveKtp}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => !uploadingKtp && ktpInputRef.current?.click()}
                          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          {uploadingKtp ? (
                            <>
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Memverifikasi KTP...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">Upload Foto KTP</p>
                              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — maks. 5MB</p>
                            </>
                          )}
                        </div>
                      )}
                      {ktpVerifyError && (
                        <p className={`text-sm flex items-start gap-2 ${ktpOcrVerified ? "text-destructive" : "text-amber-800"}`}>
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {ktpVerifyError}
                        </p>
                      )}
                      <input
                        ref={ktpInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/*"
                        onChange={handleUploadKtp}
                        className="hidden"
                      />
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

                  <TabsContent value="legalitas" forceMount className="data-[state=inactive]:hidden space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label>Akta Pendirian Perusahaan beserta Perubahannya</Label>
                      <p className="text-xs text-muted-foreground">
                        Nama pemilik di akta harus cocok dengan Nama PIC yang sudah diverifikasi di KTP.
                      </p>
                      {form.akta_pendirian_url ? (
                        <div className={`flex items-center gap-3 p-3 border rounded-lg ${aktaOcrVerified ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                          {aktaOcrVerified ? (
                            <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                          ) : (
                            <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${aktaOcrVerified ? "text-green-800" : "text-amber-800"}`}>
                              {aktaOcrVerified ? "Akta terverifikasi otomatis" : "Akta terupload — menunggu review admin"}
                            </p>
                            <a href={form.akta_pendirian_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                              Lihat file
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveAkta}
                            className="shrink-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => !uploadingAkta && aktaInputRef.current?.click()}
                          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          {uploadingAkta ? (
                            <>
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                              <span className="text-sm text-muted-foreground mt-2">Memverifikasi akta...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground mt-2">Klik untuk upload PDF</span>
                              <span className="text-xs text-muted-foreground mt-1">Maksimal 10MB</span>
                            </>
                          )}
                        </div>
                      )}
                      {aktaVerifyError && (
                        <p className={`text-sm flex items-start gap-2 ${aktaOcrVerified ? "text-destructive" : "text-amber-800"}`}>
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {aktaVerifyError}
                        </p>
                      )}
                      <input
                        ref={aktaInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleUploadAkta}
                        className="hidden"
                      />
                    </div>

                    {/* Legalitas Perusahaan */}
                    <div className="space-y-2">
                      <Label>Legalitas Perusahaan</Label>
                      <p className="text-xs text-muted-foreground">
                        SIUP, TDP, NIB, Domisili Perusahaan, SKT, NPWP Perusahaan, HAKI — <strong>Jadikan dalam 1 file PDF</strong>
                      </p>
                      {form.legalitas_url ? (
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                          <div className="flex-1 flex items-center gap-2 min-w-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">Legalitas Perusahaan.pdf</p>
                              <a href={form.legalitas_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                Lihat file
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePdf("legalitas_url")}
                            className="shrink-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => legalitasInputRef.current?.click()}
                          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          {uploadingLegalitas ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground mt-2">Klik untuk upload PDF</span>
                              <span className="text-xs text-muted-foreground mt-1">Maksimal 10MB</span>
                            </>
                          )}
                        </div>
                      )}
                      <input
                        ref={legalitasInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => handleUploadPdf(e, "legalitas_url", setUploadingLegalitas, legalitasInputRef)}
                        className="hidden"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="images" forceMount className="data-[state=inactive]:hidden space-y-6 mt-6">
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
                      <strong>Catatan:</strong> KTP wajib diupload. Akta dan legalitas perusahaan bersifat opsional saat pendaftaran awal.
                      Verifikasi KTP akan direview admin dan status bisnis akan under review hingga diverifikasi.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={loading || !form.ktp_url}
                  >
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

      <LegalitasConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={doSubmit}
        loading={loading}
        registrationContext={{
          hasAktaDocument: Boolean(form.akta_pendirian_url),
          hasLegalitasDocument: Boolean(form.legalitas_url),
        }}
      />

      {/* Footer */}
      <footer className="bg-foreground/5 border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ConnectPreneur. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}
