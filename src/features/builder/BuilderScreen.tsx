import {
  Component,
  useCallback,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Canvas } from "@react-three/fiber"
import { Grid, OrbitControls } from "@react-three/drei"
import { WarehouseRack } from "./WarehouseRack"
import { RACK_TEMPLATES, createRack, fitToFloor } from "./rackLibrary"
import { CanvasPlacement, type PlacementProjector } from "./CanvasPlacement"
import { WarehouseLocations } from "./WarehouseLocations"
import { RackInspector } from "./RackInspector"
import { SlotContents } from "./SlotContents"
import { ProductPlacementEditor } from "./ProductPlacementEditor"
import { UnitSelectionPanel } from "./UnitSelectionPanel"
import { productUnits } from "./productUnits"
import { ProductLocator, type LocateRequest } from "./ProductLocator"
import { searchWarehouseProducts } from "./warehouseSearch"
import { WAREHOUSE_PERMISSIONS } from "../../app/warehousePermissions"
import { ProductSizingPanel } from "./ProductSizingPanel"
import type { ProductDisplay } from "./productSizing"
import { fitsCompartment, storagePackageFor } from "./productSizing"
import "./builder.css"
import { productKey, ExpiryBadge } from "../../app/catalog"
import { QRLabels } from "../../app/labels"
import QRCode from "qrcode"
import { useIndustry } from "../../shared/context/IndustryContext"
import { MousePointer2, Move, QrCode } from "lucide-react"
import {
  ArrowLeft,
  Box,
  Eye,
  Grid2X2,
  MapPin,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Undo2,
  X,
} from "lucide-react"
import { useApp } from "../../app/store"
import {
  branches,
  daysLeft,
  initialRacks,
  locationLabel,
  positionCode,
  type Rack,
  type Product,
} from "../../app/model"
import {
  Badge,
  Button,
  Empty,
  Modal,
  PageTitle,
  Panel,
  SearchInput,
} from "../../app/ui"
class SceneBoundary extends Component<{
  children: ReactNode
  fallback: ReactNode
}, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
export default function Warehouse() {
  const {
    data,
    update,
    screen,
    go,
    branch,
    setBranch,
    accessibleBranches,
    selected,
    setSelected,
    visibleProducts,
    search,
    setSearch,
    log,
    notify,
    role,
    accessMode,
    guardNavigation,
    setScanTask,
    scanTask,
  } = useApp()
  const { config } = useIndustry()
  const [allTemplates,setAllTemplates] = useState(false)
  const [tool, setTool] = useState<"select" | "move" | "rotate">("select")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedUnit,setSelectedUnit]=useState(0)
  const [wholeLot,setWholeLot]=useState(false)
  const [displayMode,setDisplayMode] = useState<ProductDisplay>("readable")
  const [focusedRack,setFocusedRack] = useState<string | null>(null)
  const [locateRequest, setLocateRequest] = useState<LocateRequest | null>(null)
  const locateSequence = useRef(0)
  const mapStage = useRef<HTMLDivElement>(null)
  const [showQR, setShowQR] = useState(false)
  const [draggingTemplate, setDraggingTemplate] = useState("")
  const placement = useRef<PlacementProjector | null>(null)
  const editing = screen === "builder"
  const warehouse = branch === "all" ? branches[0] : branch
  const [draft, setDraft] = useState<Rack[]>(data.racks[warehouse] || []),
    [history, setHistory] = useState<Rack[][]>([]),
    [chosen, setChosen] = useState(""),
    [view, setView] = useState<"3d" | "plan">("3d"),
    [layer, setLayer] = useState("Vị trí hàng"),
    [help, setHelp] = useState(false),
    [leave, setLeave] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState(""),
    [cameraKey, setCameraKey] = useState(0)
  const controls = useRef<any>(null),
    drag = useRef<{ id: string; left: number; top: number; moved?: boolean } | null>(null)
  const onDragging = useCallback((dragging: boolean) => {
    if (controls.current) controls.current.enabled = !dragging
  }, [])
  useEffect(() => {
    setDraft(data.racks[warehouse] || [])
    setHistory([])
    setChosen("")
    setSelectedBatch(scanTask.productKey?.split("|")[0] === selected && scanTask.productKey?.split("|")[2] === warehouse ? scanTask.productKey.split("|")[1] : "")
    setSaved(false)
  }, [warehouse])
  const persisted = data.racks[warehouse] || [],
    racks = editing ? draft : persisted
  const product = data.products.find(
    (p) => p.id === selected && p.branch === warehouse && (!selectedBatch || p.batch === selectedBatch),
  )
  const activeId = editing ? chosen : product?.rack || chosen
  const rack = racks.find((r) => r.id === activeId)
  const displayedUnits=product&&rack?productUnits(product,rack,displayMode,data.products.filter(p=>p.branch===warehouse&&p.rack===product.rack&&p.level===product.level&&p.bin===product.bin&&p.qty>0)):[]
  const unitIndex=displayedUnits.some(unit=>unit.index===selectedUnit)?selectedUnit:displayedUnits[0]?.index||0
  useEffect(() => {
    setFocusedRack(current => current === activeId && view === "3d" ? current : null)
  }, [warehouse, activeId, view])
  const chooseProduct = (p: Product, index=0) => {
    if (editing) { setChosen(p.rack); return }
    locateProduct(p,index)
  }
  const locateProduct = (p: Product, index=0, lot=false) => {
    const destination = data.racks[p.branch]?.find(item => item.id === p.rack)
    if (!destination || p.level < 1 || p.level > destination.levels || p.bin < 1 || p.bin > destination.bins) {
      notify("Vị trí lưu trữ chưa có trên sơ đồ kho. Cần cập nhật vị trí trước khi định vị.")
      return
    }
    setScanTask({ mode: "lookup", productKey: productKey(p) })
    setBranch(p.branch)
    setSelected(p.id)
    setSelectedBatch(p.batch)
    setSelectedUnit(index)
    setWholeLot(lot)
    setChosen(p.rack)
    setView("3d")
    setFocusedRack(p.rack)
    setLocateRequest({ id: ++locateSequence.current, product: p,unitIndex:lot?undefined:index })
    requestAnimationFrame(() => mapStage.current?.scrollIntoView({ block: "start", behavior: "auto" }))
  }
  useEffect(() => {
    if (locateRequest && locateRequest.product.branch !== warehouse) setLocateRequest(null)
  }, [warehouse])
  const dirty = editing && JSON.stringify(draft) !== JSON.stringify(persisted)
  useEffect(() => {
    guardNavigation(
      dirty
        ? () =>
            window.confirm(
              "Sơ đồ có thay đổi chưa lưu. Bỏ thay đổi và rời màn hình?",
            )
        : null,
    )
    return () => guardNavigation(null)
  }, [dirty])
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])
  const mutate = (next: Rack[]) => {
    setHistory((h) => [...h, draft].slice(-30))
    setDraft(next)
    setSaved(false)
    setError("")
  }
  const patchRack = (patch: Partial<Rack>) => {
    if (!rack) return
    const next = {...rack,...patch}
    if (data.products.some(p => p.branch === warehouse && p.rack === rack.id && p.qty > 0 && (p.level > next.levels || p.bin > next.bins))) {
      setError("Không thể bỏ tầng/ô đang có hàng. Chuyển hàng sang vị trí khác trước.")
      return
    }
    if (data.products.some(p => {
      if(p.branch !== warehouse || p.rack !== rack.id || p.qty <= 0)return false
      const pack=storagePackageFor(p)
      return !pack.estimated && (!fitsCompartment(pack.value,next) || pack.value.heightCm*(p.storage3d?.stackable?p.storage3d.layers:1)>next.height/next.levels*100-5.5)
    })) {setError("Kích thước mới không đủ cho bao bì / số lớp đang lưu. Chuyển hàng hoặc chọn kệ lớn hơn trước.");return}
    const position = fitToFloor(next.x,next.z,next.width,next.depth,next.rotation)
    mutate(draft.map(item => item.id === rack.id ? {...next,...position} : item))
  }
  const add = (templateId = "shelf", position?: {x: number; z: number}) => {
    if (!editing || accessMode !== "authenticated" || !accessibleBranches.includes(warehouse)) return
    const next = createRack(templateId, draft, position)
    if (!next) return
    mutate([...draft, next])
    setChosen(next.id)
    setTool("move")
    notify(`${next.name} đã được thêm. Kéo kệ để bố trí, rồi lưu sơ đồ.`)
  }
  const dropTemplate = (event: React.DragEvent<HTMLDivElement>) => {
    if (!editing) return
    const templateId = event.dataTransfer.getData("application/waremap-rack")
    if (!RACK_TEMPLATES.some(t => t.id === templateId)) return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const position = view === "3d" && racks.length ? placement.current?.(event.clientX, event.clientY) : null
    add(templateId, position ?? {x: (event.clientX - rect.left) / rect.width * 16 - 8, z: (event.clientY - rect.top) / rect.height * 14 - 6})
    setDraggingTemplate("")
  }
  const matches = searchWarehouseProducts(visibleProducts, search)
  const rackColor = (id: string) => {
    if (layer === "Hạn dùng") {
      const items = data.products.filter(
        (p) => p.branch === warehouse && p.rack === id,
      )
      return items.some((p) => daysLeft(p.expiry) < 0)
        ? "#d47279"
        : items.some((p) => daysLeft(p.expiry) <= data.settings.expiryDays)
          ? "#e3b268"
          : "#84b7a2"
    }
    return id === activeId ? config.primaryColor : "#b2c7cc"
  }
  const plan = (
    <div
      className="rack-plan"
      onPointerMove={(e) => {
        if (!editing || !drag.current) return
        if (!drag.current.moved) {
          if (Math.abs(e.clientX - drag.current.left) + Math.abs(e.clientY - drag.current.top) < 4) return
          setHistory((h) => [...h, draft].slice(-30))
          drag.current.moved = true
        }
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.max(
          -7,
          Math.min(7, ((e.clientX - rect.left) / rect.width) * 16 - 8),
        )
        const z = Math.max(
          -5,
          Math.min(7, ((e.clientY - rect.top) / rect.height) * 14 - 6),
        )
        setDraft((prev) =>
          prev.map((r) =>
            r.id === drag.current?.id
              ? { ...r, ...fitToFloor(x, z, r.width, r.depth, r.rotation) }
              : r,
          ),
        )
      }}
      onPointerUp={(e) => {
        drag.current = null
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId)
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
    >
      {racks.map((r) => (
        <button
          key={r.id}
          className={`plan-rack ${activeId === r.id ? "chosen" : ""}`}
          aria-label={`Chọn ${r.name}`}
          style={{
            left: `${((r.x + 8) / 16) * 100}%`,
            top: `${((r.z + 6) / 14) * 100}%`,
            width: `${(r.width / 16) * 100}%`,
            height: `${(r.depth / 14) * 100}%`,
            transform: `translate(-50%,-50%) rotate(${r.rotation}deg)`,
            background: layer === "Hạn dùng" ? rackColor(r.id) : undefined,
          }}
          onClick={() => {
            setChosen(r.id)
            if (!editing) {
              const item = data.products.find(
                (p) => p.rack === r.id && p.branch === warehouse,
              )
              setSelected(item?.id || "")
            }
          }}
          onPointerDown={(e) => {
            if (editing && tool === "move") {
              setChosen(r.id)
              drag.current = { id: r.id, left: e.clientX, top: e.clientY }
              e.currentTarget.parentElement?.setPointerCapture(e.pointerId)
            }
          }}
        >
          {r.id}
        </button>
      ))}
    </div>
  )
  if (accessMode === "authenticated" && branch === "all" && accessibleBranches.length > 1) {
    return <><PageTitle eyebrow="MỘT TÀI KHOẢN · NHIỀU CƠ SỞ" title={editing ? "Chọn kho để thiết kế" : "Kho 3D của doanh nghiệp"} description="Mở từng cơ sở để xem sơ đồ, vị trí hàng hóa và tồn kho tương ứng."/><WarehouseLocations overview /></>
  }
  return (
    <>
      {accessMode === "authenticated" && <WarehouseLocations />}
      <PageTitle
        eyebrow={
          editing
            ? "Tạo một vị trí rõ ràng cho từng mặt hàng"
            : "Kho thực tế, trong một góc nhìn"
        }
        title={editing ? "Thiết lập sơ đồ kho" : "Bản đồ kho"}
        description={
          editing
            ? "Thêm kệ, bố trí theo kho thực tế rồi đặt tên và lưu."
            : "Tìm một sản phẩm để thấy chính xác kệ, tầng và ô."
        }
        action={
          editing ? (
            <Button
              variant="secondary"
              onClick={() => (dirty ? setLeave(true) : go("warehouse"))}
            >
              <ArrowLeft size={15} />
              Về bản đồ kho
            </Button>
          ) : ["owner", "manager"].includes(role) ? (
            <Button
              variant="secondary"
              onClick={() => {
                if (branch === "all") setBranch(warehouse)
                go("builder")
              }}
            >
              <Grid2X2 size={16} />
              Chỉnh sửa sơ đồ
            </Button>
          ) : undefined
        }
      />
      {!editing && accessMode === "authenticated" && WAREHOUSE_PERMISSIONS[role].putaway && <div className="putaway-shortcut"><div><strong>Có hàng mới cần lên kệ?</strong><p>Quét vị trí → mã thùng → xác nhận. Tồn kho và bản đồ cập nhật cùng nhau.</p></div><Button onClick={()=>go("putaway")}>Quét & nhập hàng lên kệ</Button></div>}
      {!editing && (
        <div className="toolbar" onKeyDown={event => {
          if (event.key === "Enter" && (event.target as HTMLElement).tagName === "INPUT" && search.trim() && matches.length) {
            event.preventDefault()
            locateProduct(matches[0])
          }
        }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm sản phẩm, mã lô hoặc vị trí…" />
          <select aria-label="Lớp thông tin" style={{ width: "auto" }} value={layer} onChange={(e) => setLayer(e.target.value)}>
            <option>Vị trí hàng</option><option>Hạn dùng</option>
          </select>
          <select aria-label="Cách hiển thị sản phẩm 3D" value={displayMode} onChange={e => setDisplayMode(e.target.value as ProductDisplay)}><option value="readable">Dễ chọn · Theo vùng hàng</option><option value="actual">Kích thước bao bì thực</option></select>
        </div>
      )}
      {!editing && <p className="tiny muted product-scale-note">{displayMode === "readable" ? "Chế độ chọn vùng hàng: minh họa các nhóm bao bì theo bố trí trong ô." : "Tỷ lệ theo kích thước bao bì đã nhập; sản phẩm chưa đo dùng số tham khảo. Chọn Xem gần kệ để xem hàng nhỏ."} Mỗi vùng đại diện một mã/lô; vẽ tối đa 12 bao bì theo vị trí và lớp xếp, không hiển thị toàn bộ tồn kho.</p>}
      {!editing && search.trim() && (
        <div className="panel warehouse-search-results" aria-label="Kết quả tìm sản phẩm">
          <p className="tiny muted" role="status">{matches.length} kết quả · Chọn một lô để đến đúng vị trí trên bản đồ</p>
          {matches.length ? matches.map((p) => (
              <button
                key={productKey(p)}
                className="list-choice"
                onClick={() => locateProduct(p)}
              >
                <MapPin size={18} color="#087e8b" />
                <div>
                  <strong className="tiny">
                    {p.name} · {p.variant}
                  </strong>
                  <p>
                    {p.id} · Lô {p.batch} · {p.qty} sản phẩm<br />{p.branch} · {locationLabel(p)} · Định vị trong 3D →
                  </p>
                </div>
              </button>
            )) : <Empty title="Chưa tìm thấy mặt hàng">
              Thử tìm bằng tên, mã lô hoặc mã kệ khác.
            </Empty>}
        </div>
      )}
      <div className={editing ? "map-layout builder-workspace" : "map-layout"}>
        {editing && <aside className="builder-toolbox panel">
          <span className="eyebrow">THƯ VIỆN KỆ</span>
          <h2>Kho của bạn, cách bạn muốn.</h2>
          <p>Chọn một mẫu. Đặt vào kho. Hoàn tất.</p>
          <Button onClick={() => add("shelf")}><Plus size={20} /> Thêm Kệ</Button>
          <Button variant="ghost" onClick={()=>setAllTemplates(value=>!value)}>{allTemplates ? "Mẫu phù hợp ngành hàng" : "Xem thêm mẫu kho lớn"}</Button>
          {RACK_TEMPLATES.filter(template => allTemplates || (config.id === "cosmetics" ? ["micro","tray","drawers","shelf","cabinet","packing"] : ["medium","shelf","tray","micro","stack","packing"]).includes(template.id)).map(template => <button draggable className={`rack-library-card rack-preview--${template.id}`} key={template.id}
            onDragStart={event => { event.dataTransfer.setData("application/waremap-rack", template.id); event.dataTransfer.effectAllowed = "copy"; setDraggingTemplate(template.name) }}
            onDragEnd={() => setDraggingTemplate("")}
            onClick={() => add(template.id)} aria-label={`Thêm ${template.name}`}>
            <span className="rack-thumbnail" aria-hidden="true">{Array.from({length:template.levels}, (_, i) => <span key={i}>{Array.from({length:template.bins}, (_, j) => <i key={j}/>)}</span>)}</span>
            <strong>{template.name}</strong><small>{template.width} × {template.depth} × {template.height} m · {template.levels} tầng · {template.bins} ô</small><small>{template.description}</small>
          </button>)}
          <small>Kéo mẫu vào kho · Hoặc bấm để thêm, dùng được trên điện thoại</small>
          <Button variant="ghost" onClick={() => setHelp(true)}>Dùng mẫu kho có sẵn</Button>
        </aside>}
        <div className="builder-stage" ref={mapStage} style={{scrollMarginTop:90}}>
          {!editing && locateRequest && <div className="warehouse-located" role="status"><div><strong>Đã định vị: {locateRequest.product.name}</strong><p>{locationLabel(locateRequest.product)} · Lô {locateRequest.product.batch} · {warehouse}</p></div><Button variant="ghost" onClick={() => locateProduct(locateRequest.product,unitIndex,wholeLot)}>Định vị lại</Button><Button variant="ghost" onClick={()=>setLocateRequest({...locateRequest,id:++locateSequence.current,scope:"slot",cancelled:false})}>Xem toàn ô</Button><Button variant="ghost" onClick={() => {setLocateRequest(null);setFocusedRack(null);controls.current?.reset();setCameraKey(k=>k+1)}}>Xem toàn kho</Button></div>}
          <div className={`map-canvas ${draggingTemplate ? "is-drop-target" : ""}`} onDragOver={event => { if (editing && event.dataTransfer.types.includes("application/waremap-rack")) { event.preventDefault(); event.dataTransfer.dropEffect = "copy" } }} onDrop={dropTemplate}>
            {draggingTemplate && <div className="rack-drop-hint">Thả để đặt {draggingTemplate} tại đây</div>}
            {editing && <div className="builder-modebar" role="toolbar" aria-label="Công cụ bố trí">
              <Button variant={tool === "select" ? "primary" : "ghost"} onClick={() => setTool("select")}><MousePointer2 size={15} />Chọn</Button>
              <Button variant={tool === "move" ? "primary" : "ghost"} onClick={() => setTool("move")}><Move size={15} />Di chuyển</Button>
              <Button variant="ghost" disabled={!rack} onClick={() => {
                if (!rack) return
                if (data.products.some(p => p.branch === warehouse && p.rack === rack.id && p.qty > 0)) return setError("Kệ đang có hàng. Hãy chuyển hàng trước khi xóa.")
                mutate(draft.filter(r => r.id !== rack.id)); setChosen("")
              }}><Trash2 size={15} />Xóa</Button>
              <details className="builder-more"><summary>Thêm công cụ</summary><div>
                <Button variant="ghost" disabled={!history.length} onClick={() => { setDraft(history[history.length - 1]); setHistory(h => h.slice(0, -1)) }}><Undo2 size={15} />Hoàn tác</Button>
                <Button variant="ghost" disabled={!rack} onClick={() => { setTool("rotate"); setView("3d") }}>Xoay kệ trong 3D</Button>
                <Button variant="ghost" onClick={() => { controls.current?.reset(); setCameraKey(k => k + 1) }}>Đặt lại góc nhìn</Button>
                <small>Lưới kệ 50 cm; khay nhỏ 10 cm. Đổi kích thước tại bảng chi tiết kệ.</small>
              </div></details>
            </div>}
            <div className="map-overlay">
              <Badge>{warehouse}</Badge>
              <Badge tone="info">{editing ? "Chỉnh sửa" : layer}</Badge>
            </div>
            {racks.length === 0 ? (
              <Empty
                title="Kho chưa có sơ đồ"
                action={
                  <Button
                    onClick={() => (editing ? add("shelf") : go("builder"))}
                  >
                    <Plus size={15} />
                    {editing ? "Thêm kệ đầu tiên" : "Tạo sơ đồ đầu tiên"}
                  </Button>
                }
              >
                Bắt đầu với một kệ rồi đặt tên theo vị trí thực tế.
              </Empty>
            ) : view === "plan" ? (
              plan
            ) : (
              <SceneBoundary fallback={plan}>
                <Suspense fallback={plan}>
                  <Canvas
                    onPointerMissed={() => { setChosen(""); if (!editing) setSelected("") }}
                    camera={{ position: [10, 10, 12], fov: 42 }}
                  >
                    <CanvasPlacement projector={placement} />
                    <color attach="background" args={["#edf3f5"]} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[5, 10, 5]} intensity={1.7} />
                    <Grid
                      args={[20, 18]}
                      cellColor="#c9d9df"
                      sectionColor="#b4cbd4"
                      cellSize={1}
                      fadeDistance={30}
                      position={[0, -0.03, 0]}
                    />
                    {racks.filter(r => !focusedRack || r.id === focusedRack).map((r) => (
                      <WarehouseRack
                        key={r.id}
                        rack={r}
                        displayMode={displayMode}
                        inspecting={!editing}
                        contents={data.products.filter(
                          (p) => p.branch === warehouse && p.rack === r.id,
                        )}
                        active={r.id === activeId}
                        color={rackColor(r.id)}
                        selectedKey={!editing && product ? productKey(product) : undefined}
                        selectedUnitIndex={unitIndex}
                        wholeLot={wholeLot}
                        onProductSelect={chooseProduct}
                        expiryLayer={!editing && layer === "Hạn dùng"}
                        expiryDays={data.settings.expiryDays}
                        draggable={editing && tool === "move"}
                        onDragging={onDragging}
                        transform={editing && r.id === activeId && tool === "rotate" ? "rotate" : undefined}
                        onTransform={(x, z, rotation) => {
                          if (x === r.x && z === r.z && rotation === r.rotation) return
                          mutate(draft.map(item => item.id === r.id ? { ...item, x, z, rotation } : item))
                        }}
                        onSelect={() => {
                          setChosen(r.id)
                          setSelectedBatch("")
                          if (!editing) {setLocateRequest(null);setSelected("")}
                        }}
                      />
                    ))}
                    <OrbitControls
                      key={cameraKey}
                      ref={controls}
                      makeDefault
                      target={[0, 0, 1]}
                      minDistance={4}
                      maxDistance={25}
                      maxPolarAngle={Math.PI / 2.05}
                      onStart={() => setLocateRequest(current=>current?{...current,cancelled:true}:null)}
                    />
                    {!editing && locateRequest && locateRequest.product.branch === warehouse && racks.find(r => r.id === locateRequest.product.rack) && <ProductLocator key={`${locateRequest.id}-${displayMode}`} request={locateRequest} rack={racks.find(r => r.id === locateRequest.product.rack)!} controls={controls} mode={displayMode} siblings={data.products.filter(p=>p.branch===warehouse&&p.rack===locateRequest.product.rack&&p.level===locateRequest.product.level&&p.bin===locateRequest.product.bin&&p.qty>0)}/>}
                  </Canvas>
                </Suspense>
              </SceneBoundary>
            )}
            <span className="map-help">
              {!editing && locateRequest && <span className="product-location-pin">Kệ {locateRequest.product.rack} · Tầng {locateRequest.product.level} · Ô {locateRequest.product.bin}</span>}
              {editing && view === "plan"
                ? "Kéo kệ để bố trí · Hoặc nhập vị trí trong bảng chi tiết"
                : editing && tool === "move" ? "Kéo trực tiếp kệ để di chuyển · Nền trống để xoay · Kệ: lưới 50 cm · Khay nhỏ: 10 cm"
                : editing && tool === "rotate" ? "Kéo vòng tròn quanh kệ để xoay · Lưu sơ đồ khi xong"
                : editing ? "Chọn kệ để chỉnh kích thước · Di chuyển để bố trí trực tiếp trong 3D"
                : "Nhấn kiện hàng để xem sản phẩm · Kéo nền để xoay · Cuộn để phóng to"}
            </span>
            <div className={`map-controls ${editing ? "builder-view-controls" : ""}`}>
              <Button
                variant={view === "plan" ? "primary" : "ghost"}
                onClick={() => { setLocateRequest(null); setView("plan") }}
              >
                Từ trên xuống
              </Button>
              <Button
                variant={view === "3d" ? "primary" : "ghost"}
                onClick={() => setView("3d")}
              >
                <Box size={13} />
                3D
              </Button>
              <Button variant="ghost" disabled={!rack || view !== "3d"} onClick={() => {
                if (!rack || !controls.current) return
                if (focusedRack) {
                  setLocateRequest(null)
                  setFocusedRack(null)
                  controls.current?.reset()
                  setCameraKey(key => key + 1)
                  return
                }
                setFocusedRack(rack.id)
                const target = controls.current
                const distance = Math.max(rack.width,rack.height,rack.depth,1) * 1.6
                target.target.set(rack.x,rack.height / 2,rack.z)
                target.object.position.set(rack.x + distance * .35,rack.height / 2 + distance * .3,rack.z + distance)
                target.minDistance = .3
                target.update()
              }}>{focusedRack ? "Xem toàn kho" : "Xem gần kệ"}</Button>
              <Button
                variant="ghost"
                aria-label="Về góc nhìn ban đầu"
                onClick={() => {
                  setLocateRequest(null)
                  controls.current?.reset()
                  setFocusedRack(null)
                  setCameraKey((k) => k + 1)
                }}
              >
                <RotateCcw size={15} />
              </Button>
            </div>
          </div>
          {editing ? (
            <div className="save-bar">
              <Button
                disabled={!dirty}
                onClick={() => {
                  if (
                    draft.some(
                      (r) =>
                        !r.name.trim() ||
                        ![
                          r.width,
                          r.depth,
                          r.height,
                          r.levels,
                          r.bins,
                          r.x,
                          r.z,
                          r.rotation,
                        ].every(Number.isFinite) ||
                        r.width <= 0 ||
                        r.depth <= 0 ||
                        r.height <= 0 ||
                        r.levels < 1 ||
                        r.bins < 1,
                    )
                  )
                    return setError(
                      "Kiểm tra tên và thông số kệ hợp lệ trước khi lưu.",
                    )
                  if (
                    data.products.some(
                      (p) =>
                        p.branch === warehouse &&
                        p.qty > 0 &&
                        !draft.some(
                          (r) =>
                            r.id === p.rack &&
                            r.levels >= p.level &&
                            r.bins >= p.bin,
                        ),
                    )
                  )
                    return setError(
                      "Sơ đồ cần giữ vị trí của hàng đang có. Hãy chuyển hàng trước khi thu nhỏ hoặc xóa kệ.",
                    )
                  update((d) => ({
                    ...d,
                    racks: { ...d.racks, [warehouse]: draft },
                  }))
                  setHistory([])
                  setSaved(true)
                  log("Đã lưu sơ đồ kho", `${warehouse} · ${draft.length} kệ`)
                  notify("Sơ đồ đã được lưu trên trình duyệt này.")
                }}
              >
                <Save size={15} />
                Lưu sơ đồ
              </Button>
              <Button variant="secondary" onClick={() => { setView("3d"); setTool("select") }}><Eye size={16} />Xem trước 3D</Button>
              <Button variant="secondary" disabled={dirty || !racks.length} onClick={async () => {
                try {
                  const target = rack || racks[0]
                  const svg = await QRCode.toString(positionCode({ branch: warehouse, rack: target.id, level: 1, bin: 1 }), { type: "svg", width: 512 })
                  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
                  const a = document.createElement("a"); a.href = url; a.download = `waremap-${target.id}-tang-1-o-1.svg`; a.click(); URL.revokeObjectURL(url)
                  notify(`Đã xuất QR ${target.name} · Tầng 1 · Ô 1, tương thích Quét QR nhanh.`)
                } catch { setError("Chưa xuất được QR. Vui lòng thử lại.") }
              }}><QrCode size={16} />Xuất QR</Button>
              <span className="builder-save-status" role="status">{dirty ? "Chưa lưu · Lưu sơ đồ để xuất QR" : "Đã lưu"}</span>
            </div>
          ) : (
            <p className="tiny muted" style={{ marginTop: 13 }}>
              {layer === "Hạn dùng"
                ? "Đỏ: có hàng hết hạn · Vàng: có hàng cận hạn · Xanh: chưa có cảnh báo"
                : "Kệ đang chọn mang màu ngành hàng · Kiện hàng đang chọn được tô vàng"}
            </p>
          )}
          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <div className="callout success" style={{ marginTop: 18 }}>
              <strong>Sơ đồ kho đã sẵn sàng.</strong>
              <div className="row" style={{ marginTop: 8 }}>
                <Button variant="ghost" onClick={() => go("warehouse")}>
                  Xem bản đồ kho
                </Button>
                <Button variant="ghost" onClick={() => go("inventory")}>
                  Gán hàng vào vị trí
                </Button>
              </div>
            </div>
          )}
        </div>
        {rack ? (
          <aside className={`panel ${editing ? "builder-inspector" : ""}`}>
            <div className="panel-heading">
              <h2>{editing ? "Chi tiết kệ" : rack.name}</h2>
              <Button
                variant="ghost"
                aria-label="Đóng chi tiết kệ"
                onClick={() => {
                  setLocateRequest(null)
                  setChosen("")
                  if (!editing) setSelected("")
                }}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="panel-body stack">
              {editing ? (
                <>
                  <RackInspector rack={rack} onPatch={patchRack}/>
                  <Button
                    variant="danger"
                    onClick={() => {
                      const occupied = data.products.some(
                        (p) =>
                          p.branch === warehouse &&
                          p.rack === rack.id &&
                          p.qty > 0,
                      )
                      if (occupied)
                        return setError(
                          "Kệ đang có hàng. Hãy gán hàng sang vị trí khác trước khi xóa.",
                        )
                      mutate(draft.filter((r) => r.id !== rack.id))
                      setChosen("")
                    }}
                  >
                    <Trash2 size={15} />
                    Xóa kệ
                  </Button>
                </>
              ) : (
                <>
                  {product ? (
                    <>
                      <Badge tone="info">{wholeLot?"Cả mã/lô đang chọn":`Bao bì #${unitIndex+1} đang chọn`}</Badge>
                      <UnitSelectionPanel units={displayedUnits} index={unitIndex} wholeLot={wholeLot} onUnit={index=>locateProduct(product,index)} onLot={()=>locateProduct(product,unitIndex,true)}/>
                      <h3>{product.name}</h3>
                      <p className="tiny">{product.variant} · {product.id}</p>
                      {product.storage3d?.unitsPerContainer && <p className="callout">Lưu nguyên thùng: {product.storage3d.unitsPerContainer} đơn vị/thùng · hiện chiếm {Math.ceil(product.qty/product.storage3d.unitsPerContainer)} thùng. Hình 3D dùng số đo nguyên thùng.</p>}
                      {product.storage3d && <Badge tone="info">{product.storage3d.stackable ? `Xếp ${product.storage3d.layers} lớp có kiểm soát` : "Một lớp · không chồng"}</Badge>}
                      <ExpiryBadge product={product} threshold={data.settings.expiryDays} />
                      <div className="callout">
                        <MapPin
                          size={17}
                          style={{ display: "inline", marginRight: 7 }}
                        />
                        {locationLabel(product)}
                      </div>
                      <dl className="detail-list">
                        <div>
                          <dt>Lô hàng</dt>
                          <dd>{product.batch}</dd>
                        </div>
                        <div>
                          <dt>Tổng tồn của lô</dt>
                          <dd>{product.qty}</dd>
                        </div>
                      </dl>
                      <ProductSizingPanel key={productKey(product)} product={product} rack={rack} readOnly={!wholeLot}/>
                      {wholeLot&&<ProductPlacementEditor key={`${productKey(product)}-${JSON.stringify(product.storage3d)}`} product={product} rack={rack} products={data.products.filter(p=>p.branch===warehouse&&p.rack===product.rack&&p.level===product.level&&p.bin===product.bin&&p.qty>0)}/>}
                      <SlotContents rack={rack} products={data.products.filter(p=>p.branch===warehouse&&p.rack===product.rack&&p.level===product.level&&p.bin===product.bin&&p.qty>0)} selected={product} onSelect={chooseProduct} onAdd={accessMode === "authenticated" && WAREHOUSE_PERMISSIONS[role].putaway ? ()=>{setScanTask({mode:"receive",locationCode:positionCode(product)});go("putaway")} : undefined}/>
                      <Button disabled={accessMode !== "authenticated"} onClick={() => { setScanTask({ mode: "lookup", productKey: productKey(product) }); go("scanner") }}>Quét QR xác minh sản phẩm</Button>
                      <Button disabled={accessMode !== "authenticated"} variant="secondary" onClick={() => setShowQR(true)}><QrCode size={16} />Nhãn QR vị trí & lô</Button>
                      <Button disabled={accessMode !== "authenticated"} variant="secondary" onClick={() => go("batches")}>
                        Xem lô & hạn dùng
                      </Button>
                    </>
                  ) : (
                    <p className="tiny">
                      {data.products.some(p => p.branch === warehouse && p.rack === rack.id && p.qty > 0)
                        ? "Chọn kiện hàng trong 3D hoặc chọn một sản phẩm trong danh sách bên dưới để xem vị trí và thông tin lô."
                        : "Kệ chưa có mặt hàng. Mở Sản phẩm & tồn kho để gán vị trí."}
                    </p>
                  )}
                  <details open={!product || undefined}>
                    <summary>Hàng tại kệ này</summary>
                    <div className="stack">
                      {data.products
                        .filter(
                          (p) => p.branch === warehouse && p.rack === rack.id,
                        )
                        .map((p) => (
                          <button
                            className="list-choice"
                            key={productKey(p)}
                            onClick={() => chooseProduct(p)}
                          >
                            <div>
                              <strong className="tiny">{p.name}</strong>
                              <p>{locationLabel(p)}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </details>
                </>
              )}
            </div>
          </aside>
        ) : (
          <Panel title={editing ? "Chọn một kệ để chỉnh sửa" : "Tìm một mặt hàng"}>
              <div className="panel-body">
                <p className="tiny">
                  {editing ? "Nhấn vào kệ trong kho để đổi tên, kích thước và số tầng. Mọi thay đổi hiển thị ngay trên bản đồ." : "Nhập tên hoặc mã để tô sáng vị trí, hoặc chọn trực tiếp một kệ trên sơ đồ."}
                </p>
              </div>
            </Panel>
        )}
      </div>
      {showQR && product && <Modal title="QR sản phẩm đang chọn" close={() => setShowQR(false)}><QRLabels product={product} /></Modal>}
      {help && (
        <Modal title="Bắt đầu với mẫu kho" close={() => setHelp(false)}>
          <p className="tiny muted">
            Mẫu gợi ý gồm 4 kệ có tên và khoảng trống giữa các dãy.
          </p>
          <div className="callout warning" style={{ marginTop: 18 }}>
            Mẫu sẽ thay bố cục đang chỉnh. Có thể hoàn tác trước khi lưu.
          </div>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setHelp(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                mutate(initialRacks.map((r) => ({ ...r })))
                setHelp(false)
              }}
            >
              Áp dụng mẫu
            </Button>
          </div>
        </Modal>
      )}
      {leave && (
        <Modal title="Có thay đổi chưa lưu" close={() => setLeave(false)}>
          <p>Quay lại bản đồ sẽ bỏ các thay đổi sơ đồ chưa lưu.</p>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setLeave(false)}>
              Tiếp tục chỉnh sửa
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                guardNavigation(null)
                go("warehouse")
              }}
            >
              Bỏ thay đổi & quay lại
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
