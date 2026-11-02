import {
  Check,
  CircleMinus,
  Clock3,
  CreditCard,
  Eye,
  History,
  LockKeyhole,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react"

import { useState } from "react"

import { useApp } from "../../app/store"

import {
  dateLabel,
  money,
  policy,
  roleNames,
  today,
  type Role,
  type Staff,
} from "../../app/model"

import { Badge, Button, Empty, Modal, Panel, SearchInput } from "../../app/ui"

import "./account-rbac.css"

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

const staffRoles: Staff["role"][] = ["manager", "warehouse", "sales"]

const roleTone: Record<Role, string> = {
  owner: "owner",

  manager: "manager",

  warehouse: "warehouse",

  sales: "sales",

  platform: "platform",
}

const permissionMatrix: {
  feature: string

  description: string

  owner: string

  manager: string

  warehouse: string

  sales: string
}[] = [
  {
    feature: "Quản lý tài khoản nhân viên",

    description: "Xem danh sách, đề xuất vai trò và gửi yêu cầu cấp tài khoản",

    owner: "Toàn quyền",

    manager: "Không có quyền",

    warehouse: "Không có quyền",

    sales: "Không có quyền",
  },

  {
    feature: "Báo cáo ROI & cài đặt",

    description: "Xem báo cáo và cấu hình doanh nghiệp",

    owner: "Toàn quyền",

    manager: "Được phép",

    warehouse: "Không có quyền",

    sales: "Không có quyền",
  },

  {
    feature: "Thiết kế sơ đồ kho 3D",

    description: "Tạo, chỉnh sửa kệ và bố trí kho",

    owner: "Thiết kế",

    manager: "Thiết kế",

    warehouse: "Chỉ xem",

    sales: "Chỉ xem",
  },

  {
    feature: "Chuyển kho & đối soát",

    description: "Tạo phiếu chuyển, xử lý giao nhận tại kho được phân công",

    owner: "Toàn quyền",

    manager: "Được phép",

    warehouse: "Xử lý tại kho",

    sales: "Không có quyền",
  },

  {
    feature: "Nhập hàng & kiểm kê",

    description: "Cập nhật hàng hóa, nhập thùng lên kệ và kiểm kê",

    owner: "Toàn quyền",

    manager: "Được phép",

    warehouse: "Được phép",

    sales: "Tra cứu",
  },

  {
    feature: "Quét QR & tra cứu FEFO",

    description: "Tra cứu vị trí và xác minh mã hàng, mã lô",

    owner: "Được phép",

    manager: "Được phép",

    warehouse: "Tác nghiệp kho",

    sales: "Chỉ tra cứu",
  },
]

export default function Accounts() {
  const { data, update, notify, accessibleBranches } = useApp()

  const [query, setQuery] = useState("")

  const [roleFilter, setRoleFilter] = useState("all")

  const [branchFilter, setBranchFilter] = useState("all")

  const [requesting, setRequesting] = useState(false)

  const [matrixOpen, setMatrixOpen] = useState(false)

  const [detailId, setDetailId] = useState("")

  const [count, setCount] = useState(1)

  const [role, setRole] = useState<Staff["role"]>("warehouse")

  const [error, setError] = useState("")

  const rows = data.staff.filter((staff) => {
    const matchesQuery = `${staff.name} ${staff.email} ${roleNames[staff.role]}`

      .toLocaleLowerCase("vi")

      .includes(query.toLocaleLowerCase("vi"))

    return (
      matchesQuery &&
      (roleFilter === "all" || staff.role === roleFilter) &&
      (branchFilter === "all" || staff.branch === branchFilter)
    )
  })

  const detail = data.staff.find((staff) => staff.id === detailId)

  const requests = data.requests.filter(
    (request) =>
      request.company === data.company && request.kind !== "Đăng ký sử dụng",
  )

  const activeCount = data.staff.filter((staff) => staff.active).length

  const availableCount = Math.max(0, data.allowance - data.staff.length)

  const quotaPercent =
    data.allowance > 0
      ? Math.min(100, (data.staff.length / data.allowance) * 100)
      : 0

  const includedAllowance = data.locations === 1 ? 4 : 18

  const purchasedBlocks = Math.ceil(
    Math.max(0, data.allowance - includedAllowance) / policy.blockSize,
  )

  const extra =
    Math.ceil(
      Math.max(0, data.staff.length + count - data.allowance) /
        policy.blockSize,
    ) * policy.accountBlock

  const toggleStaffStatus = (staff: Staff) => {
    update((current) => ({
      ...current,

      staff: current.staff.map((item) =>
        item.id === staff.id ? { ...item, active: !item.active } : item,
      ),
    }))

    notify(
      `Đã cập nhật trạng thái hồ sơ demo của ${staff.name}. Thao tác này không khóa thông tin đăng nhập mẫu.`,
    )
  }

  return (
    <div className="account-rbac">
      <header className="account-rbac__heading">
        <div>
          <span className="account-rbac__eyebrow">
            ĐÚNG NGƯỜI · ĐÚNG QUYỀN · ĐÚNG CƠ SỞ
          </span>
          <h1>Nhân viên &amp; phân quyền</h1>
          <p>
            Theo dõi hạn mức, vai trò RBAC và phạm vi làm việc của từng tài
            khoản.
          </p>
        </div>
        <div className="account-rbac__heading-actions">
          <Button
            variant="secondary"
            aria-expanded={matrixOpen}
            aria-controls="account-rbac-matrix"
            onClick={() => setMatrixOpen((open) => !open)}
          >
            <ShieldCheck size={15} />
            {matrixOpen ? "Ẩn ma trận quyền" : "Ma trận phân quyền"}
          </Button>
          <Button
            onClick={() => {
              setRequesting(true)

              setError("")
            }}
          >
            <Plus size={16} />
            Yêu cầu cấp tài khoản
          </Button>
        </div>
      </header>

      <aside className="callout" style={{ marginBottom: 20 }} aria-label="Cách thử phân quyền trong demo">
        <strong>Trang này mô phỏng việc cấp tài khoản và phân quyền.</strong>
        <p>Thay đổi vai trò hoặc trạng thái ở đây chỉ cập nhật hồ sơ mẫu, chưa đổi quyền đăng nhập. Để thử quyền của từng vai trò, đăng xuất rồi chọn tài khoản mẫu tương ứng ở trang Đăng nhập.</p>
        <p>Các tài khoản mẫu Quản lý kho, Nhân viên kho và Nhân viên bán hàng luôn dùng Kho trung tâm. Chọn cơ sở khác trong yêu cầu cấp tài khoản chỉ để minh họa, chưa thay đổi phạm vi của các tài khoản mẫu này.</p>
      </aside>

      <section
        className="account-rbac__overview"
        aria-label="Hạn mức tài khoản"
      >
        <Panel className="account-rbac__quota">
          <div className="account-rbac__quota-head">
            <div>
              <Badge tone="info">
                {data.locations === 1 ? "Gói đơn lẻ" : "Gói nhiều cơ sở"}
              </Badge>
              <h2>Hạn mức tài khoản nhân viên</h2>
              <p>
                Tài khoản Chủ doanh nghiệp được tính riêng; nhân viên thuộc hạn
                mức hiện tại.
              </p>
            </div>
            <div className="account-rbac__quota-value">
              <strong>{data.staff.length}</strong>
              <span>/ {data.allowance} tài khoản</span>
            </div>
          </div>
          <div className="account-rbac__progress">
            <div
              className="account-rbac__progress-track"
              role="progressbar"
              aria-label="Hạn mức tài khoản đã sử dụng"
              aria-valuenow={Math.min(data.staff.length, data.allowance)}
              aria-valuemin={0}
              aria-valuemax={data.allowance}
            >
              <span style={{ width: `${quotaPercent}%` }} />
            </div>
            <div className="account-rbac__progress-labels">
              <span>Đang hoạt động: {activeCount}</span>
              <span>Còn trống: {availableCount}</span>
            </div>
          </div>
          <div className="account-rbac__quota-foot">
            <span>
              Cần thêm tài khoản? Gửi yêu cầu để WareMap xét duyệt theo hạn mức.
            </span>
            <span className="account-rbac__block-price">
              <CreditCard size={14} />
              Block thêm: {money(policy.accountBlock)} / {policy.blockSize} tài
              khoản
            </span>
          </div>
        </Panel>

        <Panel className="account-rbac__package">
          <div className="account-rbac__package-title">
            <h2>Gói &amp; hạn mức</h2>
            <CreditCard size={17} />
          </div>
          <dl>
            <div>
              <dt>Cơ sở trong doanh nghiệp</dt>
              <dd>{data.locations}</dd>
            </div>
            <div>
              <dt>Hạn mức mặc định</dt>
              <dd>{includedAllowance} tài khoản</dd>
            </div>
            <div>
              <dt>Block bổ sung</dt>
              <dd>{purchasedBlocks} block</dd>
            </div>
            <div className="account-rbac__package-total">
              <dt>Còn có thể cấp</dt>
              <dd>{availableCount} tài khoản</dd>
            </div>
          </dl>
        </Panel>
      </section>

      {matrixOpen && (
        <section
          className="account-rbac__matrix"
          id="account-rbac-matrix"
          aria-labelledby="account-rbac-matrix-title"
        >
          <div className="account-rbac__section-heading">
            <div className="account-rbac__section-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 id="account-rbac-matrix-title">
                Ma trận phân quyền theo vai trò
              </h2>
              <p>
                Quyền của nhân viên luôn giới hạn trong cơ sở được phân công.
              </p>
            </div>
          </div>
          <div className="account-rbac__table-scroll">
            <table className="account-rbac__permission-table">
              <thead>
                <tr>
                  <th>Chức năng / quyền hạn</th>
                  <th>Chủ doanh nghiệp</th>
                  <th>Quản lý kho</th>
                  <th>Nhân viên kho</th>
                  <th>Nhân viên bán hàng</th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((item) => (
                  <tr key={item.feature}>
                    <td>
                      <strong>{item.feature}</strong>
                      <small>{item.description}</small>
                    </td>
                    {(["owner", "manager", "warehouse", "sales"] as const)

                      .map((permissionRole) => {
                        const value = item[permissionRole]

                        const denied = value === "Không có quyền"

                        const viewOnly =
                          value === "Chỉ xem" || value === "Chỉ tra cứu"

                        const Icon = denied
                          ? CircleMinus
                          : viewOnly
                            ? Eye
                            : Check

                        return (
                          <td
                            key={permissionRole}
                            className={
                              denied
                                ? "is-denied"
                                : viewOnly
                                  ? "is-readonly"
                                  : "is-allowed"
                            }
                          >
                            <span>
                              <Icon size={14} />
                              {value}
                            </span>
                          </td>
                        )
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Panel className="account-rbac__directory">
        <div className="account-rbac__directory-heading">
          <div>
            <h2>Danh sách nhân viên</h2>
            <p>
              {rows.length} / {data.staff.length} tài khoản · Lọc theo vai trò
              hoặc cơ sở
            </p>
          </div>
          <Badge tone={availableCount ? "success" : "warning"}>
            {availableCount
              ? `Còn ${availableCount} suất`
              : "Đã dùng hết hạn mức"}
          </Badge>
        </div>

        <div className="account-rbac__filters">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Tìm tên nhân viên, email hoặc vai trò…"
          />
          <label>
            <span className="account-rbac__filter-label">Vai trò</span>
            <select
              aria-label="Lọc theo vai trò"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              {staffRoles.map((staffRole) => (
                <option value={staffRole} key={staffRole}>
                  {roleNames[staffRole]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="account-rbac__filter-label">Cơ sở</span>
            <select
              aria-label="Lọc theo cơ sở"
              value={branchFilter}
              onChange={(event) => setBranchFilter(event.target.value)}
            >
              <option value="all">Tất cả cơ sở</option>
              {accessibleBranches.map((branch) => (
                <option value={branch} key={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>
        </div>

        {rows.length ? (
          <div className="account-rbac__table-scroll account-rbac__staff-scroll">
            <table className="account-rbac__staff-table">
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Vai trò (RBAC)</th>
                  <th>Cơ sở được truy cập</th>
                  <th>Trạng thái hồ sơ</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((staff) => {
                  const initials = staff.name

                    .split(/\s+/)

                    .slice(-2)

                    .map((part) => part[0])

                    .join("")

                    .toLocaleUpperCase("vi")

                  return (
                    <tr key={staff.id}>
                      <td>
                        <div className="account-rbac__staff-name">
                          <span
                            className={`account-rbac__avatar is-${roleTone[staff.role]}`}
                            aria-hidden="true"
                          >
                            {initials}
                          </span>
                          <span>
                            <strong>{staff.name}</strong>
                            <small>{staff.email}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`account-rbac__role is-${roleTone[staff.role]}`}
                        >
                          {roleNames[staff.role]}
                        </span>
                      </td>
                      <td>
                        <span className="account-rbac__branch">
                          <MapPin size={14} />
                          {staff.branch}
                        </span>
                      </td>
                      <td>
                        <Badge tone={staff.active ? "success" : "neutral"}>
                          {staff.active ? "Đang hoạt động" : "Đã khóa"}
                        </Badge>
                      </td>
                      <td>
                        <div className="account-rbac__row-actions">
                          <Button
                            variant="ghost"
                            onClick={() => setDetailId(staff.id)}
                          >
                            Xem quyền
                          </Button>
                          <Button
                            variant="ghost"
                            className={
                              staff.active
                                ? "account-rbac__lock-action"
                                : "account-rbac__unlock-action"
                            }
                            aria-label={
                              staff.active
                                ? `Khóa hồ sơ demo của ${staff.name}`
                                : `Mở khóa hồ sơ demo của ${staff.name}`
                            }
                            onClick={() => toggleStaffStatus(staff)}
                          >
                            <LockKeyhole size={13} />
                            {staff.active ? "Khóa" : "Mở khóa"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="Không có nhân viên phù hợp">
            Thử thay đổi từ khóa tìm kiếm, vai trò hoặc cơ sở.
          </Empty>
        )}
        <p className="account-rbac__demo-note">
          Trạng thái và vai trò trên trang này cập nhật hồ sơ minh họa; tài
          khoản đăng nhập demo có quyền cố định.
        </p>
      </Panel>

      <Panel className="account-rbac__requests">
        <div className="account-rbac__requests-heading">
          <div className="account-rbac__section-icon">
            <History size={17} />
          </div>
          <div>
            <h2>Yêu cầu cấp tài khoản</h2>
            <p>Theo dõi yêu cầu của doanh nghiệp và phản hồi từ WareMap.</p>
          </div>
          <span className="account-rbac__request-count">
            {requests.length} yêu cầu
          </span>
        </div>
        {requests.length ? (
          <div className="account-rbac__request-list">
            {requests.map((request) => (
              <article className="account-rbac__request-item" key={request.id}>
                <span
                  className={`account-rbac__request-icon is-${
                    request.status === "Đã cấp"
                      ? "success"
                      : request.status === "Từ chối"
                        ? "danger"
                        : "pending"
                  }`}
                >
                  {request.status === "Đã cấp" ? (
                    <Check size={15} />
                  ) : (
                    <Clock3 size={15} />
                  )}
                </span>
                <div className="account-rbac__request-copy">
                  <strong>
                    {request.kind}: {request.name}
                  </strong>
                  <span>
                    {roleNames[request.role]} · {request.branch} ·{" "}
                    {request.count} tài khoản
                  </span>
                  <small>
                    {request.id} · Gửi ngày {dateLabel(request.date)}
                    {request.note ? ` · ${request.note}` : ""}
                  </small>
                </div>
                <Badge
                  tone={
                    request.status === "Đã cấp"
                      ? "success"
                      : request.status === "Từ chối"
                        ? "danger"
                        : request.status === "Chờ duyệt" ||
                            request.status === "Cần bổ sung"
                          ? "warning"
                          : "neutral"
                  }
                >
                  {request.status}
                </Badge>
              </article>
            ))}
          </div>
        ) : (
          <div className="account-rbac__request-empty">
            <Empty title="Chưa có yêu cầu">
              Các yêu cầu cấp tài khoản và phản hồi sẽ hiển thị tại đây.
            </Empty>
          </div>
        )}
      </Panel>

      {detail && (
        <Modal title={detail.name} close={() => setDetailId("")}>
          <div className="stack">
            <Badge tone="info">{roleNames[detail.role]}</Badge>
            <p className="tiny muted">Phạm vi: {detail.branch}</p>
            <h3>Quyền theo vai trò</h3>
            <div className="permission-list">
              {permissions[detail.role].map((permission) => (
                <div key={permission}>
                  <Check size={16} />
                  {permission}
                </div>
              ))}
            </div>
            <label className="field">
              Phân quyền tài khoản
              <select
                value={detail.role}
                onChange={(event) => {
                  const next = event.target.value as Staff["role"]

                  update((current) => ({
                    ...current,

                    staff: current.staff.map((staff) =>
                      staff.id === detail.id ? { ...staff, role: next } : staff,
                    ),
                  }))

                  notify(
                    "Đã cập nhật vai trò trong hồ sơ demo. Tài khoản đăng nhập minh họa vẫn giữ quyền cố định.",
                  )
                }}
              >
                {staffRoles.map((staffRole) => (
                  <option value={staffRole} key={staffRole}>
                    {roleNames[staffRole]}
                  </option>
                ))}
              </select>
            </label>
            <div className="callout">
              Chủ doanh nghiệp đề xuất vai trò cho nhân viên. Việc cấp tài khoản
              thật cần WareMap xét duyệt; bản demo chỉ cập nhật hồ sơ minh họa.
            </div>
          </div>
        </Modal>
      )}

      {requesting && (
        <Modal title="Yêu cầu cấp tài khoản" close={() => setRequesting(false)}>
          <form
            onSubmit={(event) => {
              event.preventDefault()

              const form = new FormData(event.currentTarget)

              const email = String(form.get("email")).trim()

              if (
                data.staff.some(
                  (staff) => staff.email.toLowerCase() === email.toLowerCase(),
                )
              ) {
                setError("Email này đã có tài khoản trong doanh nghiệp.")

                return
              }

              update((current) => ({
                ...current,

                requests: [
                  {
                    id: "YC-" + Date.now().toString().slice(-6),

                    kind: "Cấp tài khoản",

                    company: current.company,

                    name: String(form.get("name")).trim(),

                    email,

                    branches: current.locations,

                    count,

                    reason: String(form.get("reason")).trim(),

                    role,

                    branch: String(form.get("branch")),

                    status: "Chờ duyệt",

                    note: "",

                    date: today(),
                  },

                  ...current.requests,
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
                  onChange={(event) => setCount(Number(event.target.value))}
                />
              </label>
              <label className="field">
                Vai trò đề xuất
                <select
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as Staff["role"])
                  }
                >
                  {staffRoles.map((staffRole) => (
                    <option value={staffRole} key={staffRole}>
                      {roleNames[staffRole]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="field">
              Cơ sở làm việc
              <select name="branch" required>
                {accessibleBranches.map((accessibleBranch) => (
                  <option value={accessibleBranch} key={accessibleBranch}>
                    {accessibleBranch}
                  </option>
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
              Còn {availableCount} tài khoản trong hạn mức hiện tại.
              {extra > 0 && (
                <>
                  <br />
                  <strong>Phí tăng thêm dự kiến: {money(extra)} một lần</strong>{" "}
                  theo block {policy.blockSize} tài khoản.
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
    </div>
  )
}
