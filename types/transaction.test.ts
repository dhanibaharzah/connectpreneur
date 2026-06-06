import { describe, expect, it } from "vitest"
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUSES,
  transformTransactionRow,
  type TransactionRow,
} from "@/types/transaction"

const baseRow: TransactionRow = {
  id: 1,
  reference_no: "CP-20260606-0001",
  business_id: 10,
  location_id: 100,
  buyer_name: "Budi",
  buyer_phone: "6281317679056",
  quantity: 5,
  notes: "Reseller Bekasi",
  status: "pending_review",
  invoice_description: null,
  invoice_quantity: null,
  invoice_unit_price: null,
  invoice_total: null,
  invoice_sent_at: null,
  payment_proof_url: null,
  payment_proof_uploaded_at: null,
  completed_at: null,
  rejected_reason: null,
  auto_reminder_sent_at: null,
  last_manual_reminder_at: null,
  created_at: "2026-06-06T00:00:00Z",
  updated_at: "2026-06-06T00:00:00Z",
  business_name: "Toko ABC",
  location_name: "Mustikajaya",
  kabupaten_name: "Kota Bekasi",
}

describe("transformTransactionRow", () => {
  it("maps snake_case DB row to camelCase Transaction", () => {
    const tx = transformTransactionRow(baseRow)

    expect(tx.referenceNo).toBe("CP-20260606-0001")
    expect(tx.buyerName).toBe("Budi")
    expect(tx.businessName).toBe("Toko ABC")
    expect(tx.locationName).toBe("Mustikajaya")
    expect(tx.kabupatenName).toBe("Kota Bekasi")
    expect(tx.status).toBe("pending_review")
  })

  it("coerces invoice totals from string", () => {
    const tx = transformTransactionRow({
      ...baseRow,
      status: "invoice_sent",
      invoice_total: "2500000",
      invoice_unit_price: "500000",
      invoice_quantity: 5,
    })

    expect(tx.invoiceTotal).toBe(2500000)
    expect(tx.invoiceUnitPrice).toBe(500000)
  })
})

describe("TRANSACTION_STATUSES", () => {
  it("has labels for every status", () => {
    for (const status of TRANSACTION_STATUSES) {
      expect(TRANSACTION_STATUS_LABELS[status]).toBeTruthy()
    }
  })
})
