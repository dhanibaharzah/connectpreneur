/**
 * Migrate Locations Script
 * 
 * This script creates the locations table and seeds it with 
 * Jawa Barat region data (provinsi, kabupaten/kota, kecamatan).
 * 
 * Usage: 
 *   npx tsx scripts/migrate-locations.ts
 * 
 * Options:
 *   --reset    Drop and recreate the locations table (WARNING: deletes all data)
 *   --seed     Only run seed data (skip table creation)
 *   --create   Only create table (skip seeding)
 * 
 * Environment:
 *   DATABASE_URL: Your Neon database connection string (required)
 */

import { config } from "dotenv"
import * as fs from "fs"
import * as path from "path"

// Load environment variables
config({ path: ".env.local" })
config({ path: ".env" })

import { neon } from "@neondatabase/serverless"

// Parse command line arguments
function parseArgs(): Record<string, boolean> {
  const args: Record<string, boolean> = {}
  const argv = process.argv.slice(2)
  
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      args[arg.slice(2)] = true
    }
  }
  
  return args
}

async function main() {
  console.log("\n=================================")
  console.log("  Migrate Locations")
  console.log("=================================\n")
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL environment variable is required")
    console.error("   Make sure you have a .env or .env.local file with DATABASE_URL set")
    process.exit(1)
  }
  
  const sql = neon(process.env.DATABASE_URL)
  const args = parseArgs()
  
  const shouldReset = args.reset
  const onlySeed = args.seed
  const onlyCreate = args.create
  
  try {
    // Step 1: Reset table if requested
    if (shouldReset) {
      console.log("⚠️  Resetting locations table...")
      
      // Remove foreign key constraint from businesses first
      await sql`ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_location_id_fkey`
      await sql`ALTER TABLE businesses DROP COLUMN IF EXISTS location_id`
      await sql`DROP TABLE IF EXISTS locations CASCADE`
      
      console.log("   ✅ Table dropped\n")
    }
    
    // Step 2: Create table
    if (!onlySeed) {
      console.log("📋 Creating locations table...")
      
      await sql`
        CREATE TABLE IF NOT EXISTS locations (
          id SERIAL PRIMARY KEY,
          code VARCHAR(10) NOT NULL,
          name VARCHAR(100) NOT NULL,
          level VARCHAR(20) NOT NULL CHECK (level IN ('provinsi', 'kabupaten_kota', 'kecamatan')),
          parent_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      
      // Create indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_locations_level ON locations(level)`
      await sql`CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations(parent_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_locations_code ON locations(code)`
      
      console.log("   ✅ Table created\n")
    }
    
    // Step 3: Seed data
    if (!onlyCreate) {
      // Check if data already exists
      const existingCount = await sql`SELECT COUNT(*) as count FROM locations`
      const count = parseInt(existingCount[0].count)
      
      if (count > 0 && !shouldReset) {
        console.log(`⚠️  Tabel locations sudah berisi ${count} data.`)
        console.log("   Gunakan --reset untuk menghapus dan mengisi ulang data.\n")
      } else {
        console.log("🌱 Seeding location data from JSON files...\n")
        
        const dataDir = path.join(__dirname, "../docs/jabar_geo_json")
        
        // 1. Insert Provinsi
        console.log("   🏛️  Inserting provinsi...")
        const provinsiResult = await sql`
          INSERT INTO locations (code, name, level, parent_id)
          VALUES ('32', 'JAWA BARAT', 'provinsi', NULL)
          RETURNING id
        `
        const provinsiId = provinsiResult[0].id
        console.log(`      ✅ JAWA BARAT (id: ${provinsiId})`)
        
        // 2. Insert Kabupaten/Kota
        console.log("\n   🏙️  Inserting kabupaten/kota...")
        const kabKotaFile = path.join(dataDir, "kabupaten_kota", "kab-32.json")
        const kabKotaData: Record<string, string> = JSON.parse(fs.readFileSync(kabKotaFile, "utf-8"))
        
        const kabKotaMap: Record<string, number> = {}
        let kabKotaCount = 0
        
        for (const [code, name] of Object.entries(kabKotaData)) {
          const fullCode = `32-${code}`
          const result = await sql`
            INSERT INTO locations (code, name, level, parent_id)
            VALUES (${fullCode}, ${name}, 'kabupaten_kota', ${provinsiId})
            RETURNING id
          `
          kabKotaMap[code] = result[0].id
          kabKotaCount++
        }
        console.log(`      ✅ ${kabKotaCount} kabupaten/kota inserted`)
        
        // 3. Insert Kecamatan
        console.log("\n   🏘️  Inserting kecamatan...")
        const kecamatanDir = path.join(dataDir, "kecamatan")
        const kecamatanFiles = fs.readdirSync(kecamatanDir).filter(f => f.endsWith(".json"))
        
        let totalKecamatan = 0
        
        for (const file of kecamatanFiles) {
          // Extract kab/kota code from filename (e.g., kec-32-73.json -> 73)
          const match = file.match(/kec-32-(\d+)\.json/)
          if (!match) continue
          
          const kabKotaCode = match[1]
          const parentId = kabKotaMap[kabKotaCode]
          
          if (!parentId) {
            console.log(`      ⚠️  Parent not found for ${file}`)
            continue
          }
          
          const kecamatanData: Record<string, string> = JSON.parse(
            fs.readFileSync(path.join(kecamatanDir, file), "utf-8")
          )
          
          for (const [code, name] of Object.entries(kecamatanData)) {
            const fullCode = `32-${kabKotaCode}-${code}`
            await sql`
              INSERT INTO locations (code, name, level, parent_id)
              VALUES (${fullCode}, ${name}, 'kecamatan', ${parentId})
            `
            totalKecamatan++
          }
          
          process.stdout.write(`      Processing: ${totalKecamatan} kecamatan...\r`)
        }
        console.log(`      ✅ ${totalKecamatan} kecamatan inserted\n`)
        
        // Show summary
        const summary = await sql`
          SELECT level, COUNT(*) as count 
          FROM locations 
          GROUP BY level 
          ORDER BY 
            CASE level 
              WHEN 'provinsi' THEN 1 
              WHEN 'kabupaten_kota' THEN 2 
              WHEN 'kecamatan' THEN 3 
            END
        `
        
        console.log("📊 Ringkasan:")
        for (const row of summary) {
          const label = row.level === "provinsi" 
            ? "Provinsi" 
            : row.level === "kabupaten_kota" 
              ? "Kabupaten/Kota" 
              : "Kecamatan"
          console.log(`   - ${label}: ${row.count}`)
        }
        console.log("")
      }
    }
    
    // Step 4: Add location_id to businesses table
    if (!onlySeed) {
      console.log("🔗 Adding location_id to businesses table...")
      
      await sql`
        ALTER TABLE businesses 
        ADD COLUMN IF NOT EXISTS location_id INTEGER REFERENCES locations(id)
      `
      await sql`CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(location_id)`
      
      console.log("   ✅ Column added\n")
    }
    
    console.log("=================================")
    console.log("  Migration completed!")
    console.log("=================================\n")
    
  } catch (error) {
    console.error("\n❌ ERROR: Migration failed")
    console.error(error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error)
  process.exit(1)
})
