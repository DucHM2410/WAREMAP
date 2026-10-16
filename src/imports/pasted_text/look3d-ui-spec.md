Continue building the Look3D Smart 3D Warehouse System UI using the 
Design System already created (Primary #0066FF, Cyan #00E5FF, 
Success #10B981, Warning #F59E0B, Alert #EF4444, Dark Canvas #0F172A, 
Light Panel #F8FAFC, font Inter).

===============================================================
SCREEN 1 — DESKTOP 1440×900 — MAIN 3D DASHBOARD
===============================================================
Top Bar (h=56): Logo Look3D · Search "Search SKU, Batch, Rack..." 
· [+ Inbound] [Outbound Pick] [📷 Scan QR] · bell + avatar.
Left Nav (w=72, icon-only + tooltip): 3D Map (active) · Inventory 
· Inbound · Outbound · 3D Builder · Reports · Settings.

CENTER — CANVAS 3D THẬT (WebGL/Three.js/R3F), 70% width:
- Nền #0F172A, sàn grid caro 1m, line #334155.
- 4 kệ 3D khối hộp thật (Rack A1, A2, B1, B2), mỗi kệ 4 tầng × 5 ô.
- Directional + ambient light, soft shadow đổ sàn.
- OrbitControls (phải xoay 360°, cuộn zoom, trái pan).
- Raycast click kệ/ô. Rack A1–Level 2–Bin 03 đang chọn: outline cyan 
  #00E5FF glowing.
- Label 3D nổi trên mỗi kệ ("Rack A1" chip bo tròn, nền 
  rgba(15,23,42,0.85), chữ trắng 12px).
- Ô màu theo trạng thái: trống xám, có hàng xanh, cận hạn <30d đỏ 
  nhấp nháy, 30–90d vàng.
- Góc trên-phải: gizmo XYZ + floating widget [🔍 Zoom] [🔄 Rotate] 
  [🎯 Reset] [⛶ Fullscreen].
- Góc dưới-phải: MINI-MAP 2D kho + khung vuông chỉ vùng camera (viền cyan).
- Ruler đo khoảng cách 2 kệ (mm).

RIGHT PANEL (30%) — Detail Panel:
- Header "Rack A1 — Level 2 — Bin 03" + [✏ Sửa] [× Đóng].
- Occupancy gauge SVG arc 85% cyan.
- Batch table dày: SKU | Batch ID | Qty | Expiry | Status badge 
  (FEFO: <30d đỏ, 30–90d vàng, >90d xanh; hết hạn gạch ngang + "EXPIRED").
- ⚠️ CHỈ hiển thị để tham khảo — KHÔNG auto-suggest xuất kho.
- Stock bar chart mini + [🖨 In tem QR] [🕒 Audit log].

Bottom Bar (h=48): Total Racks 48 · Capacity 72% · Expiry Alerts 6 
· Last scan 22:14 · ●Online.

===============================================================
SCREEN 2 — DESKTOP 1440×900 — 3D WAREHOUSE BUILDER
===============================================================
Header: Breadcrumb "Setup > Floor Plan A" · chip "Unsaved" (amber) 
· [💾 Save Layout] [▶ Preview Live 3D] [📄 Export QR PDF].

LEFT PANEL (260px) — Asset Library:
- Grid 2 cột card 80×80 thumbnail 3D: Light Rack 3-Tier · Heavy Pallet 
  Rack 5-Tier · Shelf Unit · Cold Unit · Floor Zone.
- DRAG-AND-DROP vào canvas: ghost preview trong suốt khi kéo; thả xuống 
  → scale-up 200ms + shadow sàn; thả chồng kệ → viền đỏ + rung 200ms.

CENTER — CANVAS 3D THẬT (builder mode):
- Grid 3D isometric, snap 0.1m.
- Rack A1 đang chọn: 8 corner resize handles + rotation gizmo trục Y 
  (xoay 90° snap) + translate gizmo X/Z.
- Measurement line hiện số đo khi resize. Click ô → chọn ô riêng.

RIGHT PANEL (320px) — Properties live-update:
- Rack Name [Rack A1].
- Dimensions L [1200mm] × W [600mm] × H [1800mm] (slider + number).
- Levels [4] slider 1–6; Bins/Level [5] slider 1–10.
- Weight limit [50kg]; toggle "Cho phép xếp chồng pallet".
- QR section: preview 128×128 + mã "LOC-A1-L2-B03" (JetBrains Mono) 
  + [📋 Copy] [🖨 In tem].
- Capacity progress bar từng tầng.
- [Generate QR Codes] (Primary) · [🗑 Xoá kệ] (Danger ghost).

Bottom Bar: [↩ Undo] [↪ Redo] · Save · Preview Live 3D · Export QR PDF 
· Zoom [—] 100% [+] · Fullscreen.

STATE phụ — "Preview Live 3D": camera hạ xuống 1.6m ngang tầm mắt, 
mũi tên cyan chỉ đường từ cửa kho đến kệ mục tiêu, overlay "Rack A1 — 
Level 2 — Bin 03 — Batch LOT-2026-0912", nút [🔊 Voice guide] [↩ Thoát].

===============================================================
SCREEN 3 — MOBILE 390×844 — DOUBLE-CHECK PICK APP (PWA)
===============================================================
Status bar. Header "Outbound Pick #ORD-8821" + progress bar Step 2/3 
"Scan Batch".

TARGET CARD (viền cyan):
- "GO TO: RACK A1 ➔ LEVEL 2 ➔ BIN 03" cỡ lớn.
- Mini 2D map + mũi tên. Nút [🧭 Mở 3D chỉ đường] (dẫn sang viewport 3D mobile).

CENTER — Camera Scanner (~50% màn):
- Viewfinder bo góc viền cyan 4 góc nhọn, laser đỏ quét dọc loop.
- Text "Align QR Code on Batch". Auto-detect QR.

DETAILS bottom sheet:
- SKU "Paracetamol 500mg" · Batch "BAT-2026-09A" 
· Expiry "FEFO Priority — 15/11/2026" (badge vàng).
- Danh sách "Lô cận hạn khác" — chỉ tham khảo, không auto-pick.

Bottom bar: [🔦 Flashlight] [⌨ Manual Input] + BIG Button 
"Confirm Scan & Update Status" (xanh full width).

3 VARIANTS trạng thái:
① Chờ quét — như trên.
② Quét ĐÚNG: overlay xanh, ✓ lớn, toast "Xuất kho thành công", 
   confetti nhẹ + âm "ting".
③ Quét SAI/HẾT HẠN: overlay đỏ, ⚠ lớn, rung 400ms, nút Confirm 
   DISABLE, lý do "Sai mã lô. Yêu cầu BAT-2026-09A, quét được 
   BAT-2026-08B."

===============================================================
SCREEN 4 — DESKTOP 1440×900 — ONBOARDING NHANH
===============================================================
Header: Logo Look3D + [Bỏ qua].
3 CARD LỚN 360×420 layout 3 cột:
1) "Xem kho 3D" — illustration kệ 3D isometric — "Xem là thấy vị trí".
2) "Quét QR 2 chiều" — scanner + QR + ✓ xanh — "Quét là chuẩn".
3) "Tự vẽ sơ đồ kéo-thả" — tay kéo kệ vào grid 3D — "Kho của bạn, 
   bạn tự vẽ trong 5 phút".
Bottom: progress dots + [▶ Bắt đầu tour 3D] (Primary) + link video HD.
Style: nền #F8FAFC, card trắng, icon flat 3D tone cyan/blue.

===============================================================
SCREEN 5 — DESKTOP 1440×900 — BATCH & EXPIRY MANAGER
===============================================================
Top Bar giống Screen 1, breadcrumb "Inventory > Batches & Expiry", 
action [📤 Export Excel] [🖨 In].
Filter chips: [< 30 ngày] đỏ · [30–90 ngày] vàng · [> 90 ngày] xanh 
· [Đã hết hạn] đỏ đậm · [Tất cả]. Search + sort [HSD tăng dần ▾].

MAIN 2 cột (70/30):
- Trái: TABLE BATCH (dày, sortable): ☐ | SKU | Batch ID | HSD | Qty 
  | Vị trí (Kệ/Tầng/Ô) | Trạng thái | Hành động. Batch cận hạn badge 
  vàng, hết hạn badge đỏ + tên SKU gạch ngang. Click "Vị trí" → mở 
  3D map bên phải.
- Phải: 3D MINI MAP (WebGL thật) highlight ô chứa batch viền cyan, 
  overlay "Rack A1 — L2 — B03" + SKU + Batch + HSD. Nút [🧭 Fullscreen] 
  [🔊 Đọc thông tin].

⚠️ Cột "Hành động" CHỈ chứa hành động do cửa hàng tự định nghĩa 
(vd "Đánh dấu kiểm tra"). KHÔNG auto-suggest xuất kho.
Bottom: pagination + tổng batch + [📊 Báo cáo tồn kho].

===============================================================
QUY TẮC CHUNG BẮT BUỘC (áp dụng mọi màn)
===============================================================
1. Viewport 3D = WebGL THẬT (Three.js / R3F). KHÔNG CSS perspective.
2. Có light + shadow + outline + raycast + orbit + gizmo + mini-map.
3. FEFO: chỉ hiển thị badge màu để nhân viên tham khảo — 
   KHÔNG có UI nào tự động đề xuất xuất kho.
4. Touch target ≥ 44px, contrast WCAG AA, focus ring 2px #0066FF.
5. Dark mode mặc định, có light mode. Fallback thông báo khi 
   trình duyệt không hỗ trợ WebGL.
6. Motion: hover 150ms, camera 3D 500ms, pulse 1s loop.

