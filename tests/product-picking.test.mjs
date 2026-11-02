import test from "node:test"
import assert from "node:assert/strict"
import { productFromIntersections } from "../src/features/builder/productPicking.ts"

const product={id:"SMALL-1",batch:"LOT-2",branch:"Kho trung tâm",qty:5}
test("a frame blocks hidden packages instead of selecting a whole region behind it",()=>{
  const frame={userData:{}}
  const slot={userData:{warehouseProductKey:"SMALL-1|LOT-2|Kho trung tâm"}}
  const packageMesh={parent:slot}
  assert.equal(productFromIntersections([{object:frame},{object:packageMesh}],[product]),undefined)
  assert.equal(productFromIntersections([{object:packageMesh}],[product]),product)
})
test("picking never resolves a different rack, branch, lot or empty stock",()=>{
  const slot={userData:{warehouseProductKey:"SMALL-1|LOT-2|Kho trung tâm"}}
  assert.equal(productFromIntersections([{object:slot}],[{...product,branch:"Kho khác"}]),undefined)
  assert.equal(productFromIntersections([{object:slot}],[{...product,batch:"LOT-1"}]),undefined)
  assert.equal(productFromIntersections([{object:slot}],[{...product,qty:0}]),undefined)
  assert.equal(productFromIntersections([{object:slot}],[]),undefined)
})
