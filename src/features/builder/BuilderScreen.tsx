import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Canvas } from "@react-three/fiber"
import { Grid, OrbitControls } from "@react-three/drei"
import { CanvasTexture } from "three"
import {
  ArrowLeft,
  Box,
  Check,
  CheckCircle2,
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
function RackLabel({ text, height }: { text: string; height: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 128
    const context = canvas.getContext("2d")!
    context.fillStyle = "#ffffff"
    context.beginPath()
    context.roundRect(0, 0, 512, 128, 24)
    context.fill()
    context.fillStyle = "#385b6a"
    context.font = "500 46px sans-serif"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(text, 256, 66, 480)
    return new CanvasTexture(canvas)
  }, [text])
  useEffect(() => () => texture.dispose(), [texture])
  return <sprite position={[0, height + 0.35, 0]} scale={[1.55, 0.39, 1]}><spriteMaterial map={texture} transparent depthTest={false} /></sprite>
}
function RackObject({
  rack,
  active,
  color,
  selectedCell,
  contents,
  onSelect,
}: {
  rack: Rack
  active: boolean
  color: string
  selectedCell?: { level: number; bin: number }
  contents: Product[]
  onSelect: () => void
}) {
  const shelf = rack.height / rack.levels
  return (
    <group
      position={[rack.x, 0, rack.z]}
      rotation={[0, (rack.rotation * Math.PI) / 180, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[
              (x * rack.width) / 2,
              rack.height / 2,
              (z * rack.depth) / 2,
            ]}
          >
            <boxGeometry args={[0.06, rack.height, 0.06]} />
            <meshStandardMaterial color={active ? "#087e8b" : "#78909e"} />
          </mesh>
        )),
      )}
      {Array.from({ length: rack.levels + 1 }, (_, i) => (
        <mesh key={i} position={[0, i * shelf, 0]}>
          <boxGeometry args={[rack.width + 0.08, 0.055, rack.depth + 0.07]} />
          <meshStandardMaterial color={active ? "#3d929d" : "#9bb0ba"} />
        </mesh>
      ))}
      {Array.from({ length: rack.levels }, (_, l) =>
        Array.from({ length: rack.bins }, (_, b) =>
          contents.some(
            (p) => p.level === l + 1 && p.bin === b + 1 && p.qty > 0,
          ) ? (
            <mesh
              key={`${l}-${b}`}
              position={[
                -rack.width / 2 + ((b + 0.5) * rack.width) / rack.bins,
                l * shelf + shelf * 0.42,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  (rack.width / rack.bins) * 0.72,
                  shelf * 0.65,
                  rack.depth * 0.72,
                ]}
              />
              <meshStandardMaterial
                color={
                  active &&
                  selectedCell?.level === l + 1 &&
                  selectedCell.bin === b + 1
                    ? "#f4b24d"
                    : color
                }
                transparent
                opacity={active ? 1 : 0.7}
              />
            </mesh>
          ) : null,
        ),
      )}
      <RackLabel text={rack.name} height={rack.height} />
    </group>
  )
}
export default function Warehouse() {
  const {
    data,
    update,
    screen,
    go,
    branch,
    setBranch,
    selected,
    setSelected,
    visibleProducts,
    search,
    setSearch,
    log,
    notify,
    role,
    guardNavigation,
  } = useApp()
  const editing = screen === "builder"
  const warehouse = branch === "all" ? branches[0] : branch
  const [draft, setDraft] = useState<Rack[]>(data.racks[warehouse] || []),
    [history, setHistory] = useState<Rack[][]>([]),
    [chosen, setChosen] = useState(""),
    [view, setView] = useState<"3d" | "plan">(editing ? "plan" : "3d"),
    [layer, setLayer] = useState("Vị trí hàng"),
    [help, setHelp] = useState(false),
    [leave, setLeave] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState(""),
    [cameraKey, setCameraKey] = useState(0)
  const controls = useRef<any>(null),
    drag = useRef<{ id: string; left: number; top: number; moved?: boolean } | null>(null)
  useEffect(() => {
    setDraft(data.racks[warehouse] || [])
    setHistory([])
    setChosen("")
    setSaved(false)
  }, [warehouse])
  const persisted = data.racks[warehouse] || [],
    racks = editing ? draft : persisted
  const product = data.products.find(
    (p) => p.id === selected && p.branch === warehouse,
  )
  const activeId = editing ? chosen : product?.rack || chosen
  const rack = racks.find((r) => r.id === activeId)
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
  const change = (key: keyof Rack, value: string | number) => {
    if (rack)
      mutate(draft.map((r) => (r.id === rack.id ? { ...r, [key]: value } : r)))
  }
  const add = (kind: string) => {
    const id =
      "K" +
      (Math.max(0, ...draft.map((r) => Number(r.id.replace(/\D/g, "")) || 0)) +
        1)
    mutate([
      ...draft,
      {
        id,
        name: `${kind} ${id}`,
        x: 0,
        z: 5,
        rotation: 0,
        width: 2,
        depth: 1,
        height: 2.4,
        levels: 3,
        bins: 3,
        kind,
      },
    ])
    setChosen(id)
  }
  const matches = visibleProducts.filter((p) =>
    `${p.name} ${p.id} ${p.batch} ${p.rack} ${locationLabel(p)}`
      .toLocaleLowerCase("vi")
      .includes(search.toLocaleLowerCase("vi")),
  )
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
    return id === activeId ? "#7ec3c4" : "#b2c7cc"
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
              ? { ...r, x: Math.round(x * 2) / 2, z: Math.round(z * 2) / 2 }
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
            if (editing) {
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
  return (
    <>
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
      {editing ? (
        <>
          <div className="builder-steps">
            <span>
              <b>1</b>Chọn mẫu / mặt bằng
            </span>
            <span>
              <b>2</b>Thêm & bố trí kệ
            </span>
            <span>
              <b>3</b>Đặt tên & lưu
            </span>
          </div>
          <div className="builder-library">
            <Button variant="secondary" onClick={() => setHelp(true)}>
              Dùng mẫu có sẵn
            </Button>
            {["Kệ hàng", "Tủ bảo quản", "Khu kiểm đếm"].map((kind) => (
              <Button variant="secondary" key={kind} onClick={() => add(kind)}>
                <Plus size={15} />
                {kind}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Tìm sản phẩm, mã lô hoặc vị trí…"
          />
          <select
            aria-label="Lớp thông tin"
            style={{ width: "auto" }}
            value={layer}
            onChange={(e) => setLayer(e.target.value)}
          >
            <option>Vị trí hàng</option>
            <option>Hạn dùng</option>
          </select>
        </div>
      )}
      {!editing && search && (
        <div className="panel" style={{ marginBottom: 18 }}>
          {matches.length ? matches.slice(0, 6).map((p) => (
              <button
                key={`${p.id}-${p.branch}`}
                className="list-choice"
                onClick={() => {
                  setSelected(p.id)
                  setBranch(p.branch)
                  setChosen(p.rack)
                }}
              >
                <MapPin size={18} color="#087e8b" />
                <div>
                  <strong className="tiny">
                    {p.name} · {p.variant}
                  </strong>
                  <p>
                    {p.branch} · {locationLabel(p)}
                  </p>
                </div>
              </button>
            )) : <Empty title="Chưa tìm thấy mặt hàng">
              Thử tìm bằng tên, mã lô hoặc mã kệ khác.
            </Empty>}
        </div>
      )}
      <div className={`map-layout ${!rack && editing ? "wide" : ""}`}>
        <div>
          <div className="map-canvas">
            <div className="map-overlay">
              <Badge>{warehouse}</Badge>
              <Badge tone="info">{editing ? "Chỉnh sửa" : layer}</Badge>
            </div>
            {racks.length === 0 ? (
              <Empty
                title="Kho chưa có sơ đồ"
                action={
                  <Button
                    onClick={() => (editing ? add("Kệ hàng") : go("builder"))}
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
                    camera={{ position: [10, 10, 12], fov: 42 }}
                  >
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
                    {racks.map((r) => (
                      <RackObject
                        key={r.id}
                        rack={r}
                        contents={data.products.filter(
                          (p) => p.branch === warehouse && p.rack === r.id,
                        )}
                        active={r.id === activeId}
                        color={rackColor(r.id)}
                        selectedCell={
                          !editing && product?.rack === r.id
                            ? product
                            : undefined
                        }
                        onSelect={() => {
                          setChosen(r.id)
                          if (!editing)
                            setSelected(
                              data.products.find(
                                (p) =>
                                  p.branch === warehouse && p.rack === r.id,
                              )?.id || "",
                            )
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
                    />
                  </Canvas>
                </Suspense>
              </SceneBoundary>
            )}
            <span className="map-help">
              {editing && view === "plan"
                ? "Kéo kệ để bố trí · Hoặc nhập vị trí trong bảng chi tiết"
                : "Chọn kệ để xem · Kéo để xoay · Cuộn để phóng to"}
            </span>
            <div className="map-controls">
              <Button
                variant={view === "plan" ? "primary" : "ghost"}
                onClick={() => setView("plan")}
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
              <Button
                variant="ghost"
                aria-label="Về góc nhìn ban đầu"
                onClick={() => {
                  controls.current?.reset()
                  setCameraKey((k) => k + 1)
                }}
              >
                <RotateCcw size={15} />
              </Button>
            </div>
          </div>
          {editing ? (
            <div className="save-bar">
              <div className="row">
                <Button
                  variant="secondary"
                  disabled={!history.length}
                  onClick={() => {
                    setDraft(history[history.length - 1])
                    setHistory((h) => h.slice(0, -1))
                    setSaved(false)
                  }}
                >
                  <Undo2 size={15} />
                  Hoàn tác
                </Button>
                <p>
                  {dirty ? "Có thay đổi chưa lưu" : "Đã lưu trên trình duyệt"}
                </p>
              </div>
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
            </div>
          ) : (
            <p className="tiny muted" style={{ marginTop: 13 }}>
              {layer === "Hạn dùng"
                ? "Đỏ: có hàng hết hạn · Vàng: có hàng cận hạn · Xanh: chưa có cảnh báo"
                : "Kệ đang chọn được tô xanh · Ô sản phẩm đang tìm được tô vàng"}
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
          <aside className="panel">
            <div className="panel-heading">
              <h2>{editing ? "Chi tiết kệ" : rack.name}</h2>
              <Button
                variant="ghost"
                aria-label="Đóng chi tiết kệ"
                onClick={() => {
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
                  <label className="field">
                    Tên kệ
                    <input
                      value={rack.name}
                      onChange={(e) => change("name", e.target.value)}
                    />
                  </label>
                  <div className="form-grid">
                    {([
                      ["width", "Dài (m)"],
                      ["depth", "Rộng (m)"],
                      ["height", "Cao (m)"],
                      ["levels", "Số tầng"],
                      ["bins", "Số ô / tầng"],
                    ] as const).map(([key, label]) => (
                      <label className="field" key={key}>
                        {label}
                        <input
                          type="number"
                          min={key === "levels" || key === "bins" ? 1 : 0.2}
                          max={key === "levels" || key === "bins" ? 10 : 6}
                          step={key === "levels" || key === "bins" ? 1 : 0.1}
                          value={rack[key]}
                          onChange={(e) => {
                            const n = Number(e.target.value)
                            if (key === "levels" || key === "bins")
                              change(
                                key,
                                Math.max(1, Math.min(10, Math.round(n))),
                              )
                            else change(key, Math.max(0.2, Math.min(6, n)))
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <details>
                    <summary>Vị trí & hướng kệ</summary>
                    <div className="stack">
                      {(["x", "z", "rotation"] as const).map((key) => (
                        <label className="field" key={key}>
                          {key === "x"
                            ? "Ngang (m)"
                            : key === "z"
                              ? "Dọc (m)"
                              : "Góc xoay (độ)"}
                          <input
                            type="number"
                            min={key === "rotation" ? -360 : -8}
                            max={key === "rotation" ? 360 : 8}
                            step={key === "rotation" ? 15 : 0.5}
                            value={rack[key]}
                            onChange={(e) =>
                              change(key, Number(e.target.value))
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </details>
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
                      <Badge tone="info">Vị trí sản phẩm đang chọn</Badge>
                      <h3>{product.name}</h3>
                      <p className="tiny">{product.variant}</p>
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
                          <dt>Số lượng</dt>
                          <dd>{product.qty}</dd>
                        </div>
                      </dl>
                      <Button variant="secondary" onClick={() => go("batches")}>
                        Xem lô & hạn dùng
                      </Button>
                    </>
                  ) : (
                    <p className="tiny">
                      Kệ chưa có mặt hàng. Mở Sản phẩm & tồn kho để gán vị trí.
                    </p>
                  )}
                  <details>
                    <summary>Hàng tại kệ này</summary>
                    <div className="stack">
                      {data.products
                        .filter(
                          (p) => p.branch === warehouse && p.rack === rack.id,
                        )
                        .map((p) => (
                          <button
                            className="list-choice"
                            key={p.id}
                            onClick={() => setSelected(p.id)}
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
          !editing && (
            <Panel title="Tìm một mặt hàng">
              <div className="panel-body">
                <p className="tiny">
                  Nhập tên hoặc mã để tô sáng vị trí. Bạn cũng có thể chọn trực
                  tiếp một kệ trên sơ đồ.
                </p>
              </div>
            </Panel>
          )
        )}
      </div>
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
