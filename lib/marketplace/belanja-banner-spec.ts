/**
 * Banner carousel display spec — derived from:
 * - `components/belanja/belanja-client.tsx` → `container mx-auto px-4`
 * - `components/belanja/banner-carousel.tsx` → `aspect-[16/9] sm:aspect-[1988/791]`
 *
 * Banner width = container max-width − 32px (px-4 × 2)
 * Tailwind default container max-widths: sm 640, md 768, lg 1024, xl 1280, 2xl 1536
 *
 * Desktop placement matches the designed asset: 1988 × 791.
 */

export const BELANJA_BANNER_ASPECT = {
  mobile: { w: 16, h: 9 },
  desktop: { w: 1988, h: 791 },
} as const

/** Tailwind classes used by the belanja carousel slot. */
export const BELANJA_BANNER_ASPECT_CLASS = "aspect-[16/9] sm:aspect-[1988/791]" as const

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
    return { breakpoint: label, width, height, note: "sm+ (aspect 1988:791)" }
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

/** Recommended upload size: designed desktop placement 1988 × 791. */
export const BELANJA_BANNER_UPLOAD_RECOMMENDED = {
  width: 1988,
  height: 791,
  aspectLabel: "1988:791",
  description: "Ukuran placement desktop (1988×791 px)",
} as const

/** 1× exact xl display size — matches placeholder on typical desktop. */
export const BELANJA_BANNER_UPLOAD_EXACT_XL = {
  width: 1248,
  height: Math.round((1248 * BELANJA_BANNER_ASPECT.desktop.h) / BELANJA_BANNER_ASPECT.desktop.w),
  aspectLabel: "1988:791",
} as const
