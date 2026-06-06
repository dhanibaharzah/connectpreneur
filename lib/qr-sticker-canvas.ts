const BRAND = {
  orange: "#ec4e14",
  orangeDark: "#b13b0f",
  orangeLight: "#fdede8",
  orangeMid: "#f5a623",
  white: "#ffffff",
  text: "#1f1f1f",
  muted: "#666666",
} as const

const LOGO_PATH = "/images/logoconnectpreneur.png"

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ")
  let line = ""
  let currentY = y

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " "
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currentY)
      line = words[i] + " "
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, currentY)
  return currentY + lineHeight
}

function drawOrangeHeader(
  ctx: CanvasRenderingContext2D,
  width: number,
  headerHeight: number,
  logo: HTMLImageElement,
) {
  ctx.fillStyle = BRAND.orange
  ctx.fillRect(0, 0, width, headerHeight)

  const logoMaxW = width * 0.55
  const logoH = (logo.height / logo.width) * logoMaxW
  const logoW = logoMaxW
  ctx.save()
  ctx.filter = "brightness(0) invert(1)"
  ctx.drawImage(logo, (width - logoW) / 2, (headerHeight - logoH) / 2, logoW, logoH)
  ctx.restore()
}

function drawOrangeBorder(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = BRAND.orange
  ctx.lineWidth = 6
  ctx.strokeRect(3, 3, w - 6, h - 6)
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  height: number,
  catalogUrl: string,
) {
  ctx.fillStyle = BRAND.orangeLight
  ctx.fillRect(0, y, width, height)

  ctx.fillStyle = BRAND.orangeDark
  ctx.font = "600 13px system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("connectpreneur.id", width / 2, y + height * 0.45)

  ctx.fillStyle = BRAND.muted
  ctx.font = "11px system-ui, sans-serif"
  const shortUrl = catalogUrl.replace(/^https?:\/\//, "")
  ctx.fillText(shortUrl, width / 2, y + height * 0.75)
}

export async function renderStoreQrStickerPng(options: {
  variant: "large" | "small"
  qrDataUrl: string
  businessName: string
  catalogUrl: string
}): Promise<string> {
  const { variant, qrDataUrl, businessName, catalogUrl } = options
  const [logo, qr] = await Promise.all([loadImage(LOGO_PATH), loadImage(qrDataUrl)])

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas tidak didukung")

  if (variant === "large") {
    canvas.width = 620
    canvas.height = 820

    ctx.fillStyle = BRAND.white
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawOrangeBorder(ctx, canvas.width, canvas.height)
    drawOrangeHeader(ctx, canvas.width, 96, logo)

    ctx.fillStyle = BRAND.orange
    ctx.font = "700 13px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("SCAN & MINTA PENAWARAN", canvas.width / 2, 128)

    const qrSize = 380
    ctx.drawImage(qr, (canvas.width - qrSize) / 2, 150, qrSize, qrSize)

    ctx.fillStyle = BRAND.text
    ctx.font = "700 24px system-ui, sans-serif"
    wrapText(ctx, businessName, canvas.width / 2, 560, canvas.width - 80, 30)

    ctx.fillStyle = BRAND.muted
    ctx.font = "13px system-ui, sans-serif"
    ctx.fillText("Scan dengan kamera HP Anda", canvas.width / 2, 640)

    drawFooter(ctx, canvas.width, 700, 120, catalogUrl)
  } else {
    canvas.width = 520
    canvas.height = 280

    ctx.fillStyle = BRAND.white
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawOrangeBorder(ctx, canvas.width, canvas.height)

    ctx.fillStyle = BRAND.orange
    ctx.fillRect(0, 0, canvas.width, 8)

    const logoW = 120
    const logoH = (logo.height / logo.width) * logoW
    ctx.drawImage(logo, 16, 20, logoW, logoH)

    ctx.fillStyle = BRAND.orange
    ctx.font = "700 10px system-ui, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("SCAN & MINTA PENAWARAN", 16, 20 + logoH + 16)

    const qrSize = 160
    ctx.drawImage(qr, 16, 90, qrSize, qrSize)

    const textX = 200
    ctx.fillStyle = BRAND.text
    ctx.font = "700 18px system-ui, sans-serif"
    ctx.textAlign = "left"
    wrapText(ctx, businessName, textX, 110, canvas.width - textX - 20, 24)

    ctx.fillStyle = BRAND.muted
    ctx.font = "11px system-ui, sans-serif"
    ctx.fillText("Lihat katalog & minta penawaran", textX, 190)
    ctx.fillText("via ConnectPreneur", textX, 210)

    ctx.fillStyle = BRAND.orangeLight
    ctx.fillRect(0, canvas.height - 36, canvas.width, 36)
    ctx.fillStyle = BRAND.orangeDark
    ctx.font = "600 11px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("connectpreneur.id", canvas.width / 2, canvas.height - 14)
  }

  return canvas.toDataURL("image/png")
}

export { BRAND as QR_STICKER_BRAND }
