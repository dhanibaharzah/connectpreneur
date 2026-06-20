import Image from "next/image"
import { cn } from "@/lib/shared/utils"
import { QR_STICKER_BRAND } from "@/lib/umkm/qr-sticker-canvas"

interface StoreQrStickerProps {
  variant: "large" | "small"
  qrDataUrl: string
  businessName: string
  catalogUrl: string
  className?: string
}

export function StoreQrSticker({
  variant,
  qrDataUrl,
  businessName,
  catalogUrl,
  className,
}: StoreQrStickerProps) {
  const shortUrl = catalogUrl.replace(/^https?:\/\//, "")

  if (variant === "small") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-white shadow-md print:shadow-none",
          className,
        )}
        style={{ border: `3px solid ${QR_STICKER_BRAND.orange}`, maxWidth: 420 }}
      >
        <div className="h-2" style={{ backgroundColor: QR_STICKER_BRAND.orange }} />
        <div className="flex gap-4 p-4">
          <div className="shrink-0 space-y-2">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur"
              width={100}
              height={28}
              className="h-7 w-auto"
            />
            <p
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: QR_STICKER_BRAND.orange }}
            >
              Scan &amp; Minta Penawaran
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="" className="h-28 w-28" />
          </div>
          <div className="flex min-w-0 flex-col justify-center py-1">
            <p className="text-base font-bold leading-tight text-[#1f1f1f]">{businessName}</p>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              Lihat katalog &amp; minta penawaran via ConnectPreneur
            </p>
          </div>
        </div>
        <div
          className="px-3 py-2 text-center text-[10px] font-semibold"
          style={{ backgroundColor: QR_STICKER_BRAND.orangeLight, color: QR_STICKER_BRAND.orangeDark }}
        >
          connectpreneur.id · {shortUrl}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-white shadow-md print:shadow-none",
        className,
      )}
      style={{ border: `3px solid ${QR_STICKER_BRAND.orange}`, maxWidth: 360 }}
    >
      <div
        className="flex justify-center px-4 py-4"
        style={{ backgroundColor: QR_STICKER_BRAND.orange }}
      >
        <Image
          src="/images/logoconnectpreneur.png"
          alt="ConnectPreneur"
          width={180}
          height={44}
          className="h-11 w-auto brightness-0 invert"
        />
      </div>
      <div className="flex flex-col items-center px-6 py-5">
        <p
          className="mb-4 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: QR_STICKER_BRAND.orange }}
        >
          Scan &amp; Minta Penawaran
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrDataUrl} alt="" className="h-52 w-52" />
        <p className="mt-5 text-center text-lg font-bold leading-tight text-[#1f1f1f]">
          {businessName}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Scan dengan kamera HP Anda</p>
      </div>
      <div
        className="px-4 py-3 text-center"
        style={{ backgroundColor: QR_STICKER_BRAND.orangeLight }}
      >
        <p className="text-xs font-semibold" style={{ color: QR_STICKER_BRAND.orangeDark }}>
          connectpreneur.id
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{shortUrl}</p>
      </div>
    </div>
  )
}
