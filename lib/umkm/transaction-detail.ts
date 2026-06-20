import type { NextRequest } from "next/server"
import {
  getBusinessBankDetails,
  getUmkmSessionFromRequest,
  updateBusinessBankDetails,
} from "@/lib/auth/umkm-auth"
import {
  approveTransaction,
  confirmPayment,
  getTransactionById,
  markManualReminderSent,
  rejectTransaction,
  sendInvoice,
} from "@/lib/transactions/transactions"
import { getOrCreateToken } from "@/lib/transactions/transaction-tokens"
import { appUrl } from "@/lib/shared/app-url"
import {
  sendBuyerBadgeLevelUp,
  sendInvoiceToBuyer,
  sendPaymentConfirmedToBuyer,
  sendPaymentReminderToBuyer,
  sendPointsEarnedToBuyer,
  sendPointsEarnedToUmkm,
  sendRfqRejectedToBuyer,
  sendTrustTierUpToUmkm,
} from "@/lib/integrations/gowa"
import { awardPointsForCompletedTransaction } from "@/lib/umkm/gamification"
import {
  BUYER_BADGE_LABELS,
  TRUST_TIER_LABELS,
} from "@/types/gamification"

export async function requireOwnedUmkmTransaction(request: NextRequest, id: number) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) return { error: { error: "Unauthorized", status: 401 as const } }

  const transaction = await getTransactionById(id)
  if (!transaction || transaction.businessId !== session.businessId) {
    return { error: { error: "Transaksi tidak ditemukan", status: 404 as const } }
  }

  return { session, transaction }
}

export async function handleUmkmTransactionAction(
  request: NextRequest,
  transactionId: number,
  body: Record<string, unknown>,
) {
  const owned = await requireOwnedUmkmTransaction(request, transactionId)
  if ("error" in owned) return owned

  const { transaction, session } = owned
  const { action } = body

  if (action === "approve") {
    const updated = await approveTransaction(transactionId)
    if (!updated) {
      return { error: { error: "Transaksi tidak dapat disetujui", status: 400 as const } }
    }
    return { success: true, transaction: updated }
  }

  if (action === "reject") {
    const reason = (body.reason as string | undefined)?.trim() || "Permintaan ditolak oleh UMKM"
    const updated = await rejectTransaction(transactionId, reason)
    if (!updated) {
      return { error: { error: "Transaksi tidak dapat ditolak", status: 400 as const } }
    }
    try {
      await sendRfqRejectedToBuyer({
        phone: transaction.buyerPhone,
        buyerName: transaction.buyerName,
        businessName: session.businessName,
        referenceNo: transaction.referenceNo,
        reason,
      })
    } catch (err) {
      console.error("Reject notification error:", err)
    }
    return { success: true, transaction: updated }
  }

  if (action === "invoice") {
    const inlineBank = body.bank as
      | { bank_name?: string; bank_account_number?: string; bank_account_name?: string }
      | undefined

    if (
      inlineBank?.bank_name?.trim() &&
      inlineBank?.bank_account_number?.trim() &&
      inlineBank?.bank_account_name?.trim()
    ) {
      await updateBusinessBankDetails(session.businessId, {
        bankName: inlineBank.bank_name.trim(),
        accountNumber: inlineBank.bank_account_number.trim(),
        accountName: inlineBank.bank_account_name.trim(),
      })
    }

    const bank = await getBusinessBankDetails(session.businessId)
    if (!bank?.bank_name?.trim() || !bank?.bank_account_number?.trim() || !bank?.bank_account_name?.trim()) {
      return {
        error: {
          error: "Lengkapi rekening bank terlebih dahulu, lalu klik Simpan Rekening",
          status: 400 as const,
        },
      }
    }

    const description = (body.description as string | undefined)?.trim()
    const quantity = Number(body.quantity)
    const unitPrice = Number(body.unit_price)

    if (!description || Number.isNaN(quantity) || quantity <= 0 || Number.isNaN(unitPrice) || unitPrice <= 0) {
      return { error: { error: "Data invoice tidak valid", status: 400 as const } }
    }

    const updated = await sendInvoice(transactionId, { description, quantity, unitPrice })
    if (!updated || updated.invoiceTotal == null) {
      return { error: { error: "Gagal menerbitkan invoice", status: 400 as const } }
    }

    const invoiceToken = await getOrCreateToken(transactionId, "buyer_invoice")
    const paymentToken = await getOrCreateToken(transactionId, "buyer_payment")
    const invoiceUrl = appUrl(`/invoice/${invoiceToken}`)
    const paymentUrl = appUrl(`/bayar/${paymentToken}`)

    try {
      await sendInvoiceToBuyer({
        phone: transaction.buyerPhone,
        buyerName: transaction.buyerName,
        businessName: session.businessName,
        referenceNo: transaction.referenceNo,
        total: updated.invoiceTotal,
        invoiceUrl,
        paymentUrl,
      })
    } catch (err) {
      console.error("Invoice notification error:", err)
    }

    return {
      success: true,
      transaction: updated,
      invoice_url: invoiceUrl,
      payment_url: paymentUrl,
    }
  }

  if (action === "confirm_payment") {
    const updated = await confirmPayment(transactionId)
    if (!updated) {
      return { error: { error: "Transaksi tidak dapat dikonfirmasi", status: 400 as const } }
    }

    let gamification = null
    try {
      gamification = await awardPointsForCompletedTransaction(updated)
    } catch (err) {
      console.error("Gamification award error:", err)
    }

    try {
      await sendPaymentConfirmedToBuyer({
        phone: transaction.buyerPhone,
        buyerName: transaction.buyerName,
        businessName: session.businessName,
        referenceNo: transaction.referenceNo,
      })
    } catch (err) {
      console.error("Payment confirmed notification error:", err)
    }

    if (gamification) {
      try {
        await sendPointsEarnedToBuyer({
          phone: transaction.buyerPhone,
          buyerName: transaction.buyerName,
          pointsEarned: gamification.buyer.pointsEarned,
          totalPoints: gamification.buyer.totalPoints,
          referenceNo: transaction.referenceNo,
        })
      } catch (err) {
        console.error("Buyer points notification error:", err)
      }

      const bank = await getBusinessBankDetails(session.businessId)
      const umkmPhone = bank?.kontak_pic as string | undefined

      if (umkmPhone) {
        try {
          await sendPointsEarnedToUmkm({
            phone: umkmPhone,
            businessName: session.businessName,
            pointsEarned: gamification.business.pointsEarned,
            totalPoints: gamification.business.totalPoints,
            referenceNo: transaction.referenceNo,
          })
        } catch (err) {
          console.error("UMKM points notification error:", err)
        }
      }

      if (gamification.buyer.badgeLevel !== gamification.buyer.previousBadgeLevel) {
        try {
          await sendBuyerBadgeLevelUp({
            phone: transaction.buyerPhone,
            buyerName: transaction.buyerName,
            badgeLabel: BUYER_BADGE_LABELS[gamification.buyer.badgeLevel],
          })
        } catch (err) {
          console.error("Buyer badge notification error:", err)
        }
      }

      if (
        gamification.business.trustTier &&
        gamification.business.trustTier !== gamification.business.previousTrustTier
      ) {
        try {
          if (umkmPhone) {
            await sendTrustTierUpToUmkm({
              phone: umkmPhone,
              businessName: session.businessName,
              tierLabel: TRUST_TIER_LABELS[gamification.business.trustTier],
            })
          }
        } catch (err) {
          console.error("Trust tier notification error:", err)
        }
      }
    }

    return { success: true, transaction: updated, gamification }
  }

  if (action === "remind") {
    if (transaction.status !== "invoice_sent") {
      return {
        error: {
          error: "Reminder hanya untuk transaksi menunggu pembayaran",
          status: 400 as const,
        },
      }
    }

    const paymentToken = await getOrCreateToken(transactionId, "buyer_payment")
    const paymentUrl = appUrl(`/bayar/${paymentToken}`)

    try {
      await sendPaymentReminderToBuyer({
        phone: transaction.buyerPhone,
        buyerName: transaction.buyerName,
        businessName: session.businessName,
        referenceNo: transaction.referenceNo,
        paymentUrl,
      })
    } catch (err) {
      console.error("Manual reminder error:", err)
      return { error: { error: "Gagal mengirim reminder", status: 502 as const } }
    }

    await markManualReminderSent(transactionId)
    return { success: true }
  }

  return { error: { error: "Aksi tidak dikenali", status: 400 as const } }
}
