import test from "node:test"
import assert from "node:assert/strict"
import { createTransferSlip, transferLines } from "../src/app/model.ts"

const details = {
  plannedDate: "2026-11-02",
  expectedDate: "2026-11-03",
  responsible: "Nguyễn An",
  reason: "Bổ sung hàng bán",
  note: "",
  shippingMethod: "Xe nội bộ",
  sender: "",
  receiver: "",
  deliveryTime: "",
  trackingCode: "",
  shippingNote: "",
}

test("one transfer slip contains all selected items and sums their quantities", () => {
  const lines = [
    { id: "BABY-004|LOT-1", productId: "BABY-004", batch: "LOT-1", qty: 2 },
    { id: "BABY-007|LOT-2", productId: "BABY-007", batch: "LOT-2", qty: 3 },
    { id: "BABY-001|LOT-3", productId: "BABY-001", batch: "LOT-3", qty: 1 },
  ]
  const slip = createTransferSlip({
    id: "TRF-20261102-001",
    from: "Kho trung tâm",
    to: "Chi nhánh Quận 3",
    created: "2026-11-02",
    history: ["Đã tạo phiếu gồm 3 mặt hàng"],
    details,
    lines,
  })

  assert.ok(slip)
  assert.equal(slip.id, "TRF-20261102-001")
  assert.equal(slip.qty, 6)
  assert.deepEqual(transferLines(slip), lines)
})

test("empty transfer slips are rejected and older single-item transfers remain readable", () => {
  assert.equal(
    createTransferSlip({
      id: "TRF-20261102-001",
      from: "Kho trung tâm",
      to: "Chi nhánh Quận 3",
      created: "2026-11-02",
      history: [],
      details,
      lines: [],
    }),
    undefined,
  )

  const legacy = {
    id: "legacy-001",
    productId: "BABY-004",
    batch: "LOT-1",
    from: "Kho trung tâm",
    to: "Chi nhánh Quận 3",
    qty: 4,
    status: "Chuẩn bị",
    created: "2026-11-02",
    history: [],
    reserved: true,
    received: 2,
  }
  assert.deepEqual(transferLines(legacy), [
    {
      id: "BABY-004:LOT-1",
      productId: "BABY-004",
      batch: "LOT-1",
      qty: 4,
      sent: true,
      received: 2,
    },
  ])
})
