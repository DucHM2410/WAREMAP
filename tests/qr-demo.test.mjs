import test from "node:test"
import assert from "node:assert/strict"
import QRCode from "qrcode"
import { seed, branches } from "../src/app/model.ts"
import { INDUSTRIES } from "../src/shared/config/industries.ts"
import { demoRequest, prepareDemoKit } from "../src/features/putaway/qrDemoKit.ts"
import { completePutaway, assessPutaway, parseLocation } from "../src/features/putaway/putaway.ts"
import { readQrPixels } from "../src/features/putaway/readQrImage.ts"

const day = "2026-11-02"
const prepare = (data, token = "TEST-001", role = "warehouse", branch = branches[0]) =>
  prepareDemoKit(data, role, [branches[0]], branch, day, token)

for (const industry of Object.values(INDUSTRIES)) {
  test(`QR demo kit for ${industry.id}: prepare, reuse, store exactly once and start another run`, () => {
    const data = seed(industry)
    const original = structuredClone(data)
    const kit = prepare(data)
    assert.equal(kit.error, "")
    assert.deepEqual(data, original)
    assert.deepEqual(kit.data.products, data.products)
    assert.equal(kit.carton.product.id, industry.sampleSKUs[0].sku)
    assert.equal(kit.carton.product.qty, 20)
    assert.ok(kit.carton.product.expiry > day)
    assert.equal(kit.carton.status, "pending")
    const code = kit.carton.qrDemo.locationCode
    const location = parseLocation(code, kit.data, branches)
    assert.ok(location)
    assert.equal(data.products.some(p => p.qty > 0 && p.branch === location.branch && p.rack === location.rack && p.level === location.level && p.bin === location.bin), false)
    const reused = prepare(kit.data, "TEST-002")
    assert.equal(reused.data, kit.data)
    assert.equal(reused.carton.code, kit.carton.code)
    const request = demoRequest(code, kit.carton.code, "warehouse", [branches[0]], day)
    const stored = completePutaway(kit.data, request)
    assert.equal(stored.error, "")
    assert.equal(stored.product.qty, 20)
    assert.equal(stored.data.inboundCartons[0].status, "stored")
    const again = completePutaway(stored.data, request)
    assert.match(again.error, /Không cộng tồn/)
    assert.equal(again.data, stored.data)
    const next = prepare(stored.data, "TEST-002")
    assert.equal(next.error, "")
    assert.notEqual(next.carton.code, kit.carton.code)
    assert.notEqual(next.carton.qrDemo.locationCode, code)
    assert.equal(next.data.inboundCartons.length, 2)
    assert.deepEqual(next.data.products, stored.data.products)
  })
}

test("kit fails without changing data when role, branch, code or empty space is invalid", () => {
  const data = seed(INDUSTRIES.cosmetics)
  for (const role of ["sales", "platform"]) assert.ok(prepare(data, "TEST-001", role).error)
  assert.ok(prepare(data, "TEST-001", "warehouse", branches[1]).error)
  assert.ok(prepare(data, "INVALID!").error)
  const noRacks = { ...data, racks: {} }
  const failed = prepare(noRacks)
  assert.ok(failed.error)
  assert.equal(failed.data, noRacks)
  const tooSmall = { ...data, products: [], racks: { [branches[0]]: [{ ...data.racks[branches[0]][0], width: 0.1, depth: 0.1, height: 0.1 }] } }
  assert.ok(prepare(tooSmall).error)
})

test("uploaded QR content must still pass the same location/carton validation", () => {
  const kit = prepare(seed(INDUSTRIES.cosmetics))
  const req = demoRequest(kit.carton.qrDemo.locationCode, kit.carton.code, "warehouse", [branches[0]], day)
  assert.equal(assessPutaway(kit.data, req).error, "")
  assert.ok(assessPutaway(kit.data, { ...req, locationCode: kit.carton.code }).error)
  assert.ok(assessPutaway(kit.data, { ...req, cartonCode: "LOT:DEMO-TEST-001" }).error)
  assert.ok(assessPutaway(kit.data, { ...req, allowedBranches: [branches[1]] }).error)
  const expired = { ...kit.data, inboundCartons: [{ ...kit.carton, product: { ...kit.carton.product, expiry: "2020-01-01" } }] }
  assert.ok(assessPutaway(expired, req).error)
})

function qrPixels(code, inverted = false) {
  const matrix = QRCode.create(code, { errorCorrectionLevel: "M" }).modules
  const scale = 6, margin = 4, width = (matrix.size + margin * 2) * scale
  const pixels = new Uint8ClampedArray(width * width * 4)
  for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
    const mx = Math.floor(x / scale) - margin, my = Math.floor(y / scale) - margin
    const dark = mx >= 0 && my >= 0 && mx < matrix.size && my < matrix.size && matrix.data[my * matrix.size + mx]
    const color = Boolean(dark) !== inverted ? 0 : 255
    const offset = (y * width + x) * 4
    pixels.set([color, color, color, 255], offset)
  }
  return { pixels, width }
}

test("image decoder reads real location and carton QR pixels, including inverted labels", () => {
  for (const code of ["LOC:0:A1:1:1", "CTN:DEMO-7A81795B-B8CC-4200-BAAD-717514D9EA16"]) {
    for (const inverted of [false, true]) {
      const { pixels, width } = qrPixels(code, inverted)
      assert.equal(readQrPixels(pixels, width, width), code)
    }
  }
})

test("image decoder rejects images without a QR", () => {
  const pixels = new Uint8ClampedArray(100 * 100 * 4).fill(255)
  assert.throws(() => readQrPixels(pixels, 100, 100), /Không tìm thấy QR/)
})
