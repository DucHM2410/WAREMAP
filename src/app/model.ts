export type Screen = "home" | "login" | "request" | "dashboard" | "builder" | "warehouse" | "mobile" | "onboarding" | "batches" | "inventory" | "roi" | "scanner" | "account" | "settings" | "admin"
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
  single: 99000,
  chain: 299000,
  branchBlock: 150000,
  accountBlock: 60000,
  includedBranches: 5,
  includedStaff: 5,
  blockSize: 5,
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
    Math.ceil(Math.max(0, staff - policy.includedStaff) / policy.blockSize) *
    policy.accountBlock
  return {
    base,
    branchExtra,
    staffExtra,
    total: base + branchExtra + staffExtra,
  }
}
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ"
const localDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
export const today = () => localDate(new Date())
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
const offsetDate = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return localDate(date)
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
}
export const locationLabel = (p: Pick<Product, "rack" | "level" | "bin">) =>
  `Kệ ${p.rack} · Tầng ${p.level} · Ô ${String(p.bin).padStart(2, "0")}`
export const positionCode = (
  p: Pick<Product, "branch" | "rack" | "level" | "bin">,
) => `LOC:${branches.indexOf(p.branch)}:${p.rack}:${p.level}:${p.bin}`
export const products: Product[] = [
  {
    id: "WM-001",
    name: "Son dưỡng Daily Care",
    variant: "Hồng nhạt · 4g",
    category: "Chăm sóc cá nhân",
    batch: "LO-001",
    expiry: offsetDate(23),
    qty: 120,
    branch: branches[0],
    rack: "A2",
    level: 2,
    bin: 3,
  },
  {
    id: "WM-002",
    name: "Kem dưỡng Moisture",
    variant: "50ml",
    category: "Chăm sóc cá nhân",
    batch: "LO-002",
    expiry: offsetDate(45),
    qty: 80,
    branch: branches[0],
    rack: "A1",
    level: 1,
    bin: 2,
  },
  {
    id: "WM-003",
    name: "Sữa bột Grow Plus",
    variant: "800g",
    category: "Mẹ & Bé",
    batch: "LO-003",
    expiry: offsetDate(12),
    qty: 60,
    branch: branches[1],
    rack: "B1",
    level: 2,
    bin: 1,
  },
  {
    id: "WM-004",
    name: "Nước giặt dịu nhẹ",
    variant: "1 lít",
    category: "Hàng tiêu dùng",
    batch: "LO-004",
    expiry: offsetDate(180),
    qty: 96,
    branch: branches[0],
    rack: "A3",
    level: 1,
    bin: 1,
  },
  {
    id: "WM-005",
    name: "Bánh ăn dặm Organic",
    variant: "Vị chuối · 50g",
    category: "Mẹ & Bé",
    batch: "LO-005",
    expiry: offsetDate(-4),
    qty: 24,
    branch: branches[2],
    rack: "A1",
    level: 2,
    bin: 2,
  },
  {
    id: "WM-006",
    name: "Kem chống nắng Daily",
    variant: "SPF50 · 30ml",
    category: "Chăm sóc cá nhân",
    batch: "LO-006",
    expiry: offsetDate(240),
    qty: 144,
    branch: branches[1],
    rack: "A3",
    level: 1,
    bin: 3,
  },
]
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
}
export const initialTransfers: Transfer[] = [
  {
    id: "CK-001",
    productId: "WM-001",
    batch: "LO-001",
    from: branches[0],
    to: branches[1],
    qty: 20,
    status: "Chuẩn bị",
    created: today(),
    history: ["Đã tạo phiếu · Nguyễn An"],
    reserved: false,
  },
  {
    id: "CK-002",
    productId: "WM-002",
    batch: "LO-002",
    from: branches[0],
    to: branches[2],
    qty: 10,
    status: "Chuẩn bị",
    created: today(),
    history: ["Đã tạo phiếu · Minh Anh"],
    reserved: false,
  },
]
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
export interface DemoData {
  version: number
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
export function seed(): DemoData {
  return {
    version: 3,
    products,
    racks: Object.fromEntries(
      branches.map((b) => [b, initialRacks.map((r) => ({ ...r }))]),
    ),
    transfers: initialTransfers,
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
    allowance: 5,
    locations: 3,
    company: "An Nhiên Retail",
    settings: { expiryDays: 30, notifications: true, pos: false, zalo: false },
    release: "1.0",
    releaseNote: "Chào mừng bạn đến với WareMap System.",
  }
}
