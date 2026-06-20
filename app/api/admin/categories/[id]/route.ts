import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { isAdminResponse, requireAdmin } from "@/lib/admin-api"

// GET /api/admin/categories/[id] - Get category details with usage count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const categoryId = Number(id)

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "ID kategori tidak valid" }, { status: 400 })
    }

    const category = await sql`SELECT id, name, slug FROM categories WHERE id = ${categoryId}`
    if (category.length === 0) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 })
    }

    const usageCount = await sql`SELECT COUNT(*) as count FROM businesses WHERE category_id = ${categoryId}`

    return NextResponse.json({ 
      category: category[0],
      usageCount: Number(usageCount[0].count)
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Gagal mengambil data kategori" }, { status: 500 })
  }
}

// DELETE /api/admin/categories/[id] - Delete a category (optionally reassign businesses)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const categoryId = Number(id)

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "ID kategori tidak valid" }, { status: 400 })
    }

    // Check if category exists
    const existing = await sql`SELECT id, name FROM categories WHERE id = ${categoryId}`
    if (existing.length === 0) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 })
    }

    // Check if category is in use
    const inUse = await sql`SELECT COUNT(*) as count FROM businesses WHERE category_id = ${categoryId}`
    const usageCount = Number(inUse[0].count)

    if (usageCount > 0) {
      // Check if reassign_to is provided in query params
      const { searchParams } = new URL(request.url)
      const reassignTo = searchParams.get("reassign_to")

      if (!reassignTo) {
        return NextResponse.json({ 
          error: `Kategori "${existing[0].name}" sedang digunakan oleh ${usageCount} bisnis.`,
          usageCount,
          requiresReassign: true
        }, { status: 400 })
      }

      const reassignCategoryId = Number(reassignTo)
      
      // Validate reassign target
      if (isNaN(reassignCategoryId) || reassignCategoryId === categoryId) {
        return NextResponse.json({ error: "Kategori tujuan tidak valid" }, { status: 400 })
      }

      const targetCategory = await sql`SELECT id FROM categories WHERE id = ${reassignCategoryId}`
      if (targetCategory.length === 0) {
        return NextResponse.json({ error: "Kategori tujuan tidak ditemukan" }, { status: 400 })
      }

      // Reassign all businesses to the new category
      await sql`UPDATE businesses SET category_id = ${reassignCategoryId} WHERE category_id = ${categoryId}`
    }

    // Delete the category
    await sql`DELETE FROM categories WHERE id = ${categoryId}`

    return NextResponse.json({ 
      message: `Kategori "${existing[0].name}" berhasil dihapus`,
      reassignedCount: usageCount
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 })
  }
}
