import { describe, expect, it } from "vitest"
import {
  BELANJA_BANNER_ASPECT,
  BELANJA_BANNER_ASPECT_CLASS,
  BELANJA_BANNER_UPLOAD_EXACT_XL,
  BELANJA_BANNER_UPLOAD_RECOMMENDED,
  getBelanjaBannerDisplaySizes,
} from "@/lib/marketplace/belanja-banner-spec"

describe("belanja banner placement", () => {
  it("uses 1988×791 as the desktop slot and recommended upload size", () => {
    expect(BELANJA_BANNER_ASPECT.desktop).toEqual({ w: 1988, h: 791 })
    expect(BELANJA_BANNER_UPLOAD_RECOMMENDED).toMatchObject({
      width: 1988,
      height: 791,
      aspectLabel: "1988:791",
    })
    expect(BELANJA_BANNER_ASPECT_CLASS).toContain("sm:aspect-[1988/791]")
  })

  it("keeps a taller 16:9 slot on mobile", () => {
    expect(BELANJA_BANNER_ASPECT.mobile).toEqual({ w: 16, h: 9 })
    expect(BELANJA_BANNER_ASPECT_CLASS).toContain("aspect-[16/9]")
  })

  it("computes xl display height from the 1988:791 placement", () => {
    const xl = getBelanjaBannerDisplaySizes().find((size) => size.breakpoint.startsWith("xl"))
    expect(xl).toMatchObject({ width: 1248, height: 497, note: "sm+ (aspect 1988:791)" })
    expect(BELANJA_BANNER_UPLOAD_EXACT_XL).toEqual({
      width: 1248,
      height: 497,
      aspectLabel: "1988:791",
    })
  })
})
