import test from "node:test"
import assert from "node:assert/strict"
import { branches, seed, transferLines } from "../src/app/model.ts"
import { INDUSTRIES } from "../src/shared/config/industries.ts"
import { applyCartonTransfer } from "../src/features/in-transit/transferCartons.ts"

test("a two-carton transfer can receive and shelve in separate visits without double counting", () => {
  const initial = seed(INDUSTRIES.cosmetics)
  const [from, to] = branches
  const source = { ...initial.products[0], branch: from, expiry: "2099-12-31", qty: 25 }
  const transfer = {
    id: "test-transfer", from, to, productId: source.id, batch: source.batch,
    qty: 20, status: "Chuẩn bị", reserved: false, history: [], cartons: [],
  }
  let data = { ...initial, products: [source], transfers: [transfer] }
  const lineId = transferLines(transfer)[0].id
  const location = `LOC:1:${initial.racks[to][0].id}:1:1`
  const run = action => {
    const result = applyCartonTransfer(data, transfer.id, action)
    assert.equal(result.error, "")
    data = result.data
  }
  const reject = action => {
    const result = applyCartonTransfer(data, transfer.id, action)
    assert.ok(result.error)
    assert.equal(result.data, data)
  }
  const pack = (code, quantity) => run({ kind: "pack", lineId, code, quantity, reuse: false })
  pack("CTN:T01", 12)
  reject({ kind: "ship" })
  pack("CTN:T02", 8)
  run({ kind: "ship" })
  assert.equal(data.products[0].qty, 5)
  reject({ kind: "ship" })
  reject({ kind: "receive", code: "CTN:OTHER", quantity: 12 })
  run({ kind: "receive", code: "CTN:T01", quantity: 12 })
  assert.equal(data.transfers[0].received, 12)
  assert.equal(data.products.length, 1)
  reject({ kind: "receive", code: "CTN:T01", quantity: 12 })
  reject({ kind: "close", reason: "Thiếu thùng" })
  reject({ kind: "place", code: "CTN:T01", location: location.replace("LOC:1", "LOC:0") })
  run({ kind: "place", code: "CTN:T01", location })
  assert.equal(data.products[1].qty, 12)
  reject({ kind: "place", code: "CTN:T01", location })
  reject({ kind: "close", reason: "" })
  run({ kind: "receive", code: "CTN:T02", quantity: 8 })
  assert.equal(data.products[1].qty, 12)
  run({ kind: "place", code: "CTN:T02", location })
  run({ kind: "close", reason: "" })
  assert.equal(data.transfers[0].status, "Hoàn tất")
  assert.equal(data.products[1].qty, 20)
})
