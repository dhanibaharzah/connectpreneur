import { NextResponse } from "next/server"
import { getKecamatanByParent } from "@/lib/db"

// GET /api/locations/[parentId] - Ambil kecamatan berdasarkan parent kabupaten/kota
export async function GET(
  request: Request,
  { params }: { params: Promise<{ parentId: string }> }
) {
  try {
    const { parentId } = await params
    const parentIdNum = parseInt(parentId, 10)

    if (isNaN(parentIdNum)) {
      return NextResponse.json(
        { error: "Parent ID tidak valid" },
        { status: 400 }
      )
    }

    const locations = await getKecamatanByParent(parentIdNum)
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching kecamatan:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data kecamatan" },
      { status: 500 }
    )
  }
}
