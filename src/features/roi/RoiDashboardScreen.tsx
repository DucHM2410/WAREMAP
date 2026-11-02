import {
  Activity,
  AlertCircle,
  ArrowDownUp,
  Boxes,
  Building2,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Printer,
  TrendingUp,
} from "lucide-react"

import { useState } from "react"

import { useApp } from "../../app/store"

import { daysLeft, quote } from "../../app/model"

import { Button, Download as DownloadButton } from "../../app/ui"

import "./roi.css"

const periods = [
  { value: "30", label: "30 ngày gần nhất" },

  { value: "90", label: "90 ngày gần nhất" },

  { value: "180", label: "6 tháng gần nhất" },

  { value: "365", label: "1 năm gần nhất" },
]

const currency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",

    currency: "VND",

    maximumFractionDigits: 0,
  }).format(amount)

const chartPoint = (value: number, index: number, max: number) => {
  const x = 56 + index * 104

  const y = 178 - (value / max) * 142

  return `${x},${y}`
}

export default function Reports() {
  const { data, branch, visibleProducts } = useApp()

  const [period, setPeriod] = useState("30")

  const [monthlyExpiryLoss, setMonthlyExpiryLoss] = useState(0)

  const [expiryReduction, setExpiryReduction] = useState(0)

  const [savedLaborHours, setSavedLaborHours] = useState(0)

  const [hourlyLaborCost, setHourlyLaborCost] = useState(0)

  const periodDays = Number(period)

  const now = Date.now()

  const branchLabel = branch === "all" ? "Tất cả cơ sở" : branch

  const relevant = data.activities.filter((activity) => {
    const age = now - Date.parse(activity.time)

    return (
      age >= 0 &&
      age <= periodDays * 86400000 &&
      (branch === "all" || activity.detail.includes(branch))
    )
  })

  const transfers = data.transfers.filter((transfer) => {
    const age = now - Date.parse(transfer.created)

    return (
      age >= 0 &&
      age <= periodDays * 86400000 &&
      (branch === "all" || transfer.from === branch || transfer.to === branch)
    )
  })

  const completed = transfers.filter(
    (transfer) => transfer.status === "Hoàn tất",
  ).length

  const differences = transfers.filter(
    (transfer) =>
      transfer.received !== undefined && transfer.received !== transfer.qty,
  ).length

  const fefoAlerts = visibleProducts.filter(
    (product) =>
      product.qty > 0 && daysLeft(product.expiry) <= data.settings.expiryDays,
  )

  const expiredLots = fefoAlerts.filter(
    (product) => daysLeft(product.expiry) < 0,
  ).length

  const chartData = Array.from({ length: 6 }, (_, index) => ({
    label:
      index === 5
        ? "Hiện tại"
        : `${Math.round(((5 - index) * periodDays) / 5)} ngày`,

    activities: 0,

    transfers: 0,
  }))

  const addToBucket = (timestamp: string, key: "activities" | "transfers") => {
    const age = (now - Date.parse(timestamp)) / 86400000

    if (age < 0 || age > periodDays) return

    const index = Math.min(
      5,

      Math.floor((periodDays - age) / (periodDays / chartData.length)),
    )

    chartData[index][key] += 1
  }

  relevant.forEach((activity) => addToBucket(activity.time, "activities"))

  transfers.forEach((transfer) => addToBucket(transfer.created, "transfers"))

  const maxActivity = Math.max(
    1,

    ...chartData.map((item) => Math.max(item.activities, item.transfers)),
  )

  const activityPoints = chartData

    .map((item, index) => chartPoint(item.activities, index, maxActivity))

    .join(" ")

  const transferPoints = chartData

    .map((item, index) => chartPoint(item.transfers, index, maxActivity))

    .join(" ")

  const cumulativeData = chartData.map((item, index) =>
    chartData

      .slice(0, index + 1)

      .reduce((sum, bucket) => sum + bucket.activities + bucket.transfers, 0),
  )

  const maxCumulative = Math.max(1, ...cumulativeData)

  const cumulativePoints = cumulativeData

    .map((value, index) => chartPoint(value, index, maxCumulative))

    .join(" ")

  const statusItems = [
    { label: "Chuẩn bị", color: "#94a3b8" },

    { label: "Đang chuyển", color: "#22d3ee" },

    { label: "Kiểm nhận", color: "#818cf8" },

    { label: "Hoàn tất", color: "#34d399" },
  ].map((item) => ({
    ...item,

    count: transfers.filter((transfer) => transfer.status === item.label)
      .length,
  }))

  const circumference = 2 * Math.PI * 43

  let donutOffset = 0

  const donutSegments = statusItems.map((item) => {
    const length =
      transfers.length > 0 ? (item.count / transfers.length) * circumference : 0

    const segment = { ...item, length, offset: donutOffset }

    donutOffset += length

    return segment
  })

  const monthlyLicense = quote(data.locations, data.allowance).total

  const monthlyExpirySavings =
    monthlyExpiryLoss * (Math.min(100, Math.max(0, expiryReduction)) / 100)

  const monthlyLaborSavings = savedLaborHours * hourlyLaborCost

  const annualSavings = (monthlyExpirySavings + monthlyLaborSavings) * 12

  const annualLicense = monthlyLicense * 12

  const projectedRoi =
    annualSavings > 0
      ? ((annualSavings - annualLicense) / annualLicense) * 100
      : null

  const paybackDays =
    monthlyExpirySavings + monthlyLaborSavings > 0
      ? Math.ceil(
          (monthlyLicense / (monthlyExpirySavings + monthlyLaborSavings)) * 30,
        )
      : null

  const breakdown = [
    {
      title: "Hàng cận hạn / hết hạn",

      description: "Hủy hàng do bỏ quên lô ở góc khuất",

      solution: "Theo dõi lô FEFO, định vị trên sơ đồ kho",

      evidence: `${fefoAlerts.length} lô cần chú ý · ${expiredLots} lô hết hạn`,

      icon: AlertCircle,

      tone: "amber",
    },

    {
      title: "Nhặt sai sản phẩm",

      description: "Mất thời gian tìm lại, đổi trả và xác minh",

      solution: "Tra cứu mã hàng, lô và vị trí trên WareMap",

      evidence: `${relevant.length} thao tác được ghi nhận`,

      icon: PackageCheck,

      tone: "cyan",
    },

    {
      title: "Chênh lệch khi chuyển kho",

      description: "Sai lệch số lượng giữa lúc xuất và nhận",

      solution: "Đối soát trạng thái và số lượng nhận hàng",

      evidence: `${differences} phiếu chênh lệch / ${transfers.length} phiếu`,

      icon: ArrowDownUp,

      tone: "indigo",
    },

    {
      title: "Kiểm kê và vận hành",

      description: "Thiếu nhật ký để xác định thời gian và chi phí",

      solution: "Ghi nhận hoạt động kho theo thời gian",

      evidence: `${relevant.length} hoạt động trong kỳ`,

      icon: Boxes,

      tone: "green",
    },
  ]

  return (
    <div className="roi-report">
      <header className="roi-report__heading">
        <div className="roi-report__heading-copy">
          <span className="roi-report__eyebrow">
            WAREMAP 3D · PHÂN TÍCH HIỆU QUẢ
          </span>
          <h1>Báo cáo ROI &amp; tiết kiệm chi phí</h1>
          <p>
            Theo dõi dữ liệu vận hành thực tế và tự mô phỏng giá trị đầu tư theo
            giả định của doanh nghiệp.
          </p>
        </div>
        <div className="roi-report__controls">
          <div className="roi-report__scope">
            <span>Phạm vi</span>
            <strong>
              <Building2 size={14} />
              {branchLabel}
            </strong>
          </div>
          <label>
            <span>Kỳ báo cáo</span>
            <div className="roi-report__select-wrap">
              <select
                aria-label="Kỳ báo cáo"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                {periods.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <DownloadButton
            name="bao-cao-roi-waremap.csv"
            rows={[
              ["Chỉ số", "Giá trị", "Phạm vi", "Kỳ báo cáo"],

              ["Hoạt động ghi nhận", relevant.length, branchLabel, period],

              ["Phiếu chuyển hoàn tất", completed, branchLabel, period],

              ["Phiếu chênh lệch", differences, branchLabel, period],

              ["Lô FEFO cần chú ý", fefoAlerts.length, branchLabel, period],

              ...breakdown.map((item) => [
                item.title,

                item.evidence,

                branchLabel,

                period,
              ]),
            ]}
          />
          <Button
            variant="secondary"
            className="roi-report__print"
            onClick={() => window.print()}
          >
            <Printer size={15} />
            <span>In báo cáo</span>
          </Button>
        </div>
      </header>

      <section className="roi-report__summary" aria-label="Tóm tắt báo cáo">
        <div className="roi-report__summary-copy">
          <span className="roi-report__summary-kicker">
            <TrendingUp size={15} />
            Hiệu quả được ghi nhận
          </span>
          <h2>
            {relevant.length + transfers.length} hoạt động vận hành
            <span> trong kỳ</span>
          </h2>
          <p>
            Phạm vi: {branchLabel}. Số liệu được lấy từ nhật ký và phiếu chuyển
            kho, không tự suy diễn khoản tiết kiệm.
          </p>
        </div>
        <div className="roi-report__summary-period">
          <span>Kỳ đang xem</span>
          <strong>
            {periods.find((option) => option.value === period)?.label}
          </strong>
          <small>{branchLabel}</small>
        </div>
      </section>

      <section className="roi-report__kpis" aria-label="Chỉ số vận hành">
        {[
          {
            title: "Thao tác đã ghi nhận",

            value: relevant.length,

            detail: "Trong nhật ký hoạt động",

            icon: Activity,

            tone: "green",
          },

          {
            title: "Phiếu chuyển hoàn tất",

            value: completed,

            detail: `Trong ${transfers.length} phiếu của kỳ`,

            icon: CheckCircle2,

            tone: "cyan",
          },

          {
            title: "Phiếu có chênh lệch",

            value: differences,

            detail: "Cần kiểm tra đối soát",

            icon: ArrowDownUp,

            tone: "indigo",
          },

          {
            title: "Lô FEFO cần chú ý",

            value: fefoAlerts.length,

            detail: `${expiredLots} lô đã hết hạn`,

            icon: Clock3,

            tone: "amber",
          },
        ].map(({ title, value, detail, icon: Icon, tone }) => (
          <article className={`roi-report__kpi is-${tone}`} key={title}>
            <div className="roi-report__kpi-top">
              <span>{title}</span>
              <span className="roi-report__kpi-icon">
                <Icon size={16} />
              </span>
            </div>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <section className="roi-report__charts" aria-label="Biểu đồ vận hành">
        <article className="roi-report__card roi-report__activity-chart">
          <div className="roi-report__card-heading">
            <div>
              <h2>Hoạt động kho theo kỳ</h2>
              <p>Đối chiếu nhật ký vận hành và phiếu chuyển</p>
            </div>
            <span className="roi-report__chart-unit">Số ghi nhận</span>
          </div>
          <div className="roi-report__legend">
            <span>
              <i className="is-green" /> Nhật ký hoạt động
            </span>
            <span>
              <i className="is-cyan" /> Phiếu chuyển
            </span>
          </div>
          <div className="roi-report__chart">
            <svg
              viewBox="0 0 640 230"
              role="img"
              aria-label="Biểu đồ nhật ký hoạt động và phiếu chuyển theo sáu giai đoạn"
              preserveAspectRatio="none"
            >
              {[36, 82, 128, 174].map((y) => (
                <line
                  key={y}
                  x1="52"
                  x2="592"
                  y1={y}
                  y2={y}
                  className="roi-report__grid-line"
                />
              ))}
              <polyline
                points={activityPoints}
                className="roi-report__line is-green"
              />
              <polyline
                points={transferPoints}
                className="roi-report__line is-cyan"
              />
              {chartData.map((item, index) => (
                <g key={item.label}>
                  <circle
                    cx={56 + index * 104}
                    cy={178 - (item.activities / maxActivity) * 142}
                    r="3.5"
                    className="roi-report__point is-green"
                  />
                  <circle
                    cx={56 + index * 104}
                    cy={178 - (item.transfers / maxActivity) * 142}
                    r="3.5"
                    className="roi-report__point is-cyan"
                  />
                  <text
                    x={56 + index * 104}
                    y="211"
                    className="roi-report__axis-label"
                    textAnchor="middle"
                  >
                    {item.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="roi-report__chart-foot">
            <span>6 giai đoạn trong kỳ</span>
            <span>{relevant.length + transfers.length} ghi nhận</span>
          </div>
        </article>

        <article className="roi-report__card roi-report__transfer-chart">
          <div className="roi-report__card-heading">
            <div>
              <h2>Trạng thái chuyển kho</h2>
              <p>Phân bổ phiếu trong kỳ báo cáo</p>
            </div>
          </div>
          <div className="roi-report__donut-wrap">
            <svg
              viewBox="0 0 120 120"
              role="img"
              aria-label={`Tổng cộng ${transfers.length} phiếu chuyển`}
            >
              <circle
                cx="60"
                cy="60"
                r="43"
                className="roi-report__donut-track"
              />
              {donutSegments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="60"
                  cy="60"
                  r="43"
                  className="roi-report__donut-segment"
                  stroke={segment.color}
                  strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                  strokeDashoffset={-segment.offset}
                />
              ))}
              <text x="60" y="57" className="roi-report__donut-value">
                {transfers.length}
              </text>
              <text x="60" y="73" className="roi-report__donut-label">
                phiếu
              </text>
            </svg>
          </div>
          <div className="roi-report__status-list">
            {statusItems.map((item) => (
              <div key={item.label}>
                <span>
                  <i style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="roi-report__card roi-report__cumulative">
        <div className="roi-report__card-heading">
          <div>
            <h2>Tích lũy ghi nhận vận hành</h2>
            <p>
              Tổng hoạt động và phiếu chuyển đã ghi nhận trong kỳ, không phải
              giá trị tiết kiệm.
            </p>
          </div>
          <span className="roi-report__chart-unit">Ghi nhận lũy kế</span>
        </div>
        <div className="roi-report__chart roi-report__chart--wide">
          <svg
            viewBox="0 0 640 230"
            role="img"
            aria-label="Biểu đồ lũy kế các hoạt động và phiếu chuyển"
            preserveAspectRatio="none"
          >
            {[36, 82, 128, 174].map((y) => (
              <line
                key={y}
                x1="52"
                x2="592"
                y1={y}
                y2={y}
                className="roi-report__grid-line"
              />
            ))}
            <polyline
              points={cumulativePoints}
              className="roi-report__line is-indigo"
            />
            {cumulativeData.map((value, index) => (
              <g key={index}>
                <circle
                  cx={56 + index * 104}
                  cy={178 - (value / maxCumulative) * 142}
                  r="3.5"
                  className="roi-report__point is-indigo"
                />
                <text
                  x={56 + index * 104}
                  y="211"
                  className="roi-report__axis-label"
                  textAnchor="middle"
                >
                  {chartData[index].label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      <section className="roi-report__simulator">
        <div className="roi-report__simulator-heading">
          <div className="roi-report__simulator-icon">
            <TrendingUp size={19} />
          </div>
          <div>
            <span className="roi-report__eyebrow">
              MÔ PHỎNG · KHÔNG PHẢI SỐ LIỆU THỰC TẾ
            </span>
            <h2>Công cụ giả lập ROI kho của bạn</h2>
            <p>Điều chỉnh các giả định để ước tính khả năng tiết kiệm.</p>
          </div>
        </div>
        <div className="roi-report__simulator-grid">
          <div className="roi-report__assumptions">
            <label className="roi-report__field">
              <span>Chi phí hàng cận hạn / tháng</span>
              <div className="roi-report__input-wrap">
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={monthlyExpiryLoss}
                  onChange={(event) =>
                    setMonthlyExpiryLoss(
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />
                <span>₫ / tháng</span>
              </div>
            </label>
            <label className="roi-report__field">
              <span>
                Tỷ lệ giảm thất thoát <strong>{expiryReduction}%</strong>
              </span>
              <input
                className="roi-report__range"
                type="range"
                min="0"
                max="100"
                value={expiryReduction}
                onChange={(event) =>
                  setExpiryReduction(Number(event.target.value))
                }
              />
            </label>
            <label className="roi-report__field">
              <span>Giờ kiểm kho tiết kiệm / tháng</span>
              <div className="roi-report__input-wrap">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={savedLaborHours}
                  onChange={(event) =>
                    setSavedLaborHours(
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />
                <span>giờ</span>
              </div>
            </label>
            <label className="roi-report__field">
              <span>Chi phí nhân công / giờ</span>
              <div className="roi-report__input-wrap">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={hourlyLaborCost}
                  onChange={(event) =>
                    setHourlyLaborCost(
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />
                <span>₫ / giờ</span>
              </div>
            </label>
            <div className="roi-report__license">
              <span>Phí WareMap tham khảo / tháng</span>
              <strong>{currency(monthlyLicense)}</strong>
            </div>
          </div>
          <div className="roi-report__projection">
            <div className="roi-report__projection-main">
              <span>Dự kiến tiết kiệm / năm</span>
              <strong>{currency(annualSavings)}</strong>
              <small>
                Theo các giả định do bạn cung cấp; chưa bao gồm chi phí triển
                khai khác.
              </small>
            </div>
            <div className="roi-report__projection-stats">
              <div>
                <span>Giờ nhân công / năm</span>
                <strong>
                  {new Intl.NumberFormat("vi-VN").format(savedLaborHours * 12)}{" "}
                  giờ
                </strong>
              </div>
              <div>
                <span>ROI ước tính</span>
                <strong>
                  {projectedRoi === null
                    ? "Nhập giả định"
                    : `${Math.round(projectedRoi)}%`}
                </strong>
              </div>
              <div>
                <span>Thời gian hoàn vốn</span>
                <strong>
                  {paybackDays === null ? "—" : `${paybackDays} ngày`}
                </strong>
              </div>
            </div>
          </div>
        </div>
        <p className="roi-report__disclaimer">
          Kết quả mô phỏng chỉ mang tính tham khảo, được tính từ các giả định
          nhập bên trái; không phải cam kết hoặc kết quả ROI đã kiểm chứng.
        </p>
      </section>

      <section className="roi-report__card roi-report__breakdown">
        <div className="roi-report__card-heading">
          <div>
            <h2>Đối soát các điểm vận hành</h2>
            <p>
              Số liệu thực tế có sẵn trong hệ thống; khoản tiết kiệm chỉ hiển
              thị khi có đủ dữ liệu đầu vào.
            </p>
          </div>
          <span className="roi-report__chart-unit">{branchLabel}</span>
        </div>
        <div className="roi-report__table-scroll">
          <table>
            <thead>
              <tr>
                <th>Vấn đề vận hành</th>
                <th>Điểm cần đo</th>
                <th>Giải pháp WareMap</th>
                <th>Dữ liệu kỳ này</th>
                <th>Tiết kiệm năm</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item) => {
                const Icon = item.icon

                return (
                  <tr key={item.title}>
                    <td>
                      <strong>
                        <span
                          className={`roi-report__table-icon is-${item.tone}`}
                        >
                          <Icon size={15} />
                        </span>
                        {item.title}
                      </strong>
                      <small>{item.description}</small>
                    </td>
                    <td>{item.description}</td>
                    <td>{item.solution}</td>
                    <td>{item.evidence}</td>
                    <td>
                      <span className="roi-report__unmeasured">
                        Chưa đủ dữ liệu
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <footer className="roi-report__table-foot">
          <span>Phạm vi: {branchLabel}</span>
          <span>
            {relevant.length} hoạt động · {transfers.length} phiếu chuyển
          </span>
        </footer>
      </section>

      <p className="roi-report__footnote">
        Số liệu vận hành được lấy từ nhật ký và phiếu chuyển kho. Báo cáo không
        tự quy đổi dữ liệu này thành khoản tiết kiệm tài chính đã xác nhận.
      </p>
    </div>
  )
}
