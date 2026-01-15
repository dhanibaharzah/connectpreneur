import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import sharp from "sharp"

// Max upload size 1MB, will be compressed to ~100KB
const MAX_UPLOAD_SIZE = 1 * 1024 * 1024 // 1MB
const TARGET_WIDTH = 800
const TARGET_HEIGHT = 800
const JPEG_QUALITY = 75

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
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF" }, { status: 400 })
    }

    // Validate file size (max 1MB)
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 1MB" }, { status: 400 })
    }

    // Convert file to buffer and compress
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const compressedBuffer = await compressImage(buffer, file.type)
    
    // Determine output extension
    const outputExt = file.type === "image/png" ? ".webp" : ".jpg"
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${folder}/${Date.now()}-${baseName}${outputExt}`

    const blob = await put(filename, compressedBuffer, {
      access: "public",
      contentType: file.type === "image/png" ? "image/webp" : "image/jpeg",
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
