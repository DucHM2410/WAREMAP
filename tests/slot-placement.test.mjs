import test from "node:test"
import assert from "node:assert/strict"
import {slotLayout,slotProductPosition,slotProductKey} from "../src/features/builder/slotLayout.ts"
const rack={width:1.2,depth:1,height:1.8,bins:2,levels:3}
const box=(id,x,z,w=12,d=10,h=8)=>({id,batch:id,branch:"Kho trung tâm",rack:"A1",level:1,bin:1,qty:1,package3d:{widthCm:w,depthCm:d,heightCm:h,shape:"box"},storage3d:{layers:1,stackable:true,placement:{xCm:x,zCm:z}}})
test("left/right and front/back positions are distinct and survive both display modes",()=>{
  const a=box("A",0,0),b=box("B",30,0),c=box("C",0,60)
  assert.equal(slotLayout(rack,[a,b,c]).fits,true)
  for(const mode of ["actual","readable"]){
    const pa=slotProductPosition(a,rack,[a,b,c],mode),pb=slotProductPosition(b,rack,[a,b,c],mode),pc=slotProductPosition(c,rack,[a,b,c],mode)
    assert.ok(pa.x<pb.x);assert.ok(pa.z>pc.z)
  }
  assert.equal(slotLayout(rack,[a,box("OVERLAP",1,1)]).fits,false)
  assert.equal(slotLayout(rack,[box("OUT",55,0)]).fits,false)
})
test("a supported upper lot sits on the lower lot, never floats or intersects it",()=>{
  const base=box("BASE",0,0,24,20,8),upper=box("UPPER",6,5)
  upper.storage3d.placement.onTopOf=slotProductKey(base)
  const layout=slotLayout(rack,[upper,base])
  assert.equal(layout.fits,true)
  assert.equal(layout.entries.find(e=>e.product.id==="UPPER").yCm,8)
  assert.equal(slotProductPosition(upper,rack,[upper,base],"actual").y,.08)
  assert.equal(slotLayout(rack,[upper]).fits,false)
  base.storage3d.stackable=false
  assert.equal(slotLayout(rack,[base,upper]).fits,false)
})
test("support containment, shelf clearance and dependency cycles are checked",()=>{
  const a=box("A",0,0),b=box("B",0,0,20,20,8)
  b.storage3d.placement.onTopOf=slotProductKey(a)
  assert.equal(slotLayout(rack,[a,b]).fits,false)
  a.storage3d.placement.onTopOf=slotProductKey(b)
  assert.equal(slotLayout(rack,[a,b]).fits,false)
  const tall=box("TALL",0,0,20,20,50),top=box("TOP",0,0,10,10,10)
  top.storage3d.placement.onTopOf=slotProductKey(tall)
  assert.equal(slotLayout(rack,[tall,top]).fits,false)
})
