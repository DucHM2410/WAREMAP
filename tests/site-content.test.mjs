import test from "node:test"
import assert from "node:assert/strict"
import {
  validateContent,
  validImageSource,
} from "../src/features/site-content/types.ts"
import { DEFAULT_SITE_CONTENT } from "../src/features/site-content/defaultContent.ts"

test("default content survives JSON export and import", () => {
  assert.equal(
    validateContent(JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT))),
    true,
  )
})
test("image sources reject executable URLs and SVG uploads", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html;base64,abc",
    "data:image/svg+xml;base64,abc",
    "http://example.com/image.png",
  ])
    assert.equal(validImageSource(value), false)
  assert.equal(validImageSource("https://example.com/image.png"), true)
  assert.equal(validImageSource("data:image/png;base64,YWJj"), true)
})
test("malformed imports cannot replace a published website", () => {
  for (const value of [null, {}, { version: 1 }, [], "content"])
    assert.equal(validateContent(value), false)
  const missingPage = structuredClone(DEFAULT_SITE_CONTENT)
  delete missingPage.pages.cosmetics
  assert.equal(validateContent(missingPage), false)
  const invalidSection = structuredClone(DEFAULT_SITE_CONTENT)
  invalidSection.pages.home.sections.push(null)
  assert.equal(validateContent(invalidSection), false)
  const duplicate = structuredClone(DEFAULT_SITE_CONTENT)
  duplicate.pages.home.sections.push(duplicate.pages.home.sections[0])
  assert.equal(validateContent(duplicate), false)
})
