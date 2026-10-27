import { Check, Clock3, Plus, ShieldCheck, UserRound } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import {
  branches,
  dateLabel,
  money,
  policy,
  roleNames,
  today,
  type Staff,
} from "../../app/model"
import {
  Badge,
  Button,
  Empty,
  Modal,
  PageTitle,
  Panel,
  SearchInput,
} from "../../app/ui"
export const permissions: Record<Staff["role"], string[]> = {
  manager: [
    "Xem và quản lý kho được phân công",
    "Chỉnh sửa sơ đồ kho",
    "Xử lý phiếu chuyển và đối soát",
    "Xem báo cáo vận hành",
  ],
  warehouse: [
    "Tra cứu hàng và vị trí",
    "Nhập, xuất và kiểm kê hàng",
    "Quét xác minh, gửi và nhận hàng",
  ],
  sales: [
    "Tra cứu sản phẩm và tồn kho",
    "Xem vị trí hàng",
    "Quét xác minh vị trí và lô",
  ],
}
export default function Accounts() {
  const { data, update, notify } = useApp()
  const [query, setQuery] = useState(""),
    [requesting, setRequesting] = useState(false),
    [detailId, setDetailId] = useState(""),
    [count, setCount] = useState(1),
    [role, setRole] = useState<Staff["role"]>("warehouse"),
    [error, setError] = useState("")
  const rows = data.staff.filter((s) =>
    `${s.name} ${s.email} ${roleNames[s.role]}`
      .toLocaleLowerCase("vi")
      .includes(query.toLocaleLowerCase("vi")),
  )
  const detail = data.staff.find((s) => s.id === detailId)
  const extra =
    Math.ceil(
      Math.max(0, data.staff.length + count - data.allowance) /
        policy.blockSize,
    ) * policy.accountBlock
  return (
    <>
      <PageTitle
        eyebrow="Đúng người, đúng công việc"
        title="Nhân viên & phân quyền"
        description="Theo dõi tài khoản của doanh nghiệp. Gửi yêu cầu để WareMap xét duyệt và cấp tài khoản mới."
        action={
          <Button
            onClick={() => {
              setRequesting(true)
              setError("")
            }}
          >
            <Plus size={16} />
            Yêu cầu cấp tài khoản
          </Button>
        }
      />
      <div className="grid-two" style={{ marginBottom: 24 }}>
        <Panel>
          <div className="panel-body row between">
            <div>
              <p className="tiny">Tài khoản nhân viên đã cấp</p>
              <div className="metric-value">
                <strong>{data.staff.length}</strong>
                <span className="muted">/ {data.allowance}</span>
              </div>
              <p className="tiny">Chủ doanh nghiệp được tính riêng.</p>
            </div>
            <UserRound size={34} color="#83a7b1" />
          </div>
        </Panel>
        <Panel>
          <div className="panel-body">
            <h3>Cấp thêm theo nhu cầu</h3>
            <p className="tiny" style={{ marginTop: 8 }}>
              5 tài khoản nhân viên ban đầu dùng chung cho doanh nghiệp. Mỗi
              block thêm 5 tài khoản:{" "}
              <strong>{money(policy.accountBlock)}/tháng</strong>.
            </p>
          </div>
        </Panel>
      </div>
      <div className="toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm nhân viên, email hoặc vai trò…"
        />
      </div>
      <Panel>
        {rows.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Vai trò</th>
                  <th>Cơ sở được truy cập</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="row">
                        <span className="avatar">
                          {s.name.split(" ").slice(-1)[0][0]}
                        </span>
                        <div>
                          <strong>{s.name}</strong>
                          <small>{s.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{roleNames[s.role]}</td>
                    <td>{s.branch}</td>
                    <td>
                      <Badge tone={s.active ? "success" : "neutral"}>
                        {s.active ? "Đang hoạt động" : "Đã khóa"}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="ghost" onClick={() => setDetailId(s.id)}>
                        Xem quyền
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="Không có nhân viên phù hợp">
            Thử tên hoặc vai trò khác.
          </Empty>
        )}
      </Panel>
      <Panel title="Yêu cầu của doanh nghiệp" className="request-history">
        {data.requests.filter(
          (r) => r.company === data.company && r.kind !== "Đăng ký sử dụng",
        ).length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Yêu cầu</th>
                  <th>Số tài khoản</th>
                  <th>Trạng thái</th>
                  <th>Phản hồi</th>
                </tr>
              </thead>
              <tbody>
                {data.requests
                  .filter(
                    (r) =>
                      r.company === data.company &&
                      r.kind !== "Đăng ký sử dụng",
                  )
                  .map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.id}</strong>
                        <small>
                          {r.kind} · {dateLabel(r.date)}
                        </small>
                      </td>
                      <td>{r.count}</td>
                      <td>
                        <Badge
                          tone={
                            r.status === "Đã cấp"
                              ? "success"
                              : r.status === "Từ chối"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td>{r.note || "Chưa có phản hồi"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="panel-body">
            <p className="tiny">
              Chưa có yêu cầu. Các yêu cầu mới và phản hồi của WareMap sẽ xuất
              hiện tại đây.
            </p>
          </div>
        )}
      </Panel>
      {detail && (
        <Modal title={detail.name} close={() => setDetailId("")}>
          <div className="stack">
            <Badge tone="info">{roleNames[detail.role]}</Badge>
            <p className="tiny muted">Phạm vi: {detail.branch}</p>
            <h3>Người này được làm gì?</h3>
            <div className="permission-list">
              {permissions[detail.role].map((p) => (
                <div key={p}>
                  <Check size={16} />
                  {p}
                </div>
              ))}
            </div>
            <div className="callout">
              Vai trò được WareMap cấp theo yêu cầu đã duyệt. Muốn thay đổi vai
              trò hoặc khóa tài khoản, gửi yêu cầu hỗ trợ trong Cài đặt.
            </div>
          </div>
        </Modal>
      )}
      {requesting && (
        <Modal title="Yêu cầu cấp tài khoản" close={() => setRequesting(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const email = String(f.get("email")).trim()
              if (
                data.staff.some(
                  (s) => s.email.toLowerCase() === email.toLowerCase(),
                )
              )
                return setError("Email này đã có tài khoản trong doanh nghiệp.")
              update((d) => ({
                ...d,
                requests: [
                  {
                    id: "YC-" + Date.now().toString().slice(-6),
                    kind: "Cấp tài khoản",
                    company: d.company,
                    name: String(f.get("name")).trim(),
                    email,
                    branches: d.locations,
                    count,
                    reason: String(f.get("reason")).trim(),
                    role,
                    branch: String(f.get("branch")),
                    status: "Chờ duyệt",
                    note: "",
                    date: today(),
                  },
                  ...d.requests,
                ],
              }))
              setRequesting(false)
              notify(
                "Đã lưu yêu cầu minh họa. Tài khoản chưa được cấp cho đến khi WareMap duyệt.",
              )
            }}
          >
            <div className="form-grid">
              <label className="field">
                Tên nhân viên / nhóm nhân viên
                <input name="name" required />
              </label>
              <label className="field">
                Email liên hệ
                <input type="email" name="email" required />
              </label>
            </div>
            <div className="form-grid">
              <label className="field">
                Số lượng cần cấp thêm
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
              </label>
              <label className="field">
                Vai trò đề xuất
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Staff["role"])}
                >
                  {Object.keys(permissions).map((r) => (
                    <option value={r} key={r}>
                      {roleNames[(r as Staff["role"])]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="field">
              Cơ sở làm việc
              <select name="branch">
                {branches.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Lý do cần số lượng tài khoản này
              <textarea
                required
                name="reason"
                placeholder="Số ca, phân công công việc và nhu cầu sử dụng…"
              />
            </label>
            <div className="callout">
              Còn {Math.max(0, data.allowance - data.staff.length)} tài khoản
              trong hạn mức hiện tại.
              {extra > 0 && (
                <>
                  <br />
                  <strong>Phí tăng thêm dự kiến: {money(extra)}/tháng</strong>{" "}
                  theo block 5 tài khoản.
                </>
              )}
            </div>
            {count > 1 && (
              <p className="tiny muted">
                Bản demo sẽ tạo nhóm tài khoản cùng vai trò. Email tài khoản
                tiếp theo được gắn hậu tố để phân biệt.
              </p>
            )}
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setRequesting(false)}>
                Hủy
              </Button>
              <Button type="submit">Gửi yêu cầu minh họa</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
