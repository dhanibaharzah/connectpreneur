/**
 * Password Migration Script: SHA-256 to bcrypt
 * 
 * This script migrates the superadmin password from SHA-256 to bcrypt.
 * Run this ONCE after deploying the security updates.
 * 
 * Usage: npx tsx scripts/migrate-password-bcrypt.ts
 * 
 * IMPORTANT: Set the following environment variables:
 * - DATABASE_URL: Your Neon database connection string
 * - NEW_ADMIN_PASSWORD: The new password for superadmin (optional, will use existing if not set)
 */

import "dotenv/config"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const BCRYPT_ROUNDS = 12

async function migratePassword() {
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is required")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  
  console.log("Starting password migration to bcrypt...")
  
  try {
    // Get all admin users
    const users = await sql`SELECT id, email, password_hash FROM admin_users`
    
    console.log(`Found ${users.length} admin user(s)`)
    
    for (const user of users) {
      // Check if already bcrypt (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (user.password_hash && user.password_hash.startsWith("$2")) {
        console.log(`User ${user.email} already has bcrypt hash, skipping`)
        continue
      }
      
      // If SHA-256 hash (64 hex chars), we need to reset the password
      if (user.password_hash && user.password_hash.length === 64) {
        console.log(`User ${user.email} has SHA-256 hash`)
        
        // Check if new password is provided
        const newPassword = process.env.NEW_ADMIN_PASSWORD
        if (newPassword) {
          const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
          await sql`UPDATE admin_users SET password_hash = ${newHash} WHERE id = ${user.id}`
          console.log(`Updated password for ${user.email} to bcrypt`)
        } else {
          console.log(`WARNING: Set NEW_ADMIN_PASSWORD env var to update password for ${user.email}`)
          console.log(`Alternative: The password will auto-migrate on next successful login`)
        }
      }
    }
    
    console.log("Migration complete!")
    console.log("")
    console.log("NOTE: If you didn't set NEW_ADMIN_PASSWORD, existing passwords will")
    console.log("auto-migrate to bcrypt upon next successful login.")
    
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migratePassword()
