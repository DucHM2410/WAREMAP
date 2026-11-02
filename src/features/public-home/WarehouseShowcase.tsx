import { MapPin, Search, Bell, Check } from "lucide-react"
import warehouseScreen from "../../assets/site-photos/waremap-warehouse-current.jpg"
import "./warehouse-showcase.css"

export function WarehouseShowcase({ notification = true }: { notification?: boolean }) {
  return <figure className="warehouse-showcase" aria-label="Minh họa tìm vị trí lô hàng trên WareMap">
    <header><span><i/> WAREMAP <b>Kho 3D</b></span><small>Dữ liệu minh họa</small></header>
    <div className="warehouse-showcase-search"><Search size={17}/><span>Tìm sản phẩm, mã lô…</span><span className="warehouse-showcase-key">↵</span></div>
    <div className="warehouse-showcase-map">
      <img src={warehouseScreen} alt="Kho 3D WareMap với các dãy kệ chia ô, khay phụ kiện và bàn soạn đơn" />
      <span className="warehouse-showcase-label">Kho trung tâm · Góc nhìn 3D</span>
    </div>
    <figcaption>
      <div className="warehouse-showcase-result"><span className="warehouse-showcase-pin"><MapPin size={21}/></span><div><small>VÍ DỤ KẾT QUẢ ĐỊNH VỊ</small><strong>Bình sữa cổ rộng</strong><p>Kệ A1 <span>→</span> Tầng 1 <span>→</span> Ô 01</p></div><Check size={18}/></div>
      {notification && <div className="warehouse-showcase-alert"><Bell size={16}/><span><strong>Cảnh báo lô cận hạn</strong><small>Minh họa thông báo Zalo OA cho người phụ trách</small></span></div>}
    </figcaption>
  </figure>
}
