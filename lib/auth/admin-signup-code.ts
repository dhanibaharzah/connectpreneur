const DEFAULT_ADMIN_SIGNUP_CODE = "200498"

export function getAdminSignupCode(): string {
  return process.env.ADMIN_SIGNUP_CODE?.trim() || DEFAULT_ADMIN_SIGNUP_CODE
}

export function isValidAdminSignupCode(code: unknown): boolean {
  if (typeof code !== "string") return false
  return code.trim() === getAdminSignupCode()
}
