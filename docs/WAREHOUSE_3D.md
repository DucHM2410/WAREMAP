# Thiết kế kho 3D và nhiều cơ sở

## Thao tác

1. Đăng nhập demo bằng `owner@waremap.demo` / `WareMap@123`.
2. Mở **Kho 3D**. Chế độ **Tất cả cơ sở** hiển thị các kho trong phạm vi tài khoản, kèm số kệ và số dòng hàng. Chọn một cơ sở để mở sơ đồ.
3. Chọn **Chỉnh sửa sơ đồ**. Kéo mẫu từ thư viện vào sàn 3D hoặc mặt bằng. Có thể bấm mẫu để thêm, phù hợp khi dùng điện thoại.
4. Chọn **Di chuyển** rồi kéo trực tiếp kệ. Kệ di chuyển theo lưới 0,5 m trong phạm vi sàn. Kéo nền trống để xoay góc nhìn.
5. Chọn kệ, chỉnh dài / rộng / cao, số tầng và số ô mỗi tầng ở bảng chi tiết. Công cụ xoay và hoàn tác nằm trong **Thêm công cụ**.
6. Bấm **Lưu sơ đồ** trước khi đổi cơ sở. Mỗi cơ sở lưu trong một mục riêng. Sơ đồ giữ nguyên khi quay lại; xóa hoặc thu nhỏ kệ đang có hàng vẫn bị chặn như trước.

## Thư viện

Mười mẫu có kích thước và hình dạng riêng. Ngoài sáu mẫu ban đầu còn có kệ ngăn mỹ phẩm, khay chia ngăn, tủ nhiều ngăn nhỏ và kệ hàng mẹ & bé. Kệ chia ô, khay và tủ hiển thị vách chia theo số ô. Chỉnh tầng / ô cập nhật ngay trên 3D. Khay có chiều dài và chiều rộng không quá 1 m dùng lưới di chuyển 10 cm; các kệ khác dùng lưới 50 cm.

## Sản phẩm cỡ vừa và rất nhỏ

- Chọn hàng trên bản đồ để xem kích thước một đơn vị bao bì bằng cm. Nếu chưa nhập số đo, hệ thống dùng kích thước tham khảo theo nhóm hàng và ghi rõ chưa xác nhận.
- Chủ doanh nghiệp, quản lý và nhân viên kho có thể nhập số đo thực tế và chọn dạng hộp / túi, chai / lọ, hũ / lon hoặc tuýp / thỏi. Số đo lưu cho mã hàng và lô tại cơ sở đang chọn; không thay đổi số lượng tồn.
- **Bao bì dễ chọn (phóng đại)** điều chỉnh kích thước hiển thị theo ô. **Kích thước bao bì thực** đổi cm sang mét và dùng tỷ lệ thật trong không gian 3D; các sản phẩm chưa đo vẫn dùng số tham khảo có nhãn.
- **Xem gần kệ** ẩn các kệ khác để tránh che khuất, đưa camera đến kệ đang chọn và cho phép phóng gần hơn. **Xem toàn kho** trả lại không gian đầy đủ.
- Một vật thể đại diện cho một lô tại ô, không vẽ từng đơn vị hàng tồn. Vùng bấm rộng bằng ô giúp chọn được cả bao bì rất nhỏ.
- Cảnh báo khi một đơn vị bao bì vượt chiều ngang, chiều sâu hoặc khoảng hở tầng theo hướng hiện tại. Đây chưa phải tính toán sức chứa hay thuật toán xếp toàn bộ số lượng hàng vào ô.

## Phạm vi hiện tại

- Chủ doanh nghiệp có thể xem nhiều cơ sở, tối đa số cơ sở trong gói demo (`data.locations`), trong danh sách cơ sở hiện có.
- Các tài khoản demo quản lý / nhân viên hiện được gán Kho trung tâm; không mở được các cơ sở còn lại.
- Khách khám phá và dùng thử vẫn chỉ xem một kho mẫu, không có thư viện chỉnh sửa hay quyền đổi cơ sở.
- Dữ liệu và sơ đồ lưu trên trình duyệt; chưa đồng bộ giữa máy tính của các thành viên. Chưa có chức năng tự tạo thêm cơ sở ngoài danh sách hiện có.
