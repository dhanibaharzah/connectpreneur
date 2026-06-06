import type { TransactionStatus } from "@/types/transaction"

/** Valid status transitions in the RFQ flow */
export const STATUS_TRANSITIONS: Partial<Record<TransactionStatus, TransactionStatus[]>> = {
  pending_review: ["approved", "rejected"],
  approved: ["invoice_sent", "rejected"],
  invoice_sent: ["payment_proof_uploaded"],
  payment_proof_uploaded: ["completed"],
  completed: [],
  rejected: [],
  cancelled: [],
}

export function canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false
}

export function canUmkmApprove(status: TransactionStatus): boolean {
  return status === "pending_review"
}

export function canUmkmReject(status: TransactionStatus): boolean {
  return status === "pending_review" || status === "approved"
}

export function canUmkmSendInvoice(status: TransactionStatus): boolean {
  return status === "approved"
}

export function canUmkmConfirmPayment(status: TransactionStatus): boolean {
  return status === "payment_proof_uploaded"
}

export function canUmkmSendManualReminder(status: TransactionStatus): boolean {
  return status === "invoice_sent"
}

export function canBuyerUploadPaymentProof(status: TransactionStatus): boolean {
  return status === "invoice_sent"
}

export function isTerminalStatus(status: TransactionStatus): boolean {
  return status === "completed" || status === "rejected" || status === "cancelled"
}

const REMINDER_AFTER_MS = 72 * 60 * 60 * 1000

/** Auto reminder: 72h after invoice, only when still awaiting payment */
export function isEligibleForAutoReminder(params: {
  status: TransactionStatus
  invoiceSentAt: Date | string | null
  autoReminderSentAt: Date | string | null
  now?: Date
}): boolean {
  if (params.status !== "invoice_sent") return false
  if (params.autoReminderSentAt) return false
  if (!params.invoiceSentAt) return false

  const sentAt = new Date(params.invoiceSentAt).getTime()
  const now = (params.now ?? new Date()).getTime()
  return now - sentAt >= REMINDER_AFTER_MS
}

export type UmkmAction =
  | "approve"
  | "reject"
  | "invoice"
  | "confirm_payment"
  | "remind"

export function isUmkmActionAllowed(action: UmkmAction, status: TransactionStatus): boolean {
  switch (action) {
    case "approve":
      return canUmkmApprove(status)
    case "reject":
      return canUmkmReject(status)
    case "invoice":
      return canUmkmSendInvoice(status)
    case "confirm_payment":
      return canUmkmConfirmPayment(status)
    case "remind":
      return canUmkmSendManualReminder(status)
    default:
      return false
  }
}

/** Ordered happy-path flow for documentation and tests */
export const HAPPY_PATH: TransactionStatus[] = [
  "pending_review",
  "approved",
  "invoice_sent",
  "payment_proof_uploaded",
  "completed",
]

export function isValidHappyPath(steps: TransactionStatus[]): boolean {
  if (steps.length !== HAPPY_PATH.length) return false
  return steps.every((step, i) => step === HAPPY_PATH[i])
}

export function computeInvoiceTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

export function validateInvoiceInput(input: {
  description?: string
  quantity?: number
  unitPrice?: number
}): string | null {
  if (!input.description?.trim()) return "Deskripsi invoice wajib diisi"
  if (input.quantity == null || Number.isNaN(input.quantity) || input.quantity <= 0) {
    return "Kuantitas harus lebih dari 0"
  }
  if (input.unitPrice == null || Number.isNaN(input.unitPrice) || input.unitPrice <= 0) {
    return "Harga satuan harus lebih dari 0"
  }
  return null
}

export function validateRfqInput(input: {
  buyerName?: string
  buyerPhone?: string
  quantity?: number
  notes?: string
}): string | null {
  if (!input.buyerName?.trim()) return "Nama harus diisi"
  if (!input.buyerPhone?.trim()) return "Nomor WhatsApp harus diisi"
  if (input.quantity == null || Number.isNaN(input.quantity) || input.quantity < 0) {
    return "Kuantitas tidak valid"
  }
  if (!input.notes?.trim()) return "Catatan khusus harus diisi"
  return null
}

export function validateBankInput(input: {
  bankName?: string
  accountNumber?: string
  accountName?: string
}): string | null {
  if (!input.bankName?.trim()) return "Nama bank wajib diisi"
  if (!input.accountNumber?.trim()) return "Nomor rekening wajib diisi"
  if (!input.accountName?.trim()) return "Atas nama wajib diisi"
  return null
}
