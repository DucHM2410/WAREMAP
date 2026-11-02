import test from "node:test"
import assert from "node:assert/strict"
import { searchWarehouseProducts, productFocusPoint } from "../src/features/builder/warehouseSearch.ts"

const first = { id:"MILK-1", name:"Sữa dành cho bé", variant:"Hộp nhỏ", batch:"LOT-A", branch:"Kho trung tâm", rack:"A2", level:2, bin:3, qty:4 }
const second = { ...first, batch:"LOT-B", rack:"B1", bin:1 }
test("warehouse search supports Vietnamese without accents, SKU, lot and slot", () => {
  assert.equal(searchWarehouseProducts([first,second],"sua be").length,2)
  assert.deepEqual(searchWarehouseProducts([first,second],"milk-1 lot-b"),[second])
  assert.deepEqual(searchWarehouseProducts([first,second],"A2 tang 2 ngan 3"),[first])
  assert.equal(searchWarehouseProducts([first],"khong co").length,0)
})
test("locating a product respects rack rotation and the selected level/bin", () => {
  const rack={x:5,z:3,width:3,height:3,levels:3,bins:3,rotation:0}
  assert.deepEqual(productFocusPoint(first,rack),[6,1.5,3])
  const rotated=productFocusPoint(first,{...rack,rotation:90})
  assert.ok(Math.abs(rotated[0]-5)<1e-9)
  assert.ok(Math.abs(rotated[2]-2)<1e-9)
})
