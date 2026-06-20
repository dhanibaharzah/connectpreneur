/** OCR often misreads these as digits and vice versa. */
const OCR_DIGIT_FIXES: Record<string, string> = {
  O: "0",
  o: "0",
  D: "0",
  Q: "0",
  I: "1",
  l: "1",
  "|": "1",
  "!": "1",
  Z: "2",
  z: "2",
  S: "5",
  s: "5",
  B: "8",
  G: "6",
  g: "9",
}

function normalizeOcrDigits(input: string): string {
  return input
    .split("")
    .map((ch) => OCR_DIGIT_FIXES[ch] ?? ch)
    .join("")
}

/** Basic plausibility check for Indonesian NIK (16 digits, valid province code). */
export function isPlausibleNik(nik: string): boolean {
  if (!/^\d{16}$/.test(nik)) return false

  const province = Number.parseInt(nik.slice(0, 2), 10)
  if (province < 11 || province > 94) return false

  const day = Number.parseInt(nik.slice(6, 8), 10)
  if (day < 1 || day > 71) return false

  const month = Number.parseInt(nik.slice(8, 10), 10)
  if (month < 1 || month > 12) return false

  return true
}

function collectFromDigitStream(digits: string, results: Set<string>) {
  if (digits.length < 16) return

  for (let i = 0; i <= digits.length - 16; i++) {
    const candidate = digits.slice(i, i + 16)
    if (isPlausibleNik(candidate)) {
      results.add(candidate)
    }
  }
}

function collectFromNikLabeledLines(text: string, results: Set<string>) {
  const lines = text.split(/\r?\n/)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!/NIK/i.test(line)) continue

    const block = [line, lines[i + 1] ?? "", lines[i + 2] ?? ""].join(" ")
    const normalized = normalizeOcrDigits(block)
    const digits = normalized.replace(/\D/g, "")

    if (digits.length >= 16) {
      collectFromDigitStream(digits, results)
      results.add(digits.slice(0, 16))
    }

    const spacedGroups = normalized.match(/\d[\d\s]{14,}\d/g) ?? []
    for (const group of spacedGroups) {
      const joined = group.replace(/\s+/g, "")
      if (joined.length >= 16) {
        collectFromDigitStream(joined, results)
        results.add(joined.slice(0, 16))
      }
    }
  }
}

function collectFromHighDigitLines(text: string, results: Set<string>) {
  for (const line of text.split(/\r?\n/)) {
    const normalized = normalizeOcrDigits(line)
    const digitCount = (normalized.match(/\d/g) ?? []).length
    if (digitCount < 14) continue

    const joined = normalized.replace(/\D/g, "")
    if (joined.length >= 16) {
      collectFromDigitStream(joined, results)
    }

    const parts = normalized.match(/\d{4,}/g) ?? []
    if (parts.length >= 2) {
      const combined = parts.join("")
      collectFromDigitStream(combined, results)
    }
  }
}

/** Extract all 16-digit NIK candidates from OCR text (handles spaces & split digits). */
export function extractNikCandidates(text: string): string[] {
  const results = new Set<string>()
  const normalized = normalizeOcrDigits(text)

  const contiguous = normalized.match(/\b(\d{16})\b/g) ?? []
  for (const nik of contiguous) {
    if (isPlausibleNik(nik)) results.add(nik)
  }

  collectFromNikLabeledLines(normalized, results)
  collectFromHighDigitLines(normalized, results)

  const allDigits = normalized.replace(/\D/g, "")
  collectFromDigitStream(allDigits, results)

  return [...results]
}

export function hasValidNik(text: string): boolean {
  return extractNikCandidates(text).length > 0
}
