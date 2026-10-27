# Link demo cho nhóm

Web đã được xuất bản tại:

https://waremap-team-oct27-2026.dapperflame64.chatgpt.site

## Cách truy cập

- Gửi link cho các thành viên và chọn **Khám phá kho mẫu** để bắt đầu.
- Ai có link đều có thể mở, không cần đăng nhập.
- Có thể dùng mạng khác nhau và thiết bị khác nhau.
- Máy phát triển không cần luôn bật; bản web chạy trên hosting Sites.

## Dữ liệu

Đây là bản frontend demo. Dữ liệu lưu riêng trên trình duyệt của từng người,
không đồng bộ giữa các thành viên. Các vai trò và thao tác quản trị đều là
trải nghiệm minh họa. Đăng nhập, POS, Zalo, thanh toán và cấp tài khoản thật
chưa được kết nối backend.

Muốn cả nhóm cùng thao tác trên một kho chung thì cần bổ sung backend,
cơ sở dữ liệu và xác thực người dùng.

## Cập nhật bản web

Thay đổi mã nguồn trong máy không tự cập nhật link Internet. Cần build và
xuất bản phiên bản mới của cùng Site.

- Cấu hình Site: `.openai/hosting.json`.
- Site ID: `appgprj_6ae042b680108191949ef064f1e9288e`.
- Phiên bản đầu: 1.
- Nguồn triển khai riêng: `.cache/sites/waremap-team-oct27-2026`.
- Bản triển khai chỉ chứa tài sản frontend đã build; không chứa dữ liệu
  localStorage của người sử dụng hay lịch sử Git của repository gốc.

Khi cập nhật, dùng lại Site ID hiện tại, không tạo Site mới.
