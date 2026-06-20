import { describe, expect, it } from "vitest"
import {
  HAPPY_PATH,
  canTransition,
  canUmkmApprove,
  canUmkmConfirmPayment,
  canUmkmReject,
  canUmkmSendInvoice,
  canUmkmSendManualReminder,
  canBuyerUploadPaymentProof,
  computeInvoiceTotal,
  isEligibleForAutoReminder,
  isTerminalStatus,
  isUmkmActionAllowed,
  isValidHappyPath,
  validateBankInput,
  validateInvoiceInput,
  validateRfqInput,
} from "@/lib/transactions/transaction-flow"
import type { TransactionStatus } from "@/types/transaction"

describe("RFQ happy path flow", () => {
  it("follows pending_review → approved → invoice_sent → payment_proof_uploaded → completed", () => {
    expect(isValidHappyPath(HAPPY_PATH)).toBe(true)

    for (let i = 0; i < HAPPY_PATH.length - 1; i++) {
      expect(canTransition(HAPPY_PATH[i], HAPPY_PATH[i + 1])).toBe(true)
    }
  })

  it("rejects invalid step order", () => {
    expect(canTransition("pending_review", "completed")).toBe(false)
    expect(canTransition("invoice_sent", "approved")).toBe(false)
    expect(canTransition("completed", "invoice_sent")).toBe(false)
  })
})

describe("UMKM actions per status", () => {
  const cases: Array<{
    status: TransactionStatus
    approve: boolean
    reject: boolean
    invoice: boolean
    confirm: boolean
    remind: boolean
  }> = [
    {
      status: "pending_review",
      approve: true,
      reject: true,
      invoice: false,
      confirm: false,
      remind: false,
    },
    {
      status: "approved",
      approve: false,
      reject: true,
      invoice: true,
      confirm: false,
      remind: false,
    },
    {
      status: "invoice_sent",
      approve: false,
      reject: false,
      invoice: false,
      confirm: false,
      remind: true,
    },
    {
      status: "payment_proof_uploaded",
      approve: false,
      reject: false,
      invoice: false,
      confirm: true,
      remind: false,
    },
    {
      status: "completed",
      approve: false,
      reject: false,
      invoice: false,
      confirm: false,
      remind: false,
    },
    {
      status: "rejected",
      approve: false,
      reject: false,
      invoice: false,
      confirm: false,
      remind: false,
    },
  ]

  it.each(cases)(
    "status $status — approve=$approve invoice=$invoice remind=$remind confirm=$confirm",
    ({ status, approve, reject, invoice, confirm, remind }) => {
      expect(canUmkmApprove(status)).toBe(approve)
      expect(canUmkmReject(status)).toBe(reject)
      expect(canUmkmSendInvoice(status)).toBe(invoice)
      expect(canUmkmConfirmPayment(status)).toBe(confirm)
      expect(canUmkmSendManualReminder(status)).toBe(remind)
      expect(isUmkmActionAllowed("approve", status)).toBe(approve)
      expect(isUmkmActionAllowed("invoice", status)).toBe(invoice)
      expect(isUmkmActionAllowed("remind", status)).toBe(remind)
      expect(isUmkmActionAllowed("confirm_payment", status)).toBe(confirm)
    },
  )
})

describe("buyer payment proof upload", () => {
  it("allowed only when invoice_sent", () => {
    expect(canBuyerUploadPaymentProof("invoice_sent")).toBe(true)
    expect(canBuyerUploadPaymentProof("approved")).toBe(false)
    expect(canBuyerUploadPaymentProof("payment_proof_uploaded")).toBe(false)
    expect(canBuyerUploadPaymentProof("completed")).toBe(false)
  })
})

describe("auto payment reminder (72h)", () => {
  const invoiceSentAt = new Date("2026-06-01T10:00:00Z")

  it("eligible after 72 hours when still invoice_sent", () => {
    const now = new Date("2026-06-04T10:00:01Z")
    expect(
      isEligibleForAutoReminder({
        status: "invoice_sent",
        invoiceSentAt,
        autoReminderSentAt: null,
        now,
      }),
    ).toBe(true)
  })

  it("not eligible before 72 hours", () => {
    const now = new Date("2026-06-03T10:00:00Z")
    expect(
      isEligibleForAutoReminder({
        status: "invoice_sent",
        invoiceSentAt,
        autoReminderSentAt: null,
        now,
      }),
    ).toBe(false)
  })

  it("not eligible when already sent", () => {
    const now = new Date("2026-06-05T10:00:00Z")
    expect(
      isEligibleForAutoReminder({
        status: "invoice_sent",
        invoiceSentAt,
        autoReminderSentAt: new Date("2026-06-04T10:00:00Z"),
        now,
      }),
    ).toBe(false)
  })

  it("not eligible when transaction completed", () => {
    const now = new Date("2026-06-05T10:00:00Z")
    expect(
      isEligibleForAutoReminder({
        status: "completed",
        invoiceSentAt,
        autoReminderSentAt: null,
        now,
      }),
    ).toBe(false)
  })

  it("not eligible when payment proof already uploaded", () => {
    const now = new Date("2026-06-05T10:00:00Z")
    expect(
      isEligibleForAutoReminder({
        status: "payment_proof_uploaded",
        invoiceSentAt,
        autoReminderSentAt: null,
        now,
      }),
    ).toBe(false)
  })
})

describe("terminal statuses", () => {
  it("completed and rejected are terminal", () => {
    expect(isTerminalStatus("completed")).toBe(true)
    expect(isTerminalStatus("rejected")).toBe(true)
    expect(isTerminalStatus("cancelled")).toBe(true)
    expect(isTerminalStatus("invoice_sent")).toBe(false)
  })
})

describe("reject flow", () => {
  it("can reject from pending_review", () => {
    expect(canTransition("pending_review", "rejected")).toBe(true)
    expect(isTerminalStatus("rejected")).toBe(true)
  })

  it("cannot proceed after rejected", () => {
    expect(canTransition("rejected", "approved")).toBe(false)
    expect(canUmkmSendInvoice("rejected")).toBe(false)
  })
})

describe("RFQ form validation", () => {
  it("accepts valid input including quantity 0", () => {
    expect(
      validateRfqInput({
        buyerName: "Budi",
        buyerPhone: "081317679056",
        quantity: 0,
        notes: "Ingin jadi reseller",
      }),
    ).toBeNull()
  })

  it("requires catatan khusus", () => {
    expect(
      validateRfqInput({
        buyerName: "Budi",
        buyerPhone: "0813",
        quantity: 1,
        notes: "",
      }),
    ).toBe("Catatan khusus harus diisi")
  })

  it("rejects negative quantity", () => {
    expect(
      validateRfqInput({
        buyerName: "Budi",
        buyerPhone: "0813",
        quantity: -1,
        notes: "Test",
      }),
    ).toBe("Kuantitas tidak valid")
  })
})

describe("invoice validation", () => {
  it("computes total correctly", () => {
    expect(computeInvoiceTotal(50, 100000)).toBe(5000000)
  })

  it("requires positive quantity and price for invoice", () => {
    expect(validateInvoiceInput({ description: "Paket", quantity: 0, unitPrice: 1000 })).toBe(
      "Kuantitas harus lebih dari 0",
    )
    expect(validateInvoiceInput({ description: "", quantity: 5, unitPrice: 1000 })).toBe(
      "Deskripsi invoice wajib diisi",
    )
  })
})

describe("bank validation", () => {
  it("requires all bank fields before invoice", () => {
    expect(validateBankInput({ bankName: "BCA", accountNumber: "", accountName: "Budi" })).toBe(
      "Nomor rekening wajib diisi",
    )
    expect(
      validateBankInput({
        bankName: "BCA",
        accountNumber: "123",
        accountName: "Budi Santoso",
      }),
    ).toBeNull()
  })
})

describe("end-to-end flow simulation", () => {
  it("simulates full RFQ lifecycle with guards", () => {
    let status: TransactionStatus = "pending_review"

    // 1. Pembeli submit RFQ
    expect(validateRfqInput({ buyerName: "Budi", buyerPhone: "0813", quantity: 0, notes: "Reseller" })).toBeNull()

    // 2. UMKM setujui
    expect(canUmkmApprove(status)).toBe(true)
    expect(canTransition(status, "approved")).toBe(true)
    status = "approved"

    // 3. UMKM isi bank + kirim invoice
    expect(validateBankInput({ bankName: "BCA", accountNumber: "123", accountName: "Toko ABC" })).toBeNull()
    expect(validateInvoiceInput({ description: "Paket kemitraan", quantity: 10, unitPrice: 500000 })).toBeNull()
    expect(canUmkmSendInvoice(status)).toBe(true)
    expect(canTransition(status, "invoice_sent")).toBe(true)
    status = "invoice_sent"

    // 4. Reminder manual allowed, auto not yet (simulated)
    expect(canUmkmSendManualReminder(status)).toBe(true)
    expect(
      isEligibleForAutoReminder({
        status,
        invoiceSentAt: new Date(),
        autoReminderSentAt: null,
      }),
    ).toBe(false)

    // 5. Pembeli upload bukti
    expect(canBuyerUploadPaymentProof(status)).toBe(true)
    expect(canTransition(status, "payment_proof_uploaded")).toBe(true)
    status = "payment_proof_uploaded"

    // 6. UMKM konfirmasi
    expect(canUmkmConfirmPayment(status)).toBe(true)
    expect(canTransition(status, "completed")).toBe(true)
    status = "completed"

    expect(isTerminalStatus(status)).toBe(true)
    expect(canUmkmSendManualReminder(status)).toBe(false)
    expect(
      isEligibleForAutoReminder({
        status,
        invoiceSentAt: new Date("2026-06-01"),
        autoReminderSentAt: null,
        now: new Date("2026-06-10"),
      }),
    ).toBe(false)
  })
})
