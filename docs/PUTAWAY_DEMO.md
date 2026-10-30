# Chỉnh kệ đơn giản và nhập thùng lên kệ

## Chỉnh kệ

Màn chi tiết kệ ưu tiên tên dễ nhớ, lựa chọn kích thước **Gọn / Phổ biến / Rộng**, nút tăng giảm tầng / ô và sơ đồ ô minh họa. Đo cm, tọa độ và tùy chỉnh chi tiết ở mục nâng cao. Không được bỏ tầng / ô đang có hàng. Sơ đồ không xác nhận sức chịu tải của kệ.

Thư viện ưu tiên kệ V lỗ, trung tải, kệ có khay cho mỹ phẩm / hàng mẹ và bé. Pallet và các mẫu kho lớn nằm sau **Xem thêm mẫu kho lớn**. Các kích thước là mẫu để chỉnh theo kệ thực tế, không khẳng định một kích thước là tiêu chuẩn chung của thị trường Việt Nam. Hình 3D có vách chia ô / khay; ô trên kệ mở cũng có thể chỉ là vùng định vị được đánh nhãn.

Tham khảo nhà sản xuất tại Việt Nam: [Catalogue Vinatech](https://vinatechgroup.vn/catalogue-ke-kho-hang-vinatech.html).

## Quyền

| Vai trò | Xem Kho 3D | Sửa kệ | Nhập thùng lên kệ | Phạm vi demo |
| --- | --- | --- | --- | --- |
| Chủ doanh nghiệp | Có | Có | Có | Các cơ sở thuộc gói |
| Quản lý kho | Có | Có | Có | Kho được phân công; demo là Kho trung tâm |
| Nhân viên kho | Có | Không | Có | Kho được phân công; demo là Kho trung tâm |
| Nhân viên bán hàng | Có | Không | Không | Chỉ tra cứu tại kho được phân công |
| Admin hệ thống | Không | Không | Không | Quản trị khách hàng / nội dung website |
| Khách | Kho mẫu | Không | Không | Một kho mẫu chỉ xem |

Quyền kiểm tra tại điều hướng, màn hình và hàm xử lý nhập thùng. Đây là mô phỏng phía trình duyệt, chưa phải xác thực / phân quyền máy chủ.

## Luồng nhập hàng

1. Đăng nhập Chủ doanh nghiệp, quản lý hoặc nhân viên kho. Mở **Kho 3D → Quét & nhập hàng lên kệ** hoặc **Sản phẩm & tồn kho → Quét nhập lên kệ**.
2. **Tạo thùng chờ nhập**: chọn SKU có sẵn hoặc khai báo SKU mới, lô, hạn dùng, số đơn vị trong thùng và cơ sở nhận. Nên nhập kích thước bao bì đã đo. Nhãn thùng `CTN:...` có thể tải xuống để in. Giai đoạn này chưa cộng tồn.

Chọn rõ **mở thùng, xếp theo đơn vị** hoặc **giữ nguyên thùng**. Nếu giữ nguyên, phải khai báo kích thước vỏ thùng đã đo; sức chứa dùng số thùng `ceil(tồn đơn vị / đơn vị mỗi thùng)`. Một thùng đã mở nhưng chưa dùng hết vẫn chiếm một chỗ. Tồn kho luôn tính theo đơn vị sản phẩm. Một lô tại một ô cần cùng quy cách đóng gói trong demo.
3. Quét hoặc nhập QR vị trí đầy đủ `LOC:<cơ sở>:<kệ>:<tầng>:<ô>`. Mục lấy nhãn / mã mẫu cho phép tạo QR vị trí và thử mà không cần camera.
4. Quét hoặc nhập mã thùng đã đăng ký. Đối chiếu cơ sở, SKU, lô, hạn dùng, số lượng và cách xếp.
5. Xác nhận đã kiểm đếm và đặt hàng thực tế. Chỉ bước này cộng tồn và đánh dấu thùng đã nhập. Có thể mở ngay đúng lô / vị trí trên Kho 3D.

Chặn thùng trùng, cơ sở ngoài quyền, QR vị trí sai, hàng hết hạn, hạn dùng không khớp lô đã có và lô đang ở vị trí khác. Demo chỉ hỗ trợ một SKU / lô trong mỗi thùng, nhập toàn bộ số lượng đã khai báo. Chưa có thùng hỗn hợp, nhập một phần hoặc phân bổ cùng một lô ở nhiều vị trí.

Mã thùng không đồng nhất với mã SKU / mã lô: nhiều thùng có thể chứa cùng một SKU / lô nhưng phải có mã thùng riêng. `CTN` là định danh nội bộ demo, không phải SSCC được GS1 cấp. Tham khảo [GS1 logistics labels](https://support.gs1.org/support/solutions/articles/43000734484-what-is-the-only-compulsory-data-on-the-logistic-label-).

## Chung ô và xếp chồng hàng nhỏ

- Chung ô được phép nếu giữ vùng / khay riêng và nhãn từng lô; phải xác nhận phân tách trước khi nhập. Hàng gần hết hạn cần dễ lấy trước.
- Xếp chồng cần kích thước đã đo cho tất cả hàng trong ô, chọn 2–5 lớp và xác nhận bao bì cho phép chồng / giới hạn vật lý. Không tự cho phép chai / hũ thủy tinh chồng rời.
- Sức chứa ước tính bằng cách chia chiều ngang của ô thành vùng riêng bằng nhau cho các lô, xếp theo hướng bao bì hiện tại, kiểm tra khoảng hở tầng và số lượng từng lô. Đây là cách bảo thủ, có thể yêu cầu chọn ô khác dù cách xếp thực tế tối ưu hơn vẫn vừa.
- Khi thiếu số đo và không xếp chồng, cho phép gán vị trí sau khi người dùng xác nhận kiểm tra chỗ trống thực tế. Không được dùng xác nhận này để bỏ qua lỗi vượt kích thước / sức chứa đã biết.
- Không kiểm định tải trọng, độ bền bao bì, kết cấu kệ hay độ ổn định. Hình 3D minh họa tối đa ba lớp đại diện cho một lô, không vẽ toàn bộ số lượng tồn.

Dữ liệu, thùng chờ nhập và sơ đồ lưu riêng trên trình duyệt. Chưa đồng bộ giữa các máy, chưa tích hợp đơn mua hàng, máy quét / SSCC nhà cung cấp hoặc backend thực. Camera QR tùy khả năng trình duyệt; nhập mã / máy đọc mã dạng bàn phím luôn có thể dùng.

Kiểm tra nghiệp vụ: `npm test` (Node.js hỗ trợ chạy TypeScript trực tiếp, khuyên dùng bản 22 mới hoặc 24).
