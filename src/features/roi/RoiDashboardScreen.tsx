import { Activity, ArrowDownUp, ClipboardCheck, Clock3 } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import { branches } from "../../app/model"
import { Badge, Button, Download, Empty, PageTitle, Panel } from "../../app/ui"
export default function Reports() {
  const { data, branch } = useApp()
  const [period, setPeriod] = useState("7")
  const relevant = data.activities.filter(
    (a) =>
      Date.now() - Date.parse(a.time) <= Number(period) * 86400000 &&
      (branch === "all" || a.detail.includes(branch)),
  )
  const transfers = data.transfers.filter(
    (t) =>
      (branch === "all" || t.from === branch || t.to === branch) &&
      Date.now() - Date.parse(t.created) <= Number(period) * 86400000,
  )
  const completed = transfers.filter((t) => t.status === "Hoàn tất").length,
    differences = transfers.filter(
      (t) => t.received !== undefined && t.received !== t.qty,
    ).length
  return (
    <>
      <PageTitle
        eyebrow="Đo từ hoạt động thực tế"
        title="Báo cáo hiệu quả"
        description="Quan sát những gì đã được ghi nhận trong kho mẫu. Chỉ so sánh hiệu quả khi có đủ dữ liệu trước và sau."
        action={
          <div className="row">
            <select
              aria-label="Kỳ báo cáo"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="7">7 ngày gần nhất</option>
              <option value="30">30 ngày gần nhất</option>
              <option value="90">90 ngày gần nhất</option>
            </select>
            <Button variant="secondary" onClick={() => window.print()}>
              In / Lưu PDF
            </Button>
          </div>
        }
      />
      <div className="metric-grid compact">
        {[
          {
            title: "Thao tác đã ghi nhận",
            value: relevant.length,
            icon: Activity,
          },
          {
            title: "Phiếu chuyển hoàn tất",
            value: completed,
            icon: ClipboardCheck,
          },
          {
            title: "Phiếu có chênh lệch",
            value: differences,
            icon: ArrowDownUp,
          },
        ].map(({ title, value, icon: Icon }) => (
          <Panel className="metric" key={title}>
            <span>{title}</span>
            <Icon className="metric-icon" size={20} />
            <div className="metric-value">
              <strong>{value}</strong>
            </div>
            <p>Trong {period} ngày tại phạm vi đang xem</p>
          </Panel>
        ))}
      </div>
      <div className="grid-two">
        <Panel title="Hiệu quả tìm và nhặt hàng">
          <Empty title="Chưa đủ dữ liệu để so sánh">
            Cần ghi thời gian bắt đầu và hoàn tất từng lượt nhặt, cùng dữ liệu
            nền trước khi dùng WareMap. Chưa có tỷ lệ cải thiện được xác nhận.
          </Empty>
        </Panel>
        <Panel title="Đối soát chuyển kho">
          <div className="panel-body stack">
            {transfers.length ? (
              <>
                {["Chuẩn bị", "Đang chuyển", "Kiểm nhận", "Hoàn tất"].map(
                  (s) => {
                    const n = transfers.filter((t) => t.status === s).length
                    return (
                      <div key={s}>
                        <div className="row between tiny">
                          <span>{s}</span>
                          <strong>{n} phiếu</strong>
                        </div>
                        <div
                          style={{
                            height: 9,
                            background: "#eff4f6",
                            borderRadius: 9,
                            marginTop: 8,
                          }}
                        >
                          <div
                            style={{
                              width: `${(n / transfers.length) * 100}%`,
                              height: "100%",
                              background:
                                s === "Hoàn tất" ? "#499b7b" : "#75aeb8",
                              borderRadius: 9,
                            }}
                          />
                        </div>
                      </div>
                    )
                  },
                )}
                <p className="tiny muted">
                  Đếm theo phiếu trong kho mẫu, không phải số liệu hiệu quả đã
                  kiểm chứng.
                </p>
              </>
            ) : (
              <p>Chưa có phiếu trong kỳ báo cáo.</p>
            )}
          </div>
        </Panel>
      </div>
      <Panel
        title="Nhật ký vận hành"
        className="request-history"
        action={
          <Download
            name="nhat-ky-waremap.csv"
            rows={[
              ["Thời gian", "Thao tác", "Chi tiết"],
              ...relevant.map((a) => [a.time, a.title, a.detail]),
            ]}
          />
        }
      >
        {relevant.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {relevant.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.time).toLocaleString("vi-VN")}</td>
                    <td>{a.title}</td>
                    <td>{a.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="panel-body">
            <p className="tiny">
              Thực hiện nhập hàng, xác minh hoặc chuyển kho để bắt đầu ghi nhận
              hoạt động.
            </p>
          </div>
        )}
      </Panel>
    </>
  )
}
