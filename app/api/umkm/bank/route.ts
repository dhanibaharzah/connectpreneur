import { type NextRequest, NextResponse } from "next/server"
import {
  getBusinessBankDetails,
  getUmkmSessionFromRequest,
  updateBusinessBankDetails,
} from "@/lib/auth/umkm-auth"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bank = await getBusinessBankDetails(session.businessId)
  return NextResponse.json({
    business_name: (bank?.nama as string | undefined) ?? session.businessName ?? "",
    bank_name: bank?.bank_name ?? "",
    bank_account_number: bank?.bank_account_number ?? "",
    bank_account_name: bank?.bank_account_name ?? "",
  })
}

export async function PUT(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bank_name, bank_account_number, bank_account_name } = await request.json()

  if (!bank_name?.trim() || !bank_account_number?.trim() || !bank_account_name?.trim()) {
    return NextResponse.json({ error: "Semua field rekening bank harus diisi" }, { status: 400 })
  }

  await updateBusinessBankDetails(session.businessId, {
    bankName: bank_name.trim(),
    accountNumber: bank_account_number.trim(),
    accountName: bank_account_name.trim(),
  })

  return NextResponse.json({ success: true })
}
