import { type NextRequest, NextResponse } from "next/server"
import { isAdminResponse, requireAdmin } from "@/lib/auth/admin-api"
import { deleteObject, isDeletableStorageUrl, newStorageObjectId, uploadObject } from "@/lib/integrations/storage"
import sharp from "sharp"
import { fileTypeFromBuffer } from "file-type"

// Max upload size for images: 5MB, banners: 10MB (full resolution), PDFs: 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_BANNER_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB
const TARGET_WIDTH = 800
const TARGET_HEIGHT = 800
const JPEG_QUALITY = 75

// Whitelist of allowed folders to prevent path traversal
const ALLOWED_FOLDERS = ["uploads", "logos", "products", "mitra", "documents", "banners"] as const
type AllowedFolder = typeof ALLOWED_FOLDERS[number]

// Allowed MIME types (validated by magic bytes)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const
const ALLOWED_PDF_TYPE = "application/pdf"

function sanitizeFolder(folder: string): AllowedFolder {
  // Remove any path traversal attempts
  const sanitized = folder.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase()
  
  // Check if it's in the whitelist
  if (ALLOWED_FOLDERS.includes(sanitized as AllowedFolder)) {
    return sanitized as AllowedFolder
  }
  
  // Default to uploads
  return "uploads"
}

function sanitizeFilename(filename: string): string {
  // Remove extension first
  const baseName = filename.replace(/\.[^/.]+$/, "")
  // Only allow alphanumeric, underscore, hyphen
  return baseName.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 100)
}

function getMaxImageSize(folder: AllowedFolder): number {
  return folder === "banners" ? MAX_BANNER_SIZE : MAX_IMAGE_SIZE
}

function getMaxImageSizeLabel(folder: AllowedFolder): string {
  return folder === "banners" ? "10MB" : "5MB"
}

function getImageExtension(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return ".jpg"
    case "image/png":
      return ".png"
    case "image/webp":
      return ".webp"
    case "image/gif":
      return ".gif"
    default:
      return ".jpg"
  }
}

async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  let sharpInstance = sharp(buffer)
  
  // Get image metadata
  const metadata = await sharpInstance.metadata()
  
  // Resize if larger than target
  if (metadata.width && metadata.height) {
    if (metadata.width > TARGET_WIDTH || metadata.height > TARGET_HEIGHT) {
      sharpInstance = sharpInstance.resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
    }
  }
  
  // Convert to JPEG with compression (best for photos)
  // For PNG with transparency, use WebP
  if (mimeType === "image/png") {
    return sharpInstance.webp({ quality: JPEG_QUALITY }).toBuffer()
  }
  
  return sharpInstance.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer()
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const formData = await request.formData()
    const file = formData.get("file") as File
    const rawFolder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    // Convert file to buffer for magic byte validation
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate file type using magic bytes (not client-provided MIME type)
    const detectedType = await fileTypeFromBuffer(buffer)
    
    if (!detectedType) {
      return NextResponse.json({ error: "Tipe file tidak dapat dideteksi" }, { status: 400 })
    }

    const isPDF = detectedType.mime === ALLOWED_PDF_TYPE
    const isImage = ALLOWED_IMAGE_TYPES.includes(detectedType.mime as typeof ALLOWED_IMAGE_TYPES[number])

    if (!isPDF && !isImage) {
      return NextResponse.json({ 
        error: `Tipe file tidak didukung: ${detectedType.mime}. Gunakan JPG, PNG, WebP, GIF, atau PDF` 
      }, { status: 400 })
    }

    // Sanitize folder (prevent path traversal)
    const folder = sanitizeFolder(rawFolder)

    // Validate file size based on type
    const maxSize = isPDF ? MAX_PDF_SIZE : getMaxImageSize(folder)
    const maxSizeLabel = isPDF ? "10MB" : getMaxImageSizeLabel(folder)
    if (file.size > maxSize) {
      return NextResponse.json({ error: `Ukuran file maksimal ${maxSizeLabel}` }, { status: 400 })
    }

    const baseName = sanitizeFilename(file.name)

    if (isPDF) {
      // PDF: upload directly without compression
      const filename = `${folder}/${newStorageObjectId()}-${baseName}.pdf`

      const uploaded = await uploadObject(filename, buffer, "application/pdf")

      console.log(`[Upload] PDF: ${(file.size / 1024).toFixed(1)}KB`)

      return NextResponse.json({
        success: true,
        url: uploaded.url,
        filename: filename,
        originalSize: file.size,
      })
    }
    
    if (folder === "banners") {
      const outputExt = getImageExtension(detectedType.mime)
      const filename = `${folder}/${newStorageObjectId()}-${baseName}${outputExt}`
      const uploaded = await uploadObject(filename, buffer, detectedType.mime)

      console.log(`[Upload] Banner (original): ${(file.size / 1024).toFixed(1)}KB`)

      return NextResponse.json({
        success: true,
        url: uploaded.url,
        filename: filename,
        originalSize: file.size,
      })
    }

    // Image: compress and upload
    const compressedBuffer = await compressImage(buffer, detectedType.mime)
    const outputExt = detectedType.mime === "image/png" ? ".webp" : ".jpg"
    const filename = `${folder}/${newStorageObjectId()}-${baseName}${outputExt}`

    const contentType = detectedType.mime === "image/png" ? "image/webp" : "image/jpeg"
    const uploaded = await uploadObject(filename, compressedBuffer, contentType)

    console.log(`[Upload] Original: ${(file.size / 1024).toFixed(1)}KB -> Compressed: ${(compressedBuffer.length / 1024).toFixed(1)}KB`)

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      filename: filename,
      originalSize: file.size,
      compressedSize: compressedBuffer.length,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Gagal mengupload file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL tidak ditemukan" }, { status: 400 })
    }

    if (!isDeletableStorageUrl(url)) {
      return NextResponse.json({ error: "URL tidak valid" }, { status: 400 })
    }

    await deleteObject(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 })
  }
}
