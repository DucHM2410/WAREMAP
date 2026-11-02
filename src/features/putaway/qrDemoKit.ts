import { branches, positionCode, type DemoData, type InboundCarton, type Role } from "../../app/model"
import { INDUSTRIES } from "../../shared/config/industries"
import { WAREHOUSE_PERMISSIONS } from "../../app/warehousePermissions"
import { assessPutaway, type PutawayRequest } from "./putaway"

export function demoRequest(locationCode: string, cartonCode: string, role: Role, allowedBranches: string[], today: string): PutawayRequest {
  return { locationCode, cartonCode, role, allowedBranches, branchNames: branches, today, stacking: false, layers: 1, confirmedPackaging: false, unmeasuredAck: false, separatedAck: false }
}

// Reuse an unfinished kit, even after a refresh. Preparing labels never changes stock.
export function prepareDemoKit(data: DemoData, role: Role, allowedBranches: string[], branch: string, today: string, token: string) {
  const fail = (error: string) => ({ data, carton: null, error })
  if (!WAREHOUSE_PERMISSIONS[role].putaway) return fail("Vai trò này chỉ được tra cứu, không được chuẩn bị hàng nhập.")
  if (!allowedBranches.includes(branch) || !branches.includes(branch)) return fail("Chọn cơ sở được cấp quyền trước khi chuẩn bị bộ QR.")
  const existing = data.inboundCartons?.find(c => c.status === "pending" && c.product.branch === branch && c.qrDemo?.industry === data.industry)
  if (existing) return { data, carton: existing, error: "" }
  const code = `CTN:DEMO-${token}`
  if (!/^[A-Za-z0-9_-]{3,50}$/.test(token) || data.inboundCartons?.some(c => c.code === code)) return fail("Mã lượt demo bị trùng. Hãy chuẩn bị lại.")
  const sku = INDUSTRIES[data.industry].sampleSKUs[0]
  const expiry = new Date(today + "T12:00:00Z")
  expiry.setUTCDate(expiry.getUTCDate() + 180)
  const carton: InboundCarton = {
    id: `qr-demo-${token}`, code, status: "pending", createdAt: new Date().toISOString(),
    product: {
      id: sku.sku, name: sku.name, variant: sku.unit, category: sku.category,
      batch: `DEMO-${token}`, expiry: expiry.toISOString().slice(0, 10), qty: 20,
      branch, rack: "", level: 1, bin: 1,
      package3d: data.industry === "mom-baby"
        ? { widthCm: 12, depthCm: 12, heightCm: 20, shape: "box" }
        : { widthCm: 4, depthCm: 4, heightCm: 10, shape: "tube" },
    },
  }
  const next = { ...data, inboundCartons: [carton, ...data.inboundCartons || []] }
  for (const rack of data.racks[branch] || []) {
    for (let level = 1; level <= rack.levels; level++) {
      for (let bin = 1; bin <= rack.bins; bin++) {
        if (data.products.some(p => p.branch === branch && p.rack === rack.id && p.level === level && p.bin === bin && p.qty > 0)) continue
        const locationCode = positionCode({ branch, rack: rack.id, level, bin })
        if (assessPutaway(next, demoRequest(locationCode, code, role, allowedBranches, today)).error) continue
        carton.qrDemo = { industry: data.industry, locationCode }
        return { data: next, carton, error: "" }
      }
    }
  }
  return fail("Chưa có ô trống đủ chỗ cho 20 sản phẩm mẫu. Thêm kệ hoặc tạo thùng với số lượng phù hợp; dữ liệu hiện tại vẫn được giữ.")
}
