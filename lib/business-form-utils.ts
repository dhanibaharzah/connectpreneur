export type SocialPlatform = "instagram" | "facebook" | "tiktok"

export function generateBusinessSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function isRichTextEmpty(html: string): boolean {
  return !html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

export function usernameToSocialUrl(
  username: string,
  platform: SocialPlatform,
): string {
  if (!username) return ""
  if (username.includes("http")) return username

  const cleanUsername = username.replace(/^@/, "").trim()
  if (!cleanUsername) return ""

  switch (platform) {
    case "instagram":
      return `https://instagram.com/${cleanUsername}`
    case "facebook":
      return `https://facebook.com/${cleanUsername}`
    case "tiktok":
      return `https://tiktok.com/@${cleanUsername}`
    default:
      return username
  }
}

export function extractSocialUsername(
  url: string,
  platform: SocialPlatform,
): string {
  if (!url) return ""

  if (!url.includes("http") && !url.includes(".com")) {
    return url.replace(/^@/, "")
  }

  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
    let pathname = urlObj.pathname.replace(/\/$/, "")

    if (platform === "tiktok") {
      return pathname.replace(/^\/@?/, "")
    }

    return pathname.replace(/^\//, "")
  } catch {
    return url.replace(/^@/, "")
  }
}
