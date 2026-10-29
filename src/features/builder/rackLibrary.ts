import type { Rack } from "../../app/model"

export const RACK_TEMPLATES = [
  { id: "micro", name: "Kệ ngăn mỹ phẩm", description: "Son, serum và hàng rất nhỏ", kind: "Kệ ngăn nhỏ", width: 1.2, depth: .4, height: 1.6, levels: 5, bins: 6 },
  { id: "tray", name: "Khay chia ngăn", description: "Khay thấp cho phụ kiện nhỏ", kind: "Khay chia ngăn", width: .8, depth: .3, height: .2, levels: 1, bins: 8 },
  { id: "drawers", name: "Tủ nhiều ngăn nhỏ", description: "Núm ti, phụ kiện và đồ chăm sóc", kind: "Kệ ngăn nhỏ", width: 1.2, depth: .45, height: 1.8, levels: 6, bins: 10 },
  { id: "medium", name: "Kệ hàng mẹ & bé", description: "Sữa, bỉm và hộp cỡ vừa", kind: "Kệ hàng", width: 1.8, depth: .8, height: 2, levels: 3, bins: 2 },
  {
    id: "shelf",
    name: "Kệ tiêu chuẩn",
    description: "Hàng hộp, chai và đồ dùng",
    kind: "Kệ hàng",
    width: 2,
    depth: 1,
    height: 2.4,
    levels: 3,
    bins: 3,
  },
  {
    id: "pallet",
    name: "Kệ pallet",
    description: "Kiện lớn và hàng nặng",
    kind: "Kệ pallet",
    width: 3,
    depth: 1.4,
    height: 3.6,
    levels: 3,
    bins: 2,
  },
  {
    id: "cubicles",
    name: "Kệ chia ô",
    description: "Nhiều ô cho hàng nhỏ",
    kind: "Kệ chia ô",
    width: 2,
    depth: 0.7,
    height: 2,
    levels: 4,
    bins: 4,
  },
  {
    id: "cabinet",
    name: "Tủ bảo quản",
    description: "Khoang kín, có vách ngăn",
    kind: "Tủ bảo quản",
    width: 1.6,
    depth: 0.8,
    height: 2.2,
    levels: 4,
    bins: 2,
  },
  {
    id: "stack",
    name: "Ô xếp hàng",
    description: "Thùng xếp trên bục thấp",
    kind: "Ô xếp hàng",
    width: 2.4,
    depth: 1.8,
    height: 1.2,
    levels: 2,
    bins: 2,
  },
  {
    id: "packing",
    name: "Bàn kiểm đếm",
    description: "Bàn thao tác và tầng dưới",
    kind: "Khu kiểm đếm",
    width: 2,
    depth: 1.2,
    height: 0.9,
    levels: 1,
    bins: 2,
  },
] as const

export function fitToFloor(
  x: number,
  z: number,
  width: number,
  depth: number,
  rotation = 0,
) {
  const angle = (rotation * Math.PI) / 180
  const halfX =
    (Math.abs(Math.cos(angle)) * width + Math.abs(Math.sin(angle)) * depth) / 2
  const halfZ =
    (Math.abs(Math.sin(angle)) * width + Math.abs(Math.cos(angle)) * depth) / 2
  const step = Math.max(width, depth) <= 1 ? .1 : .5
  const snap = (n: number) => Number((Math.round(n / step) * step).toFixed(3))
  return {
    x: Math.max(-8 + halfX, Math.min(8 - halfX, snap(x))),
    z: Math.max(-6 + halfZ, Math.min(8 - halfZ, snap(z))),
  }
}

export function createRack(
  templateId: string,
  existing: Rack[],
  position?: { x: number
 z: number },
): Rack | null {
  const template = RACK_TEMPLATES.find((t) => t.id === templateId)
  if (!template) return null
  const number =
    Math.max(0, ...existing.map((r) => Number(r.id.replace(/\D/g, "")) || 0)) +
    1
  const id = `K${number}`
  const { id: _, name, description: __, ...dimensions } = template
  const location = fitToFloor(
    position?.x ?? ((existing.length % 4) - 1.5) * 3,
    position?.z ?? 5,
    template.width,
    template.depth,
  )
  return { ...dimensions, id, name: `${name} ${id}`, rotation: 0, ...location }
}
