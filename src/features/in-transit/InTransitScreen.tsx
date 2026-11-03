import {
  ArrowRight,
  Boxes,
  CalendarDays,
  Check,
  CircleCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Copy,
  FileText,
  Info,
  Map,
  MapPin,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Printer,
  RefreshCw,
  Route,
  ScanLine,
  Search,
  SlidersHorizontal,
  Truck,
  Warehouse,
  X,
  Zap,
} from "lucide-react"
import { useState, type FormEvent } from "react"
import { useApp } from "../../app/store"
import {
  branches,
  createTransferSlip,
  daysLeft,
  nextTransferCode,
  today,
  transferDisplayId,
  transferLineCode,
  type Transfer,
  type TransferDetails,
  transferLines,
} from "../../app/model"
import { Button, Empty, Modal } from "../../app/ui"
import { productKey } from "../../app/catalog"
import "./transfers.css"

const PAGE_SIZE = 6
const TRANSFER_CREATE_STEPS = [
  "Thông tin điều chuyển",
  "Chọn hàng hóa",
  "Kiểm tra & xác minh",
  "Thông tin vận chuyển",
  "Xác nhận phiếu",
]

const FLOW_STEPS = [
  { label: "Tạo phiếu" },
  { label: "Nhặt hàng" },
  { label: "Đóng gói & Bàn giao" },
  { label: "In-Transit", sub: "Đang vận chuyển" },
  { label: "Kiểm nhận", sub: "Tại kho nhận" },
  { label: "Put-away", sub: "Nhập hàng lên kệ" },
] as const

type StatusFilter = "all" | Transfer["status"] | "attention"
type DraftLine = { key: number; itemKey: string; qty: string }

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "Chuẩn bị", label: "Nhật hàng" },
  { value: "Đang chuyển", label: "Đang di chuyển" },
  { value: "Kiểm nhận", label: "Đang kiểm hàng" },
  { value: "Hoàn tất", label: "Hoàn tất" },
  { value: "attention", label: "Cần xử lý" },
]

const BRANCH_SHORT: Record<string, string> = {
  "Kho trung tâm": "Kho Tổng",
  "Chi nhánh Quận 3": "CH-01",
  "Chi nhánh Thủ Đức": "CH-02",
}

const shortBranch = (branch: string) => BRANCH_SHORT[branch] ?? branch

const isAttention = (transfer: Transfer) =>
  transfer.status === "Kiểm nhận" &&
  transfer.received !== undefined &&
  transfer.received !== transfer.qty

type StatusTone = "prepare" | "transit" | "receiving" | "done" | "attention"

function statusMeta(transfer: Transfer): { label: string; tone: StatusTone } {
  if (isAttention(transfer)) return { label: "Cần xử lý", tone: "attention" }
  switch (transfer.status) {
    case "Chuẩn bị":
      return { label: "Nhật hàng", tone: "prepare" }
    case "Đang chuyển":
      return { label: "Đang di chuyển", tone: "transit" }
    case "Kiểm nhận":
      return { label: "Đang kiểm hàng", tone: "receiving" }
    case "Hoàn tất":
      return { label: "Hoàn tất", tone: "done" }
  }
}

function stageOf(transfer: Transfer) {
  switch (transfer.status) {
    case "Chuẩn bị":
      return 1
    case "Đang chuyển":
      return 3
    case "Kiểm nhận":
      return 4
    case "Hoàn tất":
      return 5
    default:
      return 0
  }
}

function progressOf(transfer: Transfer) {
  const count = transfer.status === "Hoàn tất" ? 6 : stageOf(transfer) + 1
  const tone = isAttention(transfer)
    ? "attention"
    : transfer.status === "Chuẩn bị"
      ? "prepare"
      : "active"
  return { count, tone }
}

function timeOf(transfer: Transfer) {
  return transfer.history.join(" ").match(/\b([01]?\d|2[0-3]):[0-5]\d\b/)?.[0] ?? ""
}

function creatorOf(transfer: Transfer, fallback: string) {
  const entry = transfer.history.find((item) => item.includes("·"))
  const candidate = entry?.split("·")[1]?.trim()
  if (!candidate) return fallback
  return /^\d{1,2}:\d{2}$/.test(candidate) ? fallback : candidate
}

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-")
  return year && month && day ? `${day}/${month}/${year}` : value
}

function defaultFromDate() {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return isoDate(date)
}

function dateAfter(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + days)
  return isoDate(date)
}

function nextDayLabel(date: string) {
  const next = new Date(date + "T00:00:00")
  next.setDate(next.getDate() + 1)
  return formatDate(isoDate(next))
}

type KpiTone = "blue" | "orange" | "green" | "red"

const SPARK_PATHS: Record<KpiTone, string> = {
  blue: "M2 23 C10 21 13 15 20 17 C27 19 31 21 37 13 C43 5 49 8 55 11 C61 14 66 20 72 9 C77 1 83 4 88 6",
  orange:
    "M2 16 C9 13 13 20 20 18 C27 16 31 8 38 11 C45 14 49 21 56 18 C63 15 67 8 74 10 C80 12 84 16 88 7",
  green:
    "M2 22 C9 20 13 14 20 16 C27 18 32 12 39 13 C46 14 50 8 57 10 C64 12 68 7 75 8 C81 9 85 5 88 4",
  red: "M2 20 C9 18 13 22 20 21 C27 20 31 12 38 15 C45 18 49 23 56 21 C63 19 67 23 74 22 C80 21 84 25 88 23",
}

function Sparkline({ tone }: { tone: KpiTone }) {
  const line = SPARK_PATHS[tone]
  return (
    <svg
      className="trf-kpi__spark"
      viewBox="0 0 90 30"
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d={`${line} L88 30 L2 30 Z`} fill="currentColor" opacity="0.1" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Transfers() {
  const {
    data,
    update,
    branch,
    accessibleBranches,
    visibleProducts,
    go,
    setScanTask,
    log,
    role,
    notify,
  } = useApp()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [fromDate, setFromDate] = useState(defaultFromDate)
  const [toDate, setToDate] = useState(today)
  const [chosen, setChosen] = useState("")
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [reconciling, setReconciling] = useState(false)
  const [error, setError] = useState("")
  const [draftSource, setDraftSource] = useState(branches[0])
  const [draftDestination, setDraftDestination] = useState(branches[1])
  const [draftLines, setDraftLines] = useState<DraftLine[]>([])
  const [nextDraftLine, setNextDraftLine] = useState(1)
  const [draftPlannedDate, setDraftPlannedDate] = useState(today())
  const [draftExpectedDate, setDraftExpectedDate] = useState(
    dateAfter(today(), 1),
  )
  const [draftCreated, setDraftCreated] = useState(today)

  const scopedTransfers = data.transfers.filter((transfer) => {
    const inBranch =
      branch === "all" || transfer.from === branch || transfer.to === branch
    const inWarehouse =
      warehouseFilter === "all" ||
      transfer.from === warehouseFilter ||
      transfer.to === warehouseFilter
    const afterFrom = !fromDate || transfer.created >= fromDate
    const beforeTo = !toDate || transfer.created <= toDate
    return inBranch && inWarehouse && afterFrom && beforeTo
  })

  const normalizedQuery = query.trim().toLocaleLowerCase("vi")
  const filteredTransfers = scopedTransfers.filter((transfer) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "attention"
        ? isAttention(transfer)
        : transfer.status === statusFilter)
    if (!matchesStatus) return false
    if (!normalizedQuery) return true
    const lineSearch = transferLines(transfer)
      .map((line, index) => {
        const product = data.products.find(
          (item) => item.id === line.productId && item.batch === line.batch,
        )
        return `${transferLineCode(transfer, line, index)} ${line.batch} ${product?.name ?? ""} ${product?.id ?? line.productId}`
      })
      .join(" ")
    return `${transferDisplayId(transfer)} ${transfer.id} ${transfer.from} ${transfer.to} ${lineSearch}`
      .toLocaleLowerCase("vi")
      .includes(normalizedQuery)
  })

  const total = scopedTransfers.length
  const moving = scopedTransfers.filter(
    (transfer) => transfer.status === "Đang chuyển",
  ).length
  const completed = scopedTransfers.filter(
    (transfer) => transfer.status === "Hoàn tất",
  ).length
  const attention = scopedTransfers.filter(isAttention).length
  const share = (count: number) =>
    total ? Math.round((count / total) * 100) : 0

  const selected =
    filteredTransfers.find((transfer) => transfer.id === chosen) ??
    filteredTransfers[0] ??
    null
  const selectedMeta = selected ? statusMeta(selected) : null
  const selectedDisplayId = selected ? transferDisplayId(selected) : ""
  const selectedStage = selected ? stageOf(selected) : -1
  const selectedAttention = selected ? isAttention(selected) : false
  const selectedLines = selected ? transferLines(selected) : []

  const pageCount = Math.max(1, Math.ceil(filteredTransfers.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const visibleTransfers = filteredTransfers.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  )
  const firstVisible = filteredTransfers.length ? startIndex + 1 : 0
  const lastVisible = Math.min(startIndex + PAGE_SIZE, filteredTransfers.length)

  const pageNumbers: (number | "gap")[] = (() => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, index) => index + 1)
    }
    const values = new Set<number>([
      1,
      pageCount,
      safePage,
      safePage - 1,
      safePage + 1,
    ])
    const sorted = [...values]
      .filter((value) => value >= 1 && value <= pageCount)
      .sort((a, b) => a - b)
    const result: (number | "gap")[] = []
    sorted.forEach((value, index) => {
      if (index > 0 && value - sorted[index - 1] > 1) result.push("gap")
      result.push(value)
    })
    return result
  })()

  const canAct = (target: string) => role === "owner" || target === branch

  const kpiCards: {
    key: string
    label: string
    value: number
    note: string
    noteTone: string
    tone: KpiTone
    icon: typeof Truck
  }[] = [
    {
      key: "total",
      label: "Tổng phiếu chuyển",
      value: total,
      note: attention ? `${attention} cần xử lý` : "Trong kỳ đã chọn",
      noteTone: attention ? "warn" : "neutral",
      tone: "blue",
      icon: Boxes,
    },
    {
      key: "moving",
      label: "Đang di chuyển",
      value: moving,
      note: `${share(moving)}% tổng phiếu`,
      noteTone: "info",
      tone: "orange",
      icon: Truck,
    },
    {
      key: "done",
      label: "Đã hoàn tất",
      value: completed,
      note: `${share(completed)}% tổng phiếu`,
      noteTone: "good",
      tone: "green",
      icon: Check,
    },
    {
      key: "attention",
      label: "Cần xử lý",
      value: attention,
      note: attention ? "Cần đối soát ngay" : "Không chênh lệch",
      noteTone: attention ? "warn" : "neutral",
      tone: "red",
      icon: CircleAlert,
    },
  ]

  const goToPage = (next: number) => {
    const target = Math.min(Math.max(1, next), pageCount)
    setPage(target)
    const first = filteredTransfers[(target - 1) * PAGE_SIZE]
    if (first) setChosen(first.id)
  }

  const resetFilters = () => {
    setStatusFilter("all")
    setWarehouseFilter("all")
    setQuery("")
    setFromDate(defaultFromDate())
    setToDate(today())
    setPage(1)
    setChosen("")
    notify("Đã làm mới bộ lọc phiếu chuyển.")
  }

  const changeFromDate = (value: string) => {
    setFromDate(value)
    if (value && toDate && value > toDate) setToDate(value)
    setPage(1)
    setChosen("")
  }

  const changeToDate = (value: string) => {
    setToDate(value)
    if (value && fromDate && value < fromDate) setFromDate(value)
    setPage(1)
    setChosen("")
  }

  const openCreateTransfer = () => {
    const availableProducts = visibleProducts.filter(
      (product) => product.qty > 0 && daysLeft(product.expiry) >= 0,
    )
    const sourceBranches = Array.from(
      new Set(availableProducts.map((product) => product.branch)),
    )
    const source = sourceBranches.includes(branch)
      ? branch
      : (sourceBranches[0] ?? branches[0])
    const destination =
      branches.find((item) => item !== source) ?? branches[0]
    const firstItem = availableProducts.find(
      (product) => product.branch === source,
    )
    setDraftSource(source)
    setDraftDestination(destination)
    setDraftPlannedDate(today())
    setDraftExpectedDate(dateAfter(today(), 1))
    setDraftCreated(today())
    setDraftLines([
      {
        key: 1,
        itemKey: firstItem ? productKey(firstItem) : "",
        qty: "1",
      },
    ])
    setNextDraftLine(2)
    setCreating(true)
    setError("")
  }

  const createTransfer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const source = String(form.get("source") ?? "")
    const to = String(form.get("to") ?? "")
    const plannedDate = String(form.get("plannedDate") ?? "")
    const expectedDate = String(form.get("expectedDate") ?? "")
    const responsible = String(form.get("responsible") ?? "").trim()
    const reason = String(form.get("reason") ?? "").trim()
    if (source === to) {
      setError("Kho xuất và kho nhận phải khác nhau.")
      return
    }
    if (!plannedDate || !expectedDate || expectedDate < plannedDate) {
      setError("Ngày nhận dự kiến phải từ ngày chuyển hàng trở đi.")
      return
    }
    if (!responsible || !reason || !draftLines.length) {
      setError("Vui lòng nhập người phụ trách, lý do và ít nhất một mặt hàng.")
      return
    }
    const lines = draftLines.map((line) => ({
      item: visibleProducts.find(
        (product) => productKey(product) === line.itemKey,
      ),
      qty: Number(line.qty),
    }))
    for (const { item, qty } of lines) {
      if (
        !item ||
        item.branch !== source ||
        !Number.isInteger(qty) ||
        qty < 1 ||
        qty > item.qty ||
        daysLeft(item.expiry) < 0
      ) {
        setError(
          "Mặt hàng phải thuộc kho xuất, còn hạn và có số lượng hợp lệ trong tồn kho.",
        )
        return
      }
    }
    if (
      new Set(draftLines.map((line) => line.itemKey)).size !==
      draftLines.length
    ) {
      setError("Mỗi mặt hàng/lô chỉ được thêm một lần vào danh sách.")
      return
    }
    const validLines = lines.flatMap(({ item, qty }) =>
      item ? [{ item, qty }] : [],
    )

    const details: TransferDetails = {
      plannedDate,
      expectedDate,
      responsible,
      reason,
      note: String(form.get("note") ?? "").trim(),
      shippingMethod: String(form.get("shippingMethod") ?? ""),
      sender: String(form.get("sender") ?? "").trim(),
      receiver: String(form.get("receiver") ?? "").trim(),
      deliveryTime: String(form.get("deliveryTime") ?? ""),
      trackingCode: String(form.get("trackingCode") ?? "").trim(),
      shippingNote: String(form.get("shippingNote") ?? "").trim(),
    }
    const created = draftCreated
    const code = nextTransferCode(created, data.transfers)
    const transfer = createTransferSlip({
      id: code,
      from: source,
      to,
      created,
      history: [
        `Đã tạo phiếu gồm ${validLines.length} mặt hàng · ${new Date().toLocaleTimeString("vi-VN")}`,
      ],
      details,
      lines: validLines.map(({ item, qty }) => ({
        id: productKey(item),
        productId: item.id,
        batch: item.batch,
        qty,
      })),
    })
    if (!transfer) return
    update((current) => ({
      ...current,
      transfers: [transfer, ...current.transfers],
    }))
    log(
      "Đã tạo phiếu chuyển",
      `${transferDisplayId(transfer)} · ${validLines.length} mặt hàng · ${transfer.from} → ${to}`,
    )
    setCreating(false)
    setError("")
    setStatusFilter("all")
    setWarehouseFilter("all")
    setQuery("")
    setFromDate(defaultFromDate())
    setToDate(today())
    setPage(1)
    setChosen(transfer.id)
    notify(`Đã tạo phiếu ${transferDisplayId(transfer)} với ${validLines.length} mã dòng riêng.`)
  }

  const reconcileSelected = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected || !isAttention(selected)) return
    const reason = String(
      new FormData(event.currentTarget).get("reason") ?? "",
    ).trim()
    if (!reason) return
    update((current) => ({
      ...current,
      transfers: current.transfers.map((transfer) =>
        transfer.id === selected.id
          ? {
              ...transfer,
              status: "Hoàn tất" as const,
              history: [
                ...transfer.history,
                `Đã đối soát chênh lệch: ${reason}`,
              ],
            }
          : transfer,
      ),
    }))
    log(
      "Đã đối soát phiếu chuyển",
      `${transferDisplayId(selected)} · ${reason}`,
    )
    notify(`Đã đối soát phiếu ${transferDisplayId(selected)}.`)
    setReconciling(false)
  }

  const completeSelected = () => {
    if (!selected) return
    const received = selected.received ?? selected.qty
    update((current) => ({
      ...current,
      transfers: current.transfers.map((transfer) =>
        transfer.id === selected.id
          ? {
              ...transfer,
              status: "Hoàn tất" as const,
              history: [
                ...transfer.history,
                `Đã kiểm nhận đủ ${received}/${transfer.qty} sản phẩm, hoàn tất nhập kệ`,
              ],
            }
          : transfer,
      ),
    }))
    log(
      "Đã hoàn tất kiểm nhận",
      `${transferDisplayId(selected)} · ${received}/${selected.qty} sản phẩm`,
    )
    notify(`Đã hoàn tất kiểm nhận phiếu ${transferDisplayId(selected)}.`)
  }

  const openReconcileCheck = () => {
    const candidate =
      scopedTransfers.find(isAttention) ??
      scopedTransfers.find((transfer) => transfer.status === "Kiểm nhận")
    if (!candidate) {
      notify("Không có phiếu nào cần đối soát trong phạm vi đang xem.")
      return
    }
    const index = scopedTransfers.indexOf(candidate)
    setStatusFilter("all")
    setQuery("")
    setPage(Math.floor(Math.max(0, index) / PAGE_SIZE) + 1)
    setChosen(candidate.id)
    notify(
      `Đang mở phiếu ${transferDisplayId(candidate)} để đối soát.`,
    )
  }

  const routeTransfer = selected
  const routeMeta = routeTransfer ? statusMeta(routeTransfer) : null
  const routeAttention = routeTransfer ? isAttention(routeTransfer) : false
  const timelineSteps = selected
    ? FLOW_STEPS.slice(
        0,
        selected.status === "Hoàn tất"
          ? FLOW_STEPS.length
          : selectedStage + 1,
      )
    : []
  const draftItems = draftLines.map((line) => ({
      ...line,
      product: visibleProducts.find(
        (product) => productKey(product) === line.itemKey,
      ),
  }))
  const draftTotalQty = draftLines.reduce(
      (total, line) => total + (Number(line.qty) || 0),
      0,
  )
  const draftSourceBranches = Array.from(
    new Set(
      visibleProducts
        .filter(
          (product) =>
            product.qty > 0 && daysLeft(product.expiry) >= 0,
        )
        .map((product) => product.branch),
    ),
  )
  const draftSourceProducts = visibleProducts.filter(
      (product) =>
        product.branch === draftSource &&
        product.qty > 0 &&
        daysLeft(product.expiry) >= 0,
  )
  const draftTransferCode = nextTransferCode(draftCreated, data.transfers)
  const draftLineCode = (index: number) =>
    `${draftTransferCode}-${String(index + 1).padStart(2, "0")}`
  const draftChecks = [
      { label: "Kho xuất và kho nhận hợp lệ", valid: draftSource !== draftDestination },
      {
        label: "Số lượng không vượt tồn khả dụng",
        valid:
          draftItems.length > 0 &&
          draftItems.every(
            ({ product, qty }) =>
              Boolean(product) &&
              Number.isInteger(Number(qty)) &&
              Number(qty) > 0 &&
              Number(qty) <= (product?.qty ?? 0),
          ),
      },
      {
        label: "Lô hàng còn hạn sử dụng",
        valid:
          draftItems.length > 0 &&
          draftItems.every(
            ({ product }) => Boolean(product && daysLeft(product.expiry) >= 0),
          ),
      },
      {
        label: "Vị trí lấy hàng đã xác định",
        valid:
          draftItems.length > 0 &&
          draftItems.every(
            ({ product }) => Boolean(product?.rack && product.level && product.bin),
          ),
      },
  ]

  return (
    <div className="trf-page">
      <section className="trf-hero">
        <svg
          className="trf-hero__city"
          viewBox="0 0 520 110"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="currentColor">
            <rect x="24" y="62" width="34" height="48" rx="2" />
            <rect x="64" y="44" width="26" height="66" rx="2" />
            <rect x="96" y="72" width="42" height="38" rx="2" />
            <rect x="146" y="34" width="30" height="76" rx="2" />
            <rect x="182" y="58" width="22" height="52" rx="2" />
            <rect x="210" y="48" width="38" height="62" rx="2" />
            <rect x="254" y="70" width="28" height="40" rx="2" />
            <rect x="288" y="26" width="24" height="84" rx="2" />
            <rect x="318" y="56" width="44" height="54" rx="2" />
            <rect x="368" y="40" width="28" height="70" rx="2" />
            <rect x="402" y="66" width="36" height="44" rx="2" />
            <rect x="444" y="52" width="24" height="58" rx="2" />
            <rect x="474" y="74" width="30" height="36" rx="2" />
          </g>
          <g fill="currentColor" opacity="0.55">
            <rect x="102" y="80" width="6" height="6" rx="1" />
            <rect x="114" y="80" width="6" height="6" rx="1" />
            <rect x="102" y="92" width="6" height="6" rx="1" />
            <rect x="114" y="92" width="6" height="6" rx="1" />
            <rect x="152" y="46" width="6" height="6" rx="1" />
            <rect x="164" y="46" width="6" height="6" rx="1" />
            <rect x="152" y="60" width="6" height="6" rx="1" />
            <rect x="164" y="60" width="6" height="6" rx="1" />
            <rect x="152" y="74" width="6" height="6" rx="1" />
            <rect x="164" y="74" width="6" height="6" rx="1" />
            <rect x="216" y="58" width="6" height="6" rx="1" />
            <rect x="228" y="58" width="6" height="6" rx="1" />
            <rect x="216" y="72" width="6" height="6" rx="1" />
            <rect x="228" y="72" width="6" height="6" rx="1" />
            <rect x="294" y="38" width="6" height="6" rx="1" />
            <rect x="304" y="38" width="6" height="6" rx="1" />
            <rect x="294" y="52" width="6" height="6" rx="1" />
            <rect x="304" y="52" width="6" height="6" rx="1" />
            <rect x="326" y="68" width="6" height="6" rx="1" />
            <rect x="338" y="68" width="6" height="6" rx="1" />
            <rect x="326" y="82" width="6" height="6" rx="1" />
            <rect x="338" y="82" width="6" height="6" rx="1" />
          </g>
        </svg>
        <div className="trf-hero__main">
          <span className="trf-hero__icon">
            <Truck size={26} />
          </span>
          <div>
            <h1>Chuyển kho</h1>
            <p>
              Điều chuyển hàng hóa giữa các kho/cửa hàng một cách an toàn và
              chính xác
            </p>
          </div>
        </div>
        <Button
          className="trf-hero__cta"
          onClick={openCreateTransfer}
        >
          <Plus size={16} />
          Tạo phiếu chuyển kho
        </Button>
      </section>

      <section className="trf-kpis" aria-label="Tổng quan phiếu chuyển">
        {kpiCards.map(({ key, label, value, note, noteTone, tone, icon: Icon }) => (
          <article className={`trf-kpi trf-kpi--${tone}`} key={key}>
            <span className="trf-kpi__icon">
              <Icon size={18} />
            </span>
            <div className="trf-kpi__body">
              <span className="trf-kpi__label">{label}</span>
              <div className="trf-kpi__value">
                <strong>{value}</strong>
                <small className={`trf-kpi__note ${noteTone}`}>{note}</small>
              </div>
            </div>
            <Sparkline tone={tone} />
          </article>
        ))}
      </section>

      <section className="trf-flow" aria-label="Tiến trình chuyển kho">
        <div className="trf-flow__steps">
          {FLOW_STEPS.map((step, index) => {
            const done = Boolean(selected) &&
              (selected!.status === "Hoàn tất" || index < selectedStage)
            const current = Boolean(selected) &&
              selected!.status !== "Hoàn tất" &&
              index === selectedStage
            const alert = current && selectedAttention
            return (
              <div
                key={step.label}
                className={`trf-step ${done ? "done" : ""} ${
                  current ? "current" : ""
                } ${alert ? "alert" : ""}`}
              >
                <div className="trf-step__head">
                  <span className="trf-step__dot">
                    {done ? <Check size={13} /> : index + 1}
                  </span>
                  <span className="trf-step__line" />
                </div>
                <span className="trf-step__label">
                  {step.label}
                  {"sub" in step && step.sub ? <small>{step.sub}</small> : null}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="trf-workspace">
        <div className="trf-list">
          <section className="trf-filters" aria-label="Bộ lọc phiếu chuyển">
            <label className="trf-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                  setChosen("")
                }}
                placeholder="Tìm mã phiếu, mã dòng, sản phẩm..."
                aria-label="Tìm phiếu chuyển"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    setPage(1)
                    setChosen("")
                  }}
                  aria-label="Xóa tìm kiếm"
                >
                  <X size={13} />
                </button>
              )}
            </label>
            <label className="trf-filter">
              <Warehouse size={13} />
              <select
                value={warehouseFilter}
                onChange={(event) => {
                  setWarehouseFilter(event.target.value)
                  setPage(1)
                  setChosen("")
                }}
                aria-label="Lọc theo kho"
              >
                <option value="all">Tất cả kho</option>
                {accessibleBranches.map((item) => (
                  <option key={item} value={item}>
                    {shortBranch(item)}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} />
            </label>
            <label className="trf-filter">
              <SlidersHorizontal size={13} />
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter)
                  setPage(1)
                  setChosen("")
                }}
                aria-label="Lọc theo trạng thái"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} />
            </label>
            <div className="trf-daterange">
              <CalendarDays size={14} />
              <span className="trf-datefield">
                <span className="trf-datefield__label" aria-hidden="true">
                  {formatDate(fromDate)}
                </span>
                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(event) => changeFromDate(event.target.value)}
                  aria-label="Từ ngày"
                />
              </span>
              <ArrowRight size={12} />
              <span className="trf-datefield">
                <span className="trf-datefield__label" aria-hidden="true">
                  {formatDate(toDate)}
                </span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(event) => changeToDate(event.target.value)}
                  aria-label="Đến ngày"
                />
              </span>
            </div>
            <button
              type="button"
              className="trf-refresh"
              onClick={resetFilters}
              aria-label="Làm mới bộ lọc"
              title="Làm mới"
            >
              <RefreshCw size={14} />
            </button>
          </section>

          <section className="trf-table-card" aria-label="Danh sách phiếu chuyển">
            {visibleTransfers.length ? (
              <>
                <div className="trf-table-scroll">
                  <table className="trf-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mã phiếu</th>
                        <th>Kho xuất → Kho nhập</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Tiến trình</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleTransfers.map((transfer, index) => {
                        const meta = statusMeta(transfer)
                        const progress = progressOf(transfer)
                        const active = selected?.id === transfer.id
                        const displayId = transferDisplayId(transfer)
                        return (
                          <tr
                            key={transfer.id}
                            className={active ? "is-selected" : ""}
                            onClick={() => setChosen(transfer.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                setChosen(transfer.id)
                              }
                            }}
                            tabIndex={0}
                            aria-selected={active}
                          >
                            <td>
                              <span className="trf-num">
                                {startIndex + index + 1}
                              </span>
                            </td>
                            <td>
                              <span className="trf-id">{displayId}</span>
                            </td>
                            <td>
                              <span
                                className="trf-route-cell"
                                title={`${transfer.from} → ${transfer.to}`}
                              >
                                <strong>{shortBranch(transfer.from)}</strong>
                                <ArrowRight size={11} />
                                <strong>{shortBranch(transfer.to)}</strong>
                              </span>
                            </td>
                            <td>
                              <span className="trf-date-main">
                                {formatDate(transfer.created)}
                              </span>
                              <span className="trf-date-sub">
                                {transferLines(transfer).length > 1
                                  ? `${timeOf(transfer) ? `${timeOf(transfer)} · ` : ""}${transferLines(transfer).length} mặt hàng`
                                  : timeOf(transfer) || `Lô ${transfer.batch}`}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`trf-status trf-status--${meta.tone}`}
                              >
                                {meta.label}
                              </span>
                              {isAttention(transfer) && (
                                <span className="trf-status-note">
                                  Lệch{" "}
                                  {transfer.qty - (transfer.received ?? 0)}
                                </span>
                              )}
                            </td>
                            <td>
                              <div
                                className={`trf-progress trf-progress--${progress.tone}`}
                              >
                                <span className="trf-progress__label">
                                  {progress.count} / 6
                                </span>
                                <div
                                  className="trf-progress__track"
                                  aria-hidden="true"
                                >
                                  <span
                                    className="trf-progress__bar"
                                    style={{
                                      width: `${(progress.count / 6) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="trf-actions">
                                <button
                                  type="button"
                                  className="trf-view"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setChosen(transfer.id)
                                  }}
                                >
                                  Xem
                                </button>
                                <button
                                  type="button"
                                  className="trf-more"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setChosen(transfer.id)
                                  }}
                                  aria-label={`Xem chi tiết ${displayId}`}
                                  title="Xem chi tiết"
                                >
                                  <MoreHorizontal size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="trf-table-foot">
                  <span>
                    Hiển thị {firstVisible} – {lastVisible} trong{" "}
                    {filteredTransfers.length} phiếu
                  </span>
                  <div className="trf-pagination">
                    <button
                      type="button"
                      className="trf-page-btn trf-page-btn--nav"
                      disabled={safePage === 1}
                      onClick={() => goToPage(safePage - 1)}
                      aria-label="Trang trước"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    {pageNumbers.map((value, index) =>
                      value === "gap" ? (
                        <span
                          className="trf-page-gap"
                          key={`gap-${index}`}
                          aria-hidden="true"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          type="button"
                          key={value}
                          className={`trf-page-btn ${
                            value === safePage ? "is-active" : ""
                          }`}
                          onClick={() => goToPage(value)}
                          aria-label={`Trang ${value}`}
                          aria-current={value === safePage ? "page" : undefined}
                        >
                          {value}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      className="trf-page-btn trf-page-btn--nav"
                      disabled={safePage === pageCount}
                      onClick={() => goToPage(safePage + 1)}
                      aria-label="Trang sau"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="trf-table-empty">
                <Empty title="Chưa có phiếu phù hợp">
                  Thay đổi bộ lọc hoặc tạo phiếu chuyển mới.
                </Empty>
              </div>
            )}
          </section>
        </div>

        <aside className="trf-detail" aria-label="Chi tiết phiếu chuyển">
          {selected && selectedMeta ? (
            <>
              <div className="trf-detail__head">
                <h2>
                  <ClipboardCheck size={14} />
                  Chi tiết phiếu chuyển
                </h2>
                <span
                  className={`trf-status trf-status--${selectedMeta.tone}`}
                >
                  {selectedMeta.label}
                </span>
              </div>
              <div className="trf-detail__body">
                <section className="trf-detail__items" aria-label="Mặt hàng trong phiếu">
                  <strong className="trf-detail__items-title">
                    Mặt hàng ({selectedLines.length})
                  </strong>
                  {selectedLines.map((line, index) => {
                    const product = data.products.find(
                      (item) =>
                        item.id === line.productId &&
                        item.batch === line.batch,
                    )
                    const sent = line.sent ?? selected.reserved
                    const lineCode = transferLineCode(selected, line, index)
                    return (
                      <div className="trf-detail__item" key={line.id}>
                        <div>
                          <strong>{product?.name ?? line.productId}</strong>
                          <small>
                            Lô {line.batch} · SL {line.qty}
                            {line.received !== undefined
                              ? ` · Đã nhận ${line.received}/${line.qty}`
                              : sent
                                ? " · Đã gửi"
                                : ""}
                          </small>
                          <small
                            className="trf-detail__line-code"
                            title={lineCode}
                          >
                            Mã dòng {lineCode}
                          </small>
                        </div>
                        {selected.status === "Chuẩn bị" &&
                          canAct(selected.from) &&
                          !sent && (
                            <Button
                              disabled={!!selectedIncident && !selectedIncident.resolved}
                              onClick={() => {
                                setScanTask({
                                  transferId: selected.id,
                                  transferLineId: line.id,
                                  mode: "dispatch",
                                })
                                go("scanner")
                              }}
                            >
                              <ScanLine size={14} />
                              Quét gửi
                            </Button>
                          )}
                        {selected.status === "Đang chuyển" &&
                          canAct(selected.to) &&
                          line.received === undefined && (
                            <Button
                              disabled={!!selectedIncident && !selectedIncident.resolved}
                              onClick={() => {
                                setScanTask({
                                  transferId: selected.id,
                                  transferLineId: line.id,
                                  mode: "receive",
                                })
                                go("scanner")
                              }}
                            >
                              <ScanLine size={14} />
                              Quét nhận
                            </Button>
                          )}
                      </div>
                    )
                  })}
                </section>
                <dl className="trf-detail__list">
                  <div>
                    <dt>Mã phiếu</dt>
                    <dd className="trf-copyline">
                      <span>{selectedDisplayId}</span>
                      <button
                        type="button"
                        className="trf-copy"
                        onClick={() => {
                          if (!navigator.clipboard) {
                            notify("Trình duyệt chưa hỗ trợ sao chép tự động.")
                            return
                          }
                          void navigator.clipboard
                            .writeText(selectedDisplayId)
                            .then(
                              () =>
                                notify(
                                  `Đã sao chép mã phiếu ${selectedDisplayId}.`,
                                ),
                              () => notify("Không sao chép được mã phiếu."),
                            )
                        }}
                        aria-label={`Sao chép mã phiếu ${selectedDisplayId}`}
                        title="Sao chép mã phiếu"
                      >
                        <Copy size={11} />
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>Ngày tạo</dt>
                    <dd>
                      {formatDate(selected.created)}
                      {timeOf(selected) ? ` · ${timeOf(selected)}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>Kho xuất</dt>
                    <dd>{selected.from}</dd>
                  </div>
                  <div>
                    <dt>Kho nhập</dt>
                    <dd>{selected.to}</dd>
                  </div>
                  <div>
                    <dt>Người tạo</dt>
                    <dd>
                      {creatorOf(
                        selected,
                        data.staff[0]?.name ?? "Nguyễn An",
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Số lượng</dt>
                    <dd>
                      {selected.received !== undefined
                        ? `${selected.received} / ${selected.qty} sản phẩm`
                        : `${selected.qty} sản phẩm`}
                    </dd>
                  </div>
                  {selected.details && (
                    <>
                      <div>
                        <dt>Ngày chuyển</dt>
                        <dd>{formatDate(selected.details.plannedDate)}</dd>
                      </div>
                      <div>
                        <dt>Dự kiến nhận</dt>
                        <dd>
                          {formatDate(selected.details.expectedDate)}
                          {selected.details.deliveryTime
                            ? ` · ${selected.details.deliveryTime}`
                            : ""}
                        </dd>
                      </div>
                      <div>
                        <dt>Người phụ trách</dt>
                        <dd>{selected.details.responsible}</dd>
                      </div>
                      <div>
                        <dt>Lý do</dt>
                        <dd>{selected.details.reason}</dd>
                      </div>
                      {selected.details.shippingMethod && (
                        <div>
                          <dt>Vận chuyển</dt>
                          <dd>{selected.details.shippingMethod}</dd>
                        </div>
                      )}
                      {selected.details.trackingCode && (
                        <div>
                          <dt>Mã vận chuyển</dt>
                          <dd>{selected.details.trackingCode}</dd>
                        </div>
                      )}
                      {selected.details.note && (
                        <div>
                          <dt>Ghi chú</dt>
                          <dd>{selected.details.note}</dd>
                        </div>
                      )}
                      {selected.details.shippingNote && (
                        <div>
                          <dt>Ghi chú giao</dt>
                          <dd>{selected.details.shippingNote}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
                {selectedAttention && (
                  <div className="trf-detail__alert">
                    <CircleAlert size={15} />
                    <div>
                      <strong>
                        Chênh lệch{" "}
                        {selected.qty - (selected.received ?? 0)} sản phẩm
                      </strong>
                      <span>
                        Đã nhận {selected.received ?? 0}/{selected.qty}. Cần đối
                        soát trước khi đóng phiếu.
                      </span>
                    </div>
                  </div>
                )}
                <div className="trf-detail__section-title">
                  Tiến trình thực hiện
                </div>
                <ol className="trf-timeline">
                  {timelineSteps.map((step, index) => {
                    const done =
                      selected.status === "Hoàn tất" || index < selectedStage
                    const current =
                      selected.status !== "Hoàn tất" &&
                      index === selectedStage
                    const alert = current && selectedAttention
                    const detail = done
                      ? index === 0
                        ? `${formatDate(selected.created)}${
                            timeOf(selected) ? ` · ${timeOf(selected)}` : ""
                          }`
                        : "Đã hoàn tất"
                      : current
                        ? alert
                          ? "Cần đối soát chênh lệch"
                          : "Đang xử lý"
                        : "Chưa thực hiện"
                    return (
                      <li
                        key={step.label}
                        className={`trf-timeline__item ${
                          done ? "done" : ""
                        } ${current ? "current" : ""} ${
                          alert ? "alert" : ""
                        } ${!done && !current ? "upcoming" : ""}`}
                      >
                        <span className="trf-timeline__dot">
                          {done ? (
                            <Check size={10} />
                          ) : current ? (
                            <span className="trf-timeline__pulse" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <span className="trf-timeline__copy">
                          <strong>{step.label}</strong>
                          <small>
                            {"sub" in step && step.sub ? `${step.sub} · ` : ""}
                            {detail}
                          </small>
                        </span>
                      </li>
                    )
                  })}
                </ol>
                <details className="trf-history">
                  <summary>Lịch sử phiếu</summary>
                  <ul>
                    {selected.history.map((entry, index) => (
                      <li key={index}>{entry}</li>
                    ))}
                  </ul>
                </details>
              </div>
              <div className="trf-detail__foot">
<<<<<<< Updated upstream
                {selected.status === "Chuẩn bị" &&
                  canAct(selected.from) && (
                    <Button
                      onClick={() => {
                        setScanTask({
                          transferId: selected.id,
                          mode: "dispatch",
                        })
                        go("scanner")
                      }}
                    >
                      <ScanLine size={14} />
                      Xác minh &amp; gửi hàng
                    </Button>
                  )}
                {selected.status === "Đang chuyển" &&
                  canAct(selected.to) && (
                    <Button
                      onClick={() => {
                        setScanTask({
                          transferId: selected.id,
                          mode: "receive",
                        })
                        go("scanner")
                      }}
                    >
                      <ScanLine size={14} />
                      Quét kiểm nhận
                    </Button>
                  )}
=======
                {selectedIncident && <div role="status" style={{flexBasis:"100%",padding:14,borderRadius:12,background:selectedIncident.resolved?"#f0fdf4":"#fef2f2",color:selectedIncident.resolved?"#166534":"#991b1b"}}>
                  <strong>{selectedIncident.resolved ? "Sự cố đã xử lý" : `Đang xử lý: ${selectedIncident.kind}`}</strong><p>Người xử lý: {selectedIncident.assignee} · {selectedIncident.note}</p>
                  {!selectedIncident.resolved && <p>Tạm dừng duyệt tại màn hình này. Xử lý sự cố trước khi tiếp tục xác minh giao nhận. Đây là theo dõi demo trên trình duyệt, chưa có khóa nghiệp vụ phía máy chủ.</p>}
                  {!selectedIncident.resolved && ["owner","manager"].includes(role) && canReport(selected) && <form onSubmit={event=>{
                    event.preventDefault()
                    const resolution=String(new FormData(event.currentTarget).get("resolution")||"").trim()
                    if(!resolution)return
                    update(current=>({...current,transfers:current.transfers.map(transfer=>transfer.id===selected.id?{...transfer,history:[...transfer.history,`${INCIDENT_PREFIX}${JSON.stringify({...selectedIncident,resolved:true})}`,`Đã xử lý sự cố · ${selectedIncident.assignee} · ${resolution}`]}:transfer)}))
                    notify("Đã ghi nhận xử lý; tiếp tục kiểm nhận QR để xác nhận số lượng thực tế.")
                  }}><label>Kết quả xử lý<input name="resolution" required placeholder="Mô tả cách xử lý và kết quả kiểm tra"/></label><Button type="submit" variant="secondary">Xác nhận đã xử lý sự cố</Button></form>}
                </div>}
                {canReport(selected) && <Button variant="danger" onClick={()=>{setIncidentTarget(selected.id);setIncidentError("")}}>Báo Lệch / Sự Cố</Button>}
>>>>>>> Stashed changes
                {selected.status === "Kiểm nhận" &&
                  ["owner", "manager"].includes(role) &&
                  canAct(selected.to) &&
                  (selectedAttention ? (
                    <Button onClick={() => setReconciling(true)}>
                      <ClipboardCheck size={14} />
                      Đối soát chênh lệch
                    </Button>
                  ) : (
                    <Button onClick={completeSelected}>
                      <PackageCheck size={14} />
                      Hoàn tất kiểm nhận
                    </Button>
                  ))}
                {selected.status === "Kiểm nhận" &&
                  !["owner", "manager"].includes(role) && (
                    <p className="trf-detail__hint">
                      Phiếu đang chờ quản lý xác nhận kiểm nhận.
                    </p>
                  )}
                <Button
                  variant="secondary"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  In phiếu chuyển
                </Button>
              </div>
            </>
          ) : (
            <div className="trf-detail__empty">
              <FileText size={26} />
              <strong>Chưa chọn phiếu</strong>
              <p>
                Chọn một phiếu trong bảng để xem thông tin và tiến trình vận
                chuyển.
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="trf-bottom">
        <section className="trf-card" aria-label="Thao tác nhanh">
          <div className="trf-card__head">
            <h2>
              <Zap size={14} />
              <span>Thao tác nhanh</span>
            </h2>
          </div>
          <div className="trf-quick">
            <button
              type="button"
              className="trf-quick__item trf-quick--blue"
              onClick={() => {
                setScanTask({ mode: "lookup" })
                go("scanner")
              }}
            >
              <span className="trf-quick__icon">
                <ScanLine size={15} />
              </span>
              <strong>Quét QR</strong>
              <small>Xác minh hàng</small>
            </button>
            <button
              type="button"
              className="trf-quick__item trf-quick--purple"
              onClick={() => go("warehouse")}
            >
              <span className="trf-quick__icon">
                <Map size={15} />
              </span>
              <strong>Xem bản đồ 3D</strong>
              <small>Vị trí hàng</small>
            </button>
            <button
              type="button"
              className="trf-quick__item trf-quick--green"
              onClick={openReconcileCheck}
            >
              <span className="trf-quick__icon">
                <ClipboardCheck size={15} />
              </span>
              <strong>Kiểm tra đối soát</strong>
              <small>Số lượng</small>
            </button>
            <button
              type="button"
              className="trf-quick__item trf-quick--orange"
              onClick={() => window.print()}
            >
              <span className="trf-quick__icon">
                <Printer size={15} />
              </span>
              <strong>In phiếu</strong>
              <small>Vận chuyển</small>
            </button>
          </div>
        </section>

        <section className="trf-card trf-routecard" aria-label="Lộ trình vận chuyển">
          <div className="trf-card__head">
            <h2>
              <Route size={14} />
              <span>Lộ trình vận chuyển</span>
            </h2>
            {routeTransfer && routeMeta && (
              <span className={`trf-status trf-status--${routeMeta.tone}`}>
                {routeMeta.label}
              </span>
            )}
          </div>
          {routeTransfer ? (
            <div className="trf-routecard__body">
              <div
                className={`trf-route ${
                  routeTransfer.status === "Hoàn tất" ? "is-done" : ""
                } ${routeAttention ? "is-alert" : ""}`}
              >
                <div className="trf-route__node">
                  <span className="trf-route__pin">
                    <Warehouse size={14} />
                  </span>
                  <strong>{shortBranch(routeTransfer.from)}</strong>
                  <small>Kho xuất</small>
                </div>
                <div className="trf-route__line">
                  <span className="trf-route__dash" />
                  <span className="trf-route__truck">
                    <Truck size={13} />
                  </span>
                  <span className="trf-route__dash" />
                </div>
                <div className="trf-route__node">
                  <span className="trf-route__pin trf-route__pin--dest">
                    <MapPin size={14} />
                  </span>
                  <strong>{shortBranch(routeTransfer.to)}</strong>
                  <small>Kho nhập</small>
                </div>
              </div>
              <div className="trf-route__eta">
                <span>
                  <CalendarDays size={11} />
                  {routeTransfer.status === "Hoàn tất"
                    ? "Đã nhận"
                    : "Dự kiến nhận"}
                </span>
                <strong>{nextDayLabel(routeTransfer.created)}</strong>
                <small>
                  {routeTransfer.status === "Hoàn tất"
                    ? "Đã hoàn tất"
                    : "09:00 - 10:00"}
                </small>
              </div>
            </div>
          ) : (
            <div className="trf-routecard__empty">
              Chọn một phiếu để xem lộ trình vận chuyển.
            </div>
          )}
        </section>
      </div>

      {reconciling && selected && selectedAttention && (
        <Modal
          title={`Đối soát ${selectedDisplayId}`}
          close={() => setReconciling(false)}
        >
          <form onSubmit={reconcileSelected}>
            <div className="callout warning">
              Phiếu gửi {selected.qty} sản phẩm, thực nhận{" "}
              {selected.received ?? 0}. Chênh lệch{" "}
              {selected.qty - (selected.received ?? 0)} sản phẩm.
            </div>
            <label className="field">
              Kết quả kiểm tra chênh lệch
              <textarea
                name="reason"
                required
                placeholder="Nêu lý do và hướng xử lý phần thiếu…"
              />
            </label>
            <p className="tiny muted">
              Tồn kho nơi nhận đã ghi nhận đúng số thực nhận. Việc đóng đối
              soát không tự cộng phần thiếu.
            </p>
            <div className="form-actions">
              <Button
                variant="secondary"
                onClick={() => setReconciling(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Xác nhận đối soát</Button>
            </div>
          </form>
        </Modal>
      )}

      {creating && (
        <Modal
          title="Tạo phiếu chuyển kho"
          className="trf-create-modal"
          close={() => setCreating(false)}
        >
          <form className="trf-create" onSubmit={createTransfer}>
            <ol className="trf-create-progress" aria-label="Các bước tạo phiếu">
              {TRANSFER_CREATE_STEPS.map((step, index) => (
                <li
                  key={step}
                  className={index === 1 ? "is-current" : index < 1 ? "is-done" : ""}
                  aria-current={index === 1 ? "step" : undefined}
                >
                  <span>{index < 1 ? <Check size={12} /> : index + 1}</span>
                  <small>{step}</small>
                </li>
              ))}
            </ol>

            <div className="trf-create-layout">
              <div className="trf-create-main">
                <section className="trf-create-card">
                  <div className="trf-create-card__head">
                    <span>1</span>
                    <h3>Thông tin điều chuyển</h3>
                  </div>
                  <div className="trf-create-fields">
                    <label className="trf-create-field">
                      <span>Kho xuất <b>*</b></span>
                      <select
                        name="source"
                        value={draftSource}
                        required
                        onChange={(event) => {
                          const source = event.target.value
                          const sourceProducts = visibleProducts.filter(
                            (product) =>
                              product.branch === source &&
                              product.qty > 0 &&
                              daysLeft(product.expiry) >= 0,
                          )
                          setDraftSource(source)
                          setDraftLines((current) =>
                            current.map((line, index) => ({
                              ...line,
                              itemKey: sourceProducts[index]
                                ? productKey(sourceProducts[index])
                                : "",
                            })),
                          )
                        }}
                      >
                        {draftSourceBranches.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="trf-create-field">
                      <span>Kho nhận <b>*</b></span>
                      <select
                        name="to"
                        value={draftDestination}
                        required
                        onChange={(event) =>
                          setDraftDestination(event.target.value)
                        }
                      >
                        {branches.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="trf-create-field">
                      <span>Ngày chuyển dự kiến <b>*</b></span>
                      <input
                        type="date"
                        name="plannedDate"
                        value={draftPlannedDate}
                        required
                        onChange={(event) => {
                          const date = event.target.value
                          setDraftPlannedDate(date)
                          if (draftExpectedDate < date) {
                            setDraftExpectedDate(date)
                          }
                        }}
                      />
                    </label>
                    <label className="trf-create-field">
                      <span>Ngày nhận dự kiến <b>*</b></span>
                      <input
                        type="date"
                        name="expectedDate"
                        value={draftExpectedDate}
                        min={draftPlannedDate}
                        required
                        onChange={(event) =>
                          setDraftExpectedDate(event.target.value)
                        }
                      />
                    </label>
                    <label className="trf-create-field">
                      <span>Người phụ trách <b>*</b></span>
                      <select name="responsible" required defaultValue={data.staff[0]?.name ?? "Nguyễn An"}>
                        {data.staff.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="trf-create-field">
                      <span>Lý do điều chuyển <b>*</b></span>
                      <select name="reason" required defaultValue="Bổ sung hàng bán">
                        <option>Bổ sung hàng bán</option>
                        <option>Cân bằng tồn kho</option>
                        <option>Điều chuyển theo kế hoạch</option>
                        <option>Khác</option>
                      </select>
                    </label>
                    <label className="trf-create-field trf-create-field--wide">
                      <span>Ghi chú</span>
                      <input name="note" placeholder="Nhập ghi chú (nếu có)..." />
                    </label>
                  </div>
                </section>

                <section className="trf-create-card">
                  <div className="trf-create-card__head">
                    <span>2</span>
                    <h3>Chọn hàng hóa</h3>
                    <Button
                      variant="secondary"
                      className="trf-create-add"
                      onClick={() => {
                        const firstItem = draftSourceProducts.find(
                          (product) =>
                            !draftLines.some(
                              (line) =>
                                line.itemKey === productKey(product),
                            ),
                        )
                        setDraftLines((current) => [
                          ...current,
                          {
                            key: nextDraftLine,
                            itemKey: firstItem ? productKey(firstItem) : "",
                            qty: "1",
                          },
                        ])
                        setNextDraftLine((current) => current + 1)
                      }}
                      disabled={draftLines.length >= draftSourceProducts.length}
                    >
                      <Plus size={14} />
                      Thêm hàng
                    </Button>
                  </div>
                  <div className="trf-create-table-wrap">
                    <table className="trf-create-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Sản phẩm / SKU</th>
                          <th>Lô hàng / HSD</th>
                          <th>Vị trí lấy hàng</th>
                          <th>Tồn khả dụng</th>
                          <th>Số lượng chuyển</th>
                          <th aria-label="Thao tác" />
                        </tr>
                      </thead>
                      <tbody>
                        {draftItems.map(({ key, itemKey, qty, product }, index) => (
                          <tr key={key}>
                            <td>{index + 1}</td>
                            <td>
                              <select
                                aria-label={`Sản phẩm dòng ${index + 1}`}
                                value={itemKey}
                                required
                                onChange={(event) =>
                                  setDraftLines((current) =>
                                    current.map((line) =>
                                      line.key === key
                                        ? { ...line, itemKey: event.target.value }
                                        : line,
                                    ),
                                  )
                                }
                              >
                                {draftSourceProducts.map((item) => (
                                  <option
                                    key={productKey(item)}
                                    value={productKey(item)}
                                    disabled={draftLines.some(
                                      (line) =>
                                        line.key !== key &&
                                        line.itemKey === productKey(item),
                                    )}
                                  >
                                    {item.name} · {item.variant}
                                  </option>
                                ))}
                              </select>
                              {product ? (
                                <small className="trf-create-sku">
                                  SKU {product.id} · Mã dòng {draftLineCode(index)}
                                </small>
                              ) : (
                                <small className="trf-create-sku trf-create-muted">
                                  Mã dòng {draftLineCode(index)}
                                </small>
                              )}
                            </td>
                            <td>
                              {product ? (
                                <>
                                  <strong>{product.batch}</strong>
                                  <small>{formatDate(product.expiry)}</small>
                                </>
                              ) : (
                                <span className="trf-create-muted">Chưa chọn</span>
                              )}
                            </td>
                            <td>
                              {product
                                ? `Kệ ${product.rack} · T${product.level} · Ô ${String(product.bin).padStart(2, "0")}`
                                : "—"}
                            </td>
                            <td>{product?.qty ?? 0}</td>
                            <td>
                              <input
                                aria-label={`Số lượng dòng ${index + 1}`}
                                type="number"
                                min={1}
                                max={product?.qty ?? undefined}
                                step={1}
                                value={qty}
                                required
                                onChange={(event) =>
                                  setDraftLines((current) =>
                                    current.map((line) =>
                                      line.key === key
                                        ? { ...line, qty: event.target.value }
                                        : line,
                                    ),
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="trf-create-remove"
                                aria-label={`Xóa dòng ${index + 1}`}
                                disabled={draftLines.length === 1}
                                onClick={() =>
                                  setDraftLines((current) =>
                                    current.filter((line) => line.key !== key),
                                  )
                                }
                              >
                                <X size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {!draftSourceProducts.length && (
                          <tr>
                            <td colSpan={7} className="trf-create-empty">
                              Kho xuất chưa có sản phẩm khả dụng.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="trf-create-fefo">
                    <Info size={14} />
                    Tất cả mặt hàng trong danh sách sẽ nằm trong cùng một phiếu; từng dòng có mã riêng và được quét riêng khi giao và nhận.
                    Hàng chưa bị trừ khỏi tồn kho khi tạo phiếu.
                  </div>
                </section>

                <div className="trf-create-bottom">
                  <section className="trf-create-card trf-create-checks">
                    <div className="trf-create-card__head">
                      <span>3</span>
                      <h3>Kiểm tra &amp; xác minh</h3>
                    </div>
                    <ul>
                      {draftChecks.map((check) => (
                        <li key={check.label} className={check.valid ? "is-valid" : "is-invalid"}>
                          <CircleCheck size={15} />
                          {check.label}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="trf-create-card">
                    <div className="trf-create-card__head">
                      <span>4</span>
                      <h3>Thông tin vận chuyển</h3>
                    </div>
                    <div className="trf-create-fields">
                      <label className="trf-create-field">
                        <span>Phương thức vận chuyển <b>*</b></span>
                        <select name="shippingMethod" required defaultValue="Xe nội bộ">
                          <option>Xe nội bộ</option>
                          <option>Đơn vị vận chuyển</option>
                          <option>Tự điều phối</option>
                        </select>
                      </label>
                      <label className="trf-create-field">
                        <span>Người bàn giao <b>*</b></span>
                        <select name="sender" required defaultValue={data.staff[0]?.name ?? "Nguyễn An"}>
                          {data.staff.map((member) => (
                            <option key={member.id} value={member.name}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="trf-create-field">
                        <span>Người nhận hàng <b>*</b></span>
                        <select name="receiver" required defaultValue={data.staff[1]?.name ?? data.staff[0]?.name ?? "Nguyễn An"}>
                          {data.staff.map((member) => (
                            <option key={member.id} value={member.name}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="trf-create-field">
                        <span>Thời gian giao dự kiến <b>*</b></span>
                        <input type="time" name="deliveryTime" defaultValue="09:00" required />
                      </label>
                      <label className="trf-create-field">
                        <span>Mã vận chuyển</span>
                        <input name="trackingCode" placeholder="VD: VC-2026-001" />
                      </label>
                      <label className="trf-create-field">
                        <span>Ghi chú vận chuyển</span>
                        <input name="shippingNote" placeholder="Hàng dễ vỡ, xin nhẹ tay..." />
                      </label>
                    </div>
                  </section>
                </div>
              </div>

              <aside className="trf-create-summary">
                <div className="trf-create-summary__head">
                  <Truck size={17} />
                  <h3>Tóm tắt phiếu chuyển</h3>
                </div>
                <div className="trf-create-summary__route">
                  <Warehouse size={24} />
                  <div>
                    <strong>{shortBranch(draftSource)} → {shortBranch(draftDestination)}</strong>
                    <small>Dự kiến: {formatDate(draftExpectedDate)}</small>
                  </div>
                </div>
                <div className="trf-create-summary__code">
                  <span>Mã phiếu</span>
                  <strong>{draftTransferCode}</strong>
                </div>
                <div className="trf-create-summary__items">
                  <div className="trf-create-summary__label">
                    Danh sách hàng hóa
                    <span>{draftLines.length} mặt hàng</span>
                  </div>
                  {draftItems.map(({ key, product, qty }, index) => (
                    <div className="trf-create-summary__item" key={key}>
                      <PackageCheck size={18} />
                      <div>
                        <strong>{product?.name ?? "Chọn sản phẩm"}</strong>
                        <small>
                          {product
                            ? `Lô ${product.batch} · HSD ${formatDate(product.expiry)}`
                            : "Chưa chọn lô hàng"}
                        </small>
                        <small className="trf-create-summary__item-code">
                          Mã dòng: {draftLineCode(index)}
                        </small>
                        <small>Số lượng: {Number(qty) || 0}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="trf-create-summary__total">
                  <span>Tổng số lượng</span>
                  <strong>{draftTotalQty}</strong>
                </div>
                <div className="trf-create-summary__status">
                  Trạng thái sau tạo <b><span /> Chờ xử lý</b>
                </div>
                {error && (
                  <p className="trf-create-error" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" className="trf-create-submit">
                  <Check size={15} />
                  Tạo phiếu chuyển kho
                </Button>
                <Button
                  variant="secondary"
                  className="trf-create-cancel"
                  onClick={() => setCreating(false)}
                >
                  <ChevronLeft size={15} />
                  Quay lại
                </Button>
                <small className="trf-create-summary__hint">
                  Phiếu tạo mới chưa trừ tồn kho; số lượng sẽ được xác minh khi bàn giao.
                </small>
              </aside>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
