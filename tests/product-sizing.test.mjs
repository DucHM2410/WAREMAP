import test from "node:test"
import assert from "node:assert/strict"
import { packageFor,packageGeometry,fitsCompartment,validPackage } from "../src/features/builder/productSizing.ts"
import { createRack,fitToFloor } from "../src/features/builder/rackLibrary.ts"

test("small cosmetics use reference packaging, never silently claim measured dimensions", () => {
  const lipstick = packageFor({id:"LIP-001",category:"Son môi"})
  assert.equal(lipstick.estimated,true)
  assert.equal(lipstick.value.shape,"tube")
  assert.equal(packageFor({id:"DIAP-002",category:"Bỉm tã"}).value.shape,"box")
  const measured = {...lipstick.value,heightCm:9}
  assert.deepEqual(packageFor({id:"LIP-001",category:"Son môi",package3d:measured}), {value:measured,estimated:false})
})
test("actual 3D dimensions convert cm to meters; readable mode enlarges without changing stored size", () => {
  const rack = createRack("micro",[])
  const profile = {widthCm:2,depthCm:2,heightCm:8.5,shape:"tube"}
  assert.deepEqual(packageGeometry(profile,rack,"actual"),{width:.02,depth:.02,height:.085})
  assert.ok(packageGeometry(profile,rack,"readable").height > .085)
  assert.equal(profile.heightCm,8.5)
})
test("slot fit checks shelf clearance, not stock quantity or exaggerated display size", () => {
  const tray = createRack("tray",[])
  assert.equal(fitsCompartment({widthCm:2,depthCm:2,heightCm:8.5,shape:"tube"},tray),true)
  assert.equal(fitsCompartment({widthCm:35,depthCm:22,heightCm:30,shape:"box"},tray),false)
  assert.equal(validPackage({widthCm:0,depthCm:2,heightCm:8.5,shape:"tube"}),false)
  assert.equal(validPackage({widthCm:2,depthCm:NaN,heightCm:8.5,shape:"tube"}),false)
  assert.deepEqual(fitToFloor(.23,.38,.8,.3), {x:.2,z:.4})
})
