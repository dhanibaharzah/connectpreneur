import { describe, expect, it } from "vitest"
import { buildBelanjaAkunPath, buildBelanjaProductPath } from "@/lib/belanja-paths"

describe("buildBelanjaAkunPath", () => {
  it("uses /akun on belanja subdomain", () => {
    expect(buildBelanjaAkunPath(true)).toBe("/akun")
  })

  it("uses /belanja/akun on main domain", () => {
    expect(buildBelanjaAkunPath(false)).toBe("/belanja/akun")
  })
})

describe("buildBelanjaProductPath", () => {
  it("uses slug path on belanja subdomain", () => {
    expect(buildBelanjaProductPath("kopi-arabica", true)).toBe("/produk/kopi-arabica")
  })

  it("uses prefixed slug path on main domain", () => {
    expect(buildBelanjaProductPath("kopi-arabica", false)).toBe("/belanja/produk/kopi-arabica")
  })
})
