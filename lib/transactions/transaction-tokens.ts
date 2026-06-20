import { sql, withDbRetry } from "@/lib/sql"
import type { TokenPurpose } from "@/types/transaction"

const TOKEN_TTL_DAYS = 30

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function createTransactionToken(
  transactionId: number,
  purpose: TokenPurpose,
): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + TOKEN_TTL_DAYS)

  await sql`
    INSERT INTO transaction_tokens (transaction_id, token, purpose, expires_at)
    VALUES (${transactionId}, ${token}, ${purpose}, ${expiresAt.toISOString()})
  `

  return token
}

export async function getValidToken(token: string, purpose: TokenPurpose) {
  return withDbRetry(async () => {
    const rows = await sql`
      SELECT tt.*, t.id AS transaction_id, t.status, t.reference_no
      FROM transaction_tokens tt
      JOIN transactions t ON t.id = tt.transaction_id
      WHERE tt.token = ${token}
        AND tt.purpose = ${purpose}
        AND tt.expires_at > NOW()
        AND (
          ${purpose} = 'buyer_invoice'
          OR tt.used_at IS NULL
        )
    `
    return rows[0] ?? null
  })
}

export async function markTokenUsed(token: string): Promise<void> {
  await sql`
    UPDATE transaction_tokens SET used_at = NOW()
    WHERE token = ${token} AND used_at IS NULL
  `
}

export async function getOrCreateToken(
  transactionId: number,
  purpose: TokenPurpose,
): Promise<string> {
  const existing = await sql`
    SELECT token FROM transaction_tokens
    WHERE transaction_id = ${transactionId}
      AND purpose = ${purpose}
      AND expires_at > NOW()
      AND (${purpose} = 'buyer_invoice' OR used_at IS NULL)
    ORDER BY created_at DESC
    LIMIT 1
  `
  if (existing.length > 0) return existing[0].token as string
  return createTransactionToken(transactionId, purpose)
}
