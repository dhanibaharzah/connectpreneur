/**
 * Analytics migration — creates analytics_events table for admin dashboard.
 *
 * Usage (from project root, uses DATABASE_URL from .env.local):
 *   npx tsx scripts/migrate-analytics.ts
 *
 * Environment:
 *   DATABASE_URL — Neon connection string (required)
 */

import { config } from "dotenv"
import { neon } from "@neondatabase/serverless"

config({ path: ".env.local" })
config({ path: ".env" })

async function migrateAnalytics() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Add it to .env.local")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log("🚀 Running analytics migration (012-create-analytics)...")

    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id BIGSERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        business_id INTEGER REFERENCES businesses(id) ON DELETE SET NULL,
        session_id VARCHAR(64) NOT NULL,
        visitor_city VARCHAR(120),
        visitor_region VARCHAR(120),
        visitor_country VARCHAR(10) DEFAULT 'ID',
        referrer TEXT,
        page_path VARCHAR(500),
        metadata JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_events_business_type ON analytics_events(business_id, event_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_events_type_session ON analytics_events(event_type, session_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_city ON analytics_events(visitor_city) WHERE visitor_city IS NOT NULL`

    const [check] = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'analytics_events'
    `

    if (check) {
      console.log("✅ analytics_events table is ready.")
    } else {
      console.error("❌ Table was not created. Check DATABASE_URL and permissions.")
      process.exit(1)
    }
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

migrateAnalytics()
