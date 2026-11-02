import type { Product, Rack } from "../../app/model"
import { packageGeometry, storagePackageFor, storageUnits, type ProductDisplay } from "./productSizing"
import { slotProductPosition } from "./slotLayout"

export interface ProductUnit {index:number;x:number;y:number;z:number;width:number;depth:number;height:number}
/** These are selectable visual representatives, not serialized stock records. */
export function productUnits(product:Product,rack:Rack,mode:ProductDisplay,siblings:Product[]):ProductUnit[]{
  if(product.qty<=0)return []
  const region=slotProductPosition(product,rack,siblings,mode).entry
  const pack=storagePackageFor(product).value
  if(region){
    const columns=Math.max(1,Math.round(region.reservedCm/pack.widthCm)),rows=Math.max(1,Math.round(region.depthUsedCm/pack.depthCm))
    const units=storageUnits(product),count=Math.min(12,units)
    return Array.from({length:count},(_,i)=>{
      const index=count<=1?0:Math.floor(i*(units-1)/(count-1)),layer=Math.floor(index/(columns*rows)),cell=index%(columns*rows)
      return {index,x:(cell%columns+.5)*pack.widthCm/100-region.reservedCm/200,y:layer*pack.heightCm/100,z:region.depthUsedCm/200-(Math.floor(cell/columns)+.5)*pack.depthCm/100,width:pack.widthCm/100,depth:pack.depthCm/100,height:pack.heightCm/100}
    })
  }
  const layers=product.storage3d?.stackable?Math.min(3,Math.max(1,product.storage3d.layers)):1
  const geometry=packageGeometry(pack,mode==="readable"?{...rack,height:rack.height/layers}:rack,mode,Math.max(1,siblings.length))
  return Array.from({length:layers},(_,index)=>({index,x:0,y:index*geometry.height,z:0,...geometry}))
}

export function unitFocusPoint(product:Product,rack:Rack,siblings:Product[],mode:ProductDisplay,index:number):[number,number,number]{
  const region=slotProductPosition(product,rack,siblings,mode)
  const units=productUnits(product,rack,mode,siblings),unit=units.find(u=>u.index===index)||units[0]
  const x=-rack.width/2+(product.bin-.5)*rack.width/rack.bins+region.x+(unit?.x||0)
  const z=region.z+(unit?.z||0),angle=rack.rotation*Math.PI/180
  return [rack.x+x*Math.cos(angle)+z*Math.sin(angle),(product.level-1)*rack.height/rack.levels+region.y+(unit?.y||0)+(unit?.height||.1)/2+.035,rack.z-x*Math.sin(angle)+z*Math.cos(angle)]
}
