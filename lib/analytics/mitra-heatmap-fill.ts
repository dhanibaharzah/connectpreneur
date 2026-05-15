/**
 * Choropleth-style fill: pale neutral at 0 → brand orange at max.
 * Matches admin Jabar map bars (`#ec4e14` family via hsl).
 */
export function mitraHeatmapFill(value: number, max: number): string {
  if (value <= 0 || max <= 0) return "#f4f4f5"
  const t = Math.min(1, value / max)
  const h = 19
  const s = Math.round(12 + t * 76)
  const l = Math.round(96 - t * 46)
  return `hsl(${h}, ${s}%, ${l}%)`
}
