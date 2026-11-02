import {
  INDUSTRIES,
  type Industry,
  type IndustryConfig,
} from "../shared/config/industries"

export type Screen = "putaway" | "trial-info" | "home" | "login" | "request" | "industry-picker" | "dashboard" | "builder" | "warehouse" | "mobile" | "onboarding" | "batches" | "inventory" | "roi" | "scanner" | "account" | "settings" | "admin" | "website-editor"
export type Role = "owner" | "manager" | "warehouse" | "sales" | "platform"
export const roleNames: Record<Role, string> = {
  owner: "Chủ doanh nghiệp",
  manager: "Quản lý kho",
  warehouse: "Nhân viên kho",
  sales: "Nhân viên bán hàng",
  platform: "Quản trị WareMap",
}
export const branches = [
  "Kho trung tâm",
  "Chi nhánh Quận 3",
  "Chi nhánh Thủ Đức",
]
export const policy = {
  single: 149000,
  chain: 399000,
  branchBlock: 199000,
  accountBlock: 99000,
  includedBranches: 5,
  includedStaff: 4,
  blockSize: 2,
}
export function quote(locations: number, staff: number) {
  locations = Math.max(
    1,
    Math.trunc(Number.isFinite(locations) ? locations : 1),
  )
  staff = Math.max(0, Math.trunc(Number.isFinite(staff) ? staff : 0))
  const base = locations === 1 ? policy.single : policy.chain
  const branchExtra =
    Math.ceil(
      Math.max(0, locations - policy.includedBranches) / policy.blockSize,
    ) * policy.branchBlock
  const staffExtra =
    Math.ceil(Math.max(0, staff - (locations === 1 ? 4 : 18)) / policy.blockSize) *
    policy.accountBlock
  return {
    base,
    branchExtra,
    staffExtra,
    total: base + branchExtra,
  }
}
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ"
const localDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
export const today = () => localDate(new Date())
const dayOffset = (offset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return localDate(date)
}
export const dateLabel = (date: string) =>
  new Date(date + "T00:00:00").toLocaleDateString("vi-VN")
export const daysLeft = (date: string) =>
  Math.ceil(
    (Date.parse(date + "T00:00:00") - Date.parse(today() + "T00:00:00")) /
      86400000,
  )
export const expiryLabel = (date: string) => {
  const d = daysLeft(date)
  return d < 0
    ? `Đã hết hạn ${-d} ngày`
    : d === 0
      ? "Hết hạn hôm nay"
      : `Còn ${d} ngày`
}
export interface ProductPackage {
  widthCm: number
  depthCm: number
  heightCm: number
  shape: "box" | "bottle" | "jar" | "tube"
}
export interface Product {
  id: string
  name: string
  variant: string
  category: string
  batch: string
  expiry: string
  qty: number
  branch: string
  rack: string
  level: number
  bin: number
  package3d?: ProductPackage
  storage3d?: {layers: number; stackable: boolean; unitsPerContainer?: number; containerPackage?: ProductPackage}
}
export const locationLabel = (p: Pick<Product, "rack" | "level" | "bin">) =>
  `Kệ ${p.rack} · Tầng ${p.level} · Ô ${String(p.bin).padStart(2, "0")}`
export const positionCode = (
  p: Pick<Product, "branch" | "rack" | "level" | "bin">,
) => `LOC:${branches.indexOf(p.branch)}:${p.rack}:${p.level}:${p.bin}`
const sampleLocations = [
  { rack: "A1", level: 2, bin: 2 },
  { rack: "A2", level: 1, bin: 3 },
  { rack: "B1", level: 2, bin: 1 },
]
const sampleTransferIds = new Set(
  Array.from({ length: 8 }, (_, index) => `CK-00${index + 1}`),
)
// Includes the mixed-industry rows seeded before demo data became industry-aware.
export const sampleProductIds = new Set([
  "WM-001",
  "WM-002",
  "WM-003",
  "WM-004",
  "WM-005",
  "WM-006",
  ...Object.values(INDUSTRIES).flatMap((config) =>
    config.sampleSKUs.map((sku) => sku.sku),
  ),
])
const sampleExpiryISO = (value: string) => {
  const [day, month, year] = value.split("/")
  return `${year}-${month}-${day}`
}
export function industryProducts(config: IndustryConfig): Product[] {
  return config.sampleSKUs.map((sku, index) => {
    const batch = config.sampleBatches[index % config.sampleBatches.length]
    return {
      id: sku.sku,
      name: sku.name,
      variant: sku.unit,
      category: sku.category,
      batch: batch.lot,
      expiry: sampleExpiryISO(batch.expiry),
      qty: batch.qty,
      branch: branches[index % branches.length],
      ...sampleLocations[index % sampleLocations.length],
    }
  })
}
export interface Rack {
  id: string
  name: string
  x: number
  z: number
  rotation: number
  width: number
  depth: number
  height: number
  levels: number
  bins: number
  kind: string
}
export const initialRacks: Rack[] = [
  {
    id: "A1",
    name: "Kệ A1",
    x: -3,
    z: 0,
    rotation: 0,
    width: 2,
    depth: 1,
    height: 2.4,
    levels: 3,
    bins: 3,
    kind: "Kệ hàng",
  },
  {
    id: "A2",
    name: "Kệ A2",
    x: 0,
    z: 0,
    rotation: 0,
    width: 2,
    depth: 1,
    height: 2.4,
    levels: 3,
    bins: 3,
    kind: "Kệ hàng",
  },
  {
    id: "A3",
    name: "Kệ A3",
    x: 3,
    z: 0,
    rotation: 0,
    width: 2,
    depth: 1,
    height: 2.4,
    levels: 3,
    bins: 3,
    kind: "Kệ hàng",
  },
  {
    id: "B1",
    name: "Kệ B1",
    x: -3,
    z: 3,
    rotation: 0,
    width: 2,
    depth: 1,
    height: 2,
    levels: 3,
    bins: 3,
    kind: "Kệ hàng",
  },
]
export type TransferStatus = "Chuẩn bị" | "Đang chuyển" | "Kiểm nhận" | "Hoàn tất"
export interface TransferDetails {
  plannedDate: string
  expectedDate: string
  responsible: string
  reason: string
  note: string
  shippingMethod: string
  sender: string
  receiver: string
  deliveryTime: string
  trackingCode: string
  shippingNote: string
}
export interface TransferLine {
  id: string
  productId: string
  batch: string
  qty: number
  sent?: boolean
  received?: number
}
export interface Transfer {
  id: string
  productId: string
  batch: string
  from: string
  to: string
  qty: number
  received?: number
  status: TransferStatus
  created: string
  history: string[]
  reserved: boolean
  details?: TransferDetails
  lines?: TransferLine[]
}
export function createTransferSlip(input: {
  id: string
  from: string
  to: string
  created: string
  history: string[]
  details: TransferDetails
  lines: TransferLine[]
}): Transfer | undefined {
  const firstLine = input.lines[0]
  if (!firstLine) return undefined
  return {
    ...input,
    productId: firstLine.productId,
    batch: firstLine.batch,
    qty: input.lines.reduce((total, line) => total + line.qty, 0),
    status: "Chuẩn bị",
    reserved: false,
  }
}
export function transferLines(transfer: Transfer): TransferLine[] {
  return transfer.lines ?? [
    {
      id: `${transfer.productId}:${transfer.batch}`,
      productId: transfer.productId,
      batch: transfer.batch,
      qty: transfer.qty,
      sent: transfer.reserved,
      received: transfer.received,
    },
  ]
}
// Display code for the transfer list. Internal ids stay stable so saved data,
// scan tasks and history continue to point at the same transfer.
export function transferDisplayId(
  transfer: Pick<Transfer, "id" | "created">,
): string {
  if (transfer.id.startsWith("TRF-")) return transfer.id
  const sequence = transfer.id.match(/(\d+)$/)?.[1] ?? "001"
  return `TRF-${transfer.created.replace(/-/g, "")}-${sequence.padStart(3, "0")}`
}
export function industryTransfers(items: Product[]): Transfer[] {
  // Keep demo transfers on lots that are still usable; the first sample lot in
  // some industries is already expired and would be blocked by the create form.
  const safeItems = items.filter((item) => daysLeft(item.expiry) >= 0)
  const pool = safeItems.length ? safeItems : items
  if (!pool.length) return []
  const creators = ["Nguyễn An", "Minh Anh", "Hoàng Nam"]
  const times = [
    "08:45",
    "09:20",
    "10:05",
    "11:10",
    "13:30",
    "14:15",
    "15:40",
    "16:20",
  ]
  const statuses: TransferStatus[] = [
    "Đang chuyển",
    "Kiểm nhận",
    "Hoàn tất",
    "Chuẩn bị",
    "Kiểm nhận",
    "Chuẩn bị",
    "Hoàn tất",
    "Đang chuyển",
  ]
  return statuses.map((status, index): Transfer => {
    const item = pool[index % pool.length]
    const sourceIndex = Math.max(0, branches.indexOf(item.branch))
    const from = branches[sourceIndex]
    const to = branches[(sourceIndex + 1) % branches.length]
    const qty = Math.max(
      4,
      Math.min(24, Math.round(item.qty / 10) + (index % 3)),
    )
    const received =
      status === "Hoàn tất"
        ? qty
        : status === "Kiểm nhận"
          ? index === 1
            ? Math.max(1, qty - 3)
            : qty
          : undefined
    const history = [
      `Đã tạo phiếu · ${creators[index % creators.length]} · ${times[index]}`,
    ]
    if (status !== "Chuẩn bị") {
      history.push("Đã nhặt hàng & đóng gói · Hoàn tất")
      history.push("Đã bàn giao cho đơn vị vận chuyển")
    }
    if (status === "Kiểm nhận" || status === "Hoàn tất") {
      history.push(`Đã kiểm nhận ${received ?? 0}/${qty} sản phẩm`)
    }
    if (status === "Hoàn tất") history.push("Đã nhập hàng lên kệ")
    return {
      id: `CK-00${index + 1}`,
      productId: item.id,
      batch: item.batch,
      from,
      to,
      qty,
      received,
      status,
      created: dayOffset(-index),
      history,
      reserved: status !== "Chuẩn bị",
    }
  })
}
export interface Staff {
  id: string
  name: string
  email: string
  role: Exclude<Role, "owner" | "platform">
  branch: string
  active: boolean
}
export interface AccessRequest {
  id: string
  kind: "Đăng ký sử dụng" | "Cấp tài khoản" | "Tăng hạn mức" | "Hỗ trợ tài khoản"
  company: string
  name: string
  email: string
  branches: number
  count: number
  reason: string
  role: Staff["role"]
  branch: string
  status: "Chờ duyệt" | "Cần bổ sung" | "Đã cấp" | "Từ chối"
  note: string
  date: string
}
export interface Activity {
  id: string
  title: string
  detail: string
  time: string
}
export interface InboundCarton {
  id: string
  code: string
  product: Product
  status: "pending" | "stored"
  createdAt: string
  storedAt?: string
  placement?: {rack: string; level: number; bin: number}
}
export interface DemoData {
  inboundCartons?: InboundCarton[]
  version: number
  industry: Industry
  trialDemo?: boolean
  industryConfirmed?: boolean
  products: Product[]
  racks: Record<string, Rack[]>
  transfers: Transfer[]
  staff: Staff[]
  requests: AccessRequest[]
  activities: Activity[]
  allowance: number
  locations: number
  company: string
  settings: {
    expiryDays: number
    notifications: boolean
    pos: boolean
    zalo: boolean
  }
  release: string
  releaseNote: string
}
export function withIndustrySamples(
  data: DemoData,
  config: IndustryConfig,
): DemoData {
  const demoProducts = industryProducts(config)
  return {
    ...data,
    industry: config.id,
    products: [
      ...demoProducts,
      ...data.products.filter((p) => !sampleProductIds.has(p.id)),
    ],
    transfers: [
      ...industryTransfers(demoProducts),
      ...data.transfers.filter(
        (t) =>
          !sampleTransferIds.has(t.id) && !sampleProductIds.has(t.productId),
      ),
    ],
  }
}
export function ensureIndustrySamples(
  data: DemoData,
  config: IndustryConfig,
): DemoData {
  const existingIds = new Set(data.products.map((product) => product.id))
  const missing = industryProducts(config).filter(
    (product) => !existingIds.has(product.id),
  )
  return missing.length
    ? { ...data, products: [...data.products, ...missing] }
    : data
}
export function ensureTransferSamples(
  data: DemoData,
  config: IndustryConfig,
): DemoData {
  // Only expand untouched sample data. As soon as the user creates their own
  // transfer, never inject additional demo rows into their workspace.
  if (!data.transfers.every((transfer) => sampleTransferIds.has(transfer.id))) {
    return data
  }
  const expected = industryTransfers(industryProducts(config))
  const missing = expected.filter(
    (transfer) =>
      !data.transfers.some((existing) => existing.id === transfer.id),
  )
  if (!missing.length) return data
  return {
    ...data,
    transfers: [...data.transfers, ...missing].sort(
      (a, b) => b.created.localeCompare(a.created) || a.id.localeCompare(b.id),
    ),
  }
}

export function seed(config: IndustryConfig): DemoData {
  const demoProducts = industryProducts(config)
  return {
    version: 3,
    industry: config.id,
    products: demoProducts,
    racks: Object.fromEntries(
      branches.map((b) => [b, initialRacks.map((r) => ({ ...r }))]),
    ),
    transfers: industryTransfers(demoProducts),
    staff: [
      {
        id: "NV-001",
        name: "Nguyễn An",
        email: "an@example.com",
        role: "manager",
        branch: branches[0],
        active: true,
      },
      {
        id: "NV-002",
        name: "Minh Anh",
        email: "minhanh@example.com",
        role: "warehouse",
        branch: branches[1],
        active: true,
      },
      {
        id: "NV-003",
        name: "Hoàng Nam",
        email: "nam@example.com",
        role: "sales",
        branch: branches[2],
        active: true,
      },
    ],
    requests: [],
    activities: [],
    allowance: 18,
    locations: 3,
    company: "An Nhiên Retail",
    settings: { expiryDays: 30, notifications: true, pos: false, zalo: false },
    release: "1.0",
    releaseNote: "Chào mừng bạn đến với WareMap System.",
  }
}
