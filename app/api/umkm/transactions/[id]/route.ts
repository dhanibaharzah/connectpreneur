import { type NextRequest, NextResponse } from "next/server"
import {
  handleUmkmTransactionAction,
  requireOwnedUmkmTransaction,
} from "@/lib/umkm/transaction-detail"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const result = await requireOwnedUmkmTransaction(request, Number(id))
  if ("error" in result) {
    return NextResponse.json({ error: result.error.error }, { status: result.error.status })
  }
  return NextResponse.json({ transaction: result.transaction })
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const result = await handleUmkmTransactionAction(request, Number(id), body)

    if ("error" in result) {
      return NextResponse.json({ error: result.error.error }, { status: result.error.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("UMKM transaction action error:", error)
    return NextResponse.json({ error: "Gagal memproses aksi" }, { status: 500 })
  }
}
