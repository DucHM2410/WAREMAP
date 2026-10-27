> **Đã được thay thế bởi [`docs/waremap-ux-spec.md`](./waremap-ux-spec.md).** Giữ lại để tham khảo lịch sử.

# WAREMAP — Bản đơn giản hoá giao diện (Mobile-first)

Tài liệu này là bản thiết kế thay thế cho bản Figma hiện tại. Mục tiêu duy nhất: **chủ cửa hàng và nhân viên làm được 3 việc hằng ngày mà không cần hướng dẫn dài**. Không thêm tính năng mới — chỉ bỏ bớt, gộp lại, đổi nhãn.

- Phạm vi: màn hình vận hành (sau đăng nhập) + 3 luồng chính.
- Ngoài phạm vi: trang giới thiệu, đăng nhập, quản trị nội bộ WareMap (giữ nguyên).
- Vai trò dùng trong tài liệu: `ADMIN_VIP` (chủ doanh nghiệp), `MANAGER` (quản lý), `STAFF_WAREHOUSE` (nhân viên kho), `STAFF_SALES` (nhân viên bán hàng).

---

## 0. Ba quyết định gốc

1. **Một khung cố định, không đổi chỗ.** Logo góc trên-trái, menu luôn cùng thứ tự, nút chính luôn ở đáy màn hình (mobile) hoặc góc phải trên cùng của vùng nội dung (desktop). Chuyển màn hình không được di chuyển logo, menu, hay nút chính.
2. **Menu chính 5 mục, phần còn lại vào "Công cụ".** Mọi thứ không làm hằng ngày (vẽ kho, nhân viên, giá vốn, gói dịch vụ, cài đặt) nằm trong một mục duy nhất, không chiếm chỗ trên màn hình chính.
3. **Một màn hình chỉ một việc.** Mỗi màn có đúng 1 nút chính. Nút phụ dùng viền/chữ. Không có màn nào vừa xem vừa sửa vừa cấu hình.

---

## 1. Cấu trúc màn hình

### 1.1 Mobile (390 × 844) — thiết kế trước

```
┌──────────────────────────────────────┐
│ ← [Tên màn]              [Kho A ▾]   │  Header 56px, dính trên
│ Kho A › Kệ A1 › Tầng 2               │  Breadcrumb 1 dòng, 14px
├──────────────────────────────────────┤
│                                      │
│  Nội dung: 1 câu dẫn + 1 khối chính  │  Nội dung cuộn
│                                      │
│                                      │
├──────────────────────────────────────┤
│  [ Nút chính — cao 56px, full width ]│  Vùng CTA cố định, dính đáy
├──────────────────────────────────────┤
│  Tổng quan  Tìm hàng  (Quét)  Lấy hàng  Thêm │  Tab bar 64px
└──────────────────────────────────────┘
```

- **Header**: nút quay lại (nếu là màn con) · tên màn 18px · chọn cơ sở (chip, chỉ hiện khi vai trò có >1 cơ sở).
- **Breadcrumb**: chỉ mô tả vị trí trong kho, tối đa 3 cấp: `Kho A › Kệ A1 › Tầng 2`. Không dùng breadcrumb kiểu "WareMap System › Vận hành › …".
- **Tab bar**: 5 khe cố định, khe giữa là nút quét tròn 64px nổi cao 12px.
- **Vùng CTA đáy**: chỉ 1 nút chính. Khi bàn phím mở, CTA dính trên bàn phím.
- **Không có**: sidebar, banner quảng cáo, thanh thống kê, nút nổi phụ (FAB thứ hai).

### 1.2 Desktop (1440 × 900) — xem tổng quan

```
┌────────────┬───────────────────────────────────────────────┐
│ Logo       │  Tìm hàng (ô tìm 1 dòng)      Kho A ▾   🔔  AN │
│            ├───────────────────────────────────────────────┤
│ Tổng quan  │  Kho A › Kệ A1 › Tầng 2                       │
│ Tìm hàng   │                                               │
│ Lấy hàng   │   Tiêu đề màn + 1 câu dẫn                     │
│ Nhập hàng  │   ┌──────────────┐  ┌───────────────────────┐  │
│ Chuyển hàng│   │ Nội dung      │  │ Bản đồ 3D / chi tiết  │  │
│            │   │               │  │ (rộng 40%, cố định)   │  │
│ ─ Công cụ  │   └──────────────┘  └───────────────────────┘  │
│ Hàng cận hạn│                                              │
│ Sơ đồ kho  │                                               │
│ Nhân viên  │                                               │
│ Giá vốn    │                                               │
│ Cài đặt    │                                               │
│ Gói dịch vụ│                                               │
│            │                                               │
│ [Avatar]   │                                               │
└────────────┴───────────────────────────────────────────────┘
```

- Sidebar rộng 240px: 5 mục chính, dưới một đường kẻ là nhóm **Công cụ** (chữ 14px, không icon to).
- Ô tìm hàng nằm ở header, dùng chung cho mọi màn — gõ là ra kết quả, không cần vào màn Tìm hàng.
- Desktop **không** có luồng quét riêng: quét là việc của mobile. Nếu mở trên desktop, hiện "Mở trên điện thoại để quét" + ô nhập mã tay.
- Màn Tổng quan của `ADMIN_VIP` gồm đúng 3 khối: Tồn kho theo cơ sở · Hàng cận hạn (có nút "Xem và lấy trước") · Phiếu chuyển đang đi đường. Không có biểu đồ trang trí.

### 1.3 Điều hướng theo vai trò

Menu chính (thứ tự cố định, chỉ ẩn/hiện — không đổi vị trí):

| # | Mục | ADMIN_VIP | MANAGER | STAFF_WAREHOUSE | STAFF_SALES |
|---|-----|:--:|:--:|:--:|:--:|
| 1 | Tổng quan (mobile: Việc hôm nay) | ✓ | ✓ | ✓ | ✓ |
| 2 | Tìm hàng | ✓ | ✓ | ✓ | ✓ |
| 3 | Lấy hàng (soạn/xuất) | ✓ | ✓ | ✓ | ✓ |
| 4 | Nhập hàng | ✓ | ✓ | ✓ | — |
| 5 | Chuyển hàng | ✓ | ✓ | ✓ | — |
| — | **Công cụ** | | | | |
| 5.1 | Hàng cận hạn | ✓ | ✓ | ✓ (chỉ xem) | ✓ (chỉ xem) |
| 5.2 | Sơ đồ kho (vẽ kho) | ✓ | ✓ | — | — |
| 5.3 | Nhân viên | ✓ | — | — | — |
| 5.4 | Giá vốn & lãi | ✓ | — | — | — |
| 5.5 | Cài đặt cơ sở | ✓ | ✓ | — | — |
| 5.6 | Gói dịch vụ & hạn mức | ✓ | — | — | — |

Quy tắc ẩn/hiện:

- `STAFF_SALES` **không thấy**: Giá vốn, Nhân viên, Sơ đồ kho, Nhập hàng, Chuyển hàng, Cài đặt.
- `STAFF_WAREHOUSE` **không thấy**: Giá vốn, Nhân viên, Sơ đồ kho, Cài đặt, Gói dịch vụ.
- `MANAGER` không thấy Giá vốn, Nhân viên, Gói dịch vụ.
- Không có màn nào báo "bạn không có quyền" cho mục đã bị ẩn — ẩn hẳn khỏi menu **và** chặn ở tầng route (nếu vào bằng link cũ, hiện: "Mục này chỉ dành cho chủ cửa hàng. Quay lại Tổng quan." + 1 nút).

Tab bar mobile theo vai trò (5 khe cố định):

| Khe | ADMIN_VIP / MANAGER | STAFF_WAREHOUSE | STAFF_SALES |
|-----|---------------------|-----------------|-------------|
| 1 | Tổng quan | Việc hôm nay | Việc hôm nay |
| 2 | Tìm hàng | Tìm hàng | Tìm hàng |
| 3 | **Quét** (nút giữa) | **Quét** | **Quét** |
| 4 | Lấy hàng | Lấy hàng | Lấy hàng |
| 5 | Thêm | Thêm | Thêm |

"Thêm" là bottom sheet chứa đúng các mục Công cụ mà vai trò được phép thấy + "Đăng xuất". Không có màn hình "Thêm" riêng.

---

## 2. Ba luồng chính (mỗi luồng ≤ 3 chạm)

Quy ước: **chạm** = một lần bấm nút. Quét QR tự nhận mã nên **không tính là chạm**.

### Luồng A — Tìm hàng (2 chạm)

**Mục tiêu:** từ lúc mở app đến lúc biết hàng nằm ở đâu ≤ 10 giây.

| Bước | Màn hình | Nội dung | Chạm |
|---|---|---|---|
| 1 | Tìm hàng | Câu dẫn: "Tìm vị trí hàng. Nhập tên hoặc quét mã sản phẩm." · ô tìm 48px (autofocus) · nút "Quét mã" · 3 mặt hàng vừa tìm | 1 (vào tab) |
| 2 | Tìm hàng — kết quả | Danh sách thẻ kết quả (mục 3.1) | 1 (gõ tên) |
| 3 | Vị trí hàng | Breadcrumb `Kho A › Kệ A1 › Tầng 2 › Ô 03` · bản đồ 3D đơn giản · vị trí chữ lớn 24px · nút chính "Chỉ đường đến kệ" | 0 (kết quả tự mở) |

- Kết quả tự mở bản đồ; không bắt người dùng bấm "Xem chi tiết".
- Trên desktop: kết quả nằm cột trái, bản đồ 3D nằm cột phải — không cần chuyển màn.
- Bản đồ mobile chỉ hiện: sàn + các kệ cùng dãy + kệ mục tiêu (viền đậm + icon) + ô mục tiêu. Ẩn kệ khác, ẩn gizmo, ẩn thước đo.
- Nếu WebGL không chạy: thay bằng sơ đồ 2D tĩnh cùng bố cục + dòng chữ vị trí (không hiện màn trắng).

### Luồng B — Lấy hàng để bán (3 chạm)

**Mục tiêu:** nhân viên không nhặt nhầm kệ, nhầm lô, và không phải nhìn màn hình liên tục.

| Bước | Màn hình | Nội dung | Chạm |
|---|---|---|---|
| 1 | Lấy hàng | Danh sách đơn cần soạn. Mỗi thẻ: mã đơn, kênh/khách, số món, giờ hẹn, nút chính "Bắt đầu lấy" | **1** |
| 2 | Chỉ đường | Mục tiêu chữ lớn: `Kệ A1 › Tầng 2 › Ô 03` · bản đồ đơn giản + mũi tên · tiến độ "2/5 món" · nút chính "Bắt đầu quét" | **2** |
| 3 | Quét mã kệ | Camera toàn màn (khung quét 260×260) · chữ "Quét mã trên kệ" · nút phụ "Nhập mã tay" | 0 (tự nhận) |
| 4 | Quét mã lô | Sau khi đúng kệ, tự chuyển · chữ "Quét mã trên lô hàng" · thẻ hàng: ảnh + màu + dung tích + SL cần lấy | 0 |
| 5 | Đã lấy xong | ✓ lớn · "Đã lấy đủ 5/5 món." · nút chính "Sang đơn tiếp theo" · nút phụ "Về Việc hôm nay" | **3** ("Xác nhận đã lấy đủ") |

Phản hồi khi quét (bắt buộc, không phụ thuộc màn hình):

| Kết quả | Âm thanh | Rung | Màu | Nội dung |
|---|---|---|---|---|
| Đúng kệ / đúng lô | 1 tiếng "bíp" cao, 120ms | 1 nhịp ngắn | Xanh #0F7B4F + ✓ | "Đúng kệ A1. Giờ quét mã lô." |
| Sai kệ | 2 tiếng "bíp" trầm | Rung 400ms | Đỏ #B42318 + ⚠ | "Bạn đang đứng ở Kệ A2. Hàng này nằm ở Kệ A1. Hãy đến Kệ A1 và quét lại." |
| Sai lô | 2 tiếng "bíp" trầm | Rung 400ms | Đỏ + ⚠ | "Lô này không đúng. Cần lô LO-002, bạn vừa quét LO-005. Tìm lô LO-002 trên cùng kệ rồi quét lại." |
| Lô hết hạn | 2 tiếng "bíp" trầm | Rung 400ms | Đỏ + ⚠ | "Lô LO-005 đã hết hạn 4 ngày. Không xuất lô này. Báo quản lý để xử lý hàng hết hạn." |

- Sai kệ/sai lô: **chặn** nút xác nhận, chỉ còn "Quét lại" và "Báo hàng lệch". Không có nút bỏ qua.
- Mất mạng: banner vàng cố định dưới header "Mất mạng. Vẫn quét và lưu tạm được — sẽ tự đồng bộ khi có mạng." Quét vẫn hoạt động, mỗi lần quét hiện chip "Chờ đồng bộ (3)".
- Nếu đơn thiếu hàng: nút phụ "Báo hàng lệch" → chụp ảnh + ghi chú 1 dòng → "Gửi quản lý".

### Luồng C — Nhập hàng mới (3 chạm)

| Bước | Màn hình | Nội dung | Chạm |
|---|---|---|---|
| 1 | Nhập hàng mới | Form 4 trường: Tên hàng · Số lượng · Số lô · Hạn dùng. Các trường khác tự điền, ẩn trong "Thêm thông tin" | **1** |
| 2 | Lưu & in tem | Sau khi bấm "Lưu & in tem": hiện 2 tem (vị trí + lô) và hộp in của máy | **2** |
| 3 | Chọn ô kệ trống | Bản đồ chỉ hiện các ô trống của kệ gần nhất; ô trống có icon + chữ "Trống"; gợi ý "Ô trống gần cửa nhất" được chọn sẵn | **3** ("Xếp vào ô này") |
| 4 | Xong | Toast: "Đã lưu lô mới. Xếp hàng lên kệ ngay?" + nút "Chụp ảnh xác nhận" (tuỳ chọn) | 0 |

- Form chỉ có 4 trường bắt buộc; nhà cung cấp, giá nhập, ghi chú nằm trong "Thêm thông tin" (mặc định đóng).
- Hạn dùng: chọn bằng lịch, có nút nhanh "+6 tháng", "+12 tháng"; hiện ngay "Còn 180 ngày" dưới trường.
- Số lô tự sinh theo mẫu `LO-00x` và cho sửa.
- Chọn ô kệ: nếu kho chưa có kệ → empty state (mục 4.1), không cho lưu mồ côi.

---

## 3. Danh sách màn hình theo vai trò

Ký hiệu: ✓ = có quyền · X = chỉ xem · — = không thấy.

### 3.1 Kho màn hình

| Mã | Màn hình | Mục đích (1 câu) | ADMIN_VIP | MANAGER | STAFF_WAREHOUSE | STAFF_SALES |
|---|---|---|---|---|---|---|
| S1 | Tổng quan (desktop) / Việc hôm nay (mobile) | Biết hôm nay phải làm gì | ✓ | ✓ | ✓ (việc của tôi) | ✓ (việc của tôi) |
| S2 | Tìm hàng | Tìm vị trí hàng trên kệ | ✓ | ✓ | ✓ | ✓ |
| S3 | Vị trí hàng (chi tiết + bản đồ) | Đi đến đúng kệ/ô | ✓ | ✓ | ✓ | ✓ |
| S4 | Lấy hàng — danh sách đơn | Chọn đơn để soạn | ✓ | ✓ | ✓ | ✓ |
| S5 | Lấy hàng — chỉ đường | Đi đến kệ của đơn | ✓ | ✓ | ✓ | ✓ |
| S6 | Lấy hàng — quét kệ & lô | Xác minh đúng hàng | ✓ | ✓ | ✓ | ✓ |
| S7 | Lấy hàng — xong / báo lệch | Chốt đơn, báo thiếu | ✓ | ✓ | ✓ | ✓ |
| S8 | Nhập hàng mới — form | Ghi nhận lô mới | ✓ | ✓ | ✓ | — |
| S9 | Nhập hàng — in tem | In tem vị trí & lô | ✓ | ✓ | ✓ | — |
| S10 | Nhập hàng — chọn ô kệ | Xếp hàng vào ô trống | ✓ | ✓ | ✓ | — |
| S11 | Chuyển hàng — danh sách phiếu | Theo dõi hàng đang đi đường | ✓ | ✓ | ✓ | — |
| S12 | Chuyển hàng — chi tiết phiếu | Gửi/nhận hàng | ✓ | ✓ | ✓ | — |
| S13 | Chuyển hàng — kiểm nhận & báo lệch | Chốt số lượng thực nhận | ✓ | ✓ | ✓ | — |
| S14 | Hàng cận hạn | Xử lý hàng gần hết hạn | ✓ | ✓ | X | X |
| S15 | Nhân viên | Thêm/khoá tài khoản | ✓ | — | — | — |
| S16 | Sơ đồ kho (xem + vẽ) | Tạo và sửa kệ | ✓ | ✓ | — | — |
| S17 | Giá vốn & lãi | Xem giá vốn, lợi nhuận | ✓ | — | — | — |
| S18 | Cài đặt cơ sở | Đổi thông tin cơ sở, ngưỡng cảnh báo | ✓ | ✓ | — | — |
| S19 | Gói dịch vụ & hạn mức | Gia hạn, mua thêm nhân viên | ✓ | — | — | — |
| S20 | Quét mã (3 chế độ: tìm / lấy / nhập) | Cửa ngõ quét dùng chung | ✓ | ✓ | ✓ | ✓ |

### 3.2 Cấu trúc từng màn (mobile)

**S1 — Việc hôm nay (nhân viên)**
Câu dẫn: "Việc của bạn hôm nay." · 3 thẻ lớn: "3 đơn cần lấy" → Lấy hàng · "2 lô cần nhập" → Nhập hàng · "1 phiếu chuyển đến" → Chuyển hàng. Dưới cùng: "Hàng cận hạn ở cơ sở này" (chỉ xem).
Trạng thái rỗng: "Hôm nay chưa có việc nào. Bạn có thể tìm hàng hoặc quét mã."

**S1 — Tổng quan (chủ/quản lý, desktop)**
3 khối ngang: Tồn kho theo cơ sở (số mặt hàng, số ô trống) · Hàng cận hạn (số lô + nút "Xem và lấy trước") · Phiếu chuyển đang đi đường (số phiếu + trạng thái). Không có biểu đồ, không có KPI trang trí.

**S2 — Tìm hàng**
Ô tìm + nút quét + "Tìm gần đây". Kết quả là thẻ (mục 4.2). Không có bộ lọc nhóm hàng, không phân trang — cuộn vô hạn.

**S3 — Vị trí hàng**
Breadcrumb vị trí · bản đồ đơn giản · vị trí chữ lớn · tồn kho + hạn dùng · nút chính "Chỉ đường đến kệ" · nút phụ "Quét mã kệ để xác nhận".

**S14 — Hàng cận hạn**
2 lựa chọn duy nhất: "Cận hạn (≤ 30 ngày)" · "Đã hết hạn". Mỗi dòng: ảnh, tên, màu/dung tích, lô, hạn dùng (chữ + icon), vị trí, nút "Lấy trước". Không có 5 mức lọc màu.

**S15 — Nhân viên**
Danh sách: tên, vai trò, cơ sở, trạng thái (Đang làm / Đã khoá). Nút chính "Thêm nhân viên" → form 4 trường (họ tên, email, vai trò, cơ sở). Khoá tài khoản: xác nhận 2 bước.

**S16 — Sơ đồ kho**
Mặc định là **chế độ xem**. Nút phụ "Sửa sơ đồ" mới bật công cụ vẽ. Trong chế độ vẽ chỉ có: thêm kệ, xoá kệ, đổi tên, số tầng, số ô. Không có thư viện 5 loại kệ, không có gizmo xoay 3 trục, không có thước mm.

**S19 — Gói dịch vụ & hạn mức**
Một chỗ duy nhất: gói hiện tại, số cơ sở, số nhân viên đã dùng/hạn mức, nút chính "Gia hạn" hoặc "Mua thêm nhân viên". Không lặp lại ở Cài đặt hay Nhân viên (chỉ hiện link "Xem gói dịch vụ").

---

## 4. Microcopy

### 4.1 Nguyên tắc viết

- Đầu màn luôn đủ 3 ý: **đây là gì → để làm gì → bước tiếp theo**. Tối đa 2 câu, 16px.
- Nút = động từ + đối tượng. Không dùng "Submit", "OK", "Confirm", "Gửi", "Lưu" trơ.
- Lỗi = chuyện gì đã xảy ra + cách sửa + hành động kế tiếp. Không dùng mã lỗi.
- Xưng "bạn", gọi hàng là "hàng", kệ là "kệ", ô là "ô". Không dùng "SKU", "batch", "location", "inbound".

### 4.2 Thẻ kết quả tìm hàng (chống nhặt nhầm)

Bắt buộc có, theo thứ tự đọc:

```
[Ảnh 72×72]  Son dưỡng Daily Care
             HỒNG NHẠT · 4g          ← 18px, đậm, không viết tắt
             Kệ A1 › Tầng 2 › Ô 03   ← 20px
             Còn 120 · Hạn 19/11/2026
             [icon đồng hồ] Còn 23 ngày
```

- Màu và dung tích luôn nằm trên ảnh/thẻ, cỡ ≥ 18px, không phải chữ phụ xám.
- Ảnh có alt text mô tả đúng: `alt="Son dưỡng Daily Care màu hồng nhạt, tuýp 4g"`.
- Nếu 2 SKU chỉ khác màu/dung tích: hiện thêm chip "Khác màu" / "Khác dung tích" và xếp cạnh nhau để so.

### 4.3 Nút bấm

| Ngữ cảnh | Nhãn cũ | Nhãn mới |
|---|---|---|
| Tìm hàng | Tìm kiếm / Search | **Tìm hàng** |
| Quét | Quét QR | **Quét mã** |
| Xác nhận đã lấy | Submit / Xác nhận | **Xác nhận đã lấy đủ** |
| Bắt đầu soạn đơn | Xử lý / Chi tiết | **Bắt đầu lấy hàng** |
| Đi tới kệ | Xem bản đồ | **Chỉ đường đến kệ** |
| Lưu lô mới | Lưu | **Lưu & in tem** |
| Xếp vào ô | Gán vị trí | **Xếp vào ô này** |
| In | In nhãn | **In tem** |
| Báo thiếu hàng | Discrepancy | **Báo hàng lệch** |
| Gửi quản lý | Gửi | **Gửi quản lý** |
| Gửi hàng đi | Điều chuyển | **Gửi hàng** |
| Nhận hàng | Kiểm nhận | **Nhận hàng** |
| Gia hạn | Nâng cấp | **Gia hạn** |
| Thêm chỗ cho nhân viên | Mua block | **Mua thêm nhân viên** |
| Khoá tài khoản | Vô hiệu hoá | **Khoá tài khoản** |
| Huỷ phiếu | Cancel | **Huỷ phiếu** |
| Đồng ý xoá | OK | **Xoá kệ này** |

### 4.4 Câu dẫn đầu màn hình

| Màn | Câu dẫn |
|---|---|
| Tìm hàng | Tìm vị trí hàng. Nhập tên hoặc quét mã sản phẩm. |
| Vị trí hàng | Hàng nằm ở đây. Bấm "Chỉ đường đến kệ" để đi tới. |
| Lấy hàng | Chọn một đơn để bắt đầu soạn. Quét mã kệ trước, rồi quét mã lô. |
| Chỉ đường | Đi đến kệ được đánh dấu. Bấm "Bắt đầu quét" khi đã đứng trước kệ. |
| Quét mã kệ | Quét mã trên kệ. Nếu không thấy mã, bấm "Nhập mã tay". |
| Nhập hàng mới | Nhập 4 thông tin: tên hàng, số lượng, số lô, hạn dùng. |
| Chọn ô kệ | Chọn một ô trống cho lô vừa nhập. Ô gần cửa nhất đã được chọn sẵn. |
| Chuyển hàng | Theo dõi hàng đang đi đường. Bấm một phiếu để gửi hoặc nhận. |
| Hàng cận hạn | Những lô sắp hết hạn. Bấm "Lấy trước" để ưu tiên bán trước. |
| Nhân viên | Thêm hoặc khoá tài khoản nhân viên. Mỗi người cần họ tên, email, vai trò, cơ sở. |
| Sơ đồ kho | Đây là sơ đồ kho đang dùng. Bấm "Sửa sơ đồ" để thêm hoặc sửa kệ. |
| Giá vốn & lãi | Giá vốn và lãi theo lô đã bán. Chỉ chủ cửa hàng xem được. |
| Gói dịch vụ | Gói đang dùng và số nhân viên còn được thêm. |

### 4.5 Thông báo thành công (luôn kèm bước tiếp theo)

- "Đã lưu lô mới. Xếp hàng lên kệ ngay?" → [Chọn ô kệ]
- "Đã in 2 tem. Dán tem lên lô và lên ô kệ." → [Chọn ô kệ]
- "Đã lấy đủ 5/5 món. Đơn sẵn sàng giao." → [Sang đơn tiếp theo]
- "Đã gửi hàng. Cơ sở nhận sẽ thấy phiếu trong mục Chuyển hàng." → [Về Việc hôm nay]
- "Đã nhận đủ 20/20. Phiếu đã đóng." → [Về danh sách phiếu]
- "Đã thêm nhân viên. Minh Anh sẽ nhận email mời trong vài phút." → [Thêm người khác]
- "Đã đồng bộ 3 thao tác." (tự ẩn sau 4 giây)

### 4.6 Lỗi & trạng thái ngoài luồng

**Empty — chưa có kệ**
> **Bạn chưa có kệ nào.**
> Dùng Công cụ vẽ kho để tạo kệ đầu tiên trong khoảng 5 phút.
> [Vẽ kệ đầu tiên] · [Xem kho mẫu]

**Empty — không tìm thấy hàng**
> **Không tìm thấy "sữa bột".**
> Kiểm tra lại tên, hoặc thử quét mã trên hộp. Nếu hàng mới về, nhập hàng trước.
> [Quét mã] · [Nhập hàng mới]

**Empty — chưa có đơn**
> **Hôm nay chưa có đơn nào cần lấy.**
> Đơn mới sẽ xuất hiện ở đây. Bạn có thể tìm hàng trong lúc chờ.
> [Tìm hàng]

**Quét sai kệ**
> **Bạn đang đứng ở Kệ A2. Hàng này nằm ở Kệ A1.**
> Hãy đến Kệ A1 và quét lại. Nếu bạn chắc chắn hàng đang ở đây, báo quản lý.
> [Quét lại] · [Báo hàng lệch]

**Quét sai lô**
> **Lô này không đúng.**
> Cần lô **LO-002**, bạn vừa quét **LO-005**. Tìm lô LO-002 trên cùng kệ rồi quét lại.
> [Quét lại]

**Lô hết hạn**
> **Lô LO-005 đã hết hạn 4 ngày. Không xuất lô này.**
> Đặt lô sang khu chờ xử lý và báo quản lý. Hệ thống không cho xuất để tránh bán hàng hết hạn.
> [Báo quản lý] · [Chọn lô khác]

**Thiếu hàng khi kiểm nhận**
> **Phiếu ghi 20, thực nhận 18.**
> Chênh 2 sản phẩm. Chụp ảnh thùng hàng để quản lý đối chiếu.
> [Chụp ảnh gửi quản lý] · [Nhận 18 và báo lệch]

**Mất mạng**
> **Mất mạng. Vẫn quét và lưu tạm được.**
> Mọi thao tác sẽ tự đồng bộ khi có mạng. Không đóng ứng dụng.
> Chip trên header: "Chờ đồng bộ (3)"

**Đồng bộ lỗi**
> **Chưa đồng bộ được 2 thao tác.**
> Dữ liệu vẫn nằm trên máy này. Kiểm tra mạng rồi bấm "Thử lại". Nếu vẫn lỗi, gửi ảnh chụp màn hình cho quản lý.
> [Thử lại] · [Gửi ảnh cho quản lý]

**Hết hạn mức nhân viên**
> **Bạn đã dùng 5/5 tài khoản.**
> Gói hiện tại cho 5 nhân viên. Mua thêm 5 tài khoản để thêm người mới.
> [Mua thêm nhân viên] (một chỗ duy nhất: Gói dịch vụ)

**Gói hết hạn**
> **Gói dùng thử đã hết hạn hôm nay.**
> Bạn vẫn xem được dữ liệu, nhưng không nhập hoặc xuất hàng được. Gia hạn để tiếp tục.
> [Gia hạn]

**Không có quyền**
> **Mục này chỉ dành cho chủ cửa hàng.**
> Bạn vẫn tìm hàng, lấy hàng và quét mã bình thường.
> [Về Tổng quan]

**Xác nhận 2 bước (nguy hiểm)**
> Bước 1: "Khoá tài khoản của Minh Anh?" → [Khoá tài khoản] · [Giữ nguyên]
> Bước 2: "Minh Anh sẽ không đăng nhập được nữa. Các thao tác đã làm vẫn được giữ." → [Khoá ngay] · [Quay lại]

### 4.7 Trạng thái ô kệ (không dựa vào màu)

| Trạng thái | Màu nền | Icon | Chữ trên ô |
|---|---|---|---|
| Trống | #F2F4F7 (xám nhạt) | ○ | "Trống" |
| Có hàng | #E7F5EC (xanh nhạt) | ▣ | "Có hàng" |
| Cận hạn (≤30 ngày) | #FFF4E0 (hổ phách nhạt) | ◷ | "Cận hạn" |
| Đã hết hạn | #FDECEA (đỏ nhạt) | ✕ | "Hết hạn" |

- Chữ luôn ≥ 14px đậm trên nền nhạt; không dùng chữ trắng trên nền đỏ/xanh đậm.
- Ô đang chọn: viền 2px + nhãn "Đang chọn" (không chỉ đổi màu viền).

### 4.8 Trạng thái tương tác (bắt buộc cho mọi thành phần)

| Trạng thái | Quy định |
|---|---|
| Hover | Nền tối hơn 1 bậc (chỉ desktop), 150ms |
| Pressed | Nền tối hơn 2 bậc + scale 0.98, 100ms |
| Focus | Viền 2px #0057D9, offset 2px — luôn hiện, kể cả khi dùng chuột |
| Loading | Nút giữ nguyên kích thước, chữ đổi thành "Đang lưu…" + spinner; cấm nút thứ hai |
| Thành công | Toast xanh có icon ✓ + bước tiếp theo, tự ẩn 4 giây |
| Lỗi | Toast đỏ + rung (mobile) + nội dung hướng dẫn sửa, không tự ẩn |

### 4.9 Khung xương (skeleton) — chống nhảy bố cục

- Mỗi khối có chiều cao cố định trước khi có dữ liệu: thẻ kết quả 88px, thẻ đơn 96px, khung bản đồ 3D `aspect-ratio: 4/3`, ảnh 72×72.
- Khung xương dùng đúng kích thước thật (không dùng spinner toàn màn).
- Bản đồ 3D: khung giữ chỗ + chữ "Đang tải bản đồ…" + nút "Dùng sơ đồ 2D" hiện sau 3 giây.
- Không dùng `height: auto` cho ảnh/bản đồ khi đang tải.

### 4.10 Tiếp cận

- Chữ nhỏ nhất 16px trên mobile (nhãn phụ 14px chỉ dùng cho breadcrumb và chú thích không quan trọng).
- Nút/ô chạm ≥ 48×48px; khoảng cách giữa 2 nút ≥ 8px; nút chính cao 56px.
- Tương phản ≥ 4.5:1 cho chữ thường, ≥ 3:1 cho chữ lớn và viền icon. Không dùng vàng #F59E0B làm màu chữ trên nền trắng (chỉ dùng làm nền/chip).
- Mọi trường form có nhãn cố định phía trên, **không** dùng placeholder thay nhãn. Placeholder chỉ là ví dụ: `Ví dụ: Sữa bột Grow Plus`.
- Ảnh sản phẩm có alt text mô tả sản phẩm + màu + dung tích.
- Không có thông tin nào chỉ truyền đạt bằng màu hoặc bằng chuyển động.

---

## 5. Đã bỏ bớt gì so với bản Figma hiện tại, và vì sao

| # | Bản hiện tại | Bản mới | Lý do |
|---|---|---|---|
| 1 | Menu 9 mục chia 3 nhóm "Theo dõi / Vận hành / Quản lý" | 5 mục chính + 1 nhóm "Công cụ" | Chủ cửa hàng phải đọc 9 nhãn để tìm 1 việc. 3 nhóm là cách phân loại của người làm phần mềm, không phải của người bán hàng. |
| 2 | "Sản phẩm & tồn kho" là một màn bảng 6 cột, 4 số liệu, bộ lọc nhóm hàng, phân trang | Gộp vào "Tìm hàng": 1 ô tìm + thẻ kết quả | Người dùng không đến để "xem tồn kho", họ đến để tìm một món hàng. Bảng 6 cột trên điện thoại là bất khả thi. |
| 3 | 5 thao tác cùng lúc trên màn tồn kho: Nhập hàng · Xuất hàng · Kiểm kê · Xử lý hàng hỏng · Gắn vị trí | Tách thành 2 luồng rõ (Lấy hàng, Nhập hàng); Kiểm kê và Xử lý hàng hỏng chuyển vào Công cụ | 5 nút ngang hàng = không nút nào là chính. Nhân viên phải chọn giữa 5 thứ giống nhau. |
| 4 | "Quét QR" là một mục menu riêng, ngang hàng với các màn khác | Nút quét ở giữa tab bar + tự chuyển chế độ theo ngữ cảnh | Quét là hành động, không phải nơi đến. Đặt ngang hàng khiến người dùng phải "vào màn quét rồi chọn quét gì". |
| 5 | Bản đồ 3D có gizmo XYZ, thước đo mm, mini-map + khung camera, 4 nút zoom/xoay/reset/fullscreen, orbit bắt buộc | Mobile: chỉ hiện tầng + kệ cần tìm + mũi tên. Desktop: 1 nút "Xem 3D đầy đủ" | 6 nút điều khiển camera không giúp tìm hàng nhanh hơn, chỉ làm rối màn hình 390px. |
| 6 | Dark mode mặc định (#0F172A), chữ 12px, chấm đỏ nhấp nháy 1s | 1 giao diện sáng, chữ ≥16px, trạng thái bằng icon + chữ | Kho sáng yếu + chữ 12px + nhấp nháy = không đọc được. Hai theme nhân đôi công kiểm thử mà không thêm giá trị. |
| 7 | 5 chip lọc hạn dùng (<30, 30–90, >90, hết hạn, tất cả) | 2 lựa chọn: "Cận hạn" và "Đã hết hạn" | Người bán hàng không nghĩ theo khoảng 30–90 ngày. Chip chỉ khác màu, dễ chọn nhầm. |
| 8 | Cột "Hành động" tự định nghĩa trong bảng lô | 1 nút "Lấy trước" | Cột hành động trống hoặc mơ hồ; 1 hành động đúng nghĩa là đủ. |
| 9 | Tour onboarding 4 thẻ 3D + "Bắt đầu tour 3D" | Bỏ tour; thay bằng empty state có CTA + 1 câu dẫn tại từng màn | Người dùng bấm "Bỏ qua" ngay. Hướng dẫn đúng lúc dùng tốt hơn hướng dẫn trước khi dùng. |
| 10 | Thanh đáy desktop: Total Racks · Capacity 72% · Expiry Alerts 6 · Last scan 22:14 · Online | 3 khối trên Tổng quan; trạng thái mạng thành chip ở header | 5 số liệu luôn hiện nhưng không ai hành động dựa trên chúng. |
| 11 | Breadcrumb "WareMap System › Vận hành › Sản phẩm & tồn kho" | Breadcrumb vị trí kho "Kho A › Kệ A1 › Tầng 2" | Breadcrumb cũ lặp lại menu, không trả lời "tôi đang ở đâu trong kho". |
| 12 | Ô tìm toàn cục tìm lẫn hàng + lô + vị trí + cơ sở | Chỉ tìm hàng; lô nằm trong chi tiết hàng | Tìm 1 thứ nhưng ra 4 loại kết quả khác nhau, người dùng không biết bấm vào đâu. |
| 13 | 3 nhãn kỹ thuật lẫn trong giao diện: FEFO, In-Transit, Sub-Account, Branch, ROI, RBAC | "Hạn dùng gần hết", "Đang đi đường", "Nhân viên", "Cơ sở", "Giá vốn & lãi" | Người dùng không hiểu và không cần hiểu thuật ngữ nội bộ. |
| 14 | Form cấp tài khoản 6 trường (kể cả "lý do" bắt buộc, "số lượng") | 4 trường: họ tên, email, vai trò, cơ sở | "Lý do" là thủ tục nội bộ, chặn việc thêm 1 nhân viên trong 30 giây. |
| 15 | Form nhập hàng nhiều trường, không rõ trường nào bắt buộc | 4 trường bắt buộc; phần còn lại trong "Thêm thông tin" | Càng nhiều trường, càng dễ bỏ dở giữa đường khi đang đứng trong kho. |
| 16 | Demo strip + role picker + "Về trang chủ" nằm trong sidebar vùng làm việc | Chuyển vào menu demo (chỉ hiện ở bản dùng thử, dưới cùng) | Chiếm chỗ và gây hiểu nhầm về việc đang đăng nhập với vai trò nào. |
| 17 | Trạng thái ô chỉ bằng màu (xám/xanh/vàng/đỏ nhấp nháy) | Màu + icon + chữ "Trống / Có hàng / Cận hạn / Hết hạn" | Khoảng 8% nam giới khó phân biệt đỏ–vàng–xanh; ánh sáng kho kém làm màu bết lại. |
| 18 | Báo cáo hiệu quả (ROI) là mục menu ngang hàng | "Giá vốn & lãi" trong Công cụ, chỉ `ADMIN_VIP` | Không phải việc hằng ngày; nhân viên không được thấy giá vốn. |
| 19 | "Chuyển kho" gộp cả tạo phiếu, gửi, nhận, huỷ trong 1 màn + modal | 3 màn theo bước: danh sách → chi tiết → kiểm nhận/báo lệch | Một màn 4 trạng thái bắt người dùng tự suy ra mình đang ở bước nào. |
| 20 | Nhiều nút cùng cấp trong 1 modal chi tiết (In tem, Sửa, Gán vị trí, Xuất, Kiểm kê…) | 1 nút chính + tối đa 1 nút phụ | Nhiều nút ngang hàng khiến người không rành công nghệ dừng lại và đoán. |

**Giữ nguyên (không đụng):** bản đồ 3D WebGL thật, tem QR vị trí + lô, logic lô/hạn dùng, luồng chuyển hàng giữa cơ sở, phân quyền theo vai trò, dữ liệu demo.

---

## 6. Đối chiếu với mã hiện tại (để triển khai)

| Màn mới | Tệp hiện tại | Việc cần làm |
|---|---|---|
| Khung + menu | `src/app/Shell.tsx` | Rút menu còn 5 + Công cụ; bỏ breadcrumb nhóm; tab bar mobile; chip mạng |
| Điều hướng/route | `src/app/App.tsx`, `src/app/model.ts` | Thêm mã màn mới, bảng quyền theo 4 vai trò, chặn route |
| S1 Tổng quan | `src/features/dashboard/DashboardScreen.tsx` | Bỏ KPI/biểu đồ trang trí; còn 3 khối + cảnh báo cận hạn nổi bật |
| S2–S3 Tìm hàng | `src/features/inventory/InventoryScreen.tsx` (bảng) + `src/features/builder/BuilderScreen.tsx` (bản đồ) | Tách "tìm" khỏi "bảng"; thẻ kết quả mới; bản đồ chế độ đơn giản |
| S4–S7 Lấy hàng | `src/features/scanner/MobileScannerScreen.tsx` | Bỏ chọn kệ/tầng/ô bằng dropdown; thêm chỉ đường, beep/rung, chặn khi sai |
| S8–S10 Nhập hàng | `src/features/inventory/InventoryScreen.tsx` (operation "Nhập hàng") + `src/app/labels.tsx` | Form 4 trường; in tem; chọn ô trống trên bản đồ |
| S11–S13 Chuyển hàng | `src/features/in-transit/InTransitScreen.tsx` | Tách 3 bước; thêm "Báo lệch" + chụp ảnh |
| S14 Hàng cận hạn | `src/features/fefo-alerts/FefoAlertsScreen.tsx` | Còn 2 lựa chọn lọc; nút "Lấy trước" |
| S15 Nhân viên | `src/features/account/AccountRbacScreen.tsx` | Form 4 trường; bỏ bảng yêu cầu khỏi màn chính |
| S16 Sơ đồ kho | `src/features/builder/BuilderScreen.tsx` | Mặc định chế độ xem; công cụ vẽ chỉ sau "Sửa sơ đồ" |
| S17 Giá vốn & lãi | `src/features/roi/RoiDashboardScreen.tsx` | Chỉ `ADMIN_VIP`; đổi nhãn |
| S18 Cài đặt | `src/features/settings/SettingsScreen.tsx` | Bỏ khối gói dịch vụ (dồn về S19); bỏ cài đặt demo khỏi màn chính |
| S19 Gói dịch vụ | `src/features/settings/SettingsScreen.tsx` (khối gói) | Tách thành màn riêng, 1 chỗ duy nhất |

Thứ tự làm đề xuất: **P0** khung + menu theo vai trò + Tìm hàng + Lấy hàng (3 luồng chính) → **P1** Nhập hàng + Hàng cận hạn + trạng thái offline → **P2** Chuyển hàng, Nhân viên, Sơ đồ kho, Giá vốn, Gói dịch vụ.

---

## 7. Câu hỏi còn mở (cần chủ cửa hàng xác nhận)

1. Đơn hàng trong luồng Lấy hàng lấy từ đâu (POS, Zalo, nhập tay)? Bản demo hiện chưa có nguồn đơn — cần chốt để không phải thêm màn.
2. Nhân viên bán hàng có được tự tạo đơn lấy hàng không, hay chỉ nhận đơn từ quản lý?
3. Có cần in tem ngay trên điện thoại (máy in Bluetooth) hay in từ desktop là đủ?
4. Ngưỡng "cận hạn" mặc định 30 ngày có đúng với mỹ phẩm và sữa bột không (một số lô sữa cần 60 ngày)?
5. Khi mất mạng, nhân viên có được phép **nhập hàng** (không chỉ quét lấy hàng) không?
