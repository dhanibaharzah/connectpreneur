/**
 * Add Admin User Script
 * 
 * This script creates a new admin user with bcrypt-hashed password.
 * 
 * Usage: 
 *   Interactive mode:
 *     npx tsx scripts/add-admin.ts
 * 
 *   With arguments:
 *     npx tsx scripts/add-admin.ts --email admin@example.com --name "Admin Name" --password "SecurePass123" --role admin
 * 
 * Options:
 *   --email     Email address (required)
 *   --name      Display name (optional)
 *   --password  Password (required, min 8 characters)
 *   --role      Role: "admin" or "superadmin" (default: admin)
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
function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {}
  const argv = process.argv.slice(2)
  
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2)
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : ""
      args[key] = value
      if (value) i++
    }
  }
  
  return args
}

// Create readline interface for interactive input
function createReadline(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

// Prompt for input
function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

// Prompt for password (hidden input simulation)
function promptPassword(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    // Note: In Node.js, we can't easily hide password input
    // For production, consider using a package like 'readline-sync' with hideEchoBack
    process.stdout.write(question)
    
    const stdin = process.stdin
    const wasRaw = stdin.isRaw
    
    if (stdin.isTTY) {
      stdin.setRawMode(true)
    }
    
    let password = ""
    
    const onData = (char: Buffer) => {
      const c = char.toString()
      
      if (c === "\n" || c === "\r") {
        stdin.removeListener("data", onData)
        if (stdin.isTTY && wasRaw !== undefined) {
          stdin.setRawMode(wasRaw)
        }
        console.log() // New line after password
        resolve(password)
      } else if (c === "\u0003") {
        // Ctrl+C
        process.exit()
      } else if (c === "\u007F" || c === "\b") {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1)
          process.stdout.write("\b \b")
        }
      } else {
        password += c
        process.stdout.write("*")
      }
    }
    
    stdin.on("data", onData)
    stdin.resume()
  })
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
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

async function main() {
  console.log("\n=================================")
  console.log("  Add New Admin User")
  console.log("=================================\n")
  
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is required")
    console.error("Make sure you have a .env or .env.local file with DATABASE_URL set")
    process.exit(1)
  }
  
  const sql = neon(process.env.DATABASE_URL)
  const args = parseArgs()
  
  let email: string
  let name: string
  let password: string
  let role: string
  
  // Check if running in interactive mode or with arguments
  if (args.email && args.password) {
    // Non-interactive mode
    email = args.email
    name = args.name || ""
    password = args.password
    role = args.role || "admin"
  } else {
    // Interactive mode
    const rl = createReadline()
    
    console.log("Please provide the following information:\n")
    
    // Get email
    while (true) {
      email = await prompt(rl, "Email: ")
      if (!email) {
        console.log("  Email is required\n")
        continue
      }
      if (!isValidEmail(email)) {
        console.log("  Invalid email format\n")
        continue
      }
      
      // Check if email already exists
      const existing = await sql`SELECT id FROM admin_users WHERE email = ${email}`
      if (existing.length > 0) {
        console.log("  An admin with this email already exists\n")
        continue
      }
      break
    }
    
    // Get name
    name = await prompt(rl, "Name (optional): ")
    
    // Get password
    while (true) {
      password = await promptPassword(rl, "Password: ")
      if (!password) {
        console.log("  Password is required\n")
        continue
      }
      
      const passwordCheck = isStrongPassword(password)
      if (!passwordCheck.valid) {
        console.log(`  ${passwordCheck.message}\n`)
        continue
      }
      
      // Confirm password
      const confirmPassword = await promptPassword(rl, "Confirm Password: ")
      if (password !== confirmPassword) {
        console.log("  Passwords do not match\n")
        continue
      }
      break
    }
    
    // Get role
    while (true) {
      const roleInput = await prompt(rl, "Role (admin/superadmin) [admin]: ")
      role = roleInput || "admin"
      
      if (!["admin", "superadmin"].includes(role)) {
        console.log("  Role must be 'admin' or 'superadmin'\n")
        continue
      }
      break
    }
    
    rl.close()
  }
  
  // Validate inputs
  if (!isValidEmail(email)) {
    console.error("ERROR: Invalid email format")
    process.exit(1)
  }
  
  const passwordCheck = isStrongPassword(password)
  if (!passwordCheck.valid) {
    console.error(`ERROR: ${passwordCheck.message}`)
    process.exit(1)
  }
  
  if (!["admin", "superadmin"].includes(role)) {
    console.error("ERROR: Role must be 'admin' or 'superadmin'")
    process.exit(1)
  }
  
  console.log("\n--- Creating Admin User ---")
  console.log(`Email: ${email}`)
  console.log(`Name: ${name || "(not set)"}`)
  console.log(`Role: ${role}`)
  console.log("")
  
  try {
    // Check if email already exists
    const existing = await sql`SELECT id FROM admin_users WHERE email = ${email}`
    if (existing.length > 0) {
      console.error("ERROR: An admin with this email already exists")
      process.exit(1)
    }
    
    // Hash password with bcrypt
    console.log("Hashing password...")
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    
    // Insert new admin
    console.log("Creating admin user...")
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name, role, is_active, created_at)
      VALUES (${email}, ${passwordHash}, ${name || null}, ${role}, true, NOW())
      RETURNING id, email, name, role, created_at
    `
    
    const newAdmin = result[0]
    
    console.log("\n=================================")
    console.log("  Admin User Created Successfully!")
    console.log("=================================")
    console.log(`ID: ${newAdmin.id}`)
    console.log(`Email: ${newAdmin.email}`)
    console.log(`Name: ${newAdmin.name || "(not set)"}`)
    console.log(`Role: ${newAdmin.role}`)
    console.log(`Created: ${newAdmin.created_at}`)
    console.log("")
    
  } catch (error) {
    console.error("ERROR: Failed to create admin user")
    console.error(error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error)
  process.exit(1)
})
