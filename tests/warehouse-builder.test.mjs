import test from "node:test"
import assert from "node:assert/strict"
import {
  createRack,
  fitToFloor,
  RACK_TEMPLATES,
} from "../src/features/builder/rackLibrary.ts"
import { warehouseScope } from "../src/app/warehouseScope.ts"

test("six rack templates have distinct shapes and independent editable instances", () => {
  assert.equal(RACK_TEMPLATES.length, 6)
  assert.equal(
    new Set(
      RACK_TEMPLATES.map((t) =>
        [t.width, t.depth, t.height, t.levels, t.bins].join("/"),
      ),
    ).size,
    6,
  )
  const first = createRack("cubicles", [], { x: 2, z: 3 })
  const second = createRack("cubicles", [first])
  assert.notEqual(first.id, second.id)
  assert.equal(first.levels, 4)
  assert.equal(first.bins, 4)
  first.levels = 6
  assert.equal(second.levels, 4)
  assert.equal(RACK_TEMPLATES.find((t) => t.id === "cubicles").levels, 4)
  assert.equal(createRack("invalid", []), null)
})
test("drop positions snap to the grid and keep the entire rotated rack inside the floor", () => {
  assert.deepEqual(fitToFloor(1.24, 2.28, 2, 1), { x: 1, z: 2.5 })
  assert.deepEqual(fitToFloor(100, -100, 2, 1), { x: 7, z: -5.5 })
  const turned = fitToFloor(100, 100, 4, 1, 90)
  assert.equal(turned.x, 7.5)
  assert.equal(turned.z, 6)
})
test("multi-warehouse access respects role and plan; guests always see one sample", () => {
  const branches = ["A", "B", "C"]
  assert.deepEqual(warehouseScope("authenticated", "owner", 2, branches), [
    "A",
    "B",
  ])
  assert.deepEqual(warehouseScope("authenticated", "owner", 1, branches), ["A"])
  assert.deepEqual(warehouseScope("authenticated", "manager", 3, branches), [
    "A",
  ])
  assert.deepEqual(warehouseScope("authenticated", "sales", 3, branches), ["A"])
  assert.deepEqual(warehouseScope("explore", "owner", 3, branches), ["A"])
  assert.deepEqual(warehouseScope("trial", "owner", 3, branches), ["A"])
})
