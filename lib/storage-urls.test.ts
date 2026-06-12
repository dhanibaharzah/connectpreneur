import { describe, expect, it } from "vitest"
import {
  isAllowedImageHost,
  isDeletableStorageUrl,
  isManagedStorageUrl,
} from "@/lib/storage-urls"

describe("storage URL helpers", () => {
  it("accepts legacy Vercel blob URLs", () => {
    const url = "https://abc.blob.vercel-storage.com/products/test.jpg"
    expect(isManagedStorageUrl(url)).toBe(true)
    expect(isDeletableStorageUrl(url)).toBe(true)
    expect(isAllowedImageHost(url)).toBe(true)
  })

  it("accepts R2 public bucket URLs (pub-*.r2.dev)", () => {
    const url = "https://pub-abc123.r2.dev/logos/123-logo.jpg"
    expect(isManagedStorageUrl(url)).toBe(true)
    expect(isDeletableStorageUrl(url)).toBe(true)
    expect(isAllowedImageHost(url)).toBe(true)
  })

  it("accepts configured R2 public base URL host", () => {
    const previous = process.env.R2_PUBLIC_BASE_URL
    process.env.R2_PUBLIC_BASE_URL = "https://files.connectpreneur.id"
    const url = "https://files.connectpreneur.id/products/test.jpg"
    expect(isManagedStorageUrl(url)).toBe(true)
    process.env.R2_PUBLIC_BASE_URL = previous
  })

  it("rejects unknown hosts", () => {
    const url = "https://evil.example.com/x.jpg"
    expect(isManagedStorageUrl(url)).toBe(false)
    expect(isDeletableStorageUrl(url)).toBe(false)
    expect(isAllowedImageHost(url)).toBe(false)
  })

  it("rejects path traversal", () => {
    const url = "https://pub-abc123.r2.dev/../secret.jpg"
    expect(isManagedStorageUrl(url)).toBe(false)
  })
})
