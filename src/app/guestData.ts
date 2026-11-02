import type { DemoData, Product, Rack } from "./model"

// Always pass a fresh seed, never a user's saved inventory.
export function guestData(sample: DemoData, branch: string): DemoData {
  const cosmetics = sample.industry === "cosmetics"
  const kinds = cosmetics ? ["Kệ ngăn nhỏ","Kệ khay nhựa","Kệ chia ô","Tủ bảo quản"] : ["Kệ V lỗ","Kệ trung tải","Kệ chia ô","Kệ khay nhựa"]
  const names = cosmetics ? ["Mỹ phẩm nhỏ & serum","Khay chăm sóc da","Hộp mỹ phẩm chia ô","Tủ phụ kiện"] : ["Sữa & bình sữa","Bỉm & chăm sóc bé","Hộp đồ dùng mẹ và bé","Khay phụ kiện nhỏ"]
  // Change only the guest presentation; retain dimensions and occupied locations.
  const racks = (sample.racks[branch] || []).map((rack,index)=>({...rack,kind:kinds[index%kinds.length],name:`${rack.id} · ${names[index%names.length]}`}))
  const products = sample.products.filter(product => product.branch === branch).slice(0,16)
  const extras: Product[] = []
  if (sample.industry && racks.length === 4 && racks.every(rack=>Number.isFinite(rack.width))) {
    // A guest-only showroom: 3 rows, clear aisles, no changes to saved warehouse layouts.
    const positions=[[-4,-3],[0,-3],[4,-3],[-4,1]]
    racks.forEach((rack,index)=>{rack.x=positions[index][0];rack.z=positions[index][1]})
    const extraNames=cosmetics?["Chăm sóc da","Son & trang điểm","Nước hoa mini","Bàn soạn đơn"]:["Bình sữa & phụ kiện","Chăm sóc bé","Đồ dùng cho mẹ","Bàn soạn đơn"]
    const extraRacks: Rack[] = [
      {id:"B2",name:`B2 · ${extraNames[0]}`,kind:"Kệ khay nhựa",x:0,z:1,width:1.8,depth:.7,height:1.8,levels:3,bins:3,rotation:0},
      {id:"B3",name:`B3 · ${extraNames[1]}`,kind:"Kệ chia ô",x:4,z:1,width:1.8,depth:.7,height:1.6,levels:3,bins:3,rotation:0},
      {id:"C1",name:`C1 · ${extraNames[2]}`,kind:cosmetics?"Kệ ngăn nhỏ":"Kệ V lỗ",x:-2,z:5,width:1.8,depth:.7,height:1.8,levels:3,bins:3,rotation:0},
      {id:"C2",name:`C2 · ${extraNames[3]}`,kind:"Khu kiểm đếm",x:2,z:5,width:2,depth:1,height:.9,levels:1,bins:2,rotation:0},
    ]
    const sources=sample.products.filter(product=>product.branch===branch&&product.id.startsWith("DEMO-")&&product.package3d)
    extraRacks.forEach((rack,index)=>{
      for(let slot=0;slot<(index===3?2:3);slot++){
        const source=sources[(index*3+slot)%Math.max(1,sources.length)]
        if(!source?.package3d)continue
        const pack=source.package3d
        const capacity=Math.floor(rack.width/rack.bins*100/pack.widthCm)*Math.floor(rack.depth*100/pack.depthCm)
        if(capacity<1||pack.heightCm>rack.height/rack.levels*100-5.5)continue
        const id=`SHOWCASE-${cosmetics?"COS":"BABY"}-${index+1}-${slot+1}`
        extras.push({...source,id,batch:`LOT-${id}`,rack:rack.id,level:index===3?1:slot+1,bin:index===3?slot+1:slot%rack.bins+1,qty:Math.min(12,capacity),storage3d:{layers:1,stackable:false}})
      }
    })
    racks.push(...extraRacks)
  }
  return {
    ...sample,
    products: [...products,...extras].slice(0,32),
    racks: { [branch]: racks },
    inboundCartons: [],
    requests: [],
    activities: [],
    staff: [],
    transfers: [],
    locations: 1,
  }
}
