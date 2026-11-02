import type { DemoData } from "./model"

// Always pass a fresh seed, never a user's saved inventory.
export function guestData(sample: DemoData, branch: string): DemoData {
  const cosmetics = sample.industry === "cosmetics"
  const kinds = cosmetics ? ["Kệ ngăn nhỏ","Kệ khay nhựa","Kệ chia ô","Tủ bảo quản"] : ["Kệ V lỗ","Kệ trung tải","Kệ chia ô","Kệ khay nhựa"]
  const names = cosmetics ? ["Mỹ phẩm nhỏ & serum","Khay chăm sóc da","Hộp mỹ phẩm chia ô","Tủ phụ kiện"] : ["Sữa & bình sữa","Bỉm & chăm sóc bé","Hộp đồ dùng mẹ và bé","Khay phụ kiện nhỏ"]
  // Change only the guest presentation; retain dimensions and occupied locations.
  const racks = (sample.racks[branch] || []).map((rack,index)=>({...rack,kind:kinds[index%kinds.length],name:`${rack.id} · ${names[index%names.length]}`}))
  return {
    ...sample,
    products: sample.products.filter(product => product.branch === branch).slice(0, 16),
    racks: { [branch]: racks },
    inboundCartons: [],
    requests: [],
    activities: [],
    staff: [],
    transfers: [],
    locations: 1,
  }
}
