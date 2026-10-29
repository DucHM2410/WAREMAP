import test from "node:test"
import assert from "node:assert/strict"
import { seed } from "../src/app/model.ts"
import { INDUSTRIES } from "../src/shared/config/industries.ts"
import { beginIndustryDemoSession, confirmBusinessIndustry } from "../src/app/industryPolicy.ts"
import { canAccessScreen } from "../src/app/access.ts"

test("only the owner can confirm a business industry", () => {
  const data = seed(INDUSTRIES["mom-baby"])
  for (const role of ["manager", "warehouse", "sales", "platform"]) {
    assert.equal(confirmBusinessIndustry(data, role, "cosmetics"), data)
    assert.equal(canAccessScreen("authenticated", role, "industry-picker"), false)
  }
  assert.equal(canAccessScreen("authenticated", "owner", "industry-picker"), true)
})

test("legacy preferences remain unconfirmed until the owner explicitly chooses", () => {
  const data = seed(INDUSTRIES["mom-baby"])
  const ownProduct = { ...data.products[0], id: "CUSTOM-1", name: "Hàng tự nhập" }
  data.products.push(ownProduct)
  const result = confirmBusinessIndustry(data, "owner", "cosmetics")
  assert.equal(result.industry, "cosmetics")
  assert.equal(result.industryConfirmed, true)
  assert.ok(result.products.includes(ownProduct))
  assert.deepEqual(result.staff, data.staff)
  assert.deepEqual(result.racks, data.racks)
  assert.equal(data.industryConfirmed, undefined)
})

test("confirmed choice stays locked after persistence and repeated selections", () => {
  for (const choice of ["mom-baby", "cosmetics"]) {
    const result = confirmBusinessIndustry(seed(INDUSTRIES["mom-baby"]), "owner", choice)
    const restored = JSON.parse(JSON.stringify(result))
    for (const next of ["mom-baby", "cosmetics"]) {
      assert.equal(confirmBusinessIndustry(restored, "owner", next), restored)
      assert.equal(restored.industry, choice)
    }
  }
})

test("invalid industry cannot be confirmed", () => {
  const data = seed(INDUSTRIES["mom-baby"])
  assert.equal(confirmBusinessIndustry(data, "owner", "unknown"), data)
})

test("owner can choose again in a new demo session while staff retain the confirmed industry", () => {
  const locked = confirmBusinessIndustry(seed(INDUSTRIES["mom-baby"]), "owner", "mom-baby")
  for (const role of ["manager", "warehouse", "sales", "platform"]) {
    assert.equal(beginIndustryDemoSession(locked, role), locked)
  }
  const reopened = beginIndustryDemoSession(locked, "owner")
  assert.equal(reopened.industryConfirmed, false)
  assert.equal(reopened.products, locked.products)
  assert.equal(reopened.staff, locked.staff)
  const next = confirmBusinessIndustry(reopened, "owner", "cosmetics")
  assert.equal(next.industry, "cosmetics")
  assert.equal(next.industryConfirmed, true)
  assert.equal(confirmBusinessIndustry(next, "owner", "mom-baby"), next)
})

test("confirming the existing industry preserves adjusted stock and transfer history", () => {
  const data = seed(INDUSTRIES["mom-baby"])
  data.products[0].qty = 17
  const result = confirmBusinessIndustry(data, "owner", "mom-baby")
  assert.equal(result.products, data.products)
  assert.equal(result.products[0].qty, 17)
  assert.equal(result.transfers, data.transfers)
})
