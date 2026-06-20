import { describe, expect, it } from "vitest"
import {
  extractSocialUsername,
  generateBusinessSlug,
  isRichTextEmpty,
  usernameToSocialUrl,
} from "@/lib/business-form-utils"

describe("generateBusinessSlug", () => {
  it("slugifies business names", () => {
    expect(generateBusinessSlug("Warung Makan Bu Ani!")).toBe("warung-makan-bu-ani")
  })
})

describe("isRichTextEmpty", () => {
  it("detects empty rich text", () => {
    expect(isRichTextEmpty("<p><br></p>")).toBe(true)
    expect(isRichTextEmpty("<p>Hello</p>")).toBe(false)
  })
})

describe("usernameToSocialUrl", () => {
  it("builds platform urls from usernames", () => {
    expect(usernameToSocialUrl("@toko", "instagram")).toBe("https://instagram.com/toko")
    expect(usernameToSocialUrl("toko", "tiktok")).toBe("https://tiktok.com/@toko")
  })

  it("preserves full urls", () => {
    expect(usernameToSocialUrl("https://instagram.com/toko", "instagram")).toBe(
      "https://instagram.com/toko",
    )
  })
})

describe("extractSocialUsername", () => {
  it("extracts usernames from urls", () => {
    expect(extractSocialUsername("https://instagram.com/toko", "instagram")).toBe("toko")
    expect(extractSocialUsername("https://tiktok.com/@toko", "tiktok")).toBe("toko")
  })

  it("returns plain usernames unchanged", () => {
    expect(extractSocialUsername("@toko", "instagram")).toBe("toko")
  })
})
