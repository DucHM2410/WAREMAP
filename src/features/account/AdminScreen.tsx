import { Check, Users } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import {
  dateLabel,
  money,
  quote,
  roleNames,
  type AccessRequest,
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
export default function Admin() {
  const { data, update, notify, log, go } = useApp()
  const [tab, setTab] = useState("Yêu cầu"),
    [filter, setFilter] = useState("Chờ duyệt"),
    [query, setQuery] = useState(""),
    [chosen, setChosen] = useState(""),
    [note, setNote] = useState(""),
    [error, setError] = useState(""),
    [release, setRelease] = useState(data.release),
    [releaseNote, setReleaseNote] = useState(data.releaseNote)
  const requests = data.requests.filter(
    (r) =>
      (filter === "Tất cả" || r.status === filter) &&
      `${r.company} ${r.email} ${r.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  const request = data.requests.find((r) => r.id === chosen)
  const decide = (status: AccessRequest["status"]) => {
    if (!request || !["Chờ duyệt", "Cần bổ sung"].includes(request.status))
      return
    if ((status === "Từ chối" || status === "Cần bổ sung") && !note.trim())
      return setError(
        "Nhập lý do hoặc nội dung cần bổ sung để khách hàng biết bước tiếp theo.",
      )
    if (
      status === "Đã cấp" &&
      request.kind === "Cấp tài khoản" &&
      data.staff.some(
        (s) => s.email.toLowerCase() === request.email.toLowerCase(),
      )
    )
      return setError(
        "Email đã được cấp tài khoản. Hãy yêu cầu khách hàng bổ sung thông tin.",
      )
    update((d) => {
      const newStaff: Staff[] =
        status === "Đã cấp" &&
        request.kind === "Cấp tài khoản" &&
        request.company === d.company
          ? Array.from({ length: request.count }, (_, i) => {
              const [local, domain] = request.email.split("@")
              return {
                id: `${request.id}-${i + 1}`,
                name: request.name + (request.count > 1 ? ` ${i + 1}` : ""),
                email: i === 0 ? request.email : `${local}+${i + 1}@${domain}`,
                role: request.role,
                branch: request.branch,
                active: true,
              }
            })
          : []
      const desired =
        request.kind === "Tăng hạn mức"
          ? request.count
          : d.staff.length + newStaff.length
      return {
        ...d,
        staff: [...d.staff, ...newStaff],
        trialDemo: status === "Đã cấp" && request.kind === "Tăng hạn mức" && request.company === d.company ? false : d.trialDemo,
        allowance:
          status === "Đã cấp" &&
          request.company === d.company &&
          ["Cấp tài khoản", "Tăng hạn mức"].includes(request.kind)
            ? Math.max(d.allowance, (Math.max(d.locations, request.branches) === 1 ? 4 : 18) + Math.ceil(Math.max(0, desired - (Math.max(d.locations, request.branches) === 1 ? 4 : 18)) / 2) * 2)
            : d.allowance,
        locations:
          status === "Đã cấp" &&
          request.kind === "Tăng hạn mức" &&
          request.company === d.company
            ? Math.max(d.locations, request.branches)
            : d.locations,
        requests: d.requests.map((r) =>
          r.id === request.id
            ? {
                ...r,
                status,
                note:
                  note.trim() ||
                  (request.kind === "Hỗ trợ tài khoản"
                    ? "Đã tiếp nhận và phản hồi trong bản demo."
                    : "Đã duyệt trong bản demo, chưa cấp đăng nhập thật."),
              }
            : r,
        ),
      }
    })
    log("WareMap xử lý yêu cầu", `${request.id} · ${status}`)
    notify("Đã cập nhật trạng thái yêu cầu trong bản demo.")
    setChosen("")
    setNote("")
    setError("")
  }
  return (
    <>
      <PageTitle
        eyebrow="Không gian nội bộ WareMap"
        title="Quản trị khách hàng"
          action={<Button variant="secondary" onClick={() => go("website-editor")}>Chỉnh sửa trang chủ</Button>}
        description="Tiếp nhận yêu cầu và quản lý hạn mức. Không gian này tách biệt với các chức năng của khách hàng."
      />
      <div className="callout" style={{ marginBottom: 24 }}>
        Môi trường quản trị minh họa. Việc duyệt chỉ cập nhật dữ liệu trên trình
        duyệt, không tạo thông tin đăng nhập thật.
      </div>
      <div className="setting-tabs">
        {["Yêu cầu", "Doanh nghiệp", "Tài khoản", "Cập nhật sản phẩm"].map(
          (t) => (
            <Button
              key={t}
              variant={tab === t ? "primary" : "secondary"}
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ),
        )}
      </div>
      {tab === "Yêu cầu" && (
        <>
          <div className="toolbar">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Tìm doanh nghiệp, email, mã yêu cầu…"
            />
            <select
              aria-label="Trạng thái yêu cầu"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {["Chờ duyệt", "Cần bổ sung", "Đã cấp", "Từ chối", "Tất cả"].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
          </div>
          <Panel>
            {requests.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Doanh nghiệp / yêu cầu</th>
                      <th>Nhu cầu</th>
                      <th>Ngày gửi</th>
                      <th>Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.company}</strong>
                          <small>
                            {r.id} · {r.email}
                          </small>
                        </td>
                        <td>
                          {r.kind}
                          <small>
                            {r.branches} cơ sở · {r.count} tài khoản
                          </small>
                        </td>
                        <td>{dateLabel(r.date)}</td>
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
                        <td>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setChosen(r.id)
                              setNote(r.note)
                              setError("")
                            }}
                          >
                            Xem yêu cầu
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty title="Không có yêu cầu phù hợp">
                Yêu cầu từ Trang chủ, Nhân viên hoặc Gói & hạn mức sẽ xuất hiện
                tại đây.
              </Empty>
            )}
          </Panel>
        </>
      )}
      {tab === "Doanh nghiệp" && (
        <Panel title="Doanh nghiệp đã duyệt">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Doanh nghiệp</th>
                  <th>Gói / quy mô</th>
                  <th>Quản lý kho & nhân viên</th>
                  <th>Phí dự kiến</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{data.company}</strong>
                    <small>Doanh nghiệp mẫu hiện tại</small>
                  </td>
                  <td>{data.locations} cơ sở</td>
                  <td>
                    {data.staff.length}/{data.allowance}
                  </td>
                  <td>
                    {money(quote(data.locations, data.allowance).total)}/tháng
                  </td>
                </tr>
                {data.requests
                  .filter(
                    (r) =>
                      r.kind === "Đăng ký sử dụng" && r.status === "Đã cấp",
                  )
                  .map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.company}</strong>
                        <small>{r.email}</small>
                      </td>
                      <td>{r.branches} cơ sở yêu cầu</td>
                      <td>{r.count} tài khoản yêu cầu</td>
                      <td>
                        <Badge>Chờ thiết lập không gian</Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      {tab === "Tài khoản" && (
        <Panel title={`Nhân viên tại ${data.company}`}>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Vai trò / cơ sở</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.staff.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                      <small>{s.email}</small>
                    </td>
                    <td>
                      {roleNames[s.role]}
                      <small>{s.branch}</small>
                    </td>
                    <td>
                      <Badge tone={s.active ? "success" : "neutral"}>
                        {s.active ? "Hoạt động" : "Đã khóa"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant={s.active ? "danger" : "secondary"}
                        onClick={() => {
                          update((d) => ({
                            ...d,
                            staff: d.staff.map((item) =>
                              item.id === s.id
                                ? { ...item, active: !item.active }
                                : item,
                            ),
                          }))
                          log(
                            s.active
                              ? "Đã khóa tài khoản mẫu"
                              : "Đã mở tài khoản mẫu",
                            s.email,
                          )
                        }}
                      >
                        {s.active ? "Khóa tài khoản mẫu" : "Mở tài khoản mẫu"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      {tab === "Cập nhật sản phẩm" && (
        <Panel title="Thông báo phiên bản" className="settings-width">
          <div className="panel-body">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                update((d) => ({
                  ...d,
                  release: release.trim(),
                  releaseNote: releaseNote.trim(),
                }))
                notify("Đã cập nhật thông báo phiên bản trong kho mẫu.")
              }}
            >
              <label className="field">
                Phiên bản
                <input
                  required
                  value={release}
                  onChange={(e) => setRelease(e.target.value)}
                />
              </label>
              <label className="field">
                Nội dung cập nhật
                <textarea
                  required
                  value={releaseNote}
                  onChange={(e) => setReleaseNote(e.target.value)}
                />
              </label>
              <p className="tiny muted">
                Nội dung xuất hiện ở Cài đặt → Dữ liệu & hỗ trợ của khách hàng.
                Thay đổi tính năng phần mềm được thực hiện trong mã nguồn của dự
                án.
              </p>
              <div className="form-actions">
                <Button type="submit">Lưu thông báo</Button>
              </div>
            </form>
          </div>
        </Panel>
      )}
      {request && (
        <Modal title={request.id} close={() => setChosen("")}>
          <div className="stack">
            <Badge tone="info">{request.kind}</Badge>
            <h3>{request.company}</h3>
            <p className="tiny">
              {request.name} · {request.email}
            </p>
            <dl className="detail-list">
              <div>
                <dt>Số cơ sở</dt>
                <dd>{request.branches}</dd>
              </div>
              <div>
                <dt>Số tài khoản đề nghị</dt>
                <dd>{request.count}</dd>
              </div>
              <div>
                <dt>Vai trò đề xuất</dt>
                <dd>{roleNames[request.role]}</dd>
              </div>
              <div>
                <dt>Cơ sở phân công</dt>
                <dd>{request.branch}</dd>
              </div>
            </dl>
            <div className="callout">
              <strong>Lý do</strong>
              <br />
              {request.reason}
            </div>
            {["Cấp tài khoản", "Tăng hạn mức"].includes(request.kind) && (
              <p className="tiny muted">
                Chi phí dự kiến sau duyệt:{" "}
                {money(
                  quote(
                    Math.max(data.locations, request.branches),
                    request.kind === "Cấp tài khoản"
                      ? Math.max(
                          data.allowance,
                          data.staff.length + request.count,
                        )
                      : Math.max(data.allowance, request.count),
                  ).total,
                )}
                /tháng. Chưa thu phí.
              </p>
            )}
            <label className="field">
              Phản hồi cho khách hàng
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={
                  !["Chờ duyệt", "Cần bổ sung"].includes(request.status)
                }
              />
            </label>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            {["Chờ duyệt", "Cần bổ sung"].includes(request.status) ? (
              <div className="row wrap">
                <Button onClick={() => decide("Đã cấp")}>
                  <Check size={15} />
                  Duyệt trong bản demo
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => decide("Cần bổ sung")}
                >
                  Cần bổ sung
                </Button>
                <Button variant="danger" onClick={() => decide("Từ chối")}>
                  Từ chối
                </Button>
              </div>
            ) : (
              <Badge>{request.status}</Badge>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
