import { appUrl } from "@/lib/app-url"
import { formatCurrency } from "@/lib/transactions"
import { normalizePhoneDigits } from "@/lib/phone"

function normalizeWhatsAppPhone(phone: string): string {
  if (phone.includes("@")) return phone
  return `${normalizePhoneDigits(phone)}@s.whatsapp.net`
}

function getGowaConfig() {
  const baseUrl = process.env.GOWA_URL?.replace(/\/$/, "")
  const basicAuth = process.env.GOWA_BASIC_AUTH
  const deviceId = process.env.GOWA_DEVICE_ID

  return { baseUrl, basicAuth, deviceId }
}

export async function sendWhatsAppMessage(phone: string, message: string): Promise<void> {
  const { baseUrl, basicAuth, deviceId } = getGowaConfig()

  if (!baseUrl || !basicAuth) {
    console.warn("[GOWA] Skipping WhatsApp notification: GOWA_URL or GOWA_BASIC_AUTH not configured")
    return
  }

  const url = new URL("/send/message", baseUrl)
  if (deviceId) {
    url.searchParams.set("device_id", deviceId)
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(basicAuth).toString("base64")}`,
  }
  if (deviceId) {
    headers["X-Device-Id"] = deviceId
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify({
      phone: normalizeWhatsAppPhone(phone),
      message,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`GOWA send failed (${response.status}): ${body}`)
  }
}

export async function sendRegistrationWhatsAppNotification(params: {
  phone: string
  namaPic: string
  namaBisnis: string
}): Promise<void> {
  const message = `Halo ${params.namaPic},

Terima kasih telah mendaftar ConnectPreneur. Bisnis *${params.namaBisnis}* Anda sedang dalam tahap kurasi. Kami akan menghubungi Anda setelah proses verifikasi selesai.`

  await sendWhatsAppMessage(params.phone, message)
}

export async function sendRfqNotificationToUmkm(params: {
  phone: string
  businessName: string
  buyerName: string
  referenceNo: string
  quantity: number
  notes: string
}): Promise<void> {
  const qtyLine = params.quantity > 0 ? String(params.quantity) : "-"
  const message = `Halo ${params.businessName},

Ada permintaan penawaran baru di ConnectPreneur.

Ref: *${params.referenceNo}*
Pembeli: ${params.buyerName}
Kuantitas: ${qtyLine}
Catatan: ${params.notes}

Kelola di portal UMKM: ${appUrl("/umkm")}`

  await sendWhatsAppMessage(params.phone, message)
}

export async function sendRfqConfirmationToBuyer(params: {
  phone: string
  buyerName: string
  businessName: string
  referenceNo: string
}): Promise<void> {
  const message = `Halo ${params.buyerName},

Permintaan penawaran Anda ke *${params.businessName}* telah kami terima.

Ref: *${params.referenceNo}*

UMKM akan meninjau permintaan Anda. Terima kasih.`

  await sendWhatsAppMessage(params.phone, message)
}

export async function sendUmkmOtp(phone: string, otp: string): Promise<void> {
  const message = `Kode OTP ConnectPreneur UMKM: *${otp}*

Berlaku 5 menit. Jangan bagikan kode ini.`
  await sendWhatsAppMessage(phone, message)
}

export async function sendInvoiceToBuyer(params: {
  phone: string
  buyerName: string
  businessName: string
  referenceNo: string
  total: number
  invoiceUrl: string
  paymentUrl: string
}): Promise<void> {
  const message = `Halo ${params.buyerName},

Invoice dari *${params.businessName}* sudah siap.

Ref: *${params.referenceNo}*
Total: *${formatCurrency(params.total)}*

Lihat invoice: ${params.invoiceUrl}
Upload bukti bayar: ${params.paymentUrl}`

  await sendWhatsAppMessage(params.phone, message)
}

export async function sendPaymentReminderToBuyer(params: {
  phone: string
  buyerName: string
  businessName: string
  referenceNo: string
  paymentUrl: string
}): Promise<void> {
  const message = `Halo ${params.buyerName},

Reminder pembayaran untuk transaksi *${params.referenceNo}* ke *${params.businessName}*.

Upload bukti transfer: ${params.paymentUrl}`

  await sendWhatsAppMessage(params.phone, message)
}

export async function sendPaymentProofNotificationToUmkm(params: {
  phone: string
  businessName: string
  referenceNo: string
  buyerName: string
}): Promise<void> {
  const message = `Halo ${params.businessName},

Bukti transfer diupload untuk transaksi *${params.referenceNo}* oleh ${params.buyerName}.

Konfirmasi di portal UMKM: ${appUrl("/umkm")}`

  await sendWhatsAppMessage(params.phone, message)
}

export async function sendPaymentConfirmedToBuyer(params: {
  phone: string
  buyerName: string
  businessName: string
  referenceNo: string
}): Promise<void> {
  const message = `Halo ${params.buyerName},

Pembayaran untuk transaksi *${params.referenceNo}* ke *${params.businessName}* telah dikonfirmasi.

Terima kasih!`

  await sendWhatsAppMessage(params.phone, message)
}

export async function sendRfqRejectedToBuyer(params: {
  phone: string
  buyerName: string
  businessName: string
  referenceNo: string
  reason?: string
}): Promise<void> {
  const reasonLine = params.reason ? `\nAlasan: ${params.reason}` : ""
  const message = `Halo ${params.buyerName},

Permintaan penawaran *${params.referenceNo}* ke *${params.businessName}* tidak dapat diproses.${reasonLine}`

  await sendWhatsAppMessage(params.phone, message)
}
