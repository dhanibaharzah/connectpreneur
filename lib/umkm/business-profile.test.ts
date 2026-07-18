import { describe, expect, it } from "vitest"
import { parseUmkmBusinessProfileUpdate } from "@/lib/umkm/business-profile"

describe("parseUmkmBusinessProfileUpdate", () => {
  it("requires nama when provided empty", () => {
    expect(parseUmkmBusinessProfileUpdate({ nama: "   " })).toEqual({
      error: "Nama bisnis wajib diisi",
    })
  })

  it("requires category when cleared", () => {
    expect(parseUmkmBusinessProfileUpdate({ category_id: null })).toEqual({
      error: "Kategori harus dipilih",
    })
  })

  it("normalizes social usernames and phone", () => {
    const result = parseUmkmBusinessProfileUpdate({
      nama: "Toko A",
      category_id: "12",
      kontak_pic: "081234567890",
      instagram: "tokoa",
      facebook: "@tokoa.id",
      tiktok: "tokoa",
      product_images: [{ url: "https://cdn.example.com/a.jpg" }],
    })

    expect(result).toMatchObject({
      data: {
        nama: "Toko A",
        category_id: 12,
        kontak_pic: "6281234567890",
        instagram: "https://instagram.com/tokoa",
        facebook: "https://facebook.com/tokoa.id",
        tiktok: "https://tiktok.com/@tokoa",
        product_images: [{ url: "https://cdn.example.com/a.jpg" }],
      },
    })
  })

  it("rejects non-https product image urls", () => {
    expect(
      parseUmkmBusinessProfileUpdate({
        product_images: [{ url: "http://cdn.example.com/a.jpg" }],
      }),
    ).toEqual({ error: "URL gambar produk tidak valid" })
  })

  it("rejects more than 5 product images", () => {
    expect(
      parseUmkmBusinessProfileUpdate({
        product_images: Array.from({ length: 6 }, (_, i) => ({
          url: `https://cdn.example.com/${i}.jpg`,
        })),
      }),
    ).toEqual({ error: "Maksimal 5 gambar produk" })
  })
})
