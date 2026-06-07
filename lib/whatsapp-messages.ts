/** Pure WhatsApp message templates — safe to import from client components. */

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

export function buildUmkmContactBuyerMessage(params: {
  businessName: string
  buyerName: string
  referenceNo: string
  quantity: number
  notes: string
}): string {
  const qtyLine = params.quantity > 0 ? String(params.quantity) : "-"
  return `Halo ${params.buyerName},

Saya dari *${params.businessName}* (ConnectPreneur). Terima kasih atas permintaan penawaran Anda.

Ref: ${params.referenceNo}
Kuantitas: ${qtyLine}
Catatan: ${params.notes}

Saya ingin mendiskusikan penawaran dan detail kemitraan lebih lanjut. Apakah saat ini berkenan untuk lanjut?

Terima kasih.`
}
