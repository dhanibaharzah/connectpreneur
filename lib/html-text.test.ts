import { describe, expect, it } from "vitest"
import { htmlToPlainText } from "./html-text"

describe("htmlToPlainText", () => {
  it("preserves word boundaries between paragraphs", () => {
    const html =
      "<p>OrbitCreation adalah partner.</p><p>Layanan kami mencakup product development.</p>"
    expect(htmlToPlainText(html)).toBe(
      "OrbitCreation adalah partner. Layanan kami mencakup product development.",
    )
  })

  it("handles br tags and entities", () => {
    expect(htmlToPlainText("<p>Line one<br>Line two</p>")).toBe("Line one Line two")
    expect(htmlToPlainText("<p>Tom&nbsp;&amp;&nbsp;Jerry</p>")).toBe("Tom & Jerry")
  })
})
