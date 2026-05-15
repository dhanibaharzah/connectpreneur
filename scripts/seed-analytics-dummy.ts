/**
 * Insert dummy analytics for demo (Jawa Barat kab/kota):
 * - page_view: 5–31 unique visitors per kab/kota that has mitras
 * - whatsapp_click: 1–3 per mitra yang sudah punya kunjungan dummy — memakai session_id
 *   yang sama dengan page_view (tidak ada WA tanpa kunjungan).
 *
 * Usage:
 *   pnpm tsx scripts/seed-analytics-dummy.ts
 *   pnpm tsx scripts/seed-analytics-dummy.ts --clear   # only remove dummy rows
 *
 * Re-run replaces previous dummy data (metadata.source = seed_demo).
 */

import { config } from "dotenv"
import { randomInt } from "node:crypto"
import { neon } from "@neondatabase/serverless"
import { JAWA_BARAT_KAB_KOTA_LIST } from "../lib/analytics/jabar-gadm-map"

config({ path: ".env.local" })
config({ path: ".env" })

const METADATA_JSON = JSON.stringify({ source: "seed_demo" })

async function main() {
  const clearOnly = process.argv.includes("--clear")

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set (.env.local)")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  await sql`
    DELETE FROM analytics_events WHERE metadata->>'source' = 'seed_demo'
  `
  console.log("🗑️  Cleared previous dummy analytics (source=seed_demo).")

  if (clearOnly) {
    console.log("✅ --clear only. Done.")
    return
  }

  let totalInserts = 0
  let skipped = 0

  for (const kabKota of JAWA_BARAT_KAB_KOTA_LIST) {
    const [stats] = await sql`
      SELECT
        COUNT(*)::int AS c,
        MIN(b.id)::int AS min_id,
        MAX(b.id)::int AS max_id
      FROM businesses b
      LEFT JOIN locations l ON b.location_id = l.id
      LEFT JOIN locations kab ON kab.id = CASE
        WHEN l.level = 'kabupaten_kota' THEN l.id
        WHEN l.level = 'kecamatan' THEN l.parent_id
        ELSE NULL
      END
      WHERE COALESCE(kab.name, NULLIF(TRIM(b.kota_provinsi), ''), 'Tidak diketahui') = ${kabKota}
    `

    const row = stats as { c: number; min_id: number | null; max_id: number | null }
    if (!row.c) {
      skipped++
      console.log(`  ⏭️  ${kabKota}: no businesses`)
      continue
    }

    const nVisitors = randomInt(5, 32)

    await sql`
      INSERT INTO analytics_events (
        event_type,
        business_id,
        session_id,
        metadata,
        page_path
      )
      SELECT
        'page_view',
        sub.id,
        md5(random()::text || g.i::text || clock_timestamp()::text),
        ${METADATA_JSON}::jsonb,
        '/bisnis/demo-seed'
      FROM generate_series(1, ${nVisitors}) AS g(i)
      CROSS JOIN LATERAL (
        SELECT b.id
        FROM businesses b
        LEFT JOIN locations l ON b.location_id = l.id
        LEFT JOIN locations kab ON kab.id = CASE
          WHEN l.level = 'kabupaten_kota' THEN l.id
          WHEN l.level = 'kecamatan' THEN l.parent_id
          ELSE NULL
        END
        WHERE COALESCE(kab.name, NULLIF(TRIM(b.kota_provinsi), ''), 'Tidak diketahui') = ${kabKota}
        ORDER BY random()
        LIMIT 1
      ) sub
    `
    totalInserts += nVisitors

    const idRange =
      row.min_id != null && row.max_id != null
        ? `mitra id ∈ [${row.min_id}…${row.max_id}]`
        : "mitra di wilayah ini"
    console.log(`  ✅ ${kabKota}: ${nVisitors} pengunjung dummy → ${idRange}`)
  }

  await sql`
    INSERT INTO analytics_events (
      event_type,
      business_id,
      session_id,
      metadata,
      page_path
    )
    WITH pv_sessions AS (
      SELECT DISTINCT business_id, session_id
      FROM analytics_events
      WHERE event_type = 'page_view' AND metadata->>'source' = 'seed_demo'
    ),
    ranked AS (
      SELECT
        business_id,
        session_id,
        row_number() OVER (PARTITION BY business_id ORDER BY random()) AS rn
      FROM pv_sessions
    ),
    per_biz AS (
      SELECT
        business_id,
        LEAST((1 + floor(random() * 3))::int, COUNT(*)::int) AS k
      FROM pv_sessions
      GROUP BY business_id
    )
    SELECT
      'whatsapp_click',
      r.business_id,
      r.session_id,
      ${METADATA_JSON}::jsonb,
      '/bisnis/demo-seed'
    FROM ranked r
    INNER JOIN per_biz p ON p.business_id = r.business_id AND r.rn <= p.k
  `
  const [wa] = await sql`
    SELECT COUNT(*)::int AS n
    FROM analytics_events
    WHERE metadata->>'source' = 'seed_demo' AND event_type = 'whatsapp_click'
  `
  const nWa = Number((wa as { n: number }).n)

  totalInserts += nWa
  console.log(
    `\n  ✅ Klik WhatsApp (dummy): ${nWa} event — 1–3 sesi / mitra yang punya kunjungan dummy (session sama dengan page view)`,
  )

  console.log(`\n✅ Selesai. ${totalInserts} event dummy (page_view + whatsapp_click). ${skipped} kab/kota tanpa mitra dilewati.`)
  console.log('   Hapus lagi: pnpm tsx scripts/seed-analytics-dummy.ts --clear')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
