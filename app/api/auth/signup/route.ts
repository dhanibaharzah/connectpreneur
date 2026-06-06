import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { hashPassword } from "@/lib/auth"

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password minimal 8 karakter" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password harus mengandung huruf besar" }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password harus mengandung huruf kecil" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password harus mengandung angka" }
  }
  return { valid: true, message: "" }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, roleType, locationId } = await request.json()

    if (!email || !password || !roleType || !locationId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    if (!["DPD", "DPC"].includes(roleType)) {
      return NextResponse.json({ error: "Tipe anggota tidak valid" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 })
    }

    const passwordCheck = isStrongPassword(password)
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 })
    }

    const locId = parseInt(locationId, 10)
    if (isNaN(locId)) {
      return NextResponse.json({ error: "Lokasi tidak valid" }, { status: 400 })
    }

    const locations = await sql`
      SELECT id, level FROM locations WHERE id = ${locId}
    `
    if (locations.length === 0) {
      return NextResponse.json({ error: "Lokasi tidak ditemukan" }, { status: 400 })
    }

    const loc = locations[0]
    if (roleType === "DPD" && loc.level !== "kabupaten_kota") {
      return NextResponse.json({ error: "DPD harus memilih Kabupaten/Kota" }, { status: 400 })
    }
    if (roleType === "DPC" && loc.level !== "kecamatan") {
      return NextResponse.json({ error: "DPC harus memilih Kecamatan" }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM admin_users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    await sql`
      INSERT INTO admin_users (email, password_hash, name, role, location_id, is_active, created_at)
      VALUES (${email}, ${passwordHash}, ${name || null}, 'admin', ${locId}, false, NOW())
    `

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil. Silakan tunggu persetujuan dari Superadmin.",
    })
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 })
  }
}
