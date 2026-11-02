import test from "node:test"
import assert from "node:assert/strict"
import { ensureIndustrySamples, seed } from "../src/app/model.ts"
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

test("industry demo seed contains eight FEFO alerts and upgrades older saved samples", () => {
  for (const config of Object.values(INDUSTRIES)) {
    const data = seed(config)
    assert.equal(config.sampleSKUs.length, 9)
    assert.equal(config.sampleBatches.length, 9)
    assert.equal(
      data.products.filter(
        (product) => product.qty > 0 && product.expiry <= "2026-12-02",
      ).length,
      8,
    )

    const olderData = { ...data, products: data.products.slice(0, 3) }
    const upgraded = ensureIndustrySamples(olderData, config)
    const industryIds = new Set(config.sampleSKUs.map(product => product.sku))
    const industryRows = upgraded.products.filter(product => industryIds.has(product.id))
    assert.equal(industryRows.length, 9)
    assert.equal(upgraded.products[0], olderData.products[0])
    assert.deepEqual(
      industryRows.slice(3).map((product) => product.id),
      config.sampleSKUs.slice(3).map((product) => product.sku),
    )
    assert.ok(upgraded.products.some(product => product.id.startsWith("DEMO-")))
    assert.equal(ensureIndustrySamples(upgraded, config), upgraded)
  }
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
