"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { isDeletableStorageUrl } from "@/lib/integrations/storage-urls"
import {
  extractSocialUsername,
  generateBusinessSlug,
  usernameToSocialUrl,
} from "@/lib/business/form-utils"
import { getAdminAuthHeaders } from "./admin-shell"
import {
  INITIAL_ADMIN_BUSINESS_FORM,
  type AdminBusinessFormState,
  type AdminProductImage,
} from "./business-form-types"
import { BusinessFormTabBasic } from "./business-form-tab-basic"
import { BusinessFormTabDetail } from "./business-form-tab-detail"
import { BusinessFormTabContact } from "./business-form-tab-contact"
import { BusinessFormTabLegalitas } from "./business-form-tab-legalitas"
import { BusinessFormTabImages } from "./business-form-tab-images"

interface BusinessFormModalProps {
  business?: any
  onClose: () => void
  onSuccess: () => void
  adminLocationId?: number | null
}

export default function BusinessFormModal({ business, onClose, onSuccess, adminLocationId }: BusinessFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingProduct, setUploadingProduct] = useState(false)
  const [uploadingAkta, setUploadingAkta] = useState(false)
  const [uploadingLegalitas, setUploadingLegalitas] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const productInputRef = useRef<HTMLInputElement>(null)
  const aktaInputRef = useRef<HTMLInputElement>(null)
  const legalitasInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<AdminBusinessFormState>(INITIAL_ADMIN_BUSINESS_FORM)
  const [productImages, setProductImages] = useState<AdminProductImage[]>([])

  useEffect(() => {
    if (business) {
      setForm({
        nama: business.nama || "",
        slug: business.slug || "",
        deskripsi: business.deskripsi || "",
        lama_usaha: business.lama_usaha || "",
        alamat: business.alamat || "",
        kota_provinsi: business.kota_provinsi || "",
        location_id: business.location_id || null,
        category_id: business.category_id?.toString() || "",
        jenis_peluang: business.jenis_peluang || "",
        deskripsi_kemitraan: business.deskripsi_kemitraan || "",
        website: business.website || "",
        instagram: extractSocialUsername(business.instagram || "", "instagram"),
        facebook: extractSocialUsername(business.facebook || "", "facebook"),
        tiktok: extractSocialUsername(business.tiktok || "", "tiktok"),
        nama_pic: business.nama_pic || "",
        jabatan_pic: business.jabatan_pic || "",
        kontak_pic: business.kontak_pic || "",
        logo_url: business.logo_url || "",
        jumlah_cabang: business.jumlah_cabang || "0",
        akta_pendirian_url: business.akta_pendirian_url || "",
        legalitas_url: business.legalitas_url || "",
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

  const handleFieldChange = <K extends keyof AdminBusinessFormState>(
    field: K,
    value: AdminBusinessFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      nama: value,
      slug: !business ? generateBusinessSlug(value) : prev.slug,
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
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "logos")

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: getAdminAuthHeaders({ includeContentType: false }),
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

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          credentials: "include",
          headers: getAdminAuthHeaders({ includeContentType: false }),
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

    if (imageToRemove && (imageToRemove.url || imageToRemove.image_url)) {
      const url = imageToRemove.url || imageToRemove.image_url
      if (url && isDeletableStorageUrl(url)) {
        try {
          await fetch("/api/admin/upload", {
            method: "DELETE",
            headers: getAdminAuthHeaders(),
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
    if (form.logo_url && isDeletableStorageUrl(form.logo_url)) {
      try {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: getAdminAuthHeaders(),
          body: JSON.stringify({ url: form.logo_url }),
        })
      } catch (error) {
        console.error("Failed to delete logo blob:", error)
      }
    }
    setForm((prev) => ({ ...prev, logo_url: "" }))
  }

  const handleUploadPdf = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "akta_pendirian_url" | "legalitas_url",
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
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "documents")

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: getAdminAuthHeaders({ includeContentType: false }),
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
    if (url && isDeletableStorageUrl(url)) {
      try {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: getAdminAuthHeaders(),
          body: JSON.stringify({ url }),
        })
      } catch (error) {
        console.error("Failed to delete PDF:", error)
      }
    }
    setForm((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.category_id) {
      alert("Kategori harus dipilih")
      return
    }

    doSubmit()
  }

  const doSubmit = async () => {
    setLoading(true)

    try {
      const payload = {
        ...form,
        category_id: form.category_id ? Number.parseInt(form.category_id) : null,
        location_id: form.location_id,
        product_images: productImages,
        instagram: usernameToSocialUrl(form.instagram, "instagram"),
        facebook: usernameToSocialUrl(form.facebook, "facebook"),
        tiktok: usernameToSocialUrl(form.tiktok, "tiktok"),
      }

      const url = business ? `/api/admin/businesses/${business.id}` : "/api/admin/businesses"
      const method = business ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: getAdminAuthHeaders(),
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Dasar</TabsTrigger>
              <TabsTrigger value="detail">Detail</TabsTrigger>
              <TabsTrigger value="contact">Kontak</TabsTrigger>
              <TabsTrigger value="legalitas">Legalitas</TabsTrigger>
              <TabsTrigger value="images">Gambar</TabsTrigger>
            </TabsList>

            <BusinessFormTabBasic form={form} onNameChange={handleNameChange} onFieldChange={handleFieldChange} />
            <BusinessFormTabDetail
              form={form}
              adminLocationId={adminLocationId}
              onFieldChange={handleFieldChange}
              onLocationChange={handleLocationChange}
            />
            <BusinessFormTabContact form={form} onFieldChange={handleFieldChange} />
            <BusinessFormTabLegalitas
              form={form}
              uploadingAkta={uploadingAkta}
              uploadingLegalitas={uploadingLegalitas}
              aktaInputRef={aktaInputRef}
              legalitasInputRef={legalitasInputRef}
              onUploadAkta={(e) => handleUploadPdf(e, "akta_pendirian_url", setUploadingAkta, aktaInputRef)}
              onRemoveAkta={() => handleRemovePdf("akta_pendirian_url")}
              onUploadLegalitas={(e) => handleUploadPdf(e, "legalitas_url", setUploadingLegalitas, legalitasInputRef)}
              onRemoveLegalitas={() => handleRemovePdf("legalitas_url")}
            />
            <BusinessFormTabImages
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

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
