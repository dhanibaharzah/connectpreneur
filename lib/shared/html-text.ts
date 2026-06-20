/**
 * Convert sanitized HTML to plain text for previews and search.
 * Preserves word boundaries between block elements (unlike naive tag stripping).
 */
export function htmlToPlainText(html: string): string {
  if (!html) return ""

  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}
