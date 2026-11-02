import type { Product, Rack } from "../../app/model"
import { slotProductPosition } from "./slotLayout"
import type { ProductDisplay } from "./productSizing"

export function normalizeWarehouseSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase().trim()
}

export function searchWarehouseProducts(products: Product[], query: string) {
  const tokens = normalizeWarehouseSearch(query).split(/\s+/).filter(Boolean)
  return products.filter((p) => {
    const text = normalizeWarehouseSearch(`${p.name} ${p.variant} ${p.id} ${p.batch} ${p.branch} ${p.rack} ke ${p.rack} tang ${p.level} o ${p.bin} ngan ${p.bin}`)
    return tokens.every((token) => text.includes(token))
  })
}

/** Match the slot coordinates used by WarehouseRack, including rack rotation. */
export function productFocusPoint(product: Product, rack: Rack, siblings: Product[] = [], mode: ProductDisplay = "readable"): [number, number, number] {
  const position=siblings.length?slotProductPosition(product,rack,siblings,mode):{x:0,y:0,z:0,entry:undefined}
  const offset = -rack.width / 2 + (product.bin - .5) * rack.width / rack.bins + position.x
  const angle = rack.rotation * Math.PI / 180
  return [rack.x + offset * Math.cos(angle)+position.z*Math.sin(angle), position.entry?(product.level-1)*rack.height/rack.levels+position.y+position.entry.heightUsedCm/200:(product.level-.5)*rack.height/rack.levels, rack.z - offset * Math.sin(angle)+position.z*Math.cos(angle)]
}
