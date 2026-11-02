import test from "node:test"
import assert from "node:assert/strict"
import {Group,Mesh,CylinderGeometry,BoxGeometry,MeshBasicMaterial,Raycaster,Vector3} from "three"
import {productUnits,unitFocusPoint} from "../src/features/builder/productUnits.ts"
import {unitFromIntersections} from "../src/features/builder/productPicking.ts"
const rack={width:1.2,depth:.4,height:1.8,levels:3,bins:2,x:0,z:0,rotation:0}
const p={id:"BOTTLE",batch:"LOT",branch:"Kho",rack:"A1",level:1,bin:1,qty:8,package3d:{widthCm:4,depthCm:4,heightCm:12,shape:"bottle"}}
test("each rendered package has a unique index and camera focus, including non-box shapes",()=>{
  for(const shape of ["bottle","jar","tube","box"]){
    const product={...p,package3d:{...p.package3d,shape}}
    const units=productUnits(product,rack,"actual",[product])
    assert.equal(units.length,8);assert.equal(new Set(units.map(u=>u.index)).size,8)
    assert.notDeepEqual(unitFocusPoint(product,rack,[product],"actual",0),unitFocusPoint(product,rack,[product],"actual",1))
  }
  assert.deepEqual(productUnits({...p,qty:0},rack,"actual",[p]),[])
  assert.equal(productUnits({...p,qty:100},rack,"actual",[{...p,qty:100}]).length,12)
})
test("ray hits distinguish neighboring cylinder bodies, caps and box packages",()=>{
  for(const kind of ["cylinder","box"]){
    const root=new Group(),material=new MeshBasicMaterial(),geometries=[]
    for(let index=0;index<2;index++){
      const unit=new Group();unit.position.x=index*2;unit.userData={warehouseProductKey:"BOTTLE|LOT|Kho",warehouseUnitIndex:index}
      const bodyGeometry=kind==="cylinder"?new CylinderGeometry(.4,.4,1,16):new BoxGeometry(.8,1,.8)
      const capGeometry=new CylinderGeometry(.2,.2,.2,16)
      geometries.push(bodyGeometry,capGeometry)
      unit.add(new Mesh(bodyGeometry,material));const cap=new Mesh(capGeometry,material);cap.position.y=.6;unit.add(cap);root.add(unit)
    }
    root.updateMatrixWorld(true)
    for(const index of [0,1])for(const y of [0,.6]){
      const ray=new Raycaster(new Vector3(index*2,y,3),new Vector3(0,0,-1))
      const selection=unitFromIntersections(ray.intersectObjects(root.children,true),[p])
      assert.equal(selection?.index,index);assert.equal(selection?.product,p)
    }
    assert.equal(unitFromIntersections([{object:{userData:{}}}],[p]),undefined)
    geometries.forEach(g=>g.dispose());material.dispose()
  }
})
