import { NextResponse } from "next/server"
import { clearPembeliSessionCookie } from "@/lib/pembeli-auth"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(clearPembeliSessionCookie())
  return response
}
