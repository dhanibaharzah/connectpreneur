const TITLE_PREFIXES =
  /\b(BPK|IBU|SDR|SDRI|DR|DRS|H|HJ|IR|NY|TN|NN|AN|AG|SH|MH|SIP|APT|PROF|KOL|BRIGJEN|KOLONEL|MAYJEN|JEND)\b/gi

/** Normalize a person name for fuzzy comparison. */
export function normalizePersonName(name: string): string {
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^A-Z\s]/g, " ")
    .replace(TITLE_PREFIXES, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      )
    }
  }

  return matrix[a.length][b.length]
}

function similarityRatio(a: string, b: string): number {
  if (!a || !b) return 0
  if (a === b) return 1
  const distance = levenshtein(a, b)
  return 1 - distance / Math.max(a.length, b.length)
}

function tokenOverlapScore(a: string, b: string): number {
  const tokensA = a.split(" ").filter(Boolean)
  const tokensB = b.split(" ").filter(Boolean)
  if (tokensA.length === 0 || tokensB.length === 0) return 0

  let matched = 0
  for (const token of tokensA) {
    if (tokensB.some((other) => similarityRatio(token, other) >= 0.85)) {
      matched++
    }
  }

  return matched / Math.max(tokensA.length, tokensB.length)
}

/** Each token in expected name must fuzzy-match somewhere in OCR output. */
export function allNameTokensFound(
  expectedName: string,
  ocrText: string,
  threshold = 0.82,
): boolean {
  const expectedTokens = normalizePersonName(expectedName).split(" ").filter(Boolean)
  if (expectedTokens.length === 0) return false

  const searchLines = ocrText
    .split(/\r?\n/)
    .map((line) => normalizePersonName(line))
    .filter((line) => line.length >= 2)

  searchLines.push(normalizePersonName(ocrText))

  return expectedTokens.every((token) =>
    searchLines.some((line) => {
      if (line.includes(token)) return true
      return line
        .split(" ")
        .some((word) => word.length >= 3 && similarityRatio(token, word) >= threshold)
    }),
  )
}

/** Check if OCR/form names refer to the same person (default threshold 0.85). */
export function namesMatch(
  expectedName: string,
  candidateText: string,
  threshold = 0.85,
): boolean {
  const expected = normalizePersonName(expectedName)
  if (!expected) return false

  const normalizedCandidate = normalizePersonName(candidateText)
  if (!normalizedCandidate) return false

  if (expected === normalizedCandidate) return true
  if (normalizedCandidate.includes(expected) || expected.includes(normalizedCandidate)) {
    return true
  }

  if (similarityRatio(expected, normalizedCandidate) >= threshold) return true
  if (tokenOverlapScore(expected, normalizedCandidate) >= threshold) return true

  const lines = candidateText
    .split(/\r?\n/)
    .map((line) => normalizePersonName(line))
    .filter((line) => line.length >= 3)

  for (const line of lines) {
    if (line === expected) return true
    if (line.includes(expected) || expected.includes(line)) return true
    if (similarityRatio(expected, line) >= threshold) return true
    if (tokenOverlapScore(expected, line) >= threshold) return true
  }

  return false
}

/** Try to extract a person name near a "Nama" label in KTP OCR output. */
export function extractNameFromKtpText(ocrText: string): string | null {
  const lines = ocrText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const inlineMatch = line.match(/^NAMA\s*[:\-]?\s*(.+)$/i)
    if (inlineMatch?.[1]) {
      return inlineMatch[1].trim()
    }

    if (/^NAMA$/i.test(line.replace(/[^A-Za-z]/g, ""))) {
      const parts: string[] = []
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const next = lines[j]
        if (/^(NIK|TEMPAT|JENIS|GOL|ALAMAT|RT|RW|KEL|KEC|AGAMA|STATUS|PEKERJAAN|KEWARGANEGARAAN|BERLAKU)/i.test(next)) {
          break
        }
        if (/^[A-Za-z\s'.-]{3,}$/.test(next.replace(/[^A-Za-z\s'.-]/g, ""))) {
          parts.push(next.replace(/[^A-Za-z\s'.-]/g, " ").replace(/\s+/g, " ").trim())
        }
      }
      if (parts.length > 0) return parts.join(" ")
    }
  }

  // Fallback: line after NIK block often contains the full name (2 consecutive name-like lines)
  for (let i = 0; i < lines.length - 1; i++) {
    if (/\d{10,}/.test(lines[i])) {
      const nameParts: string[] = []
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const candidate = lines[j].replace(/[^A-Za-z\s'.-]/g, " ").replace(/\s+/g, " ").trim()
        if (candidate.length >= 3 && /[A-Za-z]{3,}/.test(candidate)) {
          nameParts.push(candidate)
        } else {
          break
        }
      }
      if (nameParts.length > 0) return nameParts.join(" ")
    }
  }

  return null
}
