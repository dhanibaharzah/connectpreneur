import { neon, neonConfig } from "@neondatabase/serverless"

const FETCH_TIMEOUT_MS = 60_000

if (typeof fetch !== "undefined") {
  const defaultFetch = fetch
  neonConfig.fetchFunction = (url, init) =>
    defaultFetch(url, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
}

/** Normalize Neon URL for @neondatabase/serverless (pooler, no channel_binding). */
export function resolveDatabaseUrl(): string {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL

  if (!raw) {
    throw new Error("DATABASE_URL is not configured")
  }

  let url = raw

  // Serverless driver must use pooler endpoint
  url = url.replace(
    /@ep-([a-z0-9-]+)\.c-([a-z0-9-]+\.aws\.neon\.tech)/i,
    (_, host, region) => {
      if (host.endsWith("-pooler")) return `@ep-${host}.c-${region}`
      return `@ep-${host}-pooler.c-${region}`
    },
  )

  // channel_binding=require can cause flaky connections with HTTP driver
  url = url.replace(/([?&])channel_binding=require&?/g, "$1").replace(/\?&/, "?").replace(/\?$/, "")

  if (!url.includes("connect_timeout=")) {
    url += `${url.includes("?") ? "&" : "?"}connect_timeout=30`
  }

  if (!url.includes("sslmode=")) {
    url += "&sslmode=require"
  }

  return url
}

type SqlClient = ReturnType<typeof neon>

let sqlClient: SqlClient | null = null

function getSqlClient(): SqlClient {
  if (!sqlClient) {
    sqlClient = neon(resolveDatabaseUrl())
  }
  return sqlClient
}

/** Lazy-init so importing this module on the client does not throw at load time. */
export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  return getSqlClient()(strings, ...values)
}

export function isDbConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  const cause = (error as { cause?: Error }).cause
  const causeMessage = cause instanceof Error ? cause.message.toLowerCase() : ""
  return (
    message.includes("fetch failed") ||
    message.includes("connect timeout") ||
    message.includes("error connecting to database") ||
    message.includes("econnreset") ||
    message.includes("etimedout") ||
    causeMessage.includes("connect timeout") ||
    (cause as { code?: string } | undefined)?.code === "UND_ERR_CONNECT_TIMEOUT"
  )
}

export async function withDbRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!isDbConnectionError(error) || attempt === retries) break
      await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)))
    }
  }
  throw lastError
}
