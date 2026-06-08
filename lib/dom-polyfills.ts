/** Minimal DOM polyfills for pdf-parse/pdfjs on Node serverless (Vercel). */
export function ensureDomPolyfills(): void {
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = class DOMMatrix {
      a = 1
      b = 0
      c = 0
      d = 1
      e = 0
      f = 0

      constructor(_init?: string | ArrayLike<number>) {}

      multiplySelf() {
        return this
      }

      preMultiplySelf() {
        return this
      }

      translateSelf() {
        return this
      }

      scaleSelf() {
        return this
      }

      inverse() {
        return new DOMMatrix()
      }

      transformPoint(point?: { x: number; y: number }) {
        return { x: point?.x ?? 0, y: point?.y ?? 0, z: 0, w: 1 }
      }

      toFloat32Array() {
        return new Float32Array([1, 0, 0, 1, 0, 0])
      }

      toFloat64Array() {
        return new Float64Array([1, 0, 0, 1, 0, 0])
      }

      toString() {
        return "matrix(1, 0, 0, 1, 0, 0)"
      }
    } as unknown as typeof DOMMatrix
  }
}
