import { type NextRequest, NextResponse } from "next/server"
import { getUmkmSessionFromRequest } from "@/lib/umkm-auth"
import { getTransactionsForBusiness } from "@/lib/transactions"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transactions = await getTransactionsForBusiness(session.businessId)
  return NextResponse.json({ transactions })
}
