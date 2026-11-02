import { useRef, type RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"
import type { Product, Rack } from "../../app/model"
import { productFocusPoint } from "./warehouseSearch"
import type { ProductDisplay } from "./productSizing"
import { slotProductPosition } from "./slotLayout"
import { productUnits, unitFocusPoint } from "./productUnits"

export interface LocateRequest { id: number; product: Product; scope?:"slot";unitIndex?:number;cancelled?:boolean }

export function ProductLocator({ request, rack, controls, siblings, mode }: {
  request: LocateRequest; rack: Rack; controls: RefObject<any>; siblings: Product[]; mode: ProductDisplay
}) {
  const finished = useRef(false)
  const point = request.unitIndex!==undefined?unitFocusPoint(request.product,rack,siblings,mode,request.unitIndex):productFocusPoint(request.product,rack,siblings,mode)
  const unit=productUnits(request.product,rack,mode,siblings).find(u=>u.index===request.unitIndex)
  if(request.scope==="slot"){
    const center=productFocusPoint(request.product,rack)
    point[0]=center[0];point[2]=center[2]
    point[1]=(request.product.level-1)*rack.height/rack.levels+Math.max(...siblings.map(p=>{const e=slotProductPosition(p,rack,siblings,mode).entry;return e?(e.yCm+e.heightUsedCm)/100:.2}),.1)/2
  }
  const target = new Vector3(...point)
  const entry=slotProductPosition(request.product,rack,siblings,mode).entry
  const distance = request.scope==="slot"?Math.max(rack.width/rack.bins,rack.depth,.5)*1.6:unit?Math.max(unit.width,unit.depth,unit.height,.08)*2.8:entry?Math.max(entry.reservedCm/100,entry.depthUsedCm/100,entry.heightUsedCm/100,.25)*1.8:Math.max(rack.width,rack.height,rack.depth,1)*1.3
  const angle = rack.rotation * Math.PI / 180
  const side=unit&&request.scope!=="slot"?(request.product.bin<=(rack.bins+1)/2?1:-1)*distance*.5:0
  const position = new Vector3(target.x + distance * Math.sin(angle)+side*Math.cos(angle), target.y + distance * (request.scope==="slot"?.3:.7), target.z + distance * Math.cos(angle)-side*Math.sin(angle))
  useFrame((_, delta) => {
    const orbit = controls.current
    if (!orbit || finished.current || request.cancelled) return
    orbit.minDistance = unit?.06:.3
    const amount = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 1 - Math.exp(-delta * 6)
    orbit.target.lerp(target, amount)
    orbit.object.position.lerp(position, amount)
    orbit.update()
    if (orbit.target.distanceTo(target) < .005 && orbit.object.position.distanceTo(position) < .01) finished.current = true
  })
  return null
}
