/**
 * Regenerate a wider hero JPEG from `public/images/home-hero-background.jpg`
 * (Lanczos upscale — run after replacing the source with a new photo).
 *
 *   pnpm exec tsx scripts/upscale-home-hero.ts
 */
import fs from "node:fs"
import path from "node:path"

import sharp from "sharp"

const TARGET_WIDTH = 2880

async function main() {
  const input = path.join(process.cwd(), "public/images/home-hero-background.jpg")
  const outPath = path.join(process.cwd(), "public/images/home-hero-background.jpg")
  const tmpPath = `${outPath}.tmp`

  if (!fs.existsSync(input)) {
    console.error("Missing:", input)
    process.exit(1)
  }

  const meta = await sharp(input).metadata()
  const w = meta.width ?? 1024
  const h = meta.height ?? 576
  if (w >= 2400) {
    console.log(`Skip: already ${w}px wide (replace file manually for a new photo).`)
    process.exit(0)
  }
  const targetH = Math.round((h / w) * TARGET_WIDTH)

  await sharp(input)
    .resize(TARGET_WIDTH, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: "fill",
    })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(tmpPath)

  fs.renameSync(tmpPath, outPath)
  console.log(`Wrote ${outPath} (${TARGET_WIDTH}×${targetH})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
