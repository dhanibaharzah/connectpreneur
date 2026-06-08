import { createRequire } from "node:module"
import path from "node:path"

const projectRequire = createRequire(path.join(process.cwd(), "package.json"))

/** Paths for Tesseract.js on Vercel/serverless (local WASM + traineddata, no CDN). */
export function getTesseractWorkerOptions() {
  const coreDir = path.dirname(projectRequire.resolve("tesseract.js-core/package.json"))
  const langPath = process.cwd()

  return {
    logger: () => {},
    errorHandler: (err: unknown) => {
      console.error("Tesseract worker error:", err)
    },
    langPath,
    gzip: false,
    corePath: coreDir,
    workerBlobURL: false,
    cacheMethod: "none" as const,
  }
}
