import {
  AlertCircle,
  ArrowRight,
  Baby,
  Building2,
  ChevronDown,
  Clock3,
  Layers,
  MapPin,
  Package,
  Sparkles,
  Truck,
} from "lucide-react"
import { lazy, Suspense, useEffect } from "react"
import { useApp } from "../../app/store"
import { Badge, Button, LinkButton, Panel } from "../../app/ui"
import {
  branches,
  daysLeft,
  expiryLabel,
  locationLabel,
  transferDisplayId,
  type Product,
  type Rack,
} from "../../app/model"
import { useIndustry } from "../../shared/context/IndustryContext"

const MiniWarehouse3D = lazy(() =>
  import("../../shared/components/MiniWarehouse3D").then((module) => ({
    default: module.MiniWarehouse3D,
  })),
)

function MapSkeleton() {
  return (
    <div
      className="today-map__skeleton"
      role="status"
      aria-live="polite"
      aria-label="Đang tải bản đồ 3D"
    >
      <span className="today-map__skeleton-floor" aria-hidden="true" />
      <div className="today-map__skeleton-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className="today-map__skeleton-label">
        <span className="today-map__skeleton-dot" aria-hidden="true" />
        Đang tải bản đồ 3D…
      </span>
    </div>
  )
}

export default function Dashboard() {
  const { data, visibleProducts, branch, setBranch, go, setSelected, setScanTask, update, role } =
    useApp()
  const { config } = useIndustry()
  const IndustryIcon = config.icon === "Baby" ? Baby : Sparkles

  const alerts = visibleProducts
    .filter((p) => p.qty > 0 && daysLeft(p.expiry) <= data.settings.expiryDays)
    .sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry))
  const transfers = data.transfers.filter(
    (t) =>
      (branch === "all" || t.from === branch || t.to === branch) &&
      t.status !== "Hoàn tất",
  )
  const critical = alerts[0]
  const nextTransfer = transfers[0]
  const expired = alerts.filter((p) => daysLeft(p.expiry) < 0).length
  const inTransit = transfers.filter((t) => t.status === "Đang chuyển").length
  const skuCount = new Set(visibleProducts.map((p) => p.id)).size
  const totalQty = visibleProducts.reduce((sum, p) => sum + p.qty, 0)
  const branchLabel = branch === "all" ? "tất cả cơ sở" : branch
  const mapBranch = branch === "all" ? branches[0] : branch
  const mapRacks = data.racks[mapBranch] ?? []
  const mapAlerts = alerts.filter((p) => p.branch === mapBranch)
  useEffect(()=>{
    if(!["owner","manager"].includes(role))return
    update(current=>{
      const existing=current.racks[mapBranch]??[]
      if(!existing.length || existing.some(rack=>rack.id==="DEMO-SHOW-6"))return current
      const sources=current.products.filter(product=>product.branch===mapBranch&&product.id.startsWith("DEMO-")&&product.package3d)
      if(!sources.length)return current
      const additions:Rack[]=[]
      const items:Product[]=[]
      const names=config.id==="cosmetics"?["Serum & chăm sóc da","Son & trang điểm","Hộp mỹ phẩm","Phụ kiện làm đẹp","Tủ bảo quản mỹ phẩm","Bàn đóng đơn mỹ phẩm"]:["Bình sữa & phụ kiện","Chăm sóc bé","Đồ dùng mẹ & bé","Hàng soạn đơn","Tủ phụ kiện mẹ và bé","Bàn kiểm đếm"]
      const positions=[[-5,6],[-1.7,6],[1.7,6],[5,6],[-5,-4],[-1.7,-4],[1.7,-4],[5,-4]]
      for(let index=0;index<6;index++){
        if(existing.some(rack=>rack.id===`DEMO-SHOW-${index+1}`))continue
        const position=positions.find(([x,z])=>[...existing,...additions].every(rack=>Math.abs(x-rack.x)>(1.8+Math.hypot(rack.width,rack.depth))/2+.5 || Math.abs(z-rack.z)>(.7+Math.hypot(rack.width,rack.depth))/2+.5))
        if(!position)continue
        const rack:Rack={id:`DEMO-SHOW-${index+1}`,name:`[Mẫu] ${names[index]}`,kind:["Kệ khay nhựa","Kệ chia ô","Kệ V lỗ","Kệ ngăn nhỏ","Tủ bảo quản","Khu kiểm đếm"][index],x:position[0],z:position[1],width:1.8,depth:.7,height:index===5?.9:1.8,levels:index===5?1:3,bins:3,rotation:0}
        additions.push(rack)
        for(let slot=0;slot<3;slot++){
          const source=sources[(index*3+slot)%sources.length],pack=source.package3d!
          const capacity=Math.floor(rack.width/rack.bins*100/pack.widthCm)*Math.floor(rack.depth*100/pack.depthCm)
          if(capacity<1||pack.heightCm>rack.height/rack.levels*100-5.5)continue
          const id=`DEMO-SHOW-${config.id}-${index+1}-${slot+1}`
          if(current.products.some(product=>product.id===id&&product.branch===mapBranch))continue
          items.push({...source,id,batch:`LOT-${id}`,rack:rack.id,level:index===5?1:slot+1,bin:slot+1,qty:Math.min(12,capacity),storage3d:{layers:1,stackable:false}})
        }
      }
      if(!additions.length)return current
      return {...current,racks:{...current.racks,[mapBranch]:[...existing,...additions]},products:[...current.products,...items]}
    })
  },[mapBranch,role,config.id])
  const alertRacks = Array.from(new Set(mapAlerts.map((p) => p.rack)))
  const todayLabel = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  })

  const showProduct = (id: string, b: string) => {
    setSelected(id)
    setBranch(b)
    go("warehouse")
  }

  return (
    <>
      <section className="today-hero">
        <style>{`.today-map{grid-template-columns:minmax(0,3fr) minmax(220px,1fr)}.today-map .today-map__canvas{height:460px;min-height:460px}.today-role-context{display:inline-flex;padding:6px 10px;border-radius:20px;background:var(--industry-soft);color:var(--industry-primary);font-size:12px;margin-bottom:12px}@media(max-width:800px){.today-map{grid-template-columns:1fr}.today-map .today-map__canvas{height:330px;min-height:330px}}`}</style>
        <div className="today-hero__copy">
          <span className="today-role-context">Chế độ xem: {{owner:"Chủ doanh nghiệp",manager:"Quản lý kho",warehouse:"Nhân viên kho",sales:"Nhân viên bán hàng",platform:"Admin hệ thống"}[role]}</span>
          <div className="today-hero__meta">
            <span className="today-hero__industry">
              <IndustryIcon size={14} />
              {config.label}
            </span>
            <span>{todayLabel}</span>
          </div>
          <span className="eyebrow">Hôm nay bạn cần chú ý</span>
          {critical ? (
            <>
              <h1>{critical.name}</h1>
              <p>Kệ {critical.rack} chứa {critical.qty} sản phẩm {critical.name} {daysLeft(critical.expiry) < 0 ? "đã hết hạn" : "sắp hết hạn"}. Cần kiểm tra.</p>
              <p className="today-hero__line">
                <AlertCircle size={18} />
                <strong>{expiryLabel(critical.expiry)}</strong>
                <span>
                  · còn {critical.qty} sản phẩm · {critical.branch}
                </span>
              </p>
              <p className="today-hero__loc">
                <MapPin size={15} />
                {locationLabel(critical)}
              </p>
              <div className="today-hero__actions">
                <Button
                  onClick={() => showProduct(critical.id, critical.branch)}
                >
                  {role === "sales" ? `Xem sản phẩm tại Kệ ${critical.rack}` : `Đi đến Kệ ${critical.rack} để xử lý lô hàng`}
                  <ArrowRight size={15} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => go("onboarding")}
                >
                  Xem tất cả cảnh báo
                </Button>
              </div>
            </>
          ) : nextTransfer && role !== "sales" ? (
            <>
              <h1>Phiếu {transferDisplayId(nextTransfer)} đang chờ xử lý</h1>
              <p className="today-hero__line">
                <Truck size={18} />
                <strong>{nextTransfer.status}</strong>
                <span>
                  · {nextTransfer.from} → {nextTransfer.to}
                </span>
              </p>
              <p className="today-hero__loc">
                <Package size={15} />
                {nextTransfer.qty} sản phẩm · lô {nextTransfer.batch}
              </p>
              <div className="today-hero__actions">
                <Button onClick={() => go("mobile")}>
                  Kiểm tra phiếu
                  <ArrowRight size={15} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => go("batches")}
                >
                  Xem lô hàng
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1>Hôm nay chưa có việc gấp</h1>
              <p className="today-hero__calm">
                Không có lô nào cận hạn trong {data.settings.expiryDays} ngày
                tới và không có phiếu chuyển nào đang chờ tại {branchLabel}.
              </p>
              <div className="today-hero__actions">
                <Button onClick={() => go("inventory")}>
                  Kiểm tra tồn kho
                  <ArrowRight size={15} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => go("warehouse")}
                >
                  Mở bản đồ kho
                </Button>
              </div>
            </>
          )}
        </div>
        <aside className="today-hero__aside">
          <span className="today-hero__aside-label">
            Danh mục của ngành {config.shortLabel}
          </span>
          <div className="today-hero__chips">
            {config.sampleCategories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>
          <p>{config.heroTagline}</p>
        </aside>
      </section>

      <div className="today-kpis">
        <button
          type="button"
          className="today-kpi"
          onClick={() => go("inventory")}
        >
          <span className="today-kpi__icon">
            <Package size={19} />
          </span>
          <span className="today-kpi__label">Mặt hàng</span>
          <strong>{skuCount}</strong>
          <small>
            {totalQty} sản phẩm · {branchLabel}
          </small>
        </button>
        <button
          type="button"
          className="today-kpi"
          onClick={() => go("onboarding")}
        >
          <span className="today-kpi__icon">
            <AlertCircle size={19} />
          </span>
          <span className="today-kpi__label">Lô cận hạn</span>
          <strong>{alerts.length}</strong>
          <small>
            {expired
              ? `${expired} lô đã hết hạn`
              : `Trong ${data.settings.expiryDays} ngày tới`}
          </small>
        </button>
        {role !== "sales" && (<button
          type="button"
          className="today-kpi"
          onClick={() => go("mobile")}
        >
          <span className="today-kpi__icon">
            <Truck size={19} />
          </span>
          <span className="today-kpi__label">Phiếu chuyển</span>
          <strong>{transfers.length}</strong>
          <small>{inTransit} phiếu đang chuyển</small>
        </button>)}
      </div>

      <Panel
        className="today-map-panel"
        title="Bản đồ kho thu nhỏ"
        action={
          <Button variant="ghost" onClick={() => go("warehouse")}>
            Mở bản đồ
            <ArrowRight size={15} />
          </Button>
        }
      >
        <div className="today-map">
          <div className="today-map__canvas">
            <Suspense fallback={<MapSkeleton />}>
              <MiniWarehouse3D racks={mapRacks} alertRacks={alertRacks} products={data.products.filter(product=>product.branch===mapBranch)} onRackSelect={rack=>{
                const item=data.products.find(product=>product.branch===mapBranch&&product.rack===rack.id&&product.qty>0)
                setBranch(mapBranch)
                if(item){setSelected(item.id);setScanTask({mode:"lookup",productKey:[item.id,item.batch,item.branch].join("|")})}
                go("warehouse")
              }}/>
            </Suspense>
            <span className="today-map__hint">
              Kéo để xoay · Bấm kệ để mở kho 3D · Chấm đỏ: cần kiểm tra
            </span>
          </div>
          <aside className="today-map__side">
            <Badge tone="info">{mapBranch}</Badge>
            <strong>{mapRacks.length} kệ · {data.products.filter(product=>product.branch===mapBranch&&product.qty>0).length} lô đang lưu</strong>
            <p className="tiny">Kệ DEMO-SHOW và hàng [Mẫu] phục vụ trình diễn, được lưu trong dữ liệu demo trên trình duyệt này.</p>
            <strong>
              {alertRacks.length
                ? `${alertRacks.length} kệ cần chú ý`
                : "Không có kệ cần chú ý"}
            </strong>
            <p>
              {mapAlerts.length} lô cận hạn trong {data.settings.expiryDays}{" "}
              ngày tới.
            </p>
            <span className="today-map__racks-caption">
              Khu vực gợi ý
            </span>
            <div className="today-map__racks" aria-label="Khu vực gợi ý">
              {config.sampleRacks.map((rack) => (
                <span key={rack}>{rack}</span>
              ))}
            </div>
            {critical ? (
              <Button
                variant="secondary"
                onClick={() => showProduct(critical.id, critical.branch)}
              >
                Tìm hàng nhanh
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => go("warehouse")}>
                Mở bản đồ kho
              </Button>
            )}
          </aside>
        </div>
      </Panel>

      <details className="today-more">
        <summary>
          <span className="today-more__title">
            <Layers size={17} />
            Xem thêm: bảng công việc &amp; nhật ký
          </span>
          <span className="today-more__count">
            {alerts.length + transfers.length} mục
          </span>
          <ChevronDown size={18} className="today-more__chevron" />
        </summary>
        <div className="today-more__body">
          <div className="today-board">
            <section className="today-column">
              <header>
                <span className="dot" />
                <strong>Lô cận hạn</strong>
                <Badge tone={alerts.length ? "warning" : "success"}>
                  {alerts.length}
                </Badge>
              </header>
              {alerts.length ? (
                alerts.slice(0, 3).map((p) => (
                  <div className="today-column__item" key={`${p.id}-${p.branch}`}>
                    <div className="today-column__copy">
                      <strong>{p.name}</strong>
                      <p>
                        {expiryLabel(p.expiry)} · {p.qty} sản phẩm
                      </p>
                      <p className="tiny muted">
                        {p.branch} · {locationLabel(p)}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => showProduct(p.id, p.branch)}
                    >
                      Vị trí
                    </Button>
                  </div>
                ))
              ) : (
                <p className="tiny muted">Không có lô cận hạn.</p>
              )}
              <LinkButton to="onboarding">Xem tất cả</LinkButton>
            </section>

            {role !== "sales" && (<section className="today-column">
              <header>
                <span className="dot info" />
                <strong>Phiếu chuyển</strong>
                <Badge tone={transfers.length ? "warning" : "success"}>
                  {transfers.length}
                </Badge>
              </header>
              {transfers.length ? (
                transfers.slice(0, 3).map((t) => (
                  <div className="today-column__item" key={t.id}>
                    <div className="today-column__copy">
                      <strong>
                        {t.id} · {t.status}
                      </strong>
                      <p>
                        {t.from} → {t.to}
                      </p>
                      <p className="tiny muted">
                        {t.qty} sản phẩm · lô {t.batch}
                      </p>
                    </div>
                    <Button variant="secondary" onClick={() => go("mobile")}>
                      Kiểm tra
                    </Button>
                  </div>
                ))
              ) : (
                <p className="tiny muted">Không có phiếu chuyển đang chờ.</p>
              )}
              <LinkButton to="mobile">Mở chuyển kho</LinkButton>
            </section>)}
          </div>

          <div className="split">
            <Panel
              title="Hoạt động gần đây"
              action={<Clock3 size={17} color="#8195a3" />}
            >
              {data.activities.length ? (
                <div className="action-list">
                  {data.activities.slice(0, 4).map((a) => (
                    <div key={a.id}>
                      <span className="avatar">
                        <Clock3 size={16} />
                      </span>
                      <div className="action-copy">
                        <strong>{a.title}</strong>
                        <p>{a.detail}</p>
                      </div>
                      <small className="muted">
                        {new Date(a.time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel-body">
                  <p className="tiny">
                    Thao tác nhập hàng, chuyển kho và chỉnh sơ đồ sẽ được ghi
                    lại tại đây.
                  </p>
                </div>
              )}
            </Panel>

            <Panel
              title={branch === "all" ? "Các cơ sở của bạn" : "Kho đang xem"}
            >
              {(branch === "all" ? branches : [branch]).map((b) => {
                const n = data.products.filter(
                  (p) =>
                    p.branch === b &&
                    p.qty > 0 &&
                    daysLeft(p.expiry) <= data.settings.expiryDays,
                ).length
                return (
                  <div className="branch-card" key={b}>
                    <Building2 size={21} color="#7497a7" />
                    <div>
                      <strong className="tiny">{b}</strong>
                      <p>
                        {data.products
                          .filter((p) => p.branch === b)
                          .reduce((a, p) => a + p.qty, 0)}{" "}
                        sản phẩm
                      </p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={`Xem ${b}`}
                      onClick={() => {
                        setBranch(b)
                        go("warehouse")
                      }}
                    >
                      <Badge tone={n ? "warning" : "success"}>
                        {n ? `${n} cần chú ý` : "Ổn định"}
                      </Badge>
                    </button>
                  </div>
                )
              })}
            </Panel>
          </div>
        </div>
      </details>
    </>
  )
}
