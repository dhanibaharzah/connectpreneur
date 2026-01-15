import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL tidak ditemukan" }, { status: 400 })
    }

    // Only allow deleting blob storage URLs
    if (!url.includes("blob.vercel-storage.com")) {
      return NextResponse.json({ error: "URL tidak valid" }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 })
  }
}
