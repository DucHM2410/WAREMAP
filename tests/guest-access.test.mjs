import test from "node:test"
import assert from "node:assert/strict"
import { canAccessScreen } from "../src/app/access.ts"
import { guestData } from "../src/app/guestData.ts"

test("anonymous modes cannot reach privileged screens, even with an owner role", () => {
  for (const mode of ["explore", "trial"]) {
    for (const role of ["owner", "platform", "manager", "warehouse", "sales"]) {
      for (const screen of [
        "dashboard",
        "builder",
        "scanner",
        "batches",
        "mobile",
        "onboarding",
        "roi",
        "account",
        "admin",
        "website-editor",
        "settings",
        "industry-picker",
      ]) {
        assert.equal(
          canAccessScreen(mode, role, screen),
          false,
          `${mode}/${role}/${screen}`,
        )
      }
      assert.equal(canAccessScreen(mode, role, "warehouse"), true)
      assert.equal(canAccessScreen(mode, role, "inventory"), mode === "trial")
      for (const screen of ["home", "login", "request", "trial-info"])
        assert.equal(canAccessScreen(mode, role, screen), true)
    }
  }
})
test("login preserves role restrictions", () => {
  assert.equal(canAccessScreen("authenticated", "owner", "builder"), true)
  assert.equal(canAccessScreen("authenticated", "manager", "builder"), true)
  assert.equal(canAccessScreen("authenticated", "sales", "builder"), false)
  assert.equal(canAccessScreen("authenticated", "warehouse", "account"), false)
  assert.equal(canAccessScreen("authenticated", "owner", "admin"), false)
  assert.equal(canAccessScreen("authenticated", "platform", "admin"), true)
})
test("guest data has one warehouse, bounded sample rows, and no operational records", () => {
  const sample = {
    racks: { A: [{ id: "A1" }], B: [{ id: "B1" }] },
    products: Array.from({ length: 20 }, (_, i) => ({
      id: String(i),
      branch: i === 0 ? "B" : "A",
      rack: i === 0 ? "B1" : "A1",
    })),
    requests: [{}],
    staff: [{}],
    activities: [{}],
    transfers: [{}],
    locations: 2,
  }
  const result = guestData(sample, "A")
  assert.equal(result.products.length, 16)
  assert.ok(result.products.every((p) => p.branch === "A" && p.rack === "A1"))
  assert.deepEqual(Object.keys(result.racks), ["A"])
  for (const key of ["requests", "staff", "activities", "transfers"])
    assert.deepEqual(result[key], [])
  assert.equal(sample.products.length, 20)
  assert.equal(sample.staff.length, 1)
})
