import { describe, expect, it } from "vitest"
import { parseOcrServiceVerifyResponse } from "@/lib/ocr-service"

describe("parseOcrServiceVerifyResponse", () => {
  it("reads verified and text from top-level payload", () => {
    expect(
      parseOcrServiceVerifyResponse({
        verified: true,
        text: "NIK: 3201234567890123\nNama: Budi",
      }),
    ).toEqual({
      verified: true,
      text: "NIK: 3201234567890123\nNama: Budi",
      raw: {
        verified: true,
        text: "NIK: 3201234567890123\nNama: Budi",
      },
    })
  })

  it("reads nested data payload", () => {
    expect(
      parseOcrServiceVerifyResponse({
        data: {
          matched: true,
          ocr_text: "Mohammad Husein Ramadhani Baharzah",
        },
      }),
    ).toEqual({
      verified: true,
      text: "Mohammad Husein Ramadhani Baharzah",
      raw: {
        data: {
          matched: true,
          ocr_text: "Mohammad Husein Ramadhani Baharzah",
        },
      },
    })
  })

  it("reads verified from OCR service response shape", () => {
    expect(
      parseOcrServiceVerifyResponse({
        verified: true,
        confidence: 62.8,
        match_score: 85.07,
        pages_scanned: 1,
        page_matched: 1,
        total_pages: 1,
      }),
    ).toEqual({
      verified: true,
      text: "",
      raw: {
        verified: true,
        confidence: 62.8,
        match_score: 85.07,
        pages_scanned: 1,
        page_matched: 1,
        total_pages: 1,
      },
    })
  })

  it("throws when verification status is missing", () => {
    expect(() => parseOcrServiceVerifyResponse({ text: "hello" })).toThrow(
      "Respons OCR service tidak memuat status verifikasi",
    )
  })
})
