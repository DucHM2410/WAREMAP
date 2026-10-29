# Trải nghiệm chưa đăng nhập

- **Khám phá kho 3D:** chỉ xem một kho mẫu, xoay / phóng to và chọn kệ hoặc sản phẩm để xem thông tin. Không dùng giao diện quản trị.
- **Dùng thử miễn phí:** xem bảng giới hạn trước khi bắt đầu; bao gồm kho 3D và danh sách tối đa ba mã hàng mẫu để tìm kiếm / lọc. Không lưu chỉnh sửa hay nhập dữ liệu riêng.
- **Đăng nhập demo:** dùng tài khoản trong trang đăng nhập. Bấm thẻ tài khoản chỉ điền form; phải bấm Đăng nhập. Quyền theo vai trò; đổi tài khoản cần đăng xuất.

Khách không thể mở Builder, nhập / xuất tồn kho, quét / xuất QR, chuyển kho, báo cáo, tài khoản hoặc trình chỉnh sửa website. Cả điều hướng và thao tác cập nhật dữ liệu đều được chặn. Kho mẫu được tạo từ dữ liệu mẫu, không từ dữ liệu đã lưu của người đăng nhập. Đăng xuất trả về chế độ khách; tải lại trang yêu cầu đăng nhập lại.

Yêu cầu cấp tài khoản chỉ tạo yêu cầu chờ duyệt, không tạo phiên đăng nhập. Đây vẫn là demo phía trình duyệt: thông tin tài khoản demo có sẵn công khai, dữ liệu lưu cục bộ và không đồng bộ giữa thành viên. Khi triển khai dịch vụ thật cần xác thực, kiểm tra quyền và hạn mức tại máy chủ.

Kiểm tra quyền và giới hạn dữ liệu mẫu: `node --test tests/guest-access.test.mjs`.
