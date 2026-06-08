import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

function tesseractTraceIncludes() {
  const includes = ["./ind.traineddata", "./eng.traineddata"]
  try {
    const coreDir = path.dirname(require.resolve("tesseract.js-core/package.json"))
    includes.push(`${path.relative(process.cwd(), coreDir).replace(/\\/g, "/")}/**/*`)
  } catch {
    includes.push("./node_modules/**/tesseract.js-core/**/*")
  }
  return includes
}

const ocrRouteAssets = tesseractTraceIncludes()

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["tesseract.js", "pdf-parse"],
  outputFileTracingIncludes: {
    "/api/register-mitra/verify/ktp": ocrRouteAssets,
    "/api/register-mitra/verify/akta": ocrRouteAssets,
  },
  typescript: {
    // TODO: Set to false once TypeScript issues are fixed
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
