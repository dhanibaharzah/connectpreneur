import { type NextRequest, NextResponse } from "next/server"
import { getCompletedCustomersForBusiness } from "@/lib/umkm-customers"
import { getUmkmSessionFromRequest } from "@/lib/umkm-auth"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const customers = await getCompletedCustomersForBusiness(session.businessId)
  return NextResponse.json({ customers })
}
