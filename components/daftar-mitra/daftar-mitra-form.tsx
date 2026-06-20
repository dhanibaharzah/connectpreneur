"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft } from "lucide-react"
import LegalitasConfirmDialog from "@/components/forms/legalitas-confirm-dialog"
import { DaftarMitraSuccess } from "@/components/daftar-mitra/daftar-mitra-success"
import { DaftarMitraTabBasic } from "@/components/daftar-mitra/daftar-mitra-tab-basic"
import { DaftarMitraTabDetail } from "@/components/daftar-mitra/daftar-mitra-tab-detail"
import { DaftarMitraTabContact } from "@/components/daftar-mitra/daftar-mitra-tab-contact"
import { DaftarMitraTabLegalitas } from "@/components/daftar-mitra/daftar-mitra-tab-legalitas"
import { DaftarMitraTabImages } from "@/components/daftar-mitra/daftar-mitra-tab-images"
import {
  INITIAL_DAFTAR_MITRA_FORM,
  type DaftarMitraFormState,
  type ProductImage,
} from "@/components/daftar-mitra/daftar-mitra-types"
import { deleteStorageUrl, uploadToFolder } from "@/components/daftar-mitra/daftar-mitra-upload-utils"
import {
  generateBusinessSlug,
  isRichTextEmpty,
  usernameToSocialUrl,
} from "@/lib/business/form-utils"

export function DaftarMitraForm() {
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

  const [form, setForm] = useState<DaftarMitraFormState>(INITIAL_DAFTAR_MITRA_FORM)
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleFieldChange = <K extends keyof DaftarMitraFormState>(
    field: K,
    value: DaftarMitraFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      nama: value,
      slug: generateBusinessSlug(value),
    }))
  }

  const handleLocationChange = (locationId: number | null, locationName: string) => {
    setForm((prev) => ({
      ...prev,
      location_id: locationId,
      kota_provinsi: locationName,
    }))
  }

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const result = await uploadToFolder(file, "logos")
      if (result.ok) {
        setForm((prev) => ({ ...prev, logo_url: result.url }))
      } else {
        alert(result.error)
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
        const result = await uploadToFolder(file, "products")
        if (result.ok) {
          setProductImages((prev) => [...prev, { url: result.url }])
        } else {
          alert(result.error || `Gagal upload ${file.name}`)
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
    if (imageToRemove?.url) {
      await deleteStorageUrl(imageToRemove.url)
    }
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveLogo = async () => {
    if (form.logo_url) {
      await deleteStorageUrl(form.logo_url)
    }
    setForm((prev) => ({ ...prev, logo_url: "" }))
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
    if (form.ktp_url) {
      await deleteStorageUrl(form.ktp_url)
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
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB")
      return
    }

    setUploading(true)
    try {
      const result = await uploadToFolder(file, "documents")
      if (result.ok) {
        setForm((prev) => ({ ...prev, [field]: result.url }))
      } else {
        alert(result.error)
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
    if (url) {
      await deleteStorageUrl(url)
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
        instagram: usernameToSocialUrl(form.instagram, "instagram"),
        facebook: usernameToSocialUrl(form.facebook, "facebook"),
        tiktok: usernameToSocialUrl(form.tiktok, "tiktok"),
        ktp_ocr_verified: ktpOcrVerified,
        akta_ocr_verified: aktaOcrVerified,
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
      <DaftarMitraSuccess
        successMessage={successMessage}
        autoApproved={autoApproved}
        showLegalitasNote={!form.akta_pendirian_url || !form.legalitas_url}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
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

                  <DaftarMitraTabBasic
                    form={form}
                    onNameChange={handleNameChange}
                    onFieldChange={handleFieldChange}
                  />
                  <DaftarMitraTabDetail
                    form={form}
                    onFieldChange={handleFieldChange}
                    onLocationChange={handleLocationChange}
                  />
                  <DaftarMitraTabContact
                    form={form}
                    onFieldChange={handleFieldChange}
                    onNamaPicChange={handleNamaPicChange}
                    uploadingKtp={uploadingKtp}
                    ktpVerifyError={ktpVerifyError}
                    ktpOcrVerified={ktpOcrVerified}
                    ktpInputRef={ktpInputRef}
                    onUploadKtp={handleUploadKtp}
                    onRemoveKtp={handleRemoveKtp}
                  />
                  <DaftarMitraTabLegalitas
                    form={form}
                    uploadingAkta={uploadingAkta}
                    uploadingLegalitas={uploadingLegalitas}
                    aktaVerifyError={aktaVerifyError}
                    aktaOcrVerified={aktaOcrVerified}
                    aktaInputRef={aktaInputRef}
                    legalitasInputRef={legalitasInputRef}
                    onUploadAkta={handleUploadAkta}
                    onRemoveAkta={handleRemoveAkta}
                    onUploadLegalitas={(e) => handleUploadPdf(e, "legalitas_url", setUploadingLegalitas, legalitasInputRef)}
                    onRemoveLegalitas={() => handleRemovePdf("legalitas_url")}
                  />
                  <DaftarMitraTabImages
                    logoUrl={form.logo_url}
                    productImages={productImages}
                    uploadingLogo={uploadingLogo}
                    uploadingProduct={uploadingProduct}
                    logoInputRef={logoInputRef}
                    productInputRef={productInputRef}
                    onUploadLogo={handleUploadLogo}
                    onRemoveLogo={handleRemoveLogo}
                    onUploadProduct={handleUploadProduct}
                    onRemoveProductImage={handleRemoveProductImage}
                  />
                </Tabs>

                <div className="mt-8 pt-6 border-t">
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground">
                      <strong>Catatan:</strong> KTP wajib diupload. Akta dan legalitas perusahaan bersifat opsional saat pendaftaran awal.
                      {ktpOcrVerified && (!form.akta_pendirian_url || aktaOcrVerified)
                        ? " Jika verifikasi otomatis berhasil, bisnis langsung aktif setelah daftar."
                        : " Jika verifikasi otomatis gagal, status bisnis under review hingga admin menyetujui."}
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
          ktpOcrVerified,
          aktaOcrVerified,
        }}
      />

      <footer className="bg-foreground/5 border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ConnectPreneur. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}
