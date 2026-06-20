"use client"

import type React from "react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { Upload, X, Loader2, Plus } from "lucide-react"
import type { AdminProductImage } from "./business-form-types"

interface BusinessFormTabImagesProps {
  logoUrl: string
  productImages: AdminProductImage[]
  uploadingLogo: boolean
  uploadingProduct: boolean
  logoInputRef: React.RefObject<HTMLInputElement | null>
  productInputRef: React.RefObject<HTMLInputElement | null>
  onUploadLogo: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveLogo: () => void
  onUploadProduct: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveProductImage: (index: number) => void
}

export function BusinessFormTabImages({
  logoUrl,
  productImages,
  uploadingLogo,
  uploadingProduct,
  logoInputRef,
  productInputRef,
  onUploadLogo,
  onRemoveLogo,
  onUploadProduct,
  onRemoveProductImage,
}: BusinessFormTabImagesProps) {
  return (
    <TabsContent value="images" forceMount className="data-[state=inactive]:hidden space-y-6 mt-4">
      <div className="space-y-2">
        <Label>Logo Bisnis</Label>
        <div className="flex items-start gap-4">
          {logoUrl ? (
            <div className="relative">
              <Image
                src={logoUrl || "/placeholder.svg"}
                alt="Logo"
                width={120}
                height={120}
                className="rounded-lg object-cover border"
              />
              <button
                type="button"
                onClick={onRemoveLogo}
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
          <input ref={logoInputRef} type="file" accept="image/*" onChange={onUploadLogo} className="hidden" />
        </div>
      </div>

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
                onClick={() => onRemoveProductImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
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
          <input ref={productInputRef} type="file" accept="image/*" multiple onChange={onUploadProduct} className="hidden" />
        </div>
      </div>
    </TabsContent>
  )
}
