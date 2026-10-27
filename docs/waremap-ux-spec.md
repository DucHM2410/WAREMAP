# WAREMAP — Đặc tả giao diện đơn giản hoá (v2)

> Tài liệu này thay thế `docs/ux-simplify-spec.md`. Mọi con số, nhãn và luồng dưới đây là chuẩn để triển khai.

**Sản phẩm:** WAREMAP — quản lý kho 3D cho cửa hàng Mẹ & Bé và Mỹ phẩm.
**Người dùng:** chủ cửa hàng lớn tuổi, nhân viên mới chưa từng dùng phần mềm kho.
**Mục tiêu:** làm được 3 việc chính (tìm hàng, nhập hàng, lấy hàng) trong 10 phút đầu, không cần hỏi ai.

**Ba câu hỏi phần mềm phải trả lời ngay:** hàng ở đâu · còn bao nhiêu · hạn dùng khi nào.

**Không thêm tính năng nào ngoài tài liệu này.** Mọi màn hình dưới đây đều dùng dữ liệu đã có trong bản demo hiện tại (sản phẩm, kệ, lô, phiếu chuyển, nhân viên).

---

## 0. Năm nguyên tắc không được vi phạm

| # | Nguyên tắc | Cách kiểm tra |
|---|---|---|
| 1 | **Mỗi màn một việc, một nút chính** | Đếm nút primary trên màn: phải = 1 |
| 2 | **Không bắt người dùng nhớ** | Mọi màn tự nói: đây là gì → để làm gì → bấm gì tiếp |
| 3 | **Vị trí cố định** | Logo góc trên-trái, 5 mục menu cùng thứ tự, nút chính cùng chỗ ở mọi màn |
| 4 | **Không chỉ dựa vào màu** | Mỗi trạng thái có màu + icon + chữ |
| 5 | **Bàn phím/ngón tay trước** | Mobile: chữ ≥16px, vùng chạm ≥48px; desktop: ≥42px |

---

## 1. Chọn ngành hàng & lần đầu sử dụng

### 1.1 Màn chào — chọn ngành (chỉ hiện 1 lần cho mỗi cơ sở)

**Tiêu đề:** `Cửa hàng của bạn bán gì?`
**Mô tả:** `Chọn một ngành. WareMap sẽ chuẩn bị sẵn mẫu kệ, mẫu kho và màu hiển thị phù hợp. Bạn đổi lại được sau.`

```
┌───────────────────────────────┬───────────────────────────────┐
│  [ảnh minh hoạ]               │  [ảnh minh hoạ]               │
│  Mẹ & Bé                      │  Mỹ phẩm & Chăm sóc cá nhân   │
│  Tã, bỉm, sữa, bình sữa,      │  Son, kem dưỡng, nước hoa,    │
│  đồ chơi, quần áo trẻ em      │  sữa rửa mặt, mặt nạ          │
│  ( ) Chọn ngành này           │  ( ) Chọn ngành này           │
└───────────────────────────────┴───────────────────────────────┘
                     [ Tiếp tục ]   ← chỉ sáng khi đã chọn
```

Quy tắc:

- Thẻ rộng ≥ 320px trên desktop (2 cột), xếp dọc trên mobile (mỗi thẻ ≥ 220px cao).
- Cả thẻ là vùng chạm (không chỉ nút radio). Thẻ được chọn: viền 3px `#087E8B` + dấu ✓ + nhãn "Đã chọn".
- Nút **Tiếp tục** ở trạng thái vô hiệu: nền xám `#E4EAF0`, chữ `#6B7B88`, kèm dòng nhỏ "Chọn một ngành để tiếp tục."
- Không có nút "Bỏ qua". Không có tour nhiều bước.
- Sau khi bấm Tiếp tục → chuyển sang **1.2 Chọn mẫu kho**, không quay lại màn này nữa (trừ khi đổi trong Cài đặt).

**Ví dụ sản phẩm trên mỗi thẻ** (3 dòng, chữ 16px):

| Mẹ & Bé | Mỹ phẩm & Chăm sóc cá nhân |
|---|---|
| Tã, bỉm cho bé | Son, son dưỡng |
| Sữa bột, bình sữa | Kem dưỡng, sữa rửa mặt |
| Đồ chơi, quần áo trẻ em | Nước hoa, mặt nạ |

Ảnh minh hoạ: `alt="Kệ hàng Mẹ & Bé với tã, sữa bột và đồ chơi trẻ em"` / `alt="Kệ mỹ phẩm với son, nước hoa và kem dưỡng"`.

### 1.2 Chọn mẫu kho (ngay sau khi chọn ngành)

**Tiêu đề:** `Chọn kiểu kho gần giống cửa hàng của bạn`
**Mô tả:** `Chọn một mẫu để có sẵn kệ. Bạn sửa, thêm, xoá kệ được bất cứ lúc nào.`

| Thẻ | Nội dung | Dùng khi |
|---|---|---|
| **Kho nhỏ** | 1 dãy kệ (4 kệ) + lối đi 1,2 m | Cửa hàng < 40 m², một người quản lý |
| **Kho vừa** | 2–3 dãy kệ (8–12 kệ) + 2 lối đi | Cửa hàng 40–120 m², có nhân viên kho |
| **Kho trống** | Không có kệ nào | Muốn tự vẽ từ đầu |

- Mỗi thẻ có ảnh 3D thu nhỏ (ảnh tĩnh, không WebGL) + số kệ + diện tích gợi ý.
- Nút chính: **Dùng mẫu này**. Nút phụ: **Xem trước** (mở bản đồ ở chế độ chỉ xem, có nút "Quay lại").
- Chọn "Kho trống" → vào thẳng Trang chủ với empty state mục 7.1.

### 1.3 "Bắt đầu nhanh" trên Trang chủ

Khối cố định đầu Trang chủ, chỉ hiện khi chưa hoàn thành cả 3 bước:

```
Bắt đầu nhanh                                    1/3
──────────────────────────────────────────────────────
✓  Chọn ngành hàng            Đã chọn: Mẹ & Bé
○  Vẽ kho của bạn             [Dùng mẫu kho] hoặc [Tự vẽ]
○  Nhập hàng đầu tiên         [Nhập hàng]
```

- Bước hoàn thành: icon ✓ xanh `#1F7A4D` + chữ gạch nhẹ, không còn nút.
- Bước đang làm: nền `#F2FAFA`, viền trái 3px `#087E8B`, nút chính của bước đó.
- Bước chưa tới: icon ○ xám, nút bị mờ (không ẩn) để người dùng thấy còn gì phía trước.
- Hoàn thành cả 3 → khối thu lại thành 1 dòng "Bạn đã sẵn sàng. Xem việc hôm nay." + nút "Ẩn hướng dẫn này".
- Trạng thái lưu theo cơ sở, không theo thiết bị.

### 1.4 Đổi ngành hàng

Đường dẫn: **Cài đặt → Cơ sở → Ngành hàng → Đổi ngành**.

Hộp thoại xác nhận (2 bước):

> **Đổi ngành hàng sẽ thay đổi mẫu kệ và màu hiển thị. Dữ liệu hàng hóa của bạn vẫn được giữ.**
> Kệ hiện có không bị xoá. Chỉ danh sách kệ gợi ý và màu trang trí của kệ thay đổi.
> [Đổi ngành] · [Giữ nguyên]

Bước 2 (nếu cơ sở đã có hàng):
> **Cơ sở này đang có 128 sản phẩm ở 12 kệ.** Sau khi đổi, hàng vẫn nằm đúng kệ cũ.
> [Đổi ngành và giữ hàng] · [Quay lại]

### 1.5 Nhiều cơ sở, mỗi cơ sở một ngành

- Gói Chuỗi: mỗi cơ sở chọn ngành riêng, lưu theo cơ sở (không theo tài khoản).
- Bộ chọn cơ sở ở header luôn hiện tên + ngành: `Kho A · Mẹ & Bé`.
- Khi đổi cơ sở, mẫu kệ, màu kệ và ví dụ sản phẩm đổi theo; **màu trạng thái ô kệ không đổi** (mục 3.4).
- Phiếu chuyển hàng giữa 2 cơ sở khác ngành vẫn hợp lệ (ví dụ chuyển sữa rửa mặt từ cơ sở Mỹ phẩm sang cơ sở Mẹ & Bé). Không chặn, không cảnh báo.

---

## 2. Cấu trúc màn hình (mobile & desktop, cả hai ngành)

### 2.1 Ba phần cố định trên mọi màn

1. **Tiêu đề lớn** (28px desktop / 24px mobile): màn này làm gì. Ví dụ: "Tìm hàng".
2. **Một dòng mô tả** (16px, tối đa 2 câu): dùng để làm gì + bước tiếp theo.
3. **Một nút chính** (primary): việc nên làm tiếp. Vị trí: desktop góc phải của dòng tiêu đề; mobile thanh cố định đáy màn hình (cao 56px, full width).

Thêm hai phần luôn hiện:

- **Breadcrumb ngắn** dưới tiêu đề, tối đa 3 cấp, chỉ mô tả vị trí kho: `Kho A › Kệ A1 › Tầng 2`.
- **Nút Hướng dẫn "?"** ở góc trên phải header (cùng chỗ mọi màn) + **tooltip lần đầu** (mục 7.4).

### 2.2 Mobile (390 × 844)

```
┌──────────────────────────────────────────┐
│ ?            Trang chủ        [Kho A ▾] ⚙│  Header 56px
├──────────────────────────────────────────┤
│  Tiêu đề lớn (24px)                      │
│  Một dòng mô tả (16px)                   │
│  Kho A › Kệ A1 › Tầng 2                  │  Breadcrumb 14px
├──────────────────────────────────────────┤
│                                          │
│  Nội dung (1 khối chính)                 │
│                                          │
│                                    ( ⌗ ) │  Nút Quét nổi 64px
├──────────────────────────────────────────┤
│ [ Nút chính — 56px, full width ]         │  CTA dính đáy
├──────────────────────────────────────────┤
│  Trang chủ   Tìm hàng   Kho   Chuyển hàng│  Tab bar 64px, nhãn 16px
└──────────────────────────────────────────┘
```

- **Tab bar 4 mục** = 4 trong 5 mục menu. **Cài đặt** là icon bánh răng ở header (vị trí cố định, có `aria-label="Cài đặt"`). Tổng vẫn đúng 5 mục menu, không thêm mục thứ 6.
- **Nút Quét** tròn 64px, nổi trên tab bar 12px, cách phải 16px — cùng chỗ ở mọi màn. Đây là hành động (không phải mục menu), luôn dùng được.
- Nhãn tab 16px, icon 24px phía trên; tab đang mở: chữ `#087E8B` đậm + gạch 3px dưới.
- Không có sidebar, không banner, không nút nổi thứ hai.
- Vùng CTA đáy chỉ chứa **một** nút. Nút phụ nằm trong nội dung, kiểu chữ hoặc viền.

**Khác biệt theo vai trò trên tab bar:**

| Vai trò | Tab bar |
|---|---|
| ADMIN_VIP, MANAGER | Trang chủ · Tìm hàng · Kho của tôi · Chuyển hàng |
| STAFF_WAREHOUSE | Trang chủ · Tìm hàng · Kho của tôi · Chuyển hàng |
| STAFF_SALES | Trang chủ · Tìm hàng (2 tab, tab bar vẫn cao 64px) |

### 2.3 Desktop (1440 × 900)

```
┌──────────────┬─────────────────────────────────────────────────────┐
│ WAREMAP      │  ?        Tìm hàng (ô tìm)     Kho A ▾      🔔  (AN) │
│              ├─────────────────────────────────────────────────────┤
│ Trang chủ    │  Tiêu đề lớn (28px)                        [Nút chính]│
│ Tìm hàng     │  Một dòng mô tả                                     │
│ Kho của tôi  │  Kho A › Kệ A1 › Tầng 2                             │
│ Chuyển hàng  │  ┌──────────────────────────┐ ┌──────────────────┐  │
│ Cài đặt      │  │ Danh sách / nội dung     │ │ Bản đồ 3D 40%    │  │
│ ──────────   │  │                          │ │ (khung cố định)  │  │
│ Quản lý      │  └──────────────────────────┘ └──────────────────┘  │
│  Nhân viên   │                                                     │
│  Giá vốn     │                                                     │
│ [Avatar]     │                                                     │
└──────────────┴─────────────────────────────────────────────────────┘
```

- Sidebar 248px. 5 mục chính. Dưới đường kẻ: nhóm **Quản lý** (tối đa 2 mục, theo quyền) — đây là nhóm phụ, không tính vào 5 mục chính.
- Ô tìm hàng ở header dùng chung mọi màn; gõ là hiện kết quả ngay, không cần mở màn Tìm hàng.
- Bản đồ 3D chiếm cột phải 40%, cao cố định 520px (không nhảy khi tải).
- Desktop không có luồng quét camera: nếu mở màn quét trên desktop, hiện "Mở trên điện thoại để quét mã" + ô "Nhập mã tay".

### 2.4 Bảng màn hình

| Mã | Màn hình | Mobile | Desktop |
|---|---|---|---|
| S0 | Chọn ngành hàng | ✓ | ✓ |
| S1 | Chọn mẫu kho | ✓ | ✓ |
| S2 | Trang chủ (+ Bắt đầu nhanh) | ✓ | ✓ |
| S3 | Tìm hàng | ✓ | ✓ |
| S4 | Chi tiết hàng & vị trí (bản đồ đơn giản) | ✓ | ✓ (3D đầy đủ) |
| S5 | Kho của tôi (xem sơ đồ, danh sách kệ) | ✓ (chỉ xem) | ✓ |
| S6 | Công cụ vẽ kho 3D | ✗ (thông báo) | ✓ |
| S7 | Thông số kệ (panel) | ✓ (chỉ tên, số tầng) | ✓ |
| S8 | In mã QR kệ | ✓ (xem, gửi link in) | ✓ |
| S9 | Nhập hàng — thông tin | ✓ | ✓ |
| S10 | Nhập hàng — in tem | ✓ | ✓ |
| S11 | Nhập hàng — xếp lên kệ (quét) | ✓ | ✓ (nhập mã tay) |
| S12 | Lấy hàng — đơn & chỉ đường | ✓ | ✓ |
| S13 | Lấy hàng — quét kệ & lô | ✓ | ✗ |
| S14 | Lấy hàng — xong / báo lệch | ✓ | ✓ |
| S15 | Chuyển hàng — danh sách phiếu | ✓ | ✓ |
| S16 | Chuyển hàng — chi tiết & lịch sử | ✓ | ✓ |
| S17 | Chuyển hàng — đóng thùng (quét) | ✓ | ✓ (nhập mã tay) |
| S18 | Chuyển hàng — kiểm hàng & đối soát | ✓ | ✓ |
| S19 | Chuyển hàng — báo lệch (ảnh) | ✓ | ✓ |
| S20 | Cài đặt cơ sở (ngành, ngưỡng, thời gian) | ✓ | ✓ |
| S21 | Nhân viên (danh sách + form 4 trường) | ✓ (từ Cài đặt) | ✓ |
| S22 | Giá vốn | ✓ (từ Cài đặt) | ✓ |
| S23 | Hướng dẫn (khung 3 bước) | ✓ (drawer) | ✓ (drawer) |

### 2.5 Khác biệt giữa hai ngành

| Hạng mục | Mẹ & Bé | Mỹ phẩm & Chăm sóc cá nhân |
|---|---|---|
| Màu trang trí kệ | Xanh nhạt `#BFDCE8`, hồng nhạt `#F3D6DE` | Tím nhạt `#D9D2EA`, hồng đậm `#C9738F`, be `#E8DDD0` |
| Nền bản đồ 3D | `#F7FAFB`, sàn kẻ ô 1 m | `#FAF8FB`, sàn kẻ ô 1 m |
| Kệ gợi ý | Kệ tầng thấp, kệ hộp nhỏ, kệ treo, tủ mát, kệ đồ chơi | Kệ trưng bày kính, kệ hộc nhỏ, kệ ngăn kéo, khu Tester, tủ mát |
| Từ đặc thù | "Bỉm", "Sữa bột", "Đồ chơi" | "Tester (dùng thử)", "Mã vỏ giống nhau" |
| Ảnh minh hoạ | Ảnh kệ có tã, hộp sữa, đồ chơi | Ảnh kệ kính có son, nước hoa |
| Mẫu kho vừa | Dãy giữa: tã + sữa; gần cửa: đồ chơi + quần áo; góc: tủ mát | Lối vào: kệ kính; giữa: kệ hộc nhỏ + ngăn kéo; gần quầy: Tester; góc: tủ mát |

**Không đổi theo ngành:** 4 màu trạng thái ô kệ, vị trí nút, nhãn menu, cỡ chữ, luồng nhập/lấy/chuyển hàng.

---

## 3. Công cụ vẽ kho 3D

### 3.1 Vào từ đâu, ai được vẽ

- Vào: **Kho của tôi → Sửa sơ đồ** (desktop). Trên mobile chỉ có "Xem sơ đồ".
- Quyền vẽ: `ADMIN_VIP`, `MANAGER`. `STAFF_WAREHOUSE`, `STAFF_SALES`: chỉ xem (nút "Sửa sơ đồ" bị ẩn, không hiện thông báo lỗi).
- Mobile cố mở công cụ vẽ: chặn bằng thông báo (không phải lỗi):
  > **Để vẽ sơ đồ kho, bạn hãy mở trên máy tính hoặc máy tính bảng.**
  > Trên điện thoại bạn vẫn xem bản đồ, đổi tên kệ và số tầng được.
  > [Xem sơ đồ] · [Đổi tên kệ]

### 3.2 Mẫu kho có sẵn

Ba mẫu, nội dung kệ thay đổi theo ngành (xem 2.5). Mẫu chỉ là khung khởi đầu, sửa được mọi thứ.

| Mẫu | Số kệ | Bố cục | Ghi chú |
|---|---|---|---|
| Kho nhỏ | 4 | 1 dãy dọc, lối đi 1,2 m bên phải, cửa ở dưới | Kệ cao 150–180 cm |
| Kho vừa | 8–12 | 2–3 dãy song song, 2 lối đi 1,2 m, khu kiểm đếm cạnh cửa nhập | Có 1 tủ mát ở góc |
| Kho trống | 0 | Sàn 8 × 6 m, lưới 1 m | Vào thẳng empty state 7.1 |

**Mẫu "Kho vừa" — Mẹ & Bé (10 kệ):**

| Vị trí | Kệ | Số lượng |
|---|---|---|
| Dãy giữa, nửa trên | Kệ tầng thấp (tã, bỉm) | 2 |
| Dãy giữa, nửa dưới | Kệ tầng thấp (sữa bột thùng) | 2 |
| Gần cửa, trái | Kệ đồ chơi | 1 |
| Gần cửa, phải | Kệ treo (quần áo, khăn, yếm) | 2 |
| Dãy phải | Kệ hộp nhỏ (bình sữa, núm ti) | 2 |
| Góc phải | Tủ mát | 1 |

**Mẫu "Kho vừa" — Mỹ phẩm (10 kệ):**

| Vị trí | Kệ | Số lượng |
|---|---|---|
| Lối vào, trái + phải | Kệ trưng bày kính có đèn | 2 |
| Dãy giữa | Kệ hộc nhỏ nhiều ngăn | 4 |
| Dãy phải | Kệ ngăn kéo | 2 |
| Gần quầy | Khu Tester (không bán) | 1 |
| Góc phải | Tủ mát | 1 |

### 3.3 Thư viện kệ theo ngành

Chỉ hiện kệ thuộc ngành của cơ sở. Có link **Xem tất cả** để mở rộng (kệ ngành kia vẫn dùng được, chỉ là không gợi ý).

**Mẹ & Bé**

| Kệ | Dùng cho | Kích thước mặc định (D×R×C cm) | Tầng × ô | Ghi chú |
|---|---|---|---|---|
| Kệ tầng thấp chịu tải lớn | Tã, bỉm, sữa bột thùng | 200 × 60 × 150 | 3 × 4 | Tải 120 kg/tầng, tầng đáy cao 45 cm |
| Kệ hộp nhỏ nhiều ngăn | Bình sữa, núm ti, phụ kiện | 120 × 40 × 120 | 4 × 6 | Ngăn 20 × 20 cm |
| Kệ treo | Quần áo trẻ em, khăn, yếm | 150 × 45 × 180 | 2 thanh treo + 1 tầng | Thanh treo ở 120 cm và 170 cm |
| Tủ mát | Sữa tươi, thực phẩm cần lạnh | 120 × 65 × 190 | 4 × 3 | Ghi nhãn nhiệt độ 2–8°C |
| Kệ đồ chơi | Đồ chơi | 120 × 40 × 110 | 3 × 3 | Cao vừa tầm mắt trẻ (dưới 110 cm) |

**Mỹ phẩm & Chăm sóc cá nhân**

| Kệ | Dùng cho | Kích thước mặc định (D×R×C cm) | Tầng × ô | Ghi chú |
|---|---|---|---|---|
| Kệ trưng bày kính có đèn | Nước hoa, son cao cấp | 180 × 45 × 160 | 4 × 5 | Mặt kính, có đèn, chỉ 1 mặt |
| Kệ hộc nhỏ nhiều ngăn | Son, chai lọ nhỏ, kem dung tích nhỏ | 120 × 40 × 140 | 5 × 8 | Ngăn 15 × 15 cm |
| Kệ ngăn kéo | Nhiều mã có vỏ giống nhau | 100 × 50 × 90 | 6 ngăn kéo | Mỗi ngăn 1 mã, có nhãn mã |
| Khu Tester (dùng thử) | Mẫu thử | 80 × 40 × 100 | 2 × 4 | Nhãn đỏ "Không bán", không tính tồn kho |
| Tủ mát | Sản phẩm cần bảo quản lạnh | 120 × 65 × 190 | 4 × 3 | 2–8°C |

Mỗi thẻ kệ trong thư viện: ảnh minh hoạ 64×64, tên 16px, dòng phụ "Dùng cho …" 14px, dòng "200 × 60 × 150 cm" 14px. Kéo thẻ vào khung 3D hoặc bấm **Thêm kệ** (kệ xuất hiện ở giữa khung, tự chọn).

### 3.4 Thao tác vẽ

| Thao tác | Cách làm | Phản hồi | Lỗi / chặn |
|---|---|---|---|
| Thêm kệ | Kéo từ thư viện vào khung, hoặc bấm **Thêm kệ** | Kệ hiện ra có bóng đổ, tự chọn, mở panel Thông số kệ | Kệ chồng lên kệ khác: viền đỏ + rung 200ms + "Chỗ này đã có kệ. Kéo sang vị trí trống." |
| Di chuyển | Giữ kệ và kéo | Đường gióng xanh khi thẳng hàng với kệ bên; số cm hiện cạnh con trỏ | Ra ngoài sàn: kệ dừng ở mép, viền vàng |
| Căn thẳng | Tự động khi kéo gần (±15 cm) | Đường gióng + nhãn "Thẳng hàng với Kệ A2" | — |
| Sửa thông số | Bấm kệ → panel phải | Panel cập nhật ngay, bản đồ đổi theo | Chiều cao < 60 cm: "Kệ thấp hơn 60 cm sẽ không xếp được hàng. Tăng chiều cao?" |
| Đổi tên | Ô "Tên kệ" trong panel | Tên đổi trên thẻ kệ 3D | Tên trùng: "Đã có kệ tên A1. Đặt tên khác." |
| Số tầng / số ô | Ô số, có nút − / + | Bản đồ vẽ lại tầng/ô ngay | Giảm tầng đang có hàng: "Tầng 3 đang có 12 sản phẩm. Chuyển hàng đi trước khi giảm số tầng." |
| Xoá kệ | Chọn kệ → **Xoá kệ** | Hộp thoại xác nhận 2 bước | Kệ còn hàng: "Kệ này còn 12 sản phẩm. Hãy chuyển hàng sang kệ khác trước khi xoá." + nút **Chuyển hàng đi** (không cho xoá) |
| Nhân đôi | Chọn kệ → **Nhân đôi** | Bản sao y hệt đặt cạnh, tên `A1 (2)`, tự chọn | Quá 40 kệ: "Kho đã có 40 kệ. Xoá bớt kệ không dùng trước." |
| Hoàn tác | Nút ↩ góc trên trái khung 3D | Hoàn tác 10 thao tác gần nhất; nút hiện số "↩ 3" | Hết 10 bước: nút mờ + tooltip "Chỉ hoàn tác được 10 thao tác gần nhất." |
| Phóng to / thu nhỏ | Cuộn chuột, 2 ngón, hoặc nút **+ / −** | Mức zoom hiện "100%" | Zoom < 50%: "Đã thu nhỏ hết mức để còn thấy cả kho." |
| Xoay góc nhìn | Kéo 1 ngón / chuột | Xoay quanh tâm kho | — |
| Đặt lại góc nhìn | Nút **Đặt lại góc nhìn** | Về góc mặc định 45°, 100% | — |
| Thước đo | Tự hiện khi kéo kệ | Số cm giữa 2 kệ + khoảng cách tới tường | — |

Quy định bổ sung:

- **Lưu**: nút **Lưu sơ đồ** (primary) ở góc trên phải. Có thay đổi chưa lưu → chip vàng "Chưa lưu" cạnh nút. Rời màn khi chưa lưu → "Sơ đồ có thay đổi chưa lưu. Lưu lại?" [Lưu] · [Rời không lưu] · [Ở lại].
- Không có: thư viện 5 loại kệ chung chung, gizmo xoay 3 trục, trường nhập toạ độ x/z/rotation, đơn vị mét, xuất PDF sơ đồ.
- Kích thước hiển thị bằng **cm** (người bán hàng nghĩ bằng cm), không dùng mét.

### 3.5 Trạng thái ô kệ (cố định cho cả hai ngành)

| Trạng thái | Nền | Viền | Icon | Chữ trên ô | Khi nào |
|---|---|---|---|---|---|
| Trống | `#E6F4EA` | `#1F7A4D` | ○ | **Trống** | Số lượng = 0 |
| Có hàng | `#FFF3D6` | `#8A6100` | ▣ | **Có hàng · 24** | Số lượng > 0, hạn dùng > ngưỡng |
| Sắp hết hạn | `#FBE3E3` | `#A01B1B` | ◷ (đồng hồ) | **Sắp hết hạn · 12** | Còn ≤ ngưỡng cảnh báo (mặc định 30 ngày) |
| Đang chọn | như trên | `#087E8B` 3px | — | **Đang chọn** | Người dùng bấm vào ô |
| Ô cần đến | như trên | nhấp nháy 2 lớp | ➜ | **Đến đây** | Đang chỉ đường lấy hàng |

- Chữ trên ô: 14px đậm (đủ tương phản ≥ 4.5:1 trên nền nhạt). Không dùng chữ trắng trên nền đậm.
- Ô nhỏ hơn 40×40 px trên màn hình: chỉ hiện icon + số, nhãn đầy đủ hiện khi chạm vào (tooltip).
- Nhấp nháy tối đa 1,2 giây/lần, có thể tắt bằng "Giảm chuyển động" trong Cài đặt; khi tắt vẫn còn mũi tên ➜.
- **Màu trang trí kệ (theo ngành) không được dùng cho ô.** Ô luôn dùng 4 màu trạng thái ở trên.

### 3.6 Ô kệ tự cập nhật khi lấy hàng

Điều kiện: đơn xuất kho đã quét **đúng mã kệ** và **đúng mã lô**, và người dùng bấm **Xác nhận đã lấy đủ** (hoặc hệ thống tự xác nhận khi đơn chỉ có 1 dòng — xem 4.2).

| Trước | Lấy | Sau | Trạng thái ô sau |
|---|---|---|---|
| 24 | 2 | 22 | Có hàng · 22 |
| 24 | 24 | 0 | **Trống** (ô đổi ngay trên bản đồ, không còn hiện sản phẩm) |
| 12 (cận hạn) | 12 | 0 | **Trống** (mất cảnh báo cận hạn) |
| 0 | — | 0 | Trống (không đổi) |

Quy tắc:

- Cập nhật **ngay trên máy** (lạc quan), không chờ máy chủ. Nếu đồng bộ lỗi, ô hiện chip nhỏ "Chờ đồng bộ" và vẫn giữ số mới.
- Khi ô về 0: ẩn sản phẩm khỏi ô, ẩn khỏi kết quả tìm hàng, nhưng **giữ trong lịch sử**.
- Ghi lịch sử mỗi lần trừ: ai lấy, lấy bao nhiêu, lúc nào, từ kệ nào, theo đơn nào.
  Ví dụ: `14:32 · Nguyễn An · lấy 2 · Kệ A1 › Tầng 2 › Ô 03 · đơn ĐH-1042`.
- Nếu lấy nhiều lô trong cùng 1 ô: trừ theo đúng lô đã quét, không trừ lô khác.
- Không có hoàn tác ở bước này; sửa sai bằng phiếu "Báo hàng lệch" (ghi lại, không tự sửa số).

### 3.7 Mã QR của kệ

- Mỗi kệ có mã QR **tự sinh khi lưu**: `LOC:<cơ sở>:<kệ>:<tầng>:<ô>` (giữ đúng định dạng hiện tại để không phá dữ liệu cũ).
- Thẻ kệ hiện: tên kệ, mã QR nhỏ 96×96, dòng `Kệ A1 · 3 tầng × 4 ô`, nút **In mã QR**.
- Kệ chưa in: dấu cảnh báo vàng ⚠ + dòng "Kệ này chưa có mã QR. Hãy in và dán lên kệ để nhân viên quét được." + nút **In mã QR**.
- Nút **In tất cả mã QR**: in 1 file, mỗi kệ 1 tem 60×40 mm, kèm tên cơ sở và tên kệ cỡ lớn.
- Không có: xuất PDF sơ đồ, đổi mã QR bằng tay, QR cho từng ô (chỉ theo kệ + tầng + ô khi quét).

### 3.8 Giới hạn trên điện thoại

| Việc | Điện thoại | Máy tính / tablet |
|---|---|---|
| Xem bản đồ 3D | ✓ (chế độ đơn giản) | ✓ |
| Đổi tên kệ | ✓ | ✓ |
| Đổi số tầng | ✓ | ✓ |
| Thêm / xoá / nhân đôi kệ | ✗ (thông báo 3.1) | ✓ |
| Kéo thả, xoay, zoom bằng cử chỉ | ✗ | ✓ |
| In mã QR | ✓ (gửi lệnh in) | ✓ |

---

## 4. Nhập hàng & lấy hàng

### 4.1 Nhập hàng mới — 3 bước, 3 màn

Vào từ: Trang chủ → thẻ "Nhập hàng mới" (1 chạm) hoặc empty state 7.2.

**Bước 1 — Nhập thông tin (S9)**

Tiêu đề: `Nhập hàng mới` · Mô tả: `Nhập 4 thông tin: tên hàng, số lượng, số lô, hạn dùng. Các thông tin khác đã được điền sẵn.`

| Trường | Nhãn cố định phía trên | Bắt buộc | Ghi chú |
|---|---|---|---|
| Tên hàng | `Tên hàng` | ✓ | Gợi ý từ hàng đã có (gõ 2 ký tự); chọn gợi ý thì tự điền mã sản phẩm, ngành, nhà cung cấp gần nhất |
| Số lượng | `Số lượng` | ✓ | Bàn phím số, nút − / +, mặc định 1 |
| Số lô | `Số lô` | ✓ | Tự sinh `LO-007`, cho sửa |
| Hạn dùng | `Hạn dùng` | ✓ | Lịch; nút nhanh +6 tháng, +12 tháng; hiện ngay "Còn 180 ngày" |

- Ẩn trong **Thêm thông tin** (mặc định đóng): nhà cung cấp, giá nhập, ghi chú, vị trí gợi ý.
- Nút chính: **Lưu & in tem**. Nút phụ: **Huỷ**.
- Lỗi tại chỗ (dưới trường, chữ đỏ 14px + icon ⚠):
  - Tên trống: "Nhập tên hàng để tiếp tục."
  - Số lượng 0: "Số lượng phải lớn hơn 0."
  - Số lô trùng: "Lô LO-003 đã có ở cơ sở này. Nhập số lô khác hoặc mở lô cũ."
  - Hạn dùng đã qua: "Hạn dùng đã qua (12/09/2026). Kiểm tra lại hoặc nhập hàng cận hạn."

**Bước 2 — In tem (S10)**

Tiêu đề: `In tem cho lô mới` · Mô tả: `Dán tem lên lô hàng. Mỗi tem có mã QR để nhân viên quét khi lấy hàng.`

- Xem trước 2 tem: **Tem lô** (mã `LOT:LO-007`, tên hàng, hạn dùng, số lượng) và **Tem vị trí** (in sau khi chọn ô, ở bước 3).
- Nút chính: **In tem**. Nút phụ: **Bỏ qua, xếp hàng trước**.
- In xong: "Đã gửi lệnh in. Dán tem lên lô rồi bấm Tiếp tục." → nút **Tiếp tục xếp lên kệ**.

**Bước 3 — Xếp lên kệ (S11)**

Tiêu đề: `Xếp hàng lên kệ` · Mô tả: `WareMap gợi ý ô trống gần nhất. Đến kệ, quét mã kệ rồi quét mã lô.`

1. Hệ thống chọn sẵn ô trống gần cửa nhất (viền `#087E8B` + nhãn "Gợi ý").
2. Bản đồ đơn giản: chỉ tầng + kệ cần đến, mũi tên từ cửa.
3. Tại kệ: **Quét mã kệ** → đúng: "tít" + rung nhẹ + nền xanh "Đúng kệ A1." → tự chuyển sang quét lô.
4. **Quét mã lô** → đúng: nền xanh + "Đúng lô LO-007." → nút **Xác nhận đã xếp**.
5. Xong: toast "Đã xếp 60 sản phẩm vào Kệ A1 › Tầng 2 › Ô 03." + nút **Nhập lô tiếp theo** / **Về Trang chủ**.

Sai kệ (chặn):
> **Bạn đang đứng ở Kệ A2. Hàng này cần xếp vào Kệ A1.**
> Hãy đến Kệ A1 và quét lại. Nếu muốn đổi vị trí, bấm "Chọn ô khác".
> [Quét lại] · [Chọn ô khác]

Sai lô:
> **Lô này không phải lô vừa nhập.**
> Cần lô **LO-007**, bạn vừa quét **LO-005**. Quét lại tem trên thùng hàng mới.
> [Quét lại]

### 4.2 Lấy hàng để bán — 5 bước

Vào từ: Trang chủ → thẻ "Đơn cần lấy" (1 chạm).

| Bước | Màn | Nội dung | Nút chính |
|---|---|---|---|
| 1 | S12 Danh sách đơn | Mỗi thẻ: mã đơn, kênh/khách, số món, giờ hẹn | **Bắt đầu lấy hàng** |
| 2 | S12 Chỉ đường | Ô cần đến (chữ 24px): `Kệ A1 › Tầng 2 › Ô 03`; bản đồ nhấp nháy đúng ô; danh sách món 2/5 | **Đi đến kệ** |
| 3 | S13 Quét mã kệ | Camera toàn màn, khung 260×260; đúng → xanh + "tít" + rung; sai → đỏ + 2 tiếng trầm + rung 400ms | (tự chuyển) |
| 4 | S13 Quét mã lô | Hiện ảnh + màu + dung tích + số lượng cần lấy; gợi ý "Lấy lô hết hạn sớm nhất: 19/11/2026" | **Xác nhận đã lấy đủ** |
| 5 | S14 Xong | ✓ lớn, "Đã lấy đủ 5/5 món. Đơn sẵn sàng giao." | **Sang đơn tiếp theo** |

Quy tắc:

- **Gợi ý lô bán trước**: hiện đúng 1 dòng "Lấy lô hết hạn sớm nhất: 19/11/2026 (còn 23 ngày)". Không có danh sách 5 mức, không có chip màu.
- **Đúng cả kệ và lô** → tự trừ tồn (mục 3.6) + cập nhật ô kệ ngay; nếu đơn chỉ có 1 dòng thì tự chuyển sang S14, không cần chạm thêm.
- **Sai kệ** (chặn, không có nút bỏ qua):
  > **Bạn đang đứng ở Kệ A2. Hàng này nằm ở Kệ A1.**
  > Hãy đến Kệ A1 và quét lại. Nếu hàng không có ở Kệ A1, báo quản lý.
  > [Quét lại] · [Báo hàng lệch]
- **Sai lô**:
  > **Lô này không đúng với đơn hàng.**
  > Hàng cần lấy là lô có hạn dùng sớm nhất: **19/11/2026**. Bạn vừa quét lô hạn 12/03/2027.
  > [Quét lại] · [Xem lô khác trên kệ]
- **Lô hết hạn**: chặn xuất, "Lô LO-005 đã hết hạn 4 ngày. Không xuất lô này. Đặt sang khu chờ xử lý và báo quản lý."
- Âm thanh & rung: đúng = 1 "tít" cao 120ms + rung 80ms; sai = 2 tiếng trầm + rung 400ms. Có nút tắt âm thanh trong header màn quét (giữ rung).
- Nếu mất mạng: vẫn quét, vẫn trừ tồn trên máy, chip "Chờ đồng bộ" (mục 7.3).

### 4.3 Tổng hợp cập nhật tồn kho

| Sự kiện | Tồn kho | Ô kệ | Lịch sử |
|---|---|---|---|
| Nhập hàng, xác nhận xếp | +số lượng | Có hàng / Sắp hết hạn | "Nhập 60 · Kệ A1 · Nguyễn An · 14:10" |
| Lấy hàng, xác nhận đủ | −số lượng | Có hàng (số mới) hoặc Trống | "Lấy 2 · Kệ A1 · Nguyễn An · 14:32" |
| Chuyển hàng gửi đi | −số lượng ở cơ sở gửi | Cập nhật như lấy hàng | "Gửi 20 · phiếu CK-001" |
| Chuyển hàng đang đi đường | Không tính vào tồn cơ sở nhận | Không hiện ở kệ nào | "Đang đi đường · 20" |
| Chuyển hàng nhận đủ | +số lượng ở cơ sở nhận | Có hàng | "Nhận 20 · phiếu CK-001" |
| Báo lệch | Không tự sửa | Không đổi | "Lệch 2 · chờ quản lý xử lý" |

---

## 5. Chuyển hàng giữa các cơ sở — 6 trạng thái

### 5.1 Sơ đồ trạng thái

```
[Mới tạo] ──nhặt hàng──> [Đang nhặt hàng] ──đóng thùng──> [Đã đóng thùng]
                                                              │
                                                        gửi đi (khoá)
                                                              ▼
                                                       [Đang đi đường]
                                                              │
                                                         hàng đến
                                                              ▼
                                                      [Đang kiểm hàng]
                                                        │            │
                                                  nhận đủ        thiếu/hỏng
                                                        ▼            ▼
                                                  [Hoàn tất]    [Báo lệch]
                                                                     │
                                                            quản lý xử lý
                                                                     ▼
                                                                [Hoàn tất]
```

### 5.2 Sáu trạng thái

| # | Trạng thái | Ai làm | Được sửa gì | Nút chính | Thông báo |
|---|---|---|---|---|---|
| 1 | **Mới tạo** | MANAGER / ADMIN | Sửa cơ sở gửi–nhận, danh sách hàng, số lượng; xoá phiếu | **Duyệt và bắt đầu nhặt** | — |
| 2 | **Đang nhặt hàng** | STAFF_WAREHOUSE | Không sửa số lượng; đánh dấu từng món đã nhặt | **Đóng thùng** | — |
| 3 | **Đã đóng thùng** | STAFF_WAREHOUSE | Chỉ quét thêm thùng | **Gửi hàng đi** | Gửi đi: "Sắp có hàng từ Kho A. Mã phiếu: CK-001" |
| 4 | **Đang đi đường** | — (khoá) | **Không ai sửa được số lượng** | **Hàng đã đến** (chỉ cơ sở nhận) | Nhận: "Kho B đã nhận hàng." |
| 5 | **Đang kiểm hàng** | STAFF_WAREHOUSE (cơ sở nhận) | Ghi số thực nhận từng dòng | **Xác nhận nhận đủ** | — |
| 6 | **Hoàn tất** / **Báo lệch** | MANAGER / ADMIN xử lý lệch | Không | **Xem lịch sử** | Lệch: gửi quản lý kèm ảnh + số chênh |

Chi tiết từng trạng thái:

1. **Mới tạo** — người quản lý chọn cơ sở gửi, cơ sở nhận, danh sách hàng (tên, lô, số lượng). Hệ thống giữ hàng (reserve) ở cơ sở gửi nhưng chưa trừ tồn. Huỷ phiếu cần xác nhận 2 bước.
2. **Đang nhặt hàng** — nhân viên kho đi theo bản đồ 3D như luồng lấy hàng. Mỗi món quét kệ + quét lô; món đã nhặt có ✓. Không cho đóng thùng khi còn món chưa nhặt: "Còn 2 món chưa nhặt. Nhặt đủ rồi đóng thùng."
3. **Đã đóng thùng** — quét mã phiếu lên từng thùng. Mỗi thùng hiện "Thùng 3/5". Có thể in thêm tem thùng.
4. **Đang đi đường** — trạng thái khoá: không sửa số lượng, không xoá phiếu. Hàng không tính vào tồn cơ sở nhận, hiện ở mục "Đang đi đường" của cơ sở nhận (không hiện ở kệ nào).
5. **Đang kiểm hàng** — cơ sở nhận quét mã phiếu **trước khi mở thùng**. Sai cơ sở → chặn:
   > **Phiếu này gửi đến Kho B, không phải cơ sở của bạn.**
   > Hãy liên hệ người gửi (Kho A) để kiểm tra lại. Không mở thùng.
   > [Đóng]
6. **Hoàn tất / Báo lệch** — đủ hàng: **Xác nhận nhận đủ** → cộng tồn cơ sở nhận, phiếu đóng. Thiếu/hỏng: **Báo lệch** → nhập số thực nhận, chụp ảnh (bắt buộc 1 ảnh), ghi chú 1 dòng → gửi quản lý.

### 5.3 Đúng hàng, đúng nơi

- Mỗi phiếu có **1 mã phiếu** dùng xuyên suốt: tạo → đóng thùng → gửi → nhận → đối soát.
- Mã phiếu in ra dán lên từng thùng; quét mã phiếu là cách duy nhất để mở bước đóng thùng/kiểm hàng.
- **Đối soát tự động**: so sánh số gửi và số nhận ngay khi nhập số thực nhận. Chênh lệch được **ghi lại, không tự sửa** tồn kho.
- Hàng đang đi đường **không** cộng vào tồn cơ sở nhận cho tới khi nhận đủ.
- Không cho tạo phiếu rỗng hoặc số lượng 0.

### 5.4 Theo dõi

- Danh sách phiếu (S15) có 4 bộ lọc, dùng chữ + số lượng, không chỉ màu:
  `Đang đi đường (3)` · `Chờ nhận (2)` · `Có lệch (1)` · `Hoàn tất`.
- Mỗi thẻ phiếu: mã, `Kho A → Kho B`, số món, trạng thái (icon + chữ), thời gian dự kiến.
- Phiếu quá thời gian dự kiến (mặc định 24 giờ, quản lý đặt trong Cài đặt cơ sở): viền vàng + nhãn "Quá 24 giờ" + gửi nhắc quản lý 1 lần.
- Mỗi phiếu có **Xem lịch sử**: dòng thời gian từng bước, ai làm, lúc nào.
  ```
  09:10 · Nguyễn An (Kho A) tạo phiếu, 5 món
  09:40 · Minh Anh (Kho A) đã nhặt 5/5 món
  09:52 · Minh Anh (Kho A) đã đóng thùng 3/5
  10:05 · Minh Anh (Kho A) gửi hàng đi
  15:20 · Hoàng Nam (Kho B) bắt đầu kiểm hàng
  15:31 · Hoàng Nam (Kho B) nhận 18/20, báo lệch 2
  ```

### 5.5 Thông báo cho người liên quan

| Khi nào | Ai nhận | Nội dung | Kênh |
|---|---|---|---|
| Phiếu được gửi | Cơ sở nhận | "Sắp có hàng từ Kho A. Mã phiếu: CK-001" | Trong app + chuông |
| Hàng đến | Cơ sở gửi | "Kho B đã nhận hàng." | Trong app |
| Có lệch | MANAGER + ADMIN | "Phiếu CK-001 lệch 2 sản phẩm." + ảnh + số chênh | Trong app + chuông |
| Quá 24 giờ | MANAGER | "Phiếu CK-001 đã đi đường 26 giờ, chưa có xác nhận nhận hàng." | Trong app + chuông |

Chuông ở header: danh sách 20 thông báo gần nhất, mỗi dòng 1 câu + thời gian + link tới phiếu. Không có màn "trung tâm thông báo" riêng.

### 5.6 Phân quyền chuyển hàng

| Việc | ADMIN_VIP | MANAGER | STAFF_WAREHOUSE | STAFF_SALES |
|---|---|---|---|---|
| Xem danh sách & trạng thái phiếu | ✓ | ✓ | ✓ | ✓ (chỉ xem) |
| Tạo phiếu | ✓ | ✓ | — | — |
| Duyệt phiếu | ✓ | ✓ | — | — |
| Nhặt hàng, đóng thùng | ✓ | ✓ | ✓ | — |
| Gửi hàng đi | ✓ | ✓ | ✓ | — |
| Nhận hàng, kiểm đếm | ✓ | ✓ | ✓ | — |
| Xử lý lệch | ✓ | ✓ | — (chỉ báo lệch) | — |
| Huỷ phiếu | ✓ | ✓ | — | — |

---

## 6. Danh sách màn hình theo vai trò

| Màn | ADMIN_VIP | MANAGER | STAFF_WAREHOUSE | STAFF_SALES |
|---|---|---|---|---|
| S0 Chọn ngành | ✓ | ✓ | — | — |
| S1 Chọn mẫu kho | ✓ | ✓ | — | — |
| S2 Trang chủ | ✓ (tổng quan) | ✓ (tổng quan) | ✓ (việc của tôi) | ✓ (việc của tôi) |
| S3 Tìm hàng | ✓ | ✓ | ✓ | ✓ |
| S4 Chi tiết hàng & vị trí | ✓ | ✓ | ✓ | ✓ |
| S5 Kho của tôi (xem) | ✓ | ✓ | ✓ | — (xem vị trí qua Tìm hàng) |
| S6 Công cụ vẽ kho | ✓ | ✓ | — (chỉ xem) | — (chỉ xem) |
| S7 Thông số kệ | ✓ | ✓ | Xem | — |
| S8 In mã QR kệ | ✓ | ✓ | ✓ (in) | — |
| S9–S11 Nhập hàng | ✓ | ✓ | ✓ | — |
| S12–S14 Lấy hàng | ✓ | ✓ | ✓ | ✓ |
| S15–S19 Chuyển hàng | ✓ | ✓ | ✓ (thao tác) | ✓ (chỉ xem) |
| S20 Cài đặt cơ sở | ✓ | ✓ | — | — |
| S21 Nhân viên | ✓ | — | — | — |
| S22 Giá vốn | ✓ | ✓ | — | — |
| S23 Hướng dẫn | ✓ | ✓ | ✓ | ✓ |

Menu hiển thị theo vai trò:

| Mục | ADMIN_VIP | MANAGER | STAFF_WAREHOUSE | STAFF_SALES |
|---|:--:|:--:|:--:|:--:|
| Trang chủ | ✓ | ✓ | ✓ | ✓ |
| Tìm hàng | ✓ | ✓ | ✓ | ✓ |
| Kho của tôi | ✓ | ✓ | ✓ | — |
| Chuyển hàng | ✓ | ✓ | ✓ | — |
| Cài đặt | ✓ | ✓ | — | — |
| Nhân viên (nhóm Quản lý) | ✓ | — | — | — |
| Giá vốn (nhóm Quản lý) | ✓ | ✓ | — | — |

- Mục bị ẩn thì **không hiện**, không hiện dạng mờ, không báo "không có quyền".
- Nếu vào bằng link cũ: "Mục này chỉ dành cho chủ cửa hàng. Bạn vẫn tìm hàng và lấy hàng bình thường." + [Về Trang chủ].
- `STAFF_SALES` trên mobile chỉ còn 2 tab (Trang chủ, Tìm hàng); nút Quét vẫn có vì quét là một phần của Tìm hàng.

---

## 7. Microcopy

### 7.1 Nguyên tắc

- Xưng "bạn". Gọi "hàng", "kệ", "ô", "lô", "cơ sở", "nhân viên".
- Không dùng: In-Transit, FEFO, Điều chuyển, Sub-Account, Branch, SKU, Batch, RBAC, ROI, location code.
- Nút = động từ + đối tượng. Không dùng Submit / OK / Confirm / Gửi / Lưu trơ.
- Lỗi = chuyện gì + cách sửa + bước tiếp. Không hiện mã lỗi.

### 7.2 Nút bấm

| Ngữ cảnh | Không dùng | Dùng |
|---|---|---|
| Chọn ngành | Next | **Tiếp tục** |
| Dùng mẫu kho | Apply template | **Dùng mẫu này** |
| Vẽ kho | Edit layout | **Sửa sơ đồ** / **Lưu sơ đồ** |
| Thêm kệ | Add | **Thêm kệ** |
| Nhân bản | Copy | **Nhân đôi** |
| Xoá kệ | Delete | **Xoá kệ** |
| Quay lại góc nhìn | Reset | **Đặt lại góc nhìn** |
| In mã | Print | **In mã QR** / **In tất cả mã QR** |
| Nhập hàng | Save | **Lưu & in tem** |
| In tem | Print label | **In tem** |
| Xếp hàng | Confirm | **Xác nhận đã xếp** |
| Quét | Scan | **Quét mã kệ** / **Quét mã lô** |
| Lấy đủ | Submit | **Xác nhận đã lấy đủ** |
| Báo thiếu | Report | **Báo hàng lệch** |
| Gửi ảnh | Upload | **Chụp ảnh gửi quản lý** |
| Đóng thùng | Pack | **Đóng thùng** |
| Gửi đi | Dispatch | **Gửi hàng đi** |
| Nhận đủ | Receive | **Xác nhận nhận đủ** |
| Huỷ phiếu | Cancel | **Huỷ phiếu** |
| Khoá tài khoản | Disable | **Khoá tài khoản** |
| Gia hạn | Upgrade | **Gia hạn** |
| Thêm chỗ nhân viên | Buy block | **Mua thêm nhân viên** |
| Hướng dẫn | Help | **Đã hiểu** (đóng tooltip) |

### 7.3 Tiêu đề · mô tả · nút chính từng màn

| Màn | Tiêu đề lớn | Dòng mô tả | Nút chính |
|---|---|---|---|
| S0 | Cửa hàng của bạn bán gì? | Chọn một ngành. WareMap sẽ chuẩn bị sẵn mẫu kệ, mẫu kho và màu hiển thị phù hợp. | Tiếp tục |
| S1 | Chọn kiểu kho gần giống cửa hàng của bạn | Chọn một mẫu để có sẵn kệ. Bạn sửa, thêm, xoá kệ được bất cứ lúc nào. | Dùng mẫu này |
| S2 (chủ) | Hôm nay kho của bạn thế nào? | Xem tồn kho, hàng sắp hết hạn và phiếu đang đi đường. | Xem hàng sắp hết hạn |
| S2 (nhân viên) | Việc của bạn hôm nay | Có 3 đơn cần lấy và 2 lô cần xếp lên kệ. | Bắt đầu lấy hàng |
| S3 | Tìm hàng | Nhập tên hoặc quét mã sản phẩm để biết hàng nằm ở kệ nào. | Tìm hàng |
| S4 | Hàng nằm ở đây | Kệ A1, tầng 2, ô 03. Bấm "Chỉ đường đến kệ" để đi tới. | Chỉ đường đến kệ |
| S5 | Kho của tôi | Xem sơ đồ kho và tình trạng từng ô kệ. | Sửa sơ đồ (desktop) |
| S6 | Vẽ sơ đồ kho | Kéo kệ từ danh sách vào khung, hoặc dùng mẫu có sẵn. | Lưu sơ đồ |
| S7 | Thông số kệ A1 | Đổi tên, kích thước, số tầng và số ô của kệ. | Lưu thay đổi |
| S8 | Mã QR của kệ | In và dán mã này lên kệ để nhân viên quét khi lấy hàng. | In tất cả mã QR |
| S9 | Nhập hàng mới | Nhập 4 thông tin: tên hàng, số lượng, số lô, hạn dùng. | Lưu & in tem |
| S10 | In tem cho lô mới | Dán tem lên lô hàng để nhân viên quét khi lấy hàng. | In tem |
| S11 | Xếp hàng lên kệ | Đến kệ được gợi ý, quét mã kệ rồi quét mã lô. | Xác nhận đã xếp |
| S12 | Lấy hàng | Chọn một đơn để bắt đầu. WareMap sẽ chỉ đường đến đúng kệ. | Bắt đầu lấy hàng |
| S13 | Quét mã | Quét mã trên kệ trước, rồi quét mã trên lô hàng. | (tự chuyển) |
| S14 | Đã lấy xong | Đơn đã đủ hàng và tồn kho đã được cập nhật. | Sang đơn tiếp theo |
| S15 | Chuyển hàng | Theo dõi hàng đang đi đường giữa các cơ sở. | Tạo phiếu chuyển |
| S16 | Phiếu CK-001 | Kho A gửi Kho B, 5 món. Xem từng bước đã làm. | (theo trạng thái) |
| S17 | Đóng thùng | Quét mã phiếu lên từng thùng hàng trước khi gửi. | Gửi hàng đi |
| S18 | Kiểm hàng | Đếm số thực nhận của từng món rồi xác nhận. | Xác nhận nhận đủ |
| S19 | Báo lệch | Chụp ảnh thùng hàng và ghi số chênh để quản lý xử lý. | Chụp ảnh gửi quản lý |
| S20 | Cài đặt cơ sở | Đổi ngành hàng, ngưỡng cảnh báo hạn dùng, thời gian đi đường. | Lưu thay đổi |
| S21 | Nhân viên | Thêm hoặc khoá tài khoản. Mỗi người cần họ tên, email, vai trò, cơ sở. | Thêm nhân viên |
| S22 | Giá vốn | Giá vốn và lãi theo lô đã bán. Chỉ chủ cửa hàng và quản lý xem được. | Xuất báo cáo |

### 7.4 Nút "Hướng dẫn" và tooltip lần đầu

**Khung Hướng dẫn** (drawer phải 420px, mở bằng nút "?" — cùng chỗ mọi màn): tiêu đề "Cách dùng màn này", 3 bước, mỗi bước 1 ảnh minh hoạ nhỏ + 1 câu, cuối khung là nút **Đã hiểu** và link "Xem tất cả hướng dẫn".

| Màn | 3 bước trong Hướng dẫn | Tooltip lần đầu (1 câu + [Đã hiểu]) |
|---|---|---|
| S2 Trang chủ | 1. Xem việc hôm nay · 2. Bấm thẻ việc để bắt đầu · 3. Theo dõi "Bắt đầu nhanh" | "Bắt đầu từ thẻ việc đầu tiên. Làm xong sẽ tự chuyển sang việc tiếp theo." |
| S3 Tìm hàng | 1. Gõ tên hàng · 2. Chọn đúng màu và dung tích · 3. Bấm "Chỉ đường đến kệ" | "Gõ 2 chữ là có gợi ý. Không cần gõ đủ tên." |
| S4 Vị trí hàng | 1. Đọc vị trí kệ/tầng/ô · 2. Bấm "Chỉ đường" · 3. Quét mã kệ khi tới nơi | "Số ô là số trên nhãn dán ở cạnh kệ." |
| S5 Kho của tôi | 1. Xem màu và chữ trên từng ô · 2. Bấm một kệ để xem chi tiết · 3. Bấm "Sửa sơ đồ" nếu cần đổi | "Ô xanh là trống, ô vàng là có hàng, ô đỏ là sắp hết hạn." |
| S6 Vẽ sơ đồ | 1. Kéo kệ từ danh sách vào khung · 2. Kéo để căn thẳng hàng · 3. Bấm "Lưu sơ đồ" | "Kéo kệ gần kệ khác, kệ sẽ tự thẳng hàng." |
| S9 Nhập hàng | 1. Nhập 4 thông tin · 2. Bấm "Lưu & in tem" · 3. Dán tem lên lô | "Chỉ 4 ô cần nhập. Ô nào sai sẽ báo đỏ ngay dưới ô đó." |
| S11 Xếp lên kệ | 1. Đi theo mũi tên đến kệ · 2. Quét mã kệ · 3. Quét mã lô rồi xác nhận | "Quét sai kệ sẽ báo đỏ và không cho xác nhận." |
| S12 Lấy hàng | 1. Chọn đơn · 2. Đi đến kệ được chỉ · 3. Quét kệ rồi quét lô | "Đơn chỉ có 1 món thì quét xong là hoàn tất, không cần bấm thêm." |
| S13 Quét mã | 1. Đưa mã vào khung · 2. Nghe tiếng tít là đúng · 3. Sai thì làm theo dòng hướng dẫn đỏ | "Đúng thì 1 tiếng tít. Sai thì 2 tiếng và máy rung." |
| S15 Chuyển hàng | 1. Lọc theo trạng thái · 2. Bấm một phiếu · 3. Làm theo nút chính | "Phiếu vàng là đã đi đường quá 24 giờ." |
| S18 Kiểm hàng | 1. Quét mã phiếu · 2. Đếm và nhập số thực nhận · 3. Bấm "Xác nhận nhận đủ" hoặc "Báo lệch" | "Chênh lệch được ghi lại, không tự sửa tồn kho." |
| S21 Nhân viên | 1. Bấm "Thêm nhân viên" · 2. Nhập 4 thông tin · 3. Nhân viên nhận email mời | "Chỉ cần họ tên, email, vai trò và cơ sở." |

Tooltip: hộp trắng viền `#087E8B`, mũi tên chỉ vào phần tử, tối đa 2 dòng, chỉ hiện **một lần cho mỗi màn trên mỗi tài khoản**, tự ẩn sau 8 giây, có nút **Đã hiểu**.

### 7.5 Thông báo thành công (luôn kèm bước tiếp)

- "Đã lưu lô mới. Xếp hàng lên kệ ngay?" → [Chọn ô kệ]
- "Đã gửi lệnh in 2 tem. Dán tem lên lô rồi xếp lên kệ." → [Tiếp tục xếp lên kệ]
- "Đã xếp 60 sản phẩm vào Kệ A1 › Tầng 2 › Ô 03." → [Nhập lô tiếp theo]
- "Đã lấy đủ 5/5 món. Đơn sẵn sàng giao." → [Sang đơn tiếp theo]
- "Đã gửi hàng. Kho B sẽ thấy phiếu trong mục Chuyển hàng." → [Về danh sách phiếu]
- "Đã nhận đủ 20/20. Phiếu CK-001 đã đóng." → [Xem phiếu]
- "Đã thêm nhân viên. Minh Anh sẽ nhận email mời trong vài phút." → [Thêm người khác]
- "Đã lưu sơ đồ kho. In mã QR để nhân viên quét được." → [In tất cả mã QR]
- "Đã đồng bộ 3 thao tác." (tự ẩn sau 4 giây)

### 7.6 Lỗi & trạng thái ngoài luồng

**Chưa có kệ**
> **Bạn chưa có kệ nào.**
> Bấm "Dùng mẫu kho" để bắt đầu nhanh trong khoảng 5 phút.
> [Dùng mẫu kho] · [Tự vẽ từ đầu]

**Chưa có hàng**
> **Chưa có hàng trong kho.**
> Bấm "Nhập hàng đầu tiên" để bắt đầu.
> [Nhập hàng đầu tiên]

**Không tìm thấy hàng**
> **Không tìm thấy "sữa bột".**
> Kiểm tra lại tên hoặc quét mã trên hộp. Nếu hàng mới về, nhập hàng trước.
> [Quét mã] · [Nhập hàng mới]

**Mất mạng trong kho**
> **Đang chờ mạng, dữ liệu sẽ được lưu khi có mạng.**
> Bạn vẫn quét và xếp hàng bình thường. Không đóng ứng dụng.
> Chip trên header: "Chờ đồng bộ (3)"

**Đồng bộ lỗi**
> **Chưa đồng bộ được 2 thao tác.**
> Dữ liệu vẫn nằm trên máy này. Kiểm tra mạng rồi bấm "Thử lại".
> [Thử lại] · [Gửi ảnh cho quản lý]

**Sai kệ / sai lô** — xem 4.1 và 4.2 (báo đỏ, chặn xuất, có cách sửa).

**Hàng cận hạn trên Trang chủ**
> Khối nổi bật đầu trang: **12 lô sắp hết hạn ở Kho A.**
> Lấy trước để bán kịp. Sớm nhất còn 3 ngày.
> [Xem và lấy trước]

**Phiếu có lệch**
> Thẻ phiếu: nhãn đỏ **Báo lệch** + "Thiếu 2 sản phẩm" + [Chụp ảnh gửi quản lý] · [Xem chi tiết]

**Hết hạn mức nhân viên**
> **Bạn đã dùng 5/5 tài khoản.**
> Gói hiện tại cho 5 nhân viên. Mua thêm 5 tài khoản để thêm người mới.
> [Mua thêm nhân viên] ← nút duy nhất, đặt trong Cài đặt → Gói dịch vụ

**Gói hết hạn**
> **Gói dùng thử đã hết hạn hôm nay.**
> Bạn vẫn xem được dữ liệu nhưng không nhập hoặc xuất hàng được. Gia hạn để tiếp tục.
> [Gia hạn]

**Xác nhận 2 bước (nguy hiểm)**
> Bước 1: **Xoá kệ A1?** → [Xoá kệ] · [Giữ lại]
> Bước 2: **Kệ A1 sẽ bị xoá khỏi sơ đồ. Thao tác này không hoàn tác được.** → [Xoá kệ này] · [Quay lại]

**Tải dữ liệu**
- Khung xương kích thước cố định: thẻ hàng 88px, thẻ đơn 96px, bản đồ 3D `aspect-ratio 4/3` (mobile) / 520px (desktop), ảnh 72×72.
- Không dùng spinner toàn màn, không `height: auto` khi tải.
- Bản đồ 3D quá 3 giây: hiện "Đang tải bản đồ…" + [Dùng sơ đồ 2D].

### 7.7 Form & quy tắc nhập liệu

- Nhãn cố định **phía trên** mọi trường, 16px, đậm vừa. Không dùng placeholder thay nhãn; placeholder chỉ là ví dụ: `Ví dụ: Sữa bột Grow Plus`.
- Ô nhập cao ≥ 48px (mobile) / 42px (desktop); lỗi hiện ngay dưới ô, chữ đỏ 14px + icon ⚠, ô viền đỏ 2px.
- Form tạo nhân viên chỉ 4 trường: **Họ tên · Email · Vai trò · Cơ sở làm việc**.
- Form nhập hàng chỉ 4 trường: **Tên hàng · Số lượng · Số lô · Hạn dùng**.
- Mỗi màn 1 nút primary. Nút phụ: viền hoặc chữ. Nút nguy hiểm: nền đỏ nhạt, chữ đỏ, xác nhận 2 bước.
- Sau khi lưu: toast ngắn (4 giây) + gợi ý bước tiếp (mục 7.5). Không đóng form rồi để người dùng tự tìm bước sau.

### 7.8 Tiếp cận

- Chữ nội dung ≥ 16px trên mobile (nhãn tab 16px, breadcrumb 14px, chú thích phụ 14px).
- Vùng chạm ≥ 48×48px; cách nhau ≥ 8px; nút chính cao 56px.
- Tương phản: chữ ≥ 4.5:1, icon/viền ≥ 3:1. Focus ring 3px `#087E8B`, offset 2px, luôn hiện.
- Trạng thái đầy đủ: hover (desktop), pressed (scale 0.98), focus, loading (chữ "Đang lưu…", nút giữ nguyên kích thước), thành công (toast xanh + ✓), lỗi (toast đỏ + rung + hướng dẫn).
- Alt text mô tả đúng sản phẩm: `alt="Son dưỡng Daily Care màu hồng nhạt, tuýp 4g"`.
- Tôn trọng "Giảm chuyển động": tắt nhấp nháy, tắt hiệu ứng camera.

---

## 8. Đã đơn giản hoá gì so với bản Figma hiện tại

| # | Bản hiện tại | Bản mới | Lý do |
|---|---|---|---|
| 1 | Menu 9 mục, chia 3 nhóm "Theo dõi / Vận hành / Quản lý" | 5 mục cố định: Trang chủ · Tìm hàng · Kho của tôi · Chuyển hàng · Cài đặt | Phải đọc 9 nhãn để tìm 1 việc; 3 nhóm là cách phân loại của người làm phần mềm |
| 2 | "Sản phẩm & tồn kho" là màn bảng 6 cột + 4 số liệu + lọc nhóm hàng + phân trang | Gộp vào Tìm hàng (thẻ kết quả) và Kho của tôi (sơ đồ) | Người dùng cần tìm một món, không cần đọc bảng tồn kho; bảng 6 cột không dùng được trên điện thoại |
| 3 | 5 thao tác cùng lúc trên màn tồn kho (Nhập / Xuất / Kiểm kê / Hàng hỏng / Gắn vị trí) | 2 luồng rõ ràng: Nhập hàng (3 bước), Lấy hàng (5 bước) | 5 nút ngang hàng = không nút nào là chính |
| 4 | "Quét QR" là một mục menu riêng | Nút Quét nổi, cùng chỗ mọi màn; tự chọn chế độ theo ngữ cảnh | Quét là hành động, không phải nơi đến |
| 5 | Bản đồ 3D có gizmo XYZ, thước mm, mini-map + khung camera, 4 nút camera, orbit bắt buộc | Mobile: chỉ tầng + kệ cần tìm + mũi tên. Desktop: 1 nút "Xem 3D đầy đủ" | 6 nút camera không giúp tìm hàng nhanh hơn, chỉ rối màn 390px |
| 6 | Nền tối `#0F172A`, chữ 12px, chấm đỏ nhấp nháy 1 giây | Nền sáng, chữ ≥16px, trạng thái = màu + icon + chữ | Kho sáng yếu + chữ 12px + nhấp nháy = không đọc được |
| 7 | Nút cao 42px, chữ 13px, focus ring 3px màu nhạt | Nút 48–56px, chữ 16px, focus ring `#087E8B` | Người lớn tuổi và người đang cầm hàng một tay không bấm trúng nút 42px |
| 8 | Không có chọn ngành; mọi cửa hàng thấy cùng một bộ kệ | Chọn ngành 1 lần, tự nạp mẫu kệ + màu + mẫu kho theo ngành | Người bán tã không cần thấy "kệ trưng bày kính có đèn" |
| 9 | Thư viện kệ có 3 loại chung chung (Kệ hàng, Tủ bảo quản, Khu kiểm đếm) | 5 kệ theo ngành + "Xem tất cả" | Tên kệ chung chung không giúp người mới biết nên đặt gì vào đâu |
| 10 | Nhập kích thước bằng mét, có trường toạ độ x/z/góc xoay | Nhập bằng cm; kéo thả, tự căn thẳng hàng; toạ độ ẩn | Người bán hàng nghĩ bằng cm và kéo bằng tay, không tính toạ độ |
| 11 | Không có nhân đôi kệ, không có hoàn tác | Nhân đôi kệ + hoàn tác 10 bước | 12 kệ giống nhau: nhân đôi nhanh hơn tạo mới 12 lần; hoàn tác cứu người mới khỏi thao tác nhầm |
| 12 | Xoá kệ chỉ chặn khi có hàng, không có xác nhận 2 bước | Xác nhận 2 bước + nút "Chuyển hàng đi" khi kệ còn hàng | Xoá nhầm kệ là mất dữ liệu vị trí, không hoàn tác được |
| 13 | Không có QR riêng cho kệ, không có cảnh báo kệ chưa in mã | Mỗi kệ tự có QR khi lưu, cảnh báo vàng nếu chưa in, nút "In tất cả mã QR" | Nhân viên không quét được kệ thì cả luồng lấy hàng dừng lại |
| 14 | Phiếu chuyển có 4 trạng thái (Chuẩn bị / Đang chuyển / Kiểm nhận / Hoàn tất) | 6 trạng thái, thêm "Đang nhặt hàng" và "Đã đóng thùng", tách "Báo lệch" | 4 trạng thái gộp việc nhặt hàng với đóng thùng, không biết hàng đã rời kho chưa |
| 15 | Không có mã phiếu in lên thùng; nhận hàng bằng cách chọn phiếu trong danh sách | Mã phiếu dán lên từng thùng, quét mã để mở bước kiểm hàng; sai cơ sở thì chặn | Không có mã trên thùng thì không chứng minh được thùng nào thuộc phiếu nào |
| 16 | Chênh lệch nhận hàng chỉ ghi trong lịch sử, không có ảnh, không có trạng thái riêng | Trạng thái "Báo lệch" + bắt buộc 1 ảnh + thông báo cho quản lý | Ảnh là bằng chứng duy nhất khi hàng hỏng hoặc thiếu |
| 17 | 5 chip lọc hạn dùng (<30, 30–90, >90, hết hạn, tất cả) | 2 lựa chọn: "Cận hạn" và "Đã hết hạn" | Người bán hàng không nghĩ theo khoảng 30–90 ngày |
| 18 | Tour onboarding 4 thẻ 3D + "Bắt đầu tour 3D" | Bỏ tour; thay bằng "Bắt đầu nhanh" 3 bước có tick + tooltip 1 lần/màn + nút "?" 3 bước | Ai cũng bấm "Bỏ qua"; hướng dẫn đúng lúc đang làm hiệu quả hơn hướng dẫn trước khi làm |
| 19 | Không có nút Hướng dẫn; trợ giúp nằm rải rác trong modal | Nút "?" cùng chỗ mọi màn, mở khung 3 bước có ảnh | Người mới cần biết "màn này làm gì" mà không phải rời màn |
| 20 | Thanh đáy desktop hiện 5 số liệu (tổng kệ, công suất, cảnh báo, lần quét cuối, online) | 3 khối trên Trang chủ; trạng thái mạng thành chip ở header | 5 số liệu luôn hiện nhưng không ai hành động dựa trên chúng |
| 21 | Breadcrumb "WareMap System › Vận hành › Sản phẩm & tồn kho" | Breadcrumb vị trí kho "Kho A › Kệ A1 › Tầng 2" | Breadcrumb cũ lặp lại menu, không trả lời "tôi đang ở đâu trong kho" |
| 22 | Ô tìm toàn cục tìm lẫn hàng + lô + vị trí + cơ sở | Chỉ tìm hàng; lô nằm trong chi tiết hàng | Tìm 1 thứ ra 4 loại kết quả, không biết bấm vào đâu |
| 23 | Nhãn kỹ thuật lẫn trong giao diện: FEFO, In-Transit, Sub-Account, Branch, SKU, RBAC, ROI | "Hàng hết hạn trước bán trước", "Đang đi đường", "Nhân viên", "Cơ sở", "Mã sản phẩm", "Giá vốn" | Người dùng không hiểu và không cần hiểu thuật ngữ nội bộ |
| 24 | Form cấp tài khoản 6 trường, có "lý do" bắt buộc và "số lượng" | 4 trường: họ tên, email, vai trò, cơ sở | Trường "lý do" chặn việc thêm một nhân viên trong 30 giây |
| 25 | Form nhập hàng nhiều trường, không rõ trường nào bắt buộc | 4 trường bắt buộc, phần còn lại trong "Thêm thông tin" | Càng nhiều trường càng dễ bỏ dở khi đang đứng trong kho |
| 26 | Vẽ kho được trên điện thoại, không có thông báo giới hạn | Điện thoại chỉ xem + đổi tên/số tầng; vẽ cần máy tính, có thông báo rõ | Kéo thả kệ trên màn 390px gần như không làm đúng được |
| 27 | Demo strip + chọn vai trò nằm trong sidebar vùng làm việc | Chuyển vào menu demo, chỉ hiện ở bản dùng thử | Chiếm chỗ và gây nhầm "tôi đang đăng nhập với vai trò nào" |
| 28 | Báo cáo hiệu quả (ROI) là mục menu ngang hàng | "Giá vốn" trong nhóm Quản lý, chỉ ADMIN_VIP và MANAGER | Không phải việc hằng ngày; nhân viên kho và bán hàng không được thấy giá vốn |

**Giữ nguyên:** bản đồ 3D WebGL thật, tem QR vị trí + lô, dữ liệu lô/hạn dùng, luồng chuyển hàng giữa cơ sở, phân quyền theo vai trò, dữ liệu demo hiện có.

---

## 9. Đối chiếu mã hiện tại & thứ tự triển khai

| Màn mới | Tệp hiện tại | Việc chính |
|---|---|---|
| Khung, menu, tab bar, header "?" | `src/app/Shell.tsx` | Menu 5 mục + nhóm Quản lý; tab bar mobile; chip mạng; bỏ breadcrumb nhóm |
| Route & quyền | `src/app/App.tsx`, `src/app/model.ts` | Thêm mã màn; bảng quyền 4 vai trò; ngành hàng theo cơ sở; 6 trạng thái phiếu |
| S0–S1 Chọn ngành, mẫu kho | mới (dùng `src/shared/data.ts`) | 2 thẻ ngành + 3 mẫu kho theo ngành |
| S2 Trang chủ | `src/features/dashboard/DashboardScreen.tsx` | Bắt đầu nhanh 3 bước; cảnh báo cận hạn; 3 khối; bỏ KPI/biểu đồ |
| S3–S4 Tìm hàng | `src/features/inventory/InventoryScreen.tsx` + `src/features/builder/BuilderScreen.tsx` | Thẻ kết quả có ảnh + màu + dung tích; bản đồ đơn giản; bỏ bảng 6 cột |
| S5–S8 Kho & vẽ kho | `src/features/builder/BuilderScreen.tsx`, `src/app/labels.tsx` | Thư viện kệ theo ngành; cm; nhân đôi; hoàn tác; QR kệ + in tất cả; mobile giới hạn |
| S9–S11 Nhập hàng | `InventoryScreen` (operation "Nhập hàng") + `labels.tsx` | Tách 3 màn; form 4 trường; quét kệ/lô khi xếp |
| S12–S14 Lấy hàng | `src/features/scanner/MobileScannerScreen.tsx` | Bỏ dropdown chọn kệ/tầng/ô; thêm chỉ đường, beep/rung, chặn khi sai, tự trừ tồn |
| S15–S19 Chuyển hàng | `src/features/in-transit/InTransitScreen.tsx` | 6 trạng thái; mã phiếu/thùng; kiểm hàng; báo lệch + ảnh; timeline |
| S20 Cài đặt cơ sở | `src/features/settings/SettingsScreen.tsx` | Ngành hàng, ngưỡng cận hạn, thời gian đi đường |
| S21 Nhân viên | `src/features/account/AccountRbacScreen.tsx` | Form 4 trường; bỏ bảng yêu cầu khỏi màn chính |
| S22 Giá vốn | `src/features/roi/RoiDashboardScreen.tsx` | Đổi nhãn; chỉ ADMIN_VIP + MANAGER |
| S23 Hướng dẫn | mới | Drawer 3 bước + tooltip lần đầu |

Thứ tự: **P0** khung/menu/quyền + chọn ngành + Tìm hàng + Lấy hàng (3 luồng chính) → **P1** Nhập hàng + Kho/vẽ kho + QR kệ + trạng thái offline → **P2** Chuyển hàng 6 trạng thái + Nhân viên + Giá vốn + Cài đặt cơ sở.

---

## 10. Câu hỏi cần chủ cửa hàng chốt trước khi code

1. Đơn hàng trong luồng Lấy hàng đến từ đâu (POS, Zalo, nhập tay)? Bản demo chưa có nguồn đơn.
2. Ngưỡng "sắp hết hạn" mặc định 30 ngày có đúng cho cả sữa bột (thường cần 60 ngày) không? Có cần đặt riêng theo ngành không?
3. In tem trên điện thoại (máy in Bluetooth) có bắt buộc ngay bản đầu không, hay in từ máy tính là đủ?
4. Thời gian đi đường mặc định 24 giờ có đúng với khoảng cách thực tế giữa các cơ sở?
5. Khi mất mạng, nhân viên có được phép **nhập hàng** (không chỉ quét lấy hàng) không?
6. Khu Tester có tính vào tồn kho không? (Tài liệu này đang hiểu là **không** tính, chỉ để trưng bày.)
