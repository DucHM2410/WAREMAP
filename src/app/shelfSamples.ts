import type { IndustryConfig } from "../shared/config/industries"
import type { DemoData, Product, ProductPackage, Rack } from "./model"
import { slotLayout } from "../features/builder/slotLayout"

type Sample = [string, string, ProductPackage["shape"], number, number, number]
const definitions: Record<IndustryConfig["id"], Sample[]> = {
  "mom-baby": [
    ["Bình sữa cổ rộng", "Bình 150 ml", "bottle", 6, 6, 16],
    ["Khăn ướt cho bé", "Gói 80 tờ", "box", 18, 10, 6],
    ["Kem dưỡng da em bé", "Tuýp 50 ml", "tube", 4, 3, 12],
    ["Bánh ăn dặm", "Hộp 100 g", "box", 12, 8, 16],
    ["Sữa tắm cho bé", "Chai 250 ml", "bottle", 6, 5, 18],
    ["Núm ti silicone", "Hộp 2 chiếc", "box", 8, 5, 10],
    ["Bỉm quần cỡ S", "Gói 24 miếng", "box", 28, 18, 22],
    ["Kem chăm sóc da cho mẹ", "Hũ 50 ml", "jar", 6, 6, 5],
    ["Hộp thìa ăn dặm", "Hộp 2 chiếc", "box", 5, 4, 12],
    ["Dầu dưỡng cho bé", "Chai 30 ml", "bottle", 4, 4, 10],
    ["Hộp khăn mềm", "Hộp mẫu", "box", 24, 20, 8],
    ["Hộp bông cotton", "Hộp mẫu", "box", 12, 10, 6],
    ["Hộp túi trữ sữa", "Hộp mẫu", "box", 24, 20, 8],
    ["Hộp đồ dùng vệ sinh", "Hộp mẫu", "box", 12, 10, 8],
  ],
  cosmetics: [
    ["Son dưỡng mini", "Thỏi 3 g", "tube", 2, 2, 8],
    ["Serum cấp ẩm", "Chai 30 ml", "bottle", 4, 4, 11],
    ["Kem chống nắng", "Tuýp 50 ml", "tube", 5, 3, 13],
    ["Kem dưỡng ban đêm", "Hũ 50 ml", "jar", 6, 6, 5],
    ["Nước tẩy trang", "Chai 250 ml", "bottle", 6, 5, 18],
    ["Phấn phủ mini", "Hộp 8 g", "box", 7, 7, 3],
    ["Mặt nạ dưỡng da", "Hộp 5 miếng", "box", 16, 4, 20],
    ["Nước hoa mini", "Chai 10 ml", "bottle", 3, 3, 8],
    ["Son tint mini", "Tuýp 3 ml", "tube", 2, 2, 8],
    ["Kem mắt mini", "Hũ 15 ml", "jar", 4, 4, 4],
    ["Hộp bộ dưỡng da", "Hộp mẫu", "box", 24, 20, 8],
    ["Hộp mặt nạ mini", "Hộp mẫu", "box", 12, 10, 6],
    ["Hộp bộ trang điểm", "Hộp mẫu", "box", 24, 20, 8],
    ["Hộp cọ trang điểm", "Hộp mẫu", "box", 12, 10, 8],
  ],
}
export const shelfSampleIds = Object.keys(definitions).flatMap(kind => definitions[kind as IndustryConfig["id"]].map((_, i) => `DEMO-${kind === "cosmetics" ? "COS" : "BABY"}-${i + 1}`))

/** Fictional demo packages. Extra shared-slot examples only join other demo stock. */
export function shelfSamples(config: IndustryConfig, branch: string, racks: Rack[], existing: Product[] = []): Product[] {
  const occupied = new Set(existing.filter(p => p.branch === branch && p.qty > 0).map(p => `${p.rack}|${p.level}|${p.bin}`))
  const generated: Product[] = []
  return definitions[config.id].flatMap(([name, variant, shape, widthCm, depthCm, heightCm], index) => {
    const shared = index >= 8
    const scenario=index>=10
    const rack = racks[scenario?2:shared ? index - 8 : Math.floor(index / 2)]
    if (!rack) return []
    const level = shared || index % 2 === 0 ? 1 : Math.min(3, rack.levels)
    const bin = scenario?Math.min(3,rack.bins):shared || index % 2 === 0 ? 1 : Math.min(3, rack.bins)
    const id = `DEMO-${config.id === "cosmetics" ? "COS" : "BABY"}-${index + 1}`
    if ((!shared && occupied.has(`${rack.id}|${level}|${bin}`)) || existing.some(p => p.branch === branch && p.id === id) || widthCm > rack.width / rack.bins * 100 || depthCm > rack.depth * 100 || heightCm > rack.height / rack.levels * 100 - 5.5) return []
    occupied.add(`${rack.id}|${level}|${bin}`)
    const product:Product = { id, name: `[Mẫu] ${name}`, variant, category: config.id === "cosmetics" ? "Mỹ phẩm mẫu" : "Đồ dùng mẹ & bé mẫu", batch: `LOT-${id}-01`, expiry: "2028-12-31", qty: Math.min(8 + index * 3, Math.floor(rack.width / rack.bins * 100 / widthCm) * Math.floor(rack.depth * 100 / depthCm)), branch, rack: rack.id, level, bin, package3d: {shape,widthCm,depthCm,heightCm} }
    if(scenario){
      product.qty=1
      const supportId=`DEMO-${config.id === "cosmetics" ? "COS" : "BABY"}-11`
      product.storage3d={layers:1,stackable:index===10||index===11,placement:{xCm:index===11?6:index===13?40:0,zCm:index===11?5:index===12?60:0,...(index===11?{onTopOf:`${supportId}|LOT-${supportId}-01|${branch}`}:{})}}
    }
    if(shared){
      const others=[...existing,...generated].filter(p=>p.branch===branch&&p.rack===rack.id&&p.level===level&&p.bin===bin&&p.qty>0)
      const layout=slotLayout(rack,[...others,product])
      if(others.some(p=>!p.id.startsWith("DEMO-"))||layout.uncertain||!layout.fits)return []
    }
    generated.push(product)
    return [product]
  })
}

export function withShelfSamples(data: DemoData, config: IndustryConfig): DemoData {
  if (data.shelfSamplesVersion === 3) return data
  const additions = Object.entries(data.racks).flatMap(([branch, racks]) => shelfSamples(config, branch, racks, data.products))
  return { ...data, shelfSamplesVersion: 3, products: [...data.products, ...additions] }
}

