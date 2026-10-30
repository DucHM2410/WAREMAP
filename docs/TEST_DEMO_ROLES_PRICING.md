# Kiểm tra demo: vai trò, gói và block

Mở http://localhost:8443, tải lại trang. Các yêu cầu và hồ sơ lưu trên cùng trình duyệt; đổi tài khoản bằng nút Đăng xuất / Đổi tài khoản. Bấm thẻ tài khoản chỉ điền form, sau đó bấm Đăng nhập. Mật khẩu chung: WareMap@123.

## 1. Bảng giá
Trang chủ > Bảng giá: Free Trial 0đ/7 ngày, Đơn lẻ 149.000đ/tháng (1 Chủ doanh + 1 Quản lý kho + 3 Nhân viên), Chuỗi 399.000đ/tháng (1 Chủ doanh + 3 Quản lý kho + 15 Nhân viên). Block: 199.000đ/tháng thêm 2 cơ sở, chỉ Chuỗi; 99.000đ một lần thêm 2 tài khoản phân quyền linh hoạt.

## 2. Free Trial
Trang chủ > Dùng thử miễn phí > Xem demo với vai trò Chủ doanh. Đây là mô phỏng, mở vai trò Chủ doanh, hạn mức 1 cơ sở và 4 tài khoản ngoài Chủ doanh. Mỗi lần mở demo hoặc đăng nhập Chủ doanh đều chọn và xác nhận phân hệ cho phiên đó. Có thể vào thiết kế kho, nhập xuất, QR và báo cáo. Đăng xuất rồi chọn manager/warehouse/sales để thử quyền từng vai trò. Không tạo thêm 5 danh tính thật hoặc đếm hết hạn sau 7 ngày.
Khám phá kho 3D vẫn là chế độ khách chỉ xem, tách khỏi Free Trial demo.

## 3. Bán hàng
Đăng nhập sales@waremap.demo. Tổng quan không có thẻ Phiếu chuyển, nút Kiểm tra phiếu hoặc cột công việc Phiếu chuyển. Xem thêm không có Chuyển kho, Báo cáo, Cài đặt, Nhân viên. Sản phẩm & tồn kho chỉ tra cứu; không có nút nhập xuất, kiểm kê. Quét QR không có Quét nhập lên kệ.

## 4. Quản lý kho và Chủ doanh
Đăng nhập manager@waremap.demo > Xem thêm > Cài đặt > Dữ liệu & hỗ trợ: không có Tải bản sao dữ liệu. Vẫn có Chuyển kho, Thiết kế kho, Báo cáo. Không có Nhân viên & RBAC hoặc Chỉnh sửa trang chủ.
Đăng nhập owner@waremap.demo > cùng đường dẫn: có Tải bản sao dữ liệu. Chủ doanh có Nhân viên & RBAC và Chỉnh sửa trang chủ.

## 5. Giá tháng và tài khoản một lần
Chủ doanh > Cài đặt > Gói & hạn mức > Yêu cầu thay đổi hạn mức. Nhập 7 cơ sở và 22 tài khoản (không tính Chủ doanh): 598.000đ/tháng và 198.000đ mua thêm 4 tài khoản một lần. Phí tháng không bao gồm tiền tài khoản. 8 cơ sở và 22 tài khoản: 797.000đ/tháng, tài khoản vẫn 198.000đ một lần.
Gửi yêu cầu với email demo và lý do. Đây là yêu cầu thay đổi gói/hạn mức, không thanh toán thật.

## 6. Admin WareMap xét duyệt
Đăng xuất > admin@waremap.demo > Đăng nhập. Menu chỉ có quản trị khách hàng và chỉnh sửa trang chủ, không có vận hành kho khách hàng. Trong Yêu cầu, mở yêu cầu vừa tạo, xét duyệt/cấp. Trở lại owner bằng Đăng xuất / Đổi tài khoản: hạn mức mới xuất hiện trong Cài đặt. Sau khi duyệt thay đổi hạn mức, trạng thái Free Trial demo kết thúc để minh họa nâng cấp trả phí.
Chủ doanh > Nhân viên & RBAC > Yêu cầu cấp tài khoản: gửi yêu cầu với số lượng và vai trò. Admin duyệt trong cùng trình duyệt, hồ sơ được thêm vào danh sách khách hàng. Tài khoản mới là hồ sơ minh họa, không phải danh tính đăng nhập thật.

## 7. Chủ doanh phân quyền
Chủ doanh > Nhân viên & RBAC > mở một nhân sự > Phân quyền tài khoản. Đổi giữa Quản lý kho, Nhân viên kho và Nhân viên bán hàng. Danh sách và mô tả quyền cập nhật, tải lại vẫn giữ. Các tài khoản đăng nhập demo cố định không thay quyền theo hồ sơ vừa sửa; dùng thẻ tài khoản tương ứng ở trang đăng nhập để trình diễn quyền.

## Giới hạn chủ động của demo
Không triển khai backend, thu phí, tự hết hạn hoặc đăng nhập bằng hồ sơ mới cấp. Danh sách địa điểm mẫu vẫn cố định; không tạo mới kho thật khi tăng hạn mức. Hạn mức Quản lý kho/Nhân viên được mô tả theo gói; bản demo giữ tổng hạn mức ngoài Chủ doanh, chưa cưỡng chế riêng hai nhóm. Khoản tài khoản hiển thị trong báo giá là tổng chi phí mở rộng theo nhu cầu, chưa phải hóa đơn trừ các block đã thanh toán.
