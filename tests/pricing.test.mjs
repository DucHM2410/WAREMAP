import test from "node:test"
import assert from "node:assert/strict"
import { quote } from "../src/app/model.ts"
test("new plans include four or eighteen non-owner accounts", () => {
  assert.equal(quote(1,4).total,149000)
  assert.equal(quote(1,4).staffExtra,0)
  assert.equal(quote(5,18).total,399000)
  assert.equal(quote(5,18).staffExtra,0)
})
test("branch blocks contain two locations and recur monthly", () => {
  assert.equal(quote(6,18).total,598000)
  assert.equal(quote(7,18).total,598000)
  assert.equal(quote(8,18).total,797000)
  assert.equal(quote(9,18).total,797000)
})
test("pairs of accounts cost 99000 once and never increase monthly total", () => {
  assert.equal(quote(1,5).staffExtra,99000)
  assert.equal(quote(1,6).staffExtra,99000)
  assert.equal(quote(1,7).staffExtra,198000)
  assert.equal(quote(1,7).total,149000)
  assert.equal(quote(7,22).staffExtra,198000)
  assert.equal(quote(7,22).total,598000)
})
