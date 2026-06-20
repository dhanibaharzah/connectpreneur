/** URL-safe slug from display name (matches business slug conventions). */
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function slugifyNameOrFallback(name: string, fallback: string): string {
  const slug = slugifyName(name)
  return slug || fallback
}
