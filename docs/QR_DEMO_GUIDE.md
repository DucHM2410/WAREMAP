# Hướng dẫn demo QR WareMap (3–5 phút)

## Chuẩn bị

- Chạy bản web hiện tại, đăng nhập **Chủ doanh**, **Quản lý kho** hoặc **Nhân viên kho** bằng tài khoản demo ở trang Đăng nhập. Mật khẩu mẫu: `WareMap@123`.
- Chủ doanh chọn Mẹ & Bé hoặc Mỹ phẩm khi vào phiên demo mới. Nhân viên dùng phân hệ đã xác nhận của doanh nghiệp.
- Mở **Kho 3D → Quét & nhập hàng lên kệ**. Có thể vào từ **Sản phẩm & tồn kho → Quét nhập lên kệ**.
- Dùng cùng một trình duyệt cho toàn bộ buổi demo. Không cần camera: tải hai ảnh QR rồi đọc lại từ ảnh là cách ổn định nhất.

## Kịch bản trình bày

| Bước | Thao tác | Điều cần chỉ cho người xem |
| --- | --- | --- |
| 1. Tạo hàng chờ nhập | Bấm **Chuẩn bị bộ QR demo** trong khung bên phải. | Có 20 sản phẩm đúng phân hệ, lô mới và hạn dùng sau 180 ngày. Hệ thống chọn ô trống đủ chỗ theo kích thước mẫu. **Tồn chưa tăng**. |
| 2. Xuất nhãn | Bấm **Tải nhãn QR** dưới từng nhãn. Nhãn thứ nhất là vị trí `LOC:...`; nhãn thứ hai là thùng `CTN:...`. | QR vị trí gắn ở ô kệ; QR thùng gắn lên thùng hàng. **In bộ nhãn / Lưu PDF** mở bản hai nhãn để in. |
| 3. Xác định chỗ đặt | Ở bước 1, bấm **Đọc QR từ ảnh**, chọn ảnh vị trí PNG/JPG vừa tải, rồi **Kiểm tra mã**. | Web đọc nội dung QR thật từ ảnh và kiểm tra cơ sở, kệ, tầng, ô. Việc đọc mã chưa ghi tồn. |
| 4. Nhận diện thùng | Ở bước 2, bấm **Đọc QR từ ảnh**, chọn ảnh thùng rồi **Kiểm tra mã**. | Web lấy đúng tên hàng, SKU, lô, hạn dùng, số lượng từ thùng đã khai báo; kiểm tra cơ sở nhận. |
| 5. Nhập lên kệ | Đối chiếu thông tin ở bước 3, tích **Tôi đã đếm đủ hàng…**, bấm **Xác nhận nhập 20 đơn vị lên kệ**. | Chỉ thao tác này cộng tồn. Bộ mẫu dùng ô trống, không xếp chồng nên không cần tích các xác nhận nâng cao khác. |
| 6. Xem kết quả | Chỉ phần **Tồn lô trước nhập 0 → Tồn lô sau nhập 20**, rồi bấm **Xem vị trí trên Kho 3D**. | Thùng chuyển sang đã nhập; hàng nằm đúng cơ sở/kệ/tầng/ô vừa quét. Đây là tồn của **lô demo mới**, không phải tổng tồn mọi lô của SKU. |

Lời dẫn gợi ý: “Nhân viên tạo nhãn cho thùng hàng trước. Khi cất hàng, quét vị trí rồi quét thùng để đối chiếu đúng hàng, đúng lô và đúng nơi. Sau khi kiểm đếm và đặt hàng, xác nhận một lần để cập nhật tồn và bản đồ 3D.”

## Chạy lại và thử lỗi

- **Tạo lượt demo mới:** sau khi nhập xong, bấm nút này trong khung bộ QR. Mỗi lượt có mã thùng và mã lô mới. Dữ liệu cũ được giữ nguyên; hệ thống chọn ô trống khác. Nếu chưa có đủ chỗ, web báo lỗi và không thêm hàng.
- **Tải lại trang khi chưa nhập:** bộ QR chờ nhập được dùng lại, không tạo thêm thùng. Tải lại ảnh từ bộ QR đó nếu cần.
- **Chống cộng hai lần:** sau khi nhập xong, bấm **Nhập thùng tiếp theo**, quét lại ảnh vị trí và ảnh thùng cũ; bước kiểm tra thùng báo đã nhập. Tồn vẫn 20.
- **Sai loại nhãn:** đưa ảnh thùng vào bước vị trí hoặc nhập `LOT:...` vào bước thùng. Web từ chối; QR lô không thay thế mã thùng.
- **Ảnh không chứa QR:** chọn một ảnh PNG/JPG khác. Web báo không tìm thấy QR, không tăng tồn. Ảnh phải rõ nhãn, đủ bốn góc; dưới 15 MB.
- **Sai cơ sở:** khai báo thùng cho cơ sở khác trong **Tạo thùng chờ nhập**, rồi thử ở vị trí hiện tại. Web yêu cầu kiểm tra cơ sở nhận.
- **Hết hạn:** form chặn tạo thùng hết hạn; lớp xử lý cũng chặn nhập thùng đã hết hạn (có kiểm thử tự động).
- **Quyền:** đổi sang Nhân viên bán hàng: chỉ tra cứu kho, không có quyền nhập lên kệ. Chủ doanh/Quản lý kho/Nhân viên kho được nhập trong phạm vi được cấp.

## Camera và cách dự phòng

Có thể in nhãn hoặc mở ảnh nhãn trên điện thoại, rồi dùng camera máy tính đọc QR. Camera phụ thuộc hỗ trợ `BarcodeDetector`, quyền camera và môi trường trình duyệt. Nếu không hỗ trợ, dùng **Đọc QR từ ảnh**.

Nếu không tiện tải ảnh, mở **Không có ảnh? Dùng mã mẫu để mô phỏng**, lần lượt **Điền mã vị trí demo**, **Kiểm tra mã**, **Điền mã thùng demo**, **Kiểm tra mã**. Đây là điền mã mẫu, không phải quét camera; vẫn qua cùng kiểm tra nghiệp vụ.

## Tự khai báo thùng ngoài bộ mẫu

Bấm **Tạo thùng chờ nhập**, chọn SKU có sẵn hoặc khai báo hàng mới, cơ sở nhận, lô, hạn dùng và số lượng. Chọn mở thùng/xếp từng sản phẩm hoặc giữ nguyên thùng; có thể khai báo kích thước. Tạo nhãn chưa tăng tồn. Lấy QR vị trí trong **Lấy nhãn QR vị trí / thử bằng mã mẫu**, rồi làm tiếp ba bước như trên.

Một thùng chỉ chứa một SKU và một lô, nhập toàn bộ số lượng. Ô có lô khác cần xác nhận tách vùng/khay. Thiếu số đo cần kiểm tra chỗ thực tế; xác nhận này không bỏ qua lỗi sức chứa đã biết.

## Phạm vi demo

- QR vị trí `LOC` định vị cơ sở/kệ/tầng/ô. QR thùng `CTN` liên kết SKU/lô/hạn dùng/số lượng. QR lô `LOT` phục vụ tra cứu lô, không tự cộng tồn.
- Luồng này là **nhập thùng lên kệ**, không phải xuất hàng bán. Không dùng thêm thao tác “Nhập hàng” khác cho cùng thùng vì sẽ ghi nhận cùng hàng hai lần.
- Dữ liệu lưu tại trình duyệt, chưa đồng bộ máy tính/điện thoại hay các thành viên. QR là mã nội bộ, không phải URL và chưa tích hợp mã nhà cung cấp.
- Kích thước bộ mẫu chỉ để minh họa kiểm tra chỗ; cần đo bao bì và kiểm tra kệ thực tế khi vận hành.
- Không có backend, nhập từng phần, thùng hỗn hợp hoặc serial QR cho từng sản phẩm trong phạm vi này.


## Hiểu các lựa chọn về cách đặt hàng

- **Tôi đã để hàng mới riêng với lô hàng đang có trong ô:** chỉ chọn khi ô đã có lô khác. Ví dụ để lô cũ bên trái, lô mới bên phải và giữ nhãn riêng, tránh trộn lẫn.
- **Đặt hàng thành nhiều lớp (hộp trên hộp):** 10 hộp ở dưới và 10 hộp đặt lên trên là 2 lớp. Nếu chỉ đặt cạnh nhau trên mặt kệ thì bỏ qua. Cần kiểm tra bao bì và kệ chịu được số lớp đã chọn.
- **Tôi đã kiểm tra thực tế: ô kệ còn đủ chỗ cho số hàng này:** chỉ cần khi web báo thiếu kích thước. Kiểm tra chỗ thực tế, để riêng từng lô rồi xác nhận. Không dùng lựa chọn này để bỏ qua thông báo không đủ chỗ.
- **Tôi đã đếm đủ hàng, kiểm tra đúng lô và hạn dùng, rồi đặt hàng vào ô kệ đã chọn:** xác nhận cuối cùng bắt buộc để nhập hàng.

Bộ mẫu đã chọn ô trống, có kích thước và không đặt nhiều lớp: chỉ cần tích xác nhận cuối cùng. “Lô hàng” là nhóm sản phẩm có chung mã lô ghi trên bao bì; cần giữ riêng để theo dõi hạn dùng.
