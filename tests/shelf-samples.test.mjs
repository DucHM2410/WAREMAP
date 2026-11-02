import test from "node:test"
import assert from "node:assert/strict"
import { seed, initialRacks } from "../src/app/model.ts"
import { shelfSamples, withShelfSamples } from "../src/app/shelfSamples.ts"
import { INDUSTRIES } from "../src/shared/config/industries.ts"

test("both industries have varied packages on all four racks in each warehouse",()=>{
  for(const config of Object.values(INDUSTRIES)){
    const products=shelfSamples(config,"Kho trung tâm",initialRacks)
    assert.equal(products.length,14)
    assert.equal(products.filter(p=>p.rack==="A1"&&p.level===1&&p.bin===1).length,2)
    assert.equal(new Set(products.map(p=>p.rack)).size,4)
    assert.equal(new Set(products.map(p=>p.package3d.shape)).size,4)
    for(const p of products){const r=initialRacks.find(r=>r.id===p.rack);assert.ok(p.level<=r.levels&&p.bin<=r.bins)}
  }
})
test("one-time sample addition keeps existing stock and occupied positions untouched",()=>{
  const config=INDUSTRIES.cosmetics
  const saved=seed(config)
  delete saved.shelfSamplesVersion
  saved.products=[{...saved.products[0],id:"MY-OWN",qty:17,rack:"A1",level:1,bin:1}]
  const own=saved.products[0]
  const next=withShelfSamples(saved,config)
  assert.equal(next.products[0],own)
  assert.equal(next.products.filter(p=>p.branch===own.branch&&p.rack==="A1"&&p.level===1&&p.bin===1).length,1)
  assert.equal(withShelfSamples(next,config),next)
  assert.equal(saved.products.length,1)
})
