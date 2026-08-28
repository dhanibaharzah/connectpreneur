export function locationSelectPlaceholder(label: string): string {
  return `Pilih ${label}`
}

export function locationSelectSearchPlaceholder(label: string): string {
  return `Cari ${label}...`
}

export function locationChildPlaceholder(
  parentSelected: boolean,
  parentLabel: string,
  childLabel: string,
): string {
  if (!parentSelected) return `Pilih ${parentLabel} terlebih dahulu`
  return `Pilih ${childLabel}`
}
