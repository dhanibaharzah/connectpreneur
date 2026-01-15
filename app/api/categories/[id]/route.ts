import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/categories/[id] - Get single category
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const categories = await sql`
      SELECT id, name, slug FROM categories WHERE id = ${id}
    `

    if (categories.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ data: categories[0] })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, slug } = body

    const result = await sql`
      UPDATE categories SET
        name = COALESCE(${name}, name),
        slug = COALESCE(${slug}, slug)
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result[0], message: "Category updated successfully" })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if category has businesses
    const businesses = await sql`SELECT COUNT(*) FROM businesses WHERE category_id = ${id}`
    if (Number.parseInt(businesses[0].count) > 0) {
      return NextResponse.json({ error: "Cannot delete category with existing businesses" }, { status: 400 })
    }

    await sql`DELETE FROM categories WHERE id = ${id}`

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
