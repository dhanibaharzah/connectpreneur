/**
 * Banner carousel display spec — derived from:
 * - `components/belanja/belanja-client.tsx` → `container mx-auto px-4`
 * - `components/belanja/banner-carousel.tsx` → `aspect-[16/9] sm:aspect-[21/6]`
 *
 * Banner width = container max-width − 32px (px-4 × 2)
 * Tailwind default container max-widths: sm 640, md 768, lg 1024, xl 1280, 2xl 1536
 */

export const BELANJA_BANNER_ASPECT = {
  mobile: { w: 16, h: 9 },
  desktop: { w: 21, h: 6 },
} as const

export interface BelanjaBannerDisplaySize {
  breakpoint: string
  width: number
  height: number
  note: string
}

/** 1× CSS pixel sizes (exact fit, no crop with object-cover). */
export function getBelanjaBannerDisplaySizes(): BelanjaBannerDisplaySize[] {
  const desktop = (containerMax: number, label: string): BelanjaBannerDisplaySize => {
    const width = containerMax - 32
    const height = Math.round((width * BELANJA_BANNER_ASPECT.desktop.h) / BELANJA_BANNER_ASPECT.desktop.w)
    return { breakpoint: label, width, height, note: "sm+ (aspect 21:6)" }
  }

  const mobile = (viewport: number, label: string): BelanjaBannerDisplaySize => {
    const width = viewport - 32
    const height = Math.round((width * BELANJA_BANNER_ASPECT.mobile.h) / BELANJA_BANNER_ASPECT.mobile.w)
    return { breakpoint: label, width, height, note: "mobile (aspect 16:9)" }
  }

  return [
    mobile(390, "<640px (390px viewport)"),
    desktop(640, "sm"),
    desktop(768, "md"),
    desktop(1024, "lg"),
    desktop(1280, "xl — typical laptop"),
    desktop(1536, "2xl"),
  ]
}

/** Recommended upload size: 2× xl desktop for sharp display on most screens. */
export const BELANJA_BANNER_UPLOAD_RECOMMENDED = {
  width: 2496,
  height: 714,
  aspectLabel: "21:6",
  description: "2× ukuran tampilan xl (1248×357 px) — cocok untuk laptop/desktop",
} as const

/** 1× exact xl display size — matches placeholder on typical desktop. */
export const BELANJA_BANNER_UPLOAD_EXACT_XL = {
  width: 1248,
  height: 357,
  aspectLabel: "21:6",
} as const
