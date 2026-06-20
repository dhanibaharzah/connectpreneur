import { describe, expect, it } from "vitest"
import { buildBelanjaAkunPath, buildBelanjaProductPath, resolveBelanjaPaths } from "@/lib/marketplace/belanja-paths"

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

describe("resolveBelanjaPaths", () => {
  it("detects belanja subdomain and uses root home path", () => {
    expect(resolveBelanjaPaths("belanja.connectpreneur.id")).toEqual({
      homePath: "/",
      onSubdomain: true,
    })
  })

  it("strips port from host", () => {
    expect(resolveBelanjaPaths("belanja.localhost:3000")).toEqual({
      homePath: "/",
      onSubdomain: true,
    })
  })

  it("uses prefixed home path on main domain", () => {
    expect(resolveBelanjaPaths("connectpreneur.id")).toEqual({
      homePath: "/belanja",
      onSubdomain: false,
    })
  })
})
