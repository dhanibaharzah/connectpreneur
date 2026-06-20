import { NextResponse } from "next/server"
import { getKabupatenKota } from "@/lib/catalog/read-model"

// GET /api/locations - Ambil semua kabupaten/kota
export async function GET() {
  try {
    const locations = await getKabupatenKota()
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data lokasi" },
      { status: 500 }
    )
  }
}
