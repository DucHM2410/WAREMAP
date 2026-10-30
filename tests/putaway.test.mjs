import test from "node:test"
import assert from "node:assert/strict"
import { seed, branches } from "../src/app/model.ts"
import { INDUSTRIES } from "../src/shared/config/industries.ts"
import { assessPutaway, completePutaway, parseLocation, validCarton } from "../src/features/putaway/putaway.ts"
import { canAccessScreen } from "../src/app/access.ts"

function fixture() {
  const product={id:"TEST-001",name:"Son thử",variant:"Thỏi",category:"Son môi",batch:"LOT-NEW",expiry:"2027-12-31",qty:10,branch:branches[0],rack:"",level:1,bin:1,package3d:{widthCm:2,depthCm:2,heightCm:8,shape:"tube"}}
  const carton={id:"C1",code:"CTN:THUNG-001",product,status:"pending",createdAt:"2026-10-30"}
  const data={...seed(INDUSTRIES.cosmetics),products:[],inboundCartons:[carton]}
  const request={locationCode:"LOC:0:A1:1:1",cartonCode:carton.code,role:"warehouse",allowedBranches:[branches[0]],branchNames:branches,stacking:false,layers:2,confirmedPackaging:false,unmeasuredAck:false,separatedAck:false,today:"2026-10-30"}
  return {data,request,product,carton}
}
test("pending cartons do not increase stock; final confirmation increments exactly once",()=>{
  const {data,request}=fixture()
  assert.equal(data.products.length,0)
  const first=completePutaway(data,request)
  assert.equal(first.error,"")
  assert.equal(first.data.products[0].qty,10)
  assert.equal(first.data.products[0].rack,"A1")
  assert.equal(first.data.inboundCartons[0].status,"stored")
  const duplicate=completePutaway(first.data,request)
  assert.match(duplicate.error,/đã nhập/)
  assert.equal(duplicate.data.products[0].qty,10)
  assert.equal(data.products.length,0)
  assert.equal(data.inboundCartons[0].status,"pending")
})
test("stock writes reject unauthorized roles, wrong branches, unknown cartons and invalid locations",()=>{
  const {data,request}=fixture()
  for(const role of ["sales","platform"])assert.ok(assessPutaway(data,{...request,role}).error)
  assert.ok(assessPutaway(data,{...request,allowedBranches:[branches[1]]}).error)
  assert.ok(assessPutaway(data,{...request,cartonCode:"LOT:LOT-NEW"}).error)
  for(const code of ["LOC:0:A1:99:1","LOC:99:A1:1:1","LOC:0:UNKNOWN:1:1","LOC:0:A1:1.5:1","LOC:0:A1:0:1"])assert.equal(parseLocation(code,data,branches),null)
})
test("same lot merges only at its original location and with matching expiry",()=>{
  const {data,request,product}=fixture()
  data.products=[{...product,rack:"A1",level:1,bin:1,qty:5}]
  assert.equal(completePutaway(data,request).data.products[0].qty,15)
  assert.ok(assessPutaway(data,{...request,locationCode:"LOC:0:A2:1:1"}).error)
  data.products[0].expiry="2028-12-31"
  assert.match(assessPutaway(data,request).error,/Hạn dùng/)
})
test("stacking requires packaging permission and measured dimensions",()=>{
  const {data,request}=fixture()
  assert.ok(assessPutaway(data,{...request,stacking:true}).error)
  assert.equal(assessPutaway(data,{...request,stacking:true,confirmedPackaging:true}).error,"")
  delete data.inboundCartons[0].product.package3d
  assert.ok(assessPutaway(data,{...request,stacking:true,confirmedPackaging:true,unmeasuredAck:true}).error)
  assert.equal(assessPutaway(data,{...request,unmeasuredAck:true}).error,"")
})
test("manual acknowledgement cannot bypass a known capacity or shelf-height conflict",()=>{
  const {data,request}=fixture()
  data.inboundCartons[0].product.package3d.widthCm=100
  assert.ok(assessPutaway(data,{...request,unmeasuredAck:true}).error)
  data.inboundCartons[0].product.package3d={widthCm:2,depthCm:2,heightCm:50,shape:"box"}
  assert.ok(assessPutaway(data,{...request,stacking:true,confirmedPackaging:true}).error)
})
test("different lots sharing a slot require separation and dedicated room for each",()=>{
  const {data,request,product}=fixture()
  data.products=[{...product,batch:"OTHER-LOT",rack:"A1",level:1,bin:1}]
  assert.match(assessPutaway(data,request).error,/tách khay/)
  assert.equal(assessPutaway(data,{...request,separatedAck:true}).error,"")
  delete data.products[0].package3d
  data.inboundCartons[0].product.package3d.widthCm=50
  assert.ok(assessPutaway(data,{...request,separatedAck:true,unmeasuredAck:true}).error)
})
test("expired stock and invalid quantities do not enter inventory; carton codes remain unique",()=>{
  const {data,request,carton}=fixture()
  assert.equal(validCarton(carton,[]),true)
  assert.equal(validCarton(carton,[carton]),false)
  data.inboundCartons[0].product.expiry="2026-10-01"
  assert.ok(assessPutaway(data,request).error)
  data.inboundCartons[0].product.expiry="2027-12-31"
  data.inboundCartons[0].product.qty=0
  assert.ok(assessPutaway(data,request).error)
})
test("3D and putaway role matrix is explicit, including platform admins and guests",()=>{
  for(const role of ["owner","manager","warehouse","sales"])assert.equal(canAccessScreen("authenticated",role,"warehouse"),true)
  assert.equal(canAccessScreen("authenticated","platform","warehouse"),false)
  for(const role of ["owner","manager","warehouse"])assert.equal(canAccessScreen("authenticated",role,"putaway"),true)
  for(const role of ["sales","platform"])assert.equal(canAccessScreen("authenticated",role,"putaway"),false)
  for(const role of ["owner","platform","warehouse"])for(const mode of ["explore","trial"])assert.equal(canAccessScreen(mode,role,"putaway"),false)
})
test("unopened cartons use outer dimensions and carton count, not individual unit size",()=>{
  const {data,request}=fixture()
  data.inboundCartons[0].product.qty=100
  data.inboundCartons[0].product.storage3d={layers:1,stackable:false,unitsPerContainer:100,containerPackage:{widthCm:50,depthCm:50,heightCm:40,shape:"box"}}
  assert.equal(assessPutaway(data,request).error,"")
  data.inboundCartons[0].product.storage3d.containerPackage.widthCm=100
  assert.ok(assessPutaway(data,{...request,unmeasuredAck:true}).error)
})
