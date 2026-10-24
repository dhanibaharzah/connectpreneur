import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { slugifyName } from "@/lib/shared/slug"

const CATEGORY_NAME = "Lain-lain"
const CATEGORY_SLUG = "lain-lain"

const migrationSql = readFileSync(
  path.join(process.cwd(), "migrations/027-add-category-lain-lain.sql"),
  "utf8",
)

/**
 * Public GET /api/categories snapshot from connectpreneur.id on 2026-10-24,
 * before this migration. Ordered the same way the API returns them (ORDER BY name).
 */
const PUBLIC_CATEGORIES_BEFORE = [
  "Ecommerce",
  "Fashion",
  "Gaming",
  "Jasa & Konstruksi",
  "Jasa & Otomotif",
  "Jasa IT",
  "Kecantikan",
  "Kerajinan",
  "Kesehatan",
  "Kesehatan & Herbal",
  "Makanan & Minuman",
  "Perikanan",
  "Pertanian",
  "Peternakan",
] as const

/** Mirrors the migration predicate: insert only when name and slug are both absent. */
function namesAfterMigration(existingNames: readonly string[]): string[] {
  const alreadyPresent = existingNames.some(
    (name) => name.trim().toLowerCase() === CATEGORY_NAME.toLowerCase(),
  )
  const next = alreadyPresent ? [...existingNames] : [...existingNames, CATEGORY_NAME]
  return next.sort((a, b) => a.localeCompare(b, "en"))
}

describe("migration 027 category Lain-lain", () => {
  it("inserts the label and the slug produced by the shared slug helper", () => {
    expect(slugifyName(CATEGORY_NAME)).toBe(CATEGORY_SLUG)
    expect(migrationSql).toContain(`'${CATEGORY_NAME}'`)
    expect(migrationSql).toContain(`'${CATEGORY_SLUG}'`)
    expect(migrationSql).toMatch(/INSERT INTO categories \(name, slug\)/i)
    expect(migrationSql).toMatch(/WHERE NOT EXISTS/i)
    expect(migrationSql.toLowerCase()).not.toContain("delete from")
  })

  it("is not in the current public list and sorts into the category dropdown", () => {
    expect(PUBLIC_CATEGORIES_BEFORE).not.toContain(CATEGORY_NAME)

    const visible = namesAfterMigration(PUBLIC_CATEGORIES_BEFORE)
    expect(visible).toContain(CATEGORY_NAME)

    const herbal = visible.indexOf("Kesehatan & Herbal")
    const lain = visible.indexOf(CATEGORY_NAME)
    const makanan = visible.indexOf("Makanan & Minuman")
    expect(herbal).toBeGreaterThanOrEqual(0)
    expect(lain).toBeGreaterThan(herbal)
    expect(makanan).toBeGreaterThan(lain)
  })

  it("does not add a duplicate when the category is already stored", () => {
    const withCategory = [...PUBLIC_CATEGORIES_BEFORE, CATEGORY_NAME]
    expect(namesAfterMigration(withCategory).filter((name) => name === CATEGORY_NAME)).toEqual([
      CATEGORY_NAME,
    ])

    const spaced = [...PUBLIC_CATEGORIES_BEFORE, "  lain-lain  "]
    expect(namesAfterMigration(spaced)).not.toContain(CATEGORY_NAME)
    expect(namesAfterMigration(spaced).some((name) => name.trim().toLowerCase() === "lain-lain")).toBe(
      true,
    )
  })
})
