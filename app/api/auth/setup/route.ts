import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

// Helper function same as lib/auth.ts
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// ONE-TIME SETUP ENDPOINT - Delete after use
export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)

  const password = "b1Nu509011997"
  const hash = await hashPassword(password)

  console.log("[v0] Generated hash:", hash)

  await sql`
    UPDATE admin_users 
    SET password_hash = ${hash}
    WHERE email = 'superadmin@connectpreneur.id'
  `

  return NextResponse.json({
    message: "Password updated successfully",
    email: "superadmin@connectpreneur.id",
    hash: hash,
  })
}
