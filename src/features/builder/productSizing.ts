import type { Product, ProductPackage, Rack } from "../../app/model"

export type ProductDisplay = "readable" | "actual"
export const PACKAGE_SHAPES = {box: "Hộp / túi", bottle: "Chai / lọ", jar: "Hũ / lon", tube: "Tuýp / thỏi"} as const

export function validPackage(value: ProductPackage) {
  return Object.prototype.hasOwnProperty.call(PACKAGE_SHAPES, value.shape) && [value.widthCm, value.depthCm, value.heightCm].every(n => Number.isFinite(n) && n >= .5 && n <= 150)
}

// Reference sizes describe generic packaging, not verified manufacturer measurements.
export function packageFor(product: Product): {value: ProductPackage; estimated: boolean} {
  if (product.package3d && validPackage(product.package3d)) return {value: product.package3d, estimated: false}
  const category = `${product.category} ${product.id}`.toLocaleLowerCase("vi")
  let value: ProductPackage = {widthCm: 12, depthCm: 8, heightCm: 18, shape: "box"}
  if (/son|lip/.test(category)) value = {widthCm: 2, depthCm: 2, heightCm: 8.5, shape: "tube"}
  else if (/serum|ser-|nước hoa/.test(category)) value = {widthCm: 3.5, depthCm: 3.5, heightCm: 11, shape: "bottle"}
  else if (/kem|crm-/.test(category)) value = {widthCm: 6, depthCm: 6, heightCm: 5, shape: "jar"}
  else if (/sữa rửa|chăm sóc/.test(category)) value = {widthCm: 5, depthCm: 3, heightCm: 16, shape: "tube"}
  else if (/bỉm|tã|diap/.test(category)) value = {widthCm: 35, depthCm: 22, heightCm: 30, shape: "box"}
  else if (/sữa bột|milk/.test(category)) value = {widthCm: 13, depthCm: 13, heightCm: 18, shape: "jar"}
  return {value, estimated: true}
}

export function fitsCompartment(value: ProductPackage, rack: Rack) {
  return value.widthCm <= rack.width / rack.bins * 100 && value.depthCm <= rack.depth * 100 && value.heightCm <= rack.height / rack.levels * 100 - 5.5
}

export function packageGeometry(value: ProductPackage, rack: Rack, mode: ProductDisplay, siblings = 1) {
  const slotWidth = rack.width / rack.bins / Math.max(1, siblings)
  const scale = mode === "actual" ? .01 : Math.min(slotWidth * .72 / value.widthCm, rack.height / rack.levels * .65 / value.heightCm, rack.depth * .72 / value.depthCm)
  return {width: value.widthCm * scale, depth: value.depthCm * scale, height: value.heightCm * scale}
}
