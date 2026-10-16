Using the Look3D Design System, generate SCREEN: "3D Warehouse Builder 
— Custom Mode" — Desktop frame 1440×900.

Đây là màn hình để người dùng TỰ DỰNG KHO từ đầu (khác với Dashboard 
chỉ hiển thị kho đã có). Trọng tâm là khả năng KÉO-THẢ, CHỈNH SỬA, 
THÊM/BỚT KỆ, TẦNG, Ô trực tiếp trên canvas 3D.

===============================================================
BỐ CỤC TỔNG THỂ — 5 VÙNG
===============================================================
┌──────────────────────────────────────────────────────────────────┐
│ TOP HEADER (h=64)                                                │
├──────┬────────────────────────────────────────────┬──────────────┤
│ LEFT │         CENTER 3D CANVAS                   │  RIGHT       │
│ 240  │         (WebGL thật)                       │  340         │
│      │                                            │              │
│      │   [Floating Mode Toolbar - nổi giữa trên]  │              │
│      │   [Bottom floating: Undo/Save/Preview]     │              │
├──────┴────────────────────────────────────────────┴──────────────┤
│ BOTTOM STATUS BAR (h=48)                                         │
└──────────────────────────────────────────────────────────────────┘

===============================================================
1. TOP HEADER (h=64)
===============================================================
- Trái: Logo Look3D · Breadcrumb "Setup > Floor Plan A > Builder".
- Giữa: dropdown chọn khu vực kho [Khu A ▾] + input "Tên sơ đồ" 
  (inline edit) [Kho CH1 - Tầng trệt].
- Chip trạng thái: "● Unsaved changes" (amber) hoặc "✓ Saved 22:14" (xanh).
- Phải: [↩ Undo] [↪ Redo] | [💾 Save Layout] (Primary xanh) 
  | [▶ Preview Live 3D] (Secondary) | [📄 Export QR PDF] (Ghost).

===============================================================
2. LEFT PANEL (w=240) — ASSET LIBRARY (THƯ VIỆN KỆ)
===============================================================
Header: "Thư viện Kệ" + search nhỏ + dropdown filter [Tất cả ▾].

DANH SÁCH MẪU KỆ (mỗi item là card kéo được, 100×100):
┌──────────────┬──────────────┐
│ [3D thumb]   │ [3D thumb]   │
│ Kệ nhẹ       │ Kệ Pallet    │
│ 3 tầng       │ 5 tầng       │
├──────────────┼──────────────┤
│ Kệ siêu thị  │ Kệ V lỗ      │
├──────────────┼──────────────┤
│ Tủ mát       │ Sàn kho      │
│ (Cold Unit)  │ (Floor Zone) │
├──────────────┼──────────────┤
│ Kệ trưng bày │ Kệ góc       │
└──────────────┴──────────────┘

Mỗi card có:
- Thumbnail 3D isometric xoay nhẹ khi hover.
- Tên mẫu (Inter 12px) + specs nhỏ (VD: "4 tầng · 5 ô/tầng").
- Icon ⠿ (grip) ở góc trên-phải để báo "kéo được".
- Cursor: grab → grabbing khi kéo.
- Hover: viền cyan #00E5FF + shadow nổi.
- Khi kéo: item mờ 50%, GHOST PREVIEW trong suốt theo con trỏ chuột, 
  ghost có outline cyan đứt nét.

Nút cuối panel: [+ Thêm mẫu kệ] (mở modal import GLB hoặc tạo thủ công).

===============================================================
3. CENTER — CANVAS 3D THẬT (WebGL / Three.js / R3F)
===============================================================
NỀN & LƯỚI:
- Sàn kho caro 1m × 1m, grid line #334155, viền khu vực #0066FF.
- Grid phụ 0.5m mờ hơn. Trục X đỏ, trục Z xanh dương ở mép sàn.
- Ánh sáng: 1 directional (trên-trái) + 1 ambient + soft shadow đổ sàn.
- Camera OrbitControls: chuột phải xoay 360°, cuộn zoom, chuột trái pan.

TRẠNG THÁI BAN ĐẦU (Empty State — frame phụ):
- Canvas trống chỉ có sàn caro + text giữa màn hình 
  "Kéo kệ từ Thư viện bên trái vào đây để bắt đầu" 
  + icon mũi tên chỉ sang trái + animation pulse nhẹ.
- Nút gợi ý: [Dùng template có sẵn] [Bắt đầu từ trống].

KHI ĐÃ CÓ KỆ:
- Các kệ render 3D thật, mỗi kệ chia thành các LEVEL (tầng) và BIN (ô).
- Mỗi kệ có label nổi phía trên: "Rack A1" 
  (chip bo tròn, nền rgba(15,23,42,0.85), chữ trắng 12px).
- Khi chưa chọn: outline xám #64748B.
- Khi hover: outline xám sáng hơn + tooltip (tên, số tầng, % lấp đầy).
- Khi ĐANG CHỌN: outline glowing cyan #00E5FF + bounding box + gizmo.

GIZMO & HANDLES KHI CHỌN KỆ:
- 8 corner resize handles (hình vuông nhỏ trắng viền cyan) ở 8 góc khối hộp.
- Kéo handle → thay đổi L × W × H realtime, có measurement line hiện số mm.
- Rotation gizmo: vòng tròn quanh trục Y (màu cyan), kéo xoay, snap 90°.
- Translate gizmo: 3 mũi tên X (đỏ) / Y (xanh lá) / Z (xanh dương).
- Context menu (chuột phải vào kệ): Duplicate · Delete · Lock · Rename.

FLOATING MODE TOOLBAR (nổi giữa-phía trên canvas, dạng viên thuốc):
[🖱 Select] [✥ Move] [↻ Rotate] [⤢ Scale] [＋ Add Bin] [🗑 Delete] 
[⧉ Duplicate] [⊞ Snap: ON/OFF] [📏 Measure]
- Mode đang active: nền cyan #00E5FF, chữ đen.
- Chuyển mode → con trỏ chuột đổi icon tương ứng.

FLOATING BOTTOM BAR (nổi dưới canvas):
[↩ Undo] [↪ Redo] · [🔍 Zoom -] [100%] [🔍 Zoom +] · [🎯 Reset camera] 
· [⛶ Fullscreen] · [👁 Toggle grid] · [📐 Toggle ruler].

MINI-MAP (góc dưới-phải):
- Hình chữ nhật bo góc 160×120, viền cyan #00E5FF.
- Thu nhỏ toàn kho (2D top-down) + khung vuông chỉ vùng camera đang xem.
- Kéo khung để di chuyển camera.

THAO TÁC KÉO-THẢ (chi tiết):
1. Kéo card kệ từ Left Panel → ghost preview hiện trên canvas theo con trỏ.
2. Ghost snap vào lưới 0.1m, có outline cyan đứt nét.
3. Thả xuống vị trí hợp lệ → kệ xuất hiện với animation scale-up 200ms 
   + shadow đổ sàn + âm "pop" nhẹ.
4. Thả chồng lên kệ khác → viền đỏ + rung lắc 200ms, kệ không được đặt.
5. Thả ra ngoài sàn → không cho đặt, ghost mờ đi.

THÊM / BỚT TẦNG & Ô (thao tác trực tiếp trên 3D):
- Hover lên mép trên kệ → hiện nút [+] để thêm tầng (mỗi lần +1 tầng).
- Hover lên mép ngang 1 tầng → hiện nút [+] để thêm ô (bin) vào tầng đó.
- Chuột phải vào 1 tầng → menu "Xoá tầng này".
- Chuột phải vào 1 ô → menu "Xoá ô này" / "Đổi màu ô" / "Gán SKU".

===============================================================
4. RIGHT PANEL (w=340) — PROPERTIES (LIVE EDITING)
===============================================================
Tiêu đề: "Thuộc tính Kệ" + nút [×] đóng + tab [Thông tin] [Kích thước] 
[Sức chứa] [QR & Tem].

TAB "THÔNG TIN":
- Rack Name: [Rack A1] (input).
- Loại kệ: [Kệ nhẹ 3 tầng ▾] (dropdown).
- Ghi chú: textarea nhỏ "Vị trí gần cửa kho...".
- Toggle: "Cho phép xếp chồng pallet".

TAB "KÍCH THƯỚC" (slider + number input, đơn vị mm):
- Dài (L): [1200] mm — slider 400–3000.
- Rộng (W): [600] mm — slider 300–1500.
- Cao (H): [1800] mm — slider 800–3000.
- Số tầng (Levels): [4] — slider 1–6.
- Số ô mỗi tầng (Bins/Level): [5] — slider 1–10.
→ Khi thay đổi, mô hình 3D cập nhật REALTIME, có animation morph nhẹ.

TAB "SỨC CHỨA":
- Weight limit mỗi tầng: [50] kg.
- Progress bar cho từng tầng (T1: 20/50, T2: 35/50, T3: 10/50, T4: 0/50).
- Tổng sức chứa: 200 kg · Đang dùng: 65 kg (32.5%).

TAB "QR & TEM":
- Preview QR 128×128 (mã "LOC-A1-L2-B03") màu đen trên trắng.
- Text mã (JetBrains Mono) + nút [📋 Copy].
- Nút [🖨 In tem QR] + [📄 In tất cả tem của kệ này].
- Toggle: "In kèm tên kệ + tầng + ô".

NÚT HÀNH ĐỘNG CUỐI PANEL:
- [💾 Lưu thay đổi] (Primary xanh #0066FF, full width).
- [⧉ Nhân bản kệ] (Secondary).
- [🗑 Xoá kệ] (Danger ghost).

KHI CHƯA CHỌN KỆ NÀO (empty state panel):
- Icon minh hoạ + text "Chọn một kệ trên sơ đồ để chỉnh sửa".
- Checklist hướng dẫn nhanh 5 bước:
  1. Kéo kệ từ Thư viện.
  2. Chỉnh kích thước ở tab Kích thước.
  3. Thêm/bớt tầng, ô tuỳ ý.
  4. In tem QR dán lên kệ.
  5. Lưu sơ đồ để dùng cho nhập/xuất kho.

===============================================================
5. BOTTOM STATUS BAR (h=48)
===============================================================
- Số kệ: 12 · Tổng tầng: 48 · Tổng ô: 240 · % lấp đầy sơ đồ: 0%.
- Trạng thái lưới: "Snap 0.1m ✓".
- Gợi ý thao tác: "Giữ Shift để chọn nhiều kệ · Giữ Alt để nhân bản".

===============================================================
6. CÁC TRẠNG THÁI / FRAME PHỤ CẦN TẠO
===============================================================
① Empty state — canvas trống + hướng dẫn kéo kệ.
② Đang kéo kệ từ toolbar → ghost preview + ghost snap lưới.
③ Đã chọn kệ → outline cyan + resize handles + rotation gizmo.
④ Thả sai vị trí → viền đỏ + rung.
⑤ Modal "Xác nhận xoá kệ": "Bạn có chắc muốn xoá Rack A1? 
   Hành động này không thể hoàn tác."
⑥ Modal "Tạo & In QR hàng loạt": danh sách kệ checkbox + preview 
   sheet PDF A4 (grid tem 3×4) + [📄 Tải PDF] [🖨 In trực tiếp].
⑦ Chế độ "Preview Live 3D": camera hạ xuống 1.6m ngang tầm mắt nhân viên, 
   mũi tên cyan chỉ đường, overlay "Rack A1 — L2 — B03", 
   nút [🔊 Voice guide] [↩ Thoát].

===============================================================
QUY TẮC BẮT BUỘC
===============================================================
1. Canvas 3D = WebGL THẬT (Three.js / R3F). KHÔNG CSS perspective.
2. Mọi thao tác kéo-thả phải có ghost preview + snap lưới.
3. Resize/rotate phải có gizmo + measurement line realtime.
4. Thêm/bớt tầng & ô thực hiện trực tiếp trên 3D (hover edge → nút [+])
   HOẶC qua slider trong Right Panel — cả 2 cách đều hoạt động.
5. Không có UI nào tự động đề xuất xuất kho.
6. Contrast WCAG AA, focus ring 2px cyan, touch target ≥ 44px 
   (dù đây là desktop nhưng vẫn cần cho tablet).
7. Motion: hover 150ms, morph kệ 200ms, camera 500ms.