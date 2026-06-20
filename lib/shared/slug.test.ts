import { describe, expect, it } from "vitest"
import { slugifyName, slugifyNameOrFallback } from "@/lib/shared/slug"

describe("slugifyName", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugifyName("Kopi Arabica Premium")).toBe("kopi-arabica-premium")
  })

  it("strips special characters", () => {
    expect(slugifyName("Teh & Herbal (500g)")).toBe("teh-herbal-500g")
  })

  it("returns empty string when no slug characters remain", () => {
    expect(slugifyName("!!!")).toBe("")
  })
})

describe("slugifyNameOrFallback", () => {
  it("uses fallback when slug is empty", () => {
    expect(slugifyNameOrFallback("!!!", "produk-1")).toBe("produk-1")
  })
})
