import test from "node:test"
import assert from "node:assert/strict"
import { quote } from "../src/app/model.ts"

test("base plans switch from a single location to a chain", () => {
  assert.equal(quote(1, 5).total, 99000)
  assert.equal(quote(2, 5).total, 299000)
  assert.equal(quote(5, 5).total, 299000)
})
test("additional locations are charged in complete blocks of five", () => {
  assert.equal(quote(6, 5).total, 449000)
  assert.equal(quote(10, 5).total, 449000)
  assert.equal(quote(11, 5).total, 599000)
})
test("staff blocks are independent of branch blocks", () => {
  assert.equal(quote(1, 6).total, 159000)
  assert.equal(quote(1, 10).total, 159000)
  assert.equal(quote(1, 11).total, 219000)
  assert.deepEqual(quote(6, 8), {
    base: 299000,
    branchExtra: 150000,
    staffExtra: 60000,
    total: 509000,
  })
})
