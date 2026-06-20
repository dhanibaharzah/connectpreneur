"use client"

import type React from "react"
import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ImagePlus, Loader2 } from "lucide-react"

export function UmkmProductImageField({
  imageUrl,
  uploading,
  onUpload,
  onRemove,
  inputId,
}: {
  imageUrl: string
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  inputId: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>Foto Produk (opsional)</Label>
      {imageUrl ? (
        <div className="flex items-start gap-3">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted shrink-0">
            <Image src={imageUrl} alt="Foto produk" fill className="object-cover" />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
              Ganti Foto
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onRemove} disabled={uploading}>
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-28 w-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5" />
              Upload 1 foto produk
            </span>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onUpload}
        className="hidden"
      />
      <p className="text-xs text-muted-foreground">JPG, PNG, WebP, atau GIF. Maks. 5MB.</p>
    </div>
  )
}
