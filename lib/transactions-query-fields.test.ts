import { describe, expect, it } from "vitest"
import { TRANSACTION_ADMIN_LOCATION_FIELD_ALIASES } from "@/lib/transactions"

describe("TRANSACTION_ADMIN_LOCATION_FIELD_ALIASES", () => {
  it("documents location fields shared by admin transaction queries", () => {
    expect(TRANSACTION_ADMIN_LOCATION_FIELD_ALIASES).toEqual([
      "location_name",
      "kabupaten_name",
    ])
  })
})
