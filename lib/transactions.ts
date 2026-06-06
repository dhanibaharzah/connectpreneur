import { sql } from "@/lib/sql"
import {
  type Transaction,
  type TransactionRow,
  transformTransactionRow,
} from "@/types/transaction"

export async function generateReferenceNo(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const prefix = `CP-${today}-`
  const [row] = await sql`
    SELECT COUNT(*)::int AS count FROM transactions
    WHERE reference_no LIKE ${`${prefix}%`}
  `
  const seq = String((row?.count ?? 0) + 1).padStart(4, "0")
  return `${prefix}${seq}`
}

export async function createTransaction(params: {
  businessId: number
  locationId: number | null
  buyerName: string
  buyerPhone: string
  quantity: number
  notes: string
}): Promise<Transaction> {
  const referenceNo = await generateReferenceNo()
  const [row] = await sql`
    INSERT INTO transactions (
      reference_no, business_id, location_id,
      buyer_name, buyer_phone, quantity, notes, status
    ) VALUES (
      ${referenceNo},
      ${params.businessId},
      ${params.locationId},
      ${params.buyerName},
      ${params.buyerPhone},
      ${params.quantity},
      ${params.notes},
      'pending_review'
    )
    RETURNING *
  `
  return transformTransactionRow(row as TransactionRow)
}

export async function getTransactionById(id: number): Promise<Transaction | null> {
  const rows = await sql`
    SELECT t.*,
      b.nama AS business_name,
      b.slug AS business_slug,
      loc.name AS location_name,
      kab.name AS kabupaten_name
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    LEFT JOIN locations loc ON loc.id = t.location_id
    LEFT JOIN locations kab ON kab.id = CASE
      WHEN loc.level = 'kecamatan' THEN loc.parent_id
      WHEN loc.level = 'kabupaten_kota' THEN loc.id
      ELSE NULL
    END
    WHERE t.id = ${id}
  `
  if (rows.length === 0) return null
  return transformTransactionRow(rows[0] as TransactionRow)
}

export async function getTransactionsForBusiness(businessId: number): Promise<Transaction[]> {
  const rows = await sql`
    SELECT t.*, b.nama AS business_name, b.slug AS business_slug
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    WHERE t.business_id = ${businessId}
    ORDER BY t.created_at DESC
  `
  return rows.map((row) => transformTransactionRow(row as TransactionRow))
}

export async function getTransactionsForBusinessPaginated(
  businessId: number,
  params: { limit: number; offset: number },
): Promise<{ items: Transaction[]; total: number }> {
  const [countRow] = await sql`
    SELECT COUNT(*)::int AS total FROM transactions WHERE business_id = ${businessId}
  `

  const rows = await sql`
    SELECT t.*, b.nama AS business_name, b.slug AS business_slug
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    WHERE t.business_id = ${businessId}
    ORDER BY t.created_at DESC
    LIMIT ${params.limit} OFFSET ${params.offset}
  `

  return {
    items: rows.map((row) => transformTransactionRow(row as TransactionRow)),
    total: (countRow?.total as number) ?? 0,
  }
}

export async function updateTransactionStatus(
  id: number,
  status: string,
  extra?: Record<string, unknown>,
): Promise<Transaction | null> {
  const rejectedReason = extra?.rejectedReason as string | undefined
  const [row] = await sql`
    UPDATE transactions SET
      status = ${status},
      rejected_reason = COALESCE(${rejectedReason ?? null}, rejected_reason),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  if (!row) return null
  return transformTransactionRow(row as TransactionRow)
}

export async function approveTransaction(id: number): Promise<Transaction | null> {
  const [row] = await sql`
    UPDATE transactions SET status = 'approved', updated_at = NOW()
    WHERE id = ${id} AND status = 'pending_review'
    RETURNING *
  `
  if (!row) return null
  return transformTransactionRow(row as TransactionRow)
}

export async function rejectTransaction(id: number, reason: string): Promise<Transaction | null> {
  const [row] = await sql`
    UPDATE transactions SET
      status = 'rejected',
      rejected_reason = ${reason},
      updated_at = NOW()
    WHERE id = ${id} AND status IN ('pending_review', 'approved')
    RETURNING *
  `
  if (!row) return null
  return transformTransactionRow(row as TransactionRow)
}

export async function sendInvoice(
  id: number,
  invoice: { description: string; quantity: number; unitPrice: number },
): Promise<Transaction | null> {
  const total = invoice.quantity * invoice.unitPrice
  const [row] = await sql`
    UPDATE transactions SET
      status = 'invoice_sent',
      invoice_description = ${invoice.description},
      invoice_quantity = ${invoice.quantity},
      invoice_unit_price = ${invoice.unitPrice},
      invoice_total = ${total},
      invoice_sent_at = NOW(),
      updated_at = NOW()
    WHERE id = ${id} AND status = 'approved'
    RETURNING *
  `
  if (!row) return null
  return transformTransactionRow(row as TransactionRow)
}

export async function uploadPaymentProof(id: number, proofUrl: string): Promise<Transaction | null> {
  const [row] = await sql`
    UPDATE transactions SET
      status = 'payment_proof_uploaded',
      payment_proof_url = ${proofUrl},
      payment_proof_uploaded_at = NOW(),
      updated_at = NOW()
    WHERE id = ${id} AND status = 'invoice_sent'
    RETURNING *
  `
  if (!row) return null
  return transformTransactionRow(row as TransactionRow)
}

export async function confirmPayment(id: number): Promise<Transaction | null> {
  const [row] = await sql`
    UPDATE transactions SET
      status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = ${id} AND status = 'payment_proof_uploaded'
    RETURNING *
  `
  if (!row) return null
  return transformTransactionRow(row as TransactionRow)
}

export async function markAutoReminderSent(id: number): Promise<void> {
  await sql`
    UPDATE transactions SET auto_reminder_sent_at = NOW(), updated_at = NOW()
    WHERE id = ${id}
  `
}

export async function markManualReminderSent(id: number): Promise<void> {
  await sql`
    UPDATE transactions SET last_manual_reminder_at = NOW(), updated_at = NOW()
    WHERE id = ${id}
  `
}

export async function getTransactionsDueForAutoReminder(): Promise<Transaction[]> {
  const rows = await sql`
    SELECT t.*, b.nama AS business_name, b.slug AS business_slug
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    WHERE t.status = 'invoice_sent'
      AND t.auto_reminder_sent_at IS NULL
      AND t.invoice_sent_at IS NOT NULL
      AND t.invoice_sent_at <= NOW() - INTERVAL '72 hours'
  `
  return rows.map((row) => transformTransactionRow(row as TransactionRow))
}

export async function listTransactionsForAdmin(params: {
  locationScope: number[] | null
  status?: string
  search?: string
  from?: string
  to?: string
  limit?: number
  offset?: number
}): Promise<{ items: Transaction[]; total: number }> {
  const limit = params.limit ?? 50
  const offset = params.offset ?? 0
  const hasScope = params.locationScope !== null
  const scope = params.locationScope ?? []
  const searchPattern = params.search ? `%${params.search}%` : null

  const countRows = await sql`
    SELECT COUNT(*)::int AS total
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    WHERE (${!hasScope} OR t.location_id = ANY(${scope}))
      AND (${params.status ?? null}::text IS NULL OR t.status = ${params.status ?? null})
      AND (${searchPattern}::text IS NULL OR (
        t.reference_no ILIKE ${searchPattern}
        OR t.buyer_name ILIKE ${searchPattern}
        OR b.nama ILIKE ${searchPattern}
      ))
      AND (${params.from ?? null}::timestamptz IS NULL OR t.created_at >= ${params.from ?? null}::timestamptz)
      AND (${params.to ?? null}::timestamptz IS NULL OR t.created_at <= ${params.to ?? null}::timestamptz)
  `

  const rows = await sql`
    SELECT t.*,
      b.nama AS business_name,
      b.slug AS business_slug,
      loc.name AS location_name,
      kab.name AS kabupaten_name
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    LEFT JOIN locations loc ON loc.id = t.location_id
    LEFT JOIN locations kab ON kab.id = CASE
      WHEN loc.level = 'kecamatan' THEN loc.parent_id
      WHEN loc.level = 'kabupaten_kota' THEN loc.id
      ELSE NULL
    END
    WHERE (${!hasScope} OR t.location_id = ANY(${scope}))
      AND (${params.status ?? null}::text IS NULL OR t.status = ${params.status ?? null})
      AND (${searchPattern}::text IS NULL OR (
        t.reference_no ILIKE ${searchPattern}
        OR t.buyer_name ILIKE ${searchPattern}
        OR b.nama ILIKE ${searchPattern}
      ))
      AND (${params.from ?? null}::timestamptz IS NULL OR t.created_at >= ${params.from ?? null}::timestamptz)
      AND (${params.to ?? null}::timestamptz IS NULL OR t.created_at <= ${params.to ?? null}::timestamptz)
    ORDER BY t.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  return {
    items: rows.map((row) => transformTransactionRow(row as TransactionRow)),
    total: countRows[0]?.total ?? 0,
  }
}

export function buildWhatsappPrefillMessage(params: {
  businessName: string
  buyerName: string
  referenceNo: string
  quantity: number
  notes: string
}): string {
  const qtyLine = params.quantity > 0 ? String(params.quantity) : "-"
  return `Halo ${params.businessName},

Saya ${params.buyerName} tertarik dengan program kemitraan Anda.
Ref: ${params.referenceNo}
Kuantitas: ${qtyLine}
Catatan: ${params.notes}

Mohon info penawaran selanjutnya. Terima kasih.`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}
