import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await sql`
      SELECT id, name, slug
      FROM categories
      ORDER BY name
    `

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories", categories: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    const result = await sql`
      INSERT INTO categories (name, slug)
      VALUES (${name}, ${slug})
      RETURNING *
    `

    return NextResponse.json({ data: result[0], message: "Category created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
