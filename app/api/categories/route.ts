import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/categories - Get categories with offset pagination
export async function GET(request: NextRequest) {
  try {
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
