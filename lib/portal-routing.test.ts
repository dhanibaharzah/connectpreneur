import { describe, expect, it } from "vitest"
import {
  resolveBelanjaBuyerRedirectPath,
  resolveBelanjaSubdomainAction,
  shouldPassthroughPath,
} from "@/lib/portal-routing"

describe("shouldPassthroughPath", () => {
  it("allows API and static asset paths", () => {
    expect(shouldPassthroughPath("/api/belanja/products")).toBe(true)
    expect(shouldPassthroughPath("/_next/static/chunk.js")).toBe(true)
    expect(shouldPassthroughPath("/favicon.ico")).toBe(true)
    expect(shouldPassthroughPath("/images/logo.png")).toBe(true)
  })

  it("does not passthrough marketplace pages", () => {
    expect(shouldPassthroughPath("/")).toBe(false)
    expect(shouldPassthroughPath("/produk/kopi")).toBe(false)
  })
})

describe("resolveBelanjaBuyerRedirectPath", () => {
  it("maps root and legacy pembeli path to akun", () => {
    expect(resolveBelanjaBuyerRedirectPath("/")).toBe("/akun")
    expect(resolveBelanjaBuyerRedirectPath("/pembeli")).toBe("/akun")
  })

  it("preserves other paths", () => {
    expect(resolveBelanjaBuyerRedirectPath("/akun")).toBe("/akun")
    expect(resolveBelanjaBuyerRedirectPath("/produk/kopi")).toBe("/produk/kopi")
  })
})

describe("resolveBelanjaSubdomainAction", () => {
  it("passthroughs API routes", () => {
    expect(resolveBelanjaSubdomainAction("/api/belanja/products")).toEqual({ type: "passthrough" })
  })

  it("redirects prefixed belanja paths to clean URLs", () => {
    expect(resolveBelanjaSubdomainAction("/belanja")).toEqual({
      type: "redirect",
      pathname: "/",
    })
    expect(resolveBelanjaSubdomainAction("/belanja/akun")).toEqual({
      type: "redirect",
      pathname: "/akun",
    })
    expect(resolveBelanjaSubdomainAction("/belanja/produk/kopi")).toEqual({
      type: "redirect",
      pathname: "/produk/kopi",
    })
  })

  it("rewrites clean URLs to internal belanja routes", () => {
    expect(resolveBelanjaSubdomainAction("/akun")).toEqual({
      type: "rewrite",
      pathname: "/belanja/akun",
    })
    expect(resolveBelanjaSubdomainAction("/produk/kopi")).toEqual({
      type: "rewrite",
      pathname: "/belanja/produk/kopi",
    })
    expect(resolveBelanjaSubdomainAction("/")).toEqual({
      type: "rewrite",
      pathname: "/belanja",
    })
  })

  it("redirects unknown paths to main site", () => {
    expect(resolveBelanjaSubdomainAction("/katalog")).toEqual({ type: "redirect_to_main" })
  })
})
