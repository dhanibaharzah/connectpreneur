import DOMPurify from "isomorphic-dompurify"

// Allowed HTML tags for rich text content
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
  "a", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "pre", "code", "span", "div"
]

// Allowed attributes
const ALLOWED_ATTR = ["href", "target", "rel", "class", "style"]

// Allowed URL protocols for links
const ALLOWED_URI_REGEXP = /^(?:https?|mailto):/i

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return ""
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    // Force all links to have rel="noopener noreferrer"
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  })
}

/**
 * Validate and sanitize a URL
 * Returns empty string if URL is invalid or uses dangerous protocol
 */
export function sanitizeURL(url: string): string {
  if (!url) return ""
  
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return ""
    }
    
    return parsed.href
  } catch {
    // If URL is invalid, check if it's a relative path
    if (url.startsWith("/") && !url.includes("..")) {
      return url
    }
    return ""
  }
}

/**
 * Check if a URL is safe (http/https only)
 */
export function isValidURL(url: string): boolean {
  if (!url) return false
  
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}
