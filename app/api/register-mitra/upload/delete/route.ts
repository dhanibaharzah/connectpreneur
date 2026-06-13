import { type NextRequest, NextResponse } from "next/server"
import { deleteObject, isDeletableStorageUrl } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
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
