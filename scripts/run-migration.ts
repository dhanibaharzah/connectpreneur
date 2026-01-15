import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL!)

async function runMigration() {
  try {
    console.log("🚀 Running migration...")

    // Contoh: Tambah kolom baru
    // await sql`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS new_column VARCHAR(255)`

    // Contoh: Buat table baru
    // await sql`
    //   CREATE TABLE IF NOT EXISTS new_table (
    //     id SERIAL PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   )
    // `

    // Contoh: Update data
    // await sql`UPDATE businesses SET is_active = false WHERE is_active IS NULL`

    console.log("✅ Migration completed successfully!")
    
    // Optional: Show tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log("\n📋 Current tables:")
    tables.forEach((t: any) => console.log(`   - ${t.table_name}`))

  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

runMigration()
