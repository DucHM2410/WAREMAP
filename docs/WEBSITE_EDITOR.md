# Thiết kế website và chỉnh sửa nội dung

Nhánh làm việc: `DucHM`.

## Nhận diện

- Logo: `src/assets/brand/waremap-logo.jpg`, từ file logo người dùng cung cấp; không vẽ lại logo.
- Font: Be Vietnam Pro. Trang giới thiệu dùng H1 48–56px, H2 32–36px, H3 18–20px trên màn hình lớn; giảm cỡ trên điện thoại.
- Màu: navy `#192C45`, nút chính `#0B57C7`, điểm nhấn `#1685F9`, nền `#FFFFFF` / `#F5F9FF` / `#EAF3FF`.
- Trang chủ, giới thiệu, Mẹ & Bé, Mỹ phẩm & Chăm sóc cá nhân bám theo cấu trúc whiteboard. Không đưa các tỷ lệ hiệu quả chưa được đo lường thành lời cam kết.

## Chỉnh sửa trong giao diện

1. Đăng nhập demo bằng Chủ doanh nghiệp hoặc Admin hệ thống. Tài khoản Admin: `admin@waremap.demo`, mật khẩu `WareMap@123`.
2. Mở **Chỉnh sửa trang chủ** trên sidebar, hoặc từ trang quản trị khách hàng / nhân viên và phân quyền.
3. Chọn trang, chọn khối nội dung, cập nhật chữ và ảnh. Có thể ẩn/hiện, sắp xếp khối, thêm/xóa thẻ và FAQ.
4. Ảnh dùng URL HTTPS hoặc tải JPG/PNG/WebP tối đa 400 KB. Mô tả ảnh giúp người sử dụng trình đọc màn hình.
5. Chọn **Xem trước**, **Lưu nháp**, hoặc **Áp dụng trên trình duyệt**. Lưu nháp không thay trang chủ đang hiển thị.
6. Dùng **Xuất JSON** để sao lưu/bàn giao. **Nhập JSON** kiểm tra cấu trúc và chỉ nạp vào bản chỉnh sửa; không tự áp dụng.

Thay đổi chỉ lưu trên trình duyệt hiện tại. Frontend demo chưa có backend CMS, phân quyền máy chủ hoặc đồng bộ nội dung giữa người dùng. Các mức giá vẫn lấy từ cấu hình gói dịch vụ để không lệch trang đăng ký.

## Đưa nội dung đã duyệt lên website chung

1. Xuất JSON từ trình chỉnh sửa.
2. Thay nội dung `src/features/site-content/publishedContent.json` bằng JSON đó. File `{}` ban đầu dùng bộ nội dung mặc định.
3. Chạy `npx tsc --noEmit` và `npm run build -- --base=/WAREMAP/`.
4. Commit nội dung đã duyệt và triển khai qua quy trình `main` / GitHub Pages. Không cần sửa JSX cho mỗi lần thay nội dung.

Nếu người xem có nội dung cục bộ cũ, bản đó được ưu tiên. Có thể khôi phục mặc định hoặc nhập nội dung mới qua trình chỉnh sửa.
