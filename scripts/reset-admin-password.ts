// Script to generate correct password hash
// Run this once to get the correct hash

import { createHash } from "crypto"

const password = "b1Nu509011997"
const hash = createHash("sha256").update(password).digest("hex")

console.log("Password:", password)
console.log("Hash:", hash)

// The hash for b1Nu509011997 is:
// Use this SQL to update:
// UPDATE admin_users SET password_hash = '<hash>' WHERE email = 'superadmin@connectpreneur.id';
