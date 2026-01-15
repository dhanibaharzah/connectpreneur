import { type NextRequest, NextResponse } from "next/server"
import { login, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    const result = await login(email, password)

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    const token = await createSession(result.user)

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: token,
    })

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Allow cross-site for preview iframe
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 })
  }
}
