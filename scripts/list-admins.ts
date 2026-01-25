/**
 * List Admin Users Script
 * 
 * This script lists all admin users in the database.
 * 
 * Usage: npx tsx scripts/list-admins.ts
 * 
 * Environment:
 *   DATABASE_URL: Your Neon database connection string (required)
 */

import { config } from "dotenv"

// Load environment variables from .env.local (Next.js style) or .env
config({ path: ".env.local" })
config({ path: ".env" })
import { neon } from "@neondatabase/serverless"

async function main() {
  console.log("\n=================================")
  console.log("  Admin Users List")
  console.log("=================================\n")
  
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is required")
    process.exit(1)
  }
  
  const sql = neon(process.env.DATABASE_URL)
  
  try {
    const admins = await sql`
      SELECT id, email, name, role, is_active, created_at, updated_at
      FROM admin_users
      ORDER BY id
    `
    
    if (admins.length === 0) {
      console.log("No admin users found.\n")
      console.log("Run 'npx tsx scripts/add-admin.ts' to create one.\n")
      return
    }
    
    console.log(`Found ${admins.length} admin user(s):\n`)
    console.log("-".repeat(100))
    console.log(
      "ID".padEnd(5) +
      "Email".padEnd(35) +
      "Name".padEnd(20) +
      "Role".padEnd(12) +
      "Active".padEnd(8) +
      "Created"
    )
    console.log("-".repeat(100))
    
    for (const admin of admins) {
      const createdAt = admin.created_at 
        ? new Date(admin.created_at).toLocaleDateString("id-ID")
        : "N/A"
      
      console.log(
        String(admin.id).padEnd(5) +
        (admin.email || "").substring(0, 33).padEnd(35) +
        (admin.name || "-").substring(0, 18).padEnd(20) +
        (admin.role || "admin").padEnd(12) +
        (admin.is_active ? "Yes" : "No").padEnd(8) +
        createdAt
      )
    }
    
    console.log("-".repeat(100))
    console.log("")
    
  } catch (error) {
    console.error("ERROR: Failed to fetch admin users")
    console.error(error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error)
  process.exit(1)
})
