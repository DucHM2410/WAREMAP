import type { Product, Rack } from "../../app/model"
import { storagePackageFor, type ProductDisplay } from "./productSizing"
import { productUnits } from "./productUnits"
import { slotProductKey } from "./slotLayout"
import { useState } from "react"

export function ProductGlyph({product,rack,mode,siblings,color,selected,selectedUnitIndex,wholeLot,onSelect,onHover,interactive=true}:{product:Product;rack:Rack;mode:ProductDisplay;siblings:Product[];color:string;selected:boolean;selectedUnitIndex:number;wholeLot:boolean;interactive?:boolean;onSelect:(index:number)=>void;onHover:(index:number|null)=>void}){
  const [hovered,setHovered]=useState<number|null>(null)
  const shape=storagePackageFor(product).value.shape
  const units=productUnits(product,rack,mode,siblings)
  return <group>{units.map(unit=>{
    const active=selected&&(wholeLot||unit.index===selectedUnitIndex)
    const hover=hovered===unit.index
    const faded=selected&&!wholeLot&&!active&&!hover
    const material=<meshStandardMaterial color={active?"#f4b24d":hover?"#61c5cf":color} emissive={active?"#f4b24d":hover?"#61c5cf":"#000"} emissiveIntensity={active||hover?.25:0} transparent={faded} opacity={faded?.35:1} depthWrite={!faded}/>
    const cap=<meshStandardMaterial color={active?"#ffe0a6":"#e1e9f0"} transparent={faded} opacity={faded?.35:1} depthWrite={!faded}/>
    return <group key={unit.index} position={[unit.x,unit.y+unit.height/2+.035,unit.z]} userData={{warehouseProductKey:slotProductKey(product),warehouseUnitIndex:unit.index}}
      onClick={event=>{if(interactive){event.stopPropagation();onSelect(unit.index)}}}
      onPointerOver={event=>{if(interactive){event.stopPropagation();setHovered(unit.index);onHover(unit.index)}}}
      onPointerOut={()=>{setHovered(null);onHover(null)}}>
      {shape==="box"?<mesh><boxGeometry args={[unit.width,unit.height,unit.depth]}/>{material}</mesh>:shape==="tube"?<><mesh position={[0,unit.height*.05,0]}><boxGeometry args={[unit.width,unit.height*.9,unit.depth]}/>{material}</mesh><mesh position={[0,-unit.height*.45,0]}><boxGeometry args={[unit.width,unit.height*.1,unit.depth]}/>{cap}</mesh></>:<group scale={[unit.width,1,unit.depth]}><mesh position={[0,-unit.height*.08,0]}><cylinderGeometry args={[.5,.5,unit.height*.84,16]}/>{material}</mesh><mesh position={[0,unit.height*.42,0]}><cylinderGeometry args={[shape==="bottle"?.24:.52,shape==="bottle"?.24:.52,unit.height*.16,16]}/>{cap}</mesh></group>}
    </group>
  })}</group>
}
