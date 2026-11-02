import type { Product } from "../../app/model"

interface HitObject {
  userData?: Record<string, unknown>
  parent?: HitObject | null
}

/** Respect the front hit instead of selecting an occluded group behind it. */
export function productFromIntersections(hits: { object: HitObject }[], contents: Product[]) {
  for (const hit of hits.slice(0,1)) {
    let node: HitObject | null | undefined = hit.object
    while (node) {
      const key = node.userData?.warehouseProductKey
      if (typeof key === "string") {
        const product = contents.find(p => p.qty > 0 && `${p.id}|${p.batch}|${p.branch}` === key)
        if (product) return product
        break
      }
      node = node.parent
    }
  }
}

export function unitFromIntersections(hits:{object:HitObject}[],contents:Product[]){
  let node:HitObject|null|undefined=hits[0]?.object
  while(node){
    const key=node.userData?.warehouseProductKey,index=node.userData?.warehouseUnitIndex
    if(typeof key==="string"&&Number.isInteger(index)&&Number(index)>=0){
      const product=contents.find(p=>p.qty>0&&`${p.id}|${p.batch}|${p.branch}`===key)
      return product?{product,index:Number(index)}:undefined
    }
    node=node.parent
  }
}
