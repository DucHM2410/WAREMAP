import test from "node:test"
import assert from "node:assert/strict"
import {slotLayout,slotProductOffset} from "../src/features/builder/slotLayout.ts"
import {seed,branches} from "../src/app/model.ts"
import {INDUSTRIES} from "../src/shared/config/industries.ts"
import {assessPutaway,completePutaway} from "../src/features/putaway/putaway.ts"
const rack={width:1.2,depth:.4,height:1.8,bins:2,levels:3}
const p=(id,width,qty)=>({id,name:id,batch:id,branch:branches[0],rack:"A1",level:1,bin:1,qty,expiry:"2028-12-31",package3d:{widthCm:width,depthCm:10,heightCm:10,shape:"box"}})
test("unequal lots share one slot using measured strips and leave explicit free width",()=>{
  const items=[p("WIDE",35,4),p("SMALL",2,8)]
  const result=slotLayout(rack,items)
  assert.equal(result.fits,true)
  assert.equal(result.usedCm,39)
  assert.equal(result.freeCm,21)
  assert.ok(slotProductOffset(items[0],rack,items,"actual")<slotProductOffset(items[1],rack,items,"actual"))
  assert.ok(result.entries[0].offsetCm+result.entries[0].reservedCm/2<=result.entries[1].offsetCm-result.entries[1].reservedCm/2)
  assert.equal(slotLayout(rack,[p("FULL",35,8),items[1]]).fits,false)
})
test("missing measurements never report verified free space",()=>{
  const item=p("UNKNOWN",2,4);delete item.package3d
  assert.equal(slotLayout(rack,[item]).uncertain,true)
})
test("putaway admits a second SKU in a partly occupied slot and rejects overflowing quantity",()=>{
  const data=seed(INDUSTRIES.cosmetics)
  data.racks[branches[0]]=[{...data.racks[branches[0]][0],...rack}]
  data.products=[p("WIDE",35,4)]
  data.inboundCartons=[{id:"SHARED",code:"CTN:SHARED",status:"pending",product:p("SMALL",2,8)}]
  const request={locationCode:"LOC:0:A1:1:1",cartonCode:"CTN:SHARED",role:"warehouse",allowedBranches:[branches[0]],branchNames:branches,stacking:false,layers:1,confirmedPackaging:false,unmeasuredAck:false,separatedAck:true,today:"2026-10-30"}
  const result=completePutaway(data,request)
  assert.equal(result.error,"")
  assert.equal(result.data.products.length,2)
  assert.equal(result.data.products[0].qty,4)
  data.inboundCartons[0].product.qty=80
  assert.ok(assessPutaway(data,request).error)
  assert.equal(data.inboundCartons[0].status,"pending")
})
