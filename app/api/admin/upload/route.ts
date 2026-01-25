import { type NextRequest, NextResponse } from "next/server"
import { put, del } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"
import sharp from "sharp"
import { fileTypeFromBuffer } from "file-type"

// Max upload size 5MB, will be compressed to ~100KB
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB
const TARGET_WIDTH = 800
const TARGET_HEIGHT = 800
const JPEG_QUALITY = 75

// Whitelist of allowed folders to prevent path traversal
const ALLOWED_FOLDERS = ["uploads", "logos", "products", "mitra"] as const
type AllowedFolder = typeof ALLOWED_FOLDERS[number]

// Allowed MIME types (validated by magic bytes)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const

// Whitelist of allowed blob storage hostnames
const ALLOWED_HOSTS = [
  "blob.vercel-storage.com",
]

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

function isValidBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    
    // Check protocol
    if (parsed.protocol !== "https:") {
      return false
    }
    
    // Check hostname - must end with allowed host (handles subdomains)
    const isAllowedHost = ALLOWED_HOSTS.some(host => 
      parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    )
    
    if (!isAllowedHost) {
      return false
    }
    
    // Check for path traversal attempts
    if (parsed.pathname.includes("..")) {
      return false
    }
    
    return true
  } catch {
    return false
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
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const rawFolder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    // Validate file size first
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 })
    }

    // Convert file to buffer for magic byte validation
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate file type using magic bytes (not client-provided MIME type)
    const detectedType = await fileTypeFromBuffer(buffer)
    
    if (!detectedType) {
      return NextResponse.json({ error: "Tipe file tidak dapat dideteksi" }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.includes(detectedType.mime as typeof ALLOWED_MIME_TYPES[number])) {
      return NextResponse.json({ 
        error: `Tipe file tidak didukung: ${detectedType.mime}. Gunakan JPG, PNG, WebP, atau GIF` 
      }, { status: 400 })
    }

    // Sanitize folder (prevent path traversal)
    const folder = sanitizeFolder(rawFolder)
    
    // Compress image
    const compressedBuffer = await compressImage(buffer, detectedType.mime)
    
    // Determine output extension based on actual processing
    const outputExt = detectedType.mime === "image/png" ? ".webp" : ".jpg"
    const baseName = sanitizeFilename(file.name)
    const filename = `${folder}/${Date.now()}-${baseName}${outputExt}`

    const blob = await put(filename, compressedBuffer, {
      access: "public",
      contentType: detectedType.mime === "image/png" ? "image/webp" : "image/jpeg",
    })

    console.log(`[Upload] Original: ${(file.size / 1024).toFixed(1)}KB -> Compressed: ${(compressedBuffer.length / 1024).toFixed(1)}KB`)

    return NextResponse.json({
      success: true,
      url: blob.url,
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
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL tidak ditemukan" }, { status: 400 })
    }

    // Validate URL properly
    if (!isValidBlobUrl(url)) {
      return NextResponse.json({ error: "URL tidak valid" }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 })
  }
}
