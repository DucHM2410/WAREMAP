# WareMap — hướng dẫn demo

Mở trang Đăng nhập và chọn thẻ vai trò để vào nhanh, hoặc dùng tài khoản bên dưới.
Mật khẩu chung: `WareMap@123`.

| Vai trò | Email | Phạm vi |
| --- | --- | --- |
| Chủ doanh nghiệp | owner@waremap.demo | Tất cả cơ sở |
| Quản lý kho | manager@waremap.demo | Kho trung tâm |
| Nhân viên kho | warehouse@waremap.demo | Kho trung tâm |
| Nhân viên bán hàng | sales@waremap.demo | Kho trung tâm |

Đây là danh tính demo cục bộ; dữ liệu lưu trong trình duyệt và dùng chung giữa các vai trò demo. Chưa có dịch vụ xác thực hoặc tài khoản production. Có thể đổi vai trò tại cuối sidebar.

## Thử kho 3D

1. Chọn **Kho 3D** trong sidebar.
2. Nhấn kiện hàng trên kệ để xem mã sản phẩm, lô, hạn dùng, số lượng và vị trí chính xác. Nếu nhiều lô cùng ô, chúng hiển thị thành các kiện nhỏ riêng biệt.
3. Chọn **Nhãn QR vị trí & lô** để xem/in nhãn; **Quét QR xác minh sản phẩm** mở màn hình quét với đúng sản phẩm/lô đã chọn.
4. Chọn lớp **Hạn dùng** để xem màu cảnh báo theo từng kiện.

## Thử thiết kế kho

Chỉ Chủ doanh nghiệp và Quản lý kho có quyền mở **Thiết kế kho 3D**.

1. Nhấn **Thêm Kệ**, rồi chọn kệ trên bản đồ.
2. Chọn **Di chuyển** và kéo mũi tên hoặc mặt phẳng tay nắm để bố trí kệ trực tiếp trong 3D. Tọa độ bám lưới 0.5 m.
3. Mở **Thêm công cụ → Xoay kệ trong 3D**, kéo vòng xoay theo bước 15°.
4. Đổi tên, kích thước, số tầng hoặc số ô trong bảng chi tiết; mô hình cập nhật ngay.
5. Nhấn **Lưu sơ đồ**. Có thể hoàn tác thao tác tại **Thêm công cụ** trước khi lưu.

Kệ chứa hàng được bảo vệ khỏi xóa; lưu sơ đồ cũng kiểm tra vị trí hàng còn hợp lệ. Di chuyển kệ thay đổi bố cục vật lý, giữ nguyên mã Kệ–Tầng–Ô của hàng. Việc chuyển hàng giữa các vị trí vẫn đi qua nghiệp vụ gán vị trí/quét QR; kéo kiện hàng để tự điều chỉnh tồn kho chưa được hỗ trợ.

## Phân quyền demo

- **Chủ doanh nghiệp:** toàn bộ vận hành, thiết kế, báo cáo và yêu cầu tài khoản nhân viên.
- **Quản lý kho:** vận hành kho, thiết kế, cảnh báo và báo cáo; không quản lý tài khoản.
- **Nhân viên kho:** tra cứu, nhập xuất, kiểm kê, chuyển kho và QR; không thiết kế hoặc xem báo cáo quản trị.
- **Bán hàng:** tra cứu sản phẩm, tồn, vị trí và QR; không sửa tồn, thiết kế hoặc chuyển kho.

Phân quyền hiện áp dụng trong bản frontend demo. Khi triển khai thực tế cần backend xác thực và kiểm tra quyền cho từng nghiệp vụ.
