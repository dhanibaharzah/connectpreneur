/**
 * Manage Admin User Script
 * 
 * This script allows you to update or delete admin users.
 * 
 * Usage:
 *   Reset password:
 *     npx tsx scripts/manage-admin.ts --email admin@example.com --reset-password "NewPassword123"
 * 
 *   Change role:
 *     npx tsx scripts/manage-admin.ts --email admin@example.com --role superadmin
 * 
 *   Deactivate user:
 *     npx tsx scripts/manage-admin.ts --email admin@example.com --deactivate
 * 
 *   Activate user:
 *     npx tsx scripts/manage-admin.ts --email admin@example.com --activate
 * 
 *   Delete user:
 *     npx tsx scripts/manage-admin.ts --email admin@example.com --delete
 * 
 * Environment:
 *   DATABASE_URL: Your Neon database connection string (required)
 */

import { config } from "dotenv"

// Load environment variables from .env.local (Next.js style) or .env
config({ path: ".env.local" })
config({ path: ".env" })
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import * as readline from "readline"

const BCRYPT_ROUNDS = 12

// Parse command line arguments
function parseArgs(): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {}
  const argv = process.argv.slice(2)
  
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2)
      
      // Check if next arg is a value or another flag
      if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        args[key] = argv[i + 1]
        i++
      } else {
        // Boolean flag
        args[key] = true
      }
    }
  }
  
  return args
}

// Prompt for confirmation
function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes")
    })
  })
}

// Validate password strength
function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" }
  }
  return { valid: true, message: "Password is strong" }
}

function printUsage() {
  console.log(`
Usage:
  npx tsx scripts/manage-admin.ts --email <email> <action>

Actions:
  --reset-password <new-password>   Reset the admin's password
  --role <admin|superadmin>         Change the admin's role
  --deactivate                      Deactivate the admin account
  --activate                        Activate the admin account
  --delete                          Delete the admin account

Examples:
  npx tsx scripts/manage-admin.ts --email admin@example.com --reset-password "NewPass123"
  npx tsx scripts/manage-admin.ts --email admin@example.com --role superadmin
  npx tsx scripts/manage-admin.ts --email admin@example.com --deactivate
`)
}

async function main() {
  console.log("\n=================================")
  console.log("  Manage Admin User")
  console.log("=================================\n")
  
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is required")
    process.exit(1)
  }
  
  const sql = neon(process.env.DATABASE_URL)
  const args = parseArgs()
  
  // Check for email
  if (!args.email || typeof args.email !== "string") {
    console.error("ERROR: --email is required")
    printUsage()
    process.exit(1)
  }
  
  const email = args.email
  
  // Find the admin
  const admins = await sql`
    SELECT id, email, name, role, is_active 
    FROM admin_users 
    WHERE email = ${email}
  `
  
  if (admins.length === 0) {
    console.error(`ERROR: Admin with email "${email}" not found`)
    process.exit(1)
  }
  
  const admin = admins[0]
  console.log(`Found admin: ${admin.email} (ID: ${admin.id}, Role: ${admin.role})\n`)
  
  // Handle actions
  if (args["reset-password"]) {
    const newPassword = args["reset-password"] as string
    
    const passwordCheck = isStrongPassword(newPassword)
    if (!passwordCheck.valid) {
      console.error(`ERROR: ${passwordCheck.message}`)
      process.exit(1)
    }
    
    console.log("Resetting password...")
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
    
    await sql`
      UPDATE admin_users 
      SET password_hash = ${passwordHash}, updated_at = NOW()
      WHERE id = ${admin.id}
    `
    
    console.log("Password reset successfully!")
    
  } else if (args.role) {
    const newRole = args.role as string
    
    if (!["admin", "superadmin"].includes(newRole)) {
      console.error("ERROR: Role must be 'admin' or 'superadmin'")
      process.exit(1)
    }
    
    console.log(`Changing role from "${admin.role}" to "${newRole}"...`)
    
    await sql`
      UPDATE admin_users 
      SET role = ${newRole}, updated_at = NOW()
      WHERE id = ${admin.id}
    `
    
    console.log("Role updated successfully!")
    
  } else if (args.deactivate) {
    if (!admin.is_active) {
      console.log("Admin is already deactivated")
      return
    }
    
    console.log("Deactivating admin account...")
    
    await sql`
      UPDATE admin_users 
      SET is_active = false, updated_at = NOW()
      WHERE id = ${admin.id}
    `
    
    console.log("Admin account deactivated!")
    
  } else if (args.activate) {
    if (admin.is_active) {
      console.log("Admin is already active")
      return
    }
    
    console.log("Activating admin account...")
    
    await sql`
      UPDATE admin_users 
      SET is_active = true, updated_at = NOW()
      WHERE id = ${admin.id}
    `
    
    console.log("Admin account activated!")
    
  } else if (args.delete) {
    const confirmed = await confirm(
      `Are you sure you want to DELETE admin "${admin.email}"? This cannot be undone. (y/n): `
    )
    
    if (!confirmed) {
      console.log("Cancelled.")
      return
    }
    
    console.log("Deleting admin account...")
    
    await sql`DELETE FROM admin_users WHERE id = ${admin.id}`
    
    console.log("Admin account deleted!")
    
  } else {
    console.error("ERROR: No action specified")
    printUsage()
    process.exit(1)
  }
  
  console.log("")
}

main().catch((error) => {
  console.error("Unexpected error:", error)
  process.exit(1)
})
