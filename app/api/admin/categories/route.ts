import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

// GET /api/admin/categories - Get categories with offset pagination (same as public but with auth)
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const offset = Number(searchParams.get("offset") || "0")
    const limit = Math.min(Number(searchParams.get("limit") || "10"), 50)
    const search = searchParams.get("search") || ""

    let categories
    let total

    if (search) {
      categories = await sql`
        SELECT id, name, slug
        FROM categories
        WHERE name ILIKE ${"%" + search + "%"}
        ORDER BY name
        LIMIT ${limit} OFFSET ${offset}
      `
      const countResult = await sql`SELECT COUNT(*) as count FROM categories WHERE name ILIKE ${"%" + search + "%"}`
      total = Number(countResult[0].count)
    } else {
      categories = await sql`
        SELECT id, name, slug
        FROM categories
        ORDER BY name
        LIMIT ${limit} OFFSET ${offset}
      `
      const countResult = await sql`SELECT COUNT(*) as count FROM categories`
      total = Number(countResult[0].count)
    }

    const hasMore = offset + categories.length < total

    return NextResponse.json({ 
      categories,
      total,
      hasMore,
      offset,
      limit
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories", categories: [], total: 0, hasMore: false }, { status: 500 })
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nama kategori harus diisi" }, { status: 400 })
    }

    const trimmedName = name.trim()
    
    // Generate slug from name
    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    // Check if category already exists
    const existing = await sql`SELECT id FROM categories WHERE LOWER(name) = LOWER(${trimmedName})`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Kategori sudah ada" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO categories (name, slug)
      VALUES (${trimmedName}, ${slug})
      RETURNING *
    `

    return NextResponse.json({ category: result[0], message: "Kategori berhasil dibuat" }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Gagal membuat kategori" }, { status: 500 })
  }
}
