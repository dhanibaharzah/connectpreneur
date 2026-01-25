import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"

// Whitelist of allowed blob storage hostnames
const ALLOWED_HOSTS = [
  "blob.vercel-storage.com",
  // Add your specific Vercel blob storage subdomain if needed
]

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

export async function POST(request: NextRequest) {
  try {
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
