import QRCode from "qrcode"

const QR_OPTIONS = {
  margin: 2,
  errorCorrectionLevel: "M" as const,
  color: { dark: "#1a1a1a", light: "#ffffff" },
}

export async function generateStoreQrDataUrl(url: string, width: number): Promise<string> {
  return QRCode.toDataURL(url, { ...QR_OPTIONS, width })
}

export const STORE_QR_SIZES = {
  large: 480,
  small: 200,
} as const
