import { describe, expect, it } from "vitest"
import {
  locationChildPlaceholder,
  locationSelectPlaceholder,
  locationSelectSearchPlaceholder,
} from "@/lib/shared/location-field-copy"

describe("location field copy", () => {
  it("builds select copy from Asal DPD/DPC labels", () => {
    expect(locationSelectPlaceholder("Asal DPD")).toBe("Pilih Asal DPD")
    expect(locationSelectSearchPlaceholder("Asal DPC")).toBe("Cari Asal DPC...")
  })

  it("asks for the parent location before the child can be chosen", () => {
    expect(locationChildPlaceholder(false, "Asal DPD", "Asal DPC")).toBe(
      "Pilih Asal DPD terlebih dahulu",
    )
    expect(locationChildPlaceholder(true, "Asal DPD", "Asal DPC")).toBe("Pilih Asal DPC")
  })
})
