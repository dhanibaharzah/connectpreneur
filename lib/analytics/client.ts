"use client"

import type { TrackEventPayload } from "./types"

const SESSION_KEY = "cp_analytics_sid"

export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") return ""

  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, "")
        : `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function trackEvent(payload: TrackEventPayload) {
  const sessionId = getAnalyticsSessionId()
  if (!sessionId) return

  const body = {
    ...payload,
    sessionId,
    pagePath: payload.pagePath ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
  }

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // non-blocking
  })
}
