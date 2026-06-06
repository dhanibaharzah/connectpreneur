export const TRANSACTION_STATUSES = [
  "pending_review",
  "approved",
  "invoice_sent",
  "payment_proof_uploaded",
  "completed",
  "rejected",
  "cancelled",
] as const

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]

export const TOKEN_PURPOSES = ["buyer_invoice", "buyer_payment"] as const

export type TokenPurpose = (typeof TOKEN_PURPOSES)[number]

export interface Transaction {
  id: number
  referenceNo: string
  businessId: number
  locationId: number | null
  buyerName: string
  buyerPhone: string
  quantity: number
  notes: string
  status: TransactionStatus
  invoiceDescription: string | null
  invoiceQuantity: number | null
  invoiceUnitPrice: number | null
  invoiceTotal: number | null
  invoiceSentAt: string | null
  paymentProofUrl: string | null
  paymentProofUploadedAt: string | null
  completedAt: string | null
  rejectedReason: string | null
  autoReminderSentAt: string | null
  lastManualReminderAt: string | null
  createdAt: string
  updatedAt: string
  businessName?: string
  businessSlug?: string
  locationName?: string
  kabupatenName?: string
}

export interface TransactionRow {
  id: number
  reference_no: string
  business_id: number
  location_id: number | null
  buyer_name: string
  buyer_phone: string
  quantity: number
  notes: string
  status: string
  invoice_description: string | null
  invoice_quantity: number | null
  invoice_unit_price: string | number | null
  invoice_total: string | number | null
  invoice_sent_at: string | null
  payment_proof_url: string | null
  payment_proof_uploaded_at: string | null
  completed_at: string | null
  rejected_reason: string | null
  auto_reminder_sent_at: string | null
  last_manual_reminder_at: string | null
  created_at: string
  updated_at: string
  business_name?: string
  business_slug?: string
  location_name?: string
  kabupaten_name?: string
}

export function transformTransactionRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    referenceNo: row.reference_no,
    businessId: row.business_id,
    locationId: row.location_id,
    buyerName: row.buyer_name,
    buyerPhone: row.buyer_phone,
    quantity: row.quantity,
    notes: row.notes,
    status: row.status as TransactionStatus,
    invoiceDescription: row.invoice_description,
    invoiceQuantity: row.invoice_quantity,
    invoiceUnitPrice: row.invoice_unit_price != null ? Number(row.invoice_unit_price) : null,
    invoiceTotal: row.invoice_total != null ? Number(row.invoice_total) : null,
    invoiceSentAt: row.invoice_sent_at,
    paymentProofUrl: row.payment_proof_url,
    paymentProofUploadedAt: row.payment_proof_uploaded_at,
    completedAt: row.completed_at,
    rejectedReason: row.rejected_reason,
    autoReminderSentAt: row.auto_reminder_sent_at,
    lastManualReminderAt: row.last_manual_reminder_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    businessName: row.business_name,
    businessSlug: row.business_slug,
    locationName: row.location_name,
    kabupatenName: row.kabupaten_name,
  }
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  pending_review: "Menunggu Review",
  approved: "Disetujui",
  invoice_sent: "Invoice Terkirim",
  payment_proof_uploaded: "Bukti Diupload",
  completed: "Selesai",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
}
