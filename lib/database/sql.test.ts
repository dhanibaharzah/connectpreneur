import { describe, expect, it, vi } from "vitest"
import { isDbConnectionError, withDbRetry } from "@/lib/sql"

describe("isDbConnectionError", () => {
  it("detects Neon connect timeout", () => {
    const error = new Error("Error connecting to database: TypeError: fetch failed")
    ;(error as { cause?: Error }).cause = new Error("Connect Timeout Error") as Error & {
      code: string
    }
    ;((error as { cause?: Error & { code?: string } }).cause as Error & { code?: string }).code =
      "UND_ERR_CONNECT_TIMEOUT"

    expect(isDbConnectionError(error)).toBe(true)
  })

  it("returns false for unrelated errors", () => {
    expect(isDbConnectionError(new Error("Invalid input"))).toBe(false)
  })
})

describe("withDbRetry", () => {
  it("retries on connection errors then succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error("fetch failed"), { cause: { code: "UND_ERR_CONNECT_TIMEOUT" } }))
      .mockResolvedValueOnce("ok")

    const result = await withDbRetry(fn, 2)
    expect(result).toBe("ok")
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it("does not retry non-connection errors", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("validation failed"))

    await expect(withDbRetry(fn, 2)).rejects.toThrow("validation failed")
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
