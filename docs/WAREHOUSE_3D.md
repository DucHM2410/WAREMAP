# Thiết kế kho 3D và nhiều cơ sở

## Thao tác

1. Đăng nhập demo bằng `owner@waremap.demo` / `WareMap@123`.
2. Mở **Kho 3D**. Chế độ **Tất cả cơ sở** hiển thị các kho trong phạm vi tài khoản, kèm số kệ và số dòng hàng. Chọn một cơ sở để mở sơ đồ.
3. Chọn **Chỉnh sửa sơ đồ**. Kéo mẫu từ thư viện vào sàn 3D hoặc mặt bằng. Có thể bấm mẫu để thêm, phù hợp khi dùng điện thoại.
4. Chọn **Di chuyển** rồi kéo trực tiếp kệ. Kệ di chuyển theo lưới 0,5 m trong phạm vi sàn. Kéo nền trống để xoay góc nhìn.
5. Chọn kệ, chỉnh dài / rộng / cao, số tầng và số ô mỗi tầng ở bảng chi tiết. Công cụ xoay và hoàn tác nằm trong **Thêm công cụ**.
6. Bấm **Lưu sơ đồ** trước khi đổi cơ sở. Mỗi cơ sở lưu trong một mục riêng. Sơ đồ giữ nguyên khi quay lại; xóa hoặc thu nhỏ kệ đang có hàng vẫn bị chặn như trước.

## Thư viện

Sáu mẫu có kích thước và hình dạng riêng: kệ tiêu chuẩn, kệ pallet, kệ chia ô, tủ bảo quản, ô xếp hàng và bàn kiểm đếm. Kệ chia ô và tủ hiển thị vách chia theo số ô. Chỉnh tầng / ô cập nhật ngay trên 3D.

## Phạm vi hiện tại

- Chủ doanh nghiệp có thể xem nhiều cơ sở, tối đa số cơ sở trong gói demo (`data.locations`), trong danh sách cơ sở hiện có.
- Các tài khoản demo quản lý / nhân viên hiện được gán Kho trung tâm; không mở được các cơ sở còn lại.
- Khách khám phá và dùng thử vẫn chỉ xem một kho mẫu, không có thư viện chỉnh sửa hay quyền đổi cơ sở.
- Dữ liệu và sơ đồ lưu trên trình duyệt; chưa đồng bộ giữa máy tính của các thành viên. Chưa có chức năng tự tạo thêm cơ sở ngoài danh sách hiện có.
