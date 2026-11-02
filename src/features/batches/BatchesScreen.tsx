import {
  AlertCircle,
  ArrowRight,
  Clock3,
  LocateFixed,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react"

import { lazy, Suspense, useEffect, useRef, useState } from "react"

import { useApp } from "../../app/store"

import {
  dateLabel,
  daysLeft,
  expiryLabel,
  locationLabel,
} from "../../app/model"

import { ExpiryBadge, matchesProduct, productKey } from "../../app/catalog"

import {
  Button,
  Download,
  Empty,
  Modal,
  PageTitle,
  Panel,
  SearchInput,
} from "../../app/ui"

import "./batches.css"

const MiniWarehouse3D = lazy(() =>
  import("../../shared/components/MiniWarehouse3D").then((module) => ({
    default: module.MiniWarehouse3D,
  })),
)

function MapLoading() {
  return (
    <div className="batches-map__loading" role="status">
      Đang tải bản đồ kho…
    </div>
  )
}

export default function Batches() {
  const {
    visibleProducts,

    data,

    go,

    setSelected,

    setBranch,

    branch,

    accessibleBranches,

    setScanTask,
  } = useApp()

  const [filter, setFilter] = useState("Tất cả"),
    [search, setSearch] = useState(""),
    [detailKey, setDetailKey] = useState("")

  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)
  const pageSize = 10
  useEffect(() => setPage(1), [search, filter, branch, data.settings.expiryDays])

  const middleRange = `Từ ${data.settings.expiryDays + 1}–90 ngày`

  const filters = [
    "Tất cả",

    "Đã hết hạn",

    `Trong ${data.settings.expiryDays} ngày`,

    ...(data.settings.expiryDays < 90 ? [middleRange] : []),

    "Trên 90 ngày",
  ]

  const matches = (product: typeof visibleProducts[number]) => {
    const remaining = daysLeft(product.expiry)

    return (
      filter === "Tất cả" ||
      (filter === "Đã hết hạn" && remaining < 0) ||
      (filter === `Trong ${data.settings.expiryDays} ngày` &&
        remaining >= 0 &&
        remaining <= data.settings.expiryDays) ||
      (filter === middleRange &&
        remaining > data.settings.expiryDays &&
        remaining <= 90) ||
      (filter === "Trên 90 ngày" && remaining > 90)
    )
  }

  const rows = visibleProducts

    .filter((product) => matches(product) && matchesProduct(product, search))

    .sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry))

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  useEffect(() => setPage(previous => Math.min(previous, pageCount)), [pageCount])
  const changePage = (next: number) => {
    setPage(Math.max(1, Math.min(next, pageCount)))
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const inStock = visibleProducts.filter((product) => product.qty > 0)

  const expired = inStock.filter((product) => daysLeft(product.expiry) < 0)

  const nearExpiry = inStock.filter((product) => {
    const remaining = daysLeft(product.expiry)

    return remaining >= 0 && remaining <= data.settings.expiryDays
  })

  const safe = inStock.filter((product) => daysLeft(product.expiry) > 90)

  const quantityOf = (products: typeof inStock) =>
    products.reduce((sum, product) => sum + product.qty, 0)

  const mapBranch = branch === "all" ? accessibleBranches[0] : branch

  const mapRacks = mapBranch ? (data.racks[mapBranch] ?? []) : []

  const mapAlerts = inStock.filter(
    (product) =>
      product.branch === mapBranch &&
      daysLeft(product.expiry) <= data.settings.expiryDays,
  )

  const alertRacks = Array.from(
    new Set(mapAlerts.map((product) => product.rack)),
  )

  const detail = visibleProducts.find(
    (product) => productKey(product) === detailKey,
  )

  const showOnMap = (product: typeof visibleProducts[number]) => {
    setSelected(product.id)

    setBranch(product.branch)

    setScanTask({ mode: "lookup", productKey: productKey(product) })

    go("warehouse")
  }

  const exportRows = [
    [
      "Sản phẩm",

      "Mã lô",

      "Quy cách",

      "Hạn dùng",

      "Số lượng",

      "Cơ sở",

      "Vị trí",

      "Trạng thái",
    ],

    ...rows.map((product) => [
      product.name,

      product.batch,

      product.variant,

      dateLabel(product.expiry),

      product.qty,

      product.branch,

      locationLabel(product),

      expiryLabel(product.expiry),
    ]),
  ]

  return (
    <div className="batches-page">
      <PageTitle
        eyebrow="Kiểm soát lô, chủ động hạn dùng"
        title="Lô hàng & hạn dùng"
        description="Theo dõi hạn sử dụng, tồn kho và vị trí từng lô. Danh sách luôn ưu tiên lô hết hạn trước theo nguyên tắc FEFO."
        action={
          <div className="batches-page__actions">
            <Button variant="secondary" onClick={() => go("onboarding")}>
              <AlertCircle size={16} />
              Cảnh báo FEFO
            </Button>
            <Download name="danh-sach-lo-hang.csv" rows={exportRows} />
          </div>
        }
      />

      <section className="batches-metrics" aria-label="Tổng quan hạn dùng">
        <article className="batches-metric batches-metric--expired">
          <div className="batches-metric__top">
            <span className="batches-metric__icon">
              <AlertCircle size={17} />
            </span>
            <span className="batches-metric__label">Đã hết hạn</span>
          </div>
          <div className="batches-metric__value">
            <strong>{expired.length}</strong>
            <span>lô hàng</span>
          </div>
          <p>
            {quantityOf(expired).toLocaleString("vi-VN")} sản phẩm cần xử lý
          </p>
        </article>
        <article className="batches-metric batches-metric--urgent">
          <div className="batches-metric__top">
            <span className="batches-metric__icon">
              <Clock3 size={17} />
            </span>
            <span className="batches-metric__label">Cận hạn</span>
          </div>
          <div className="batches-metric__value">
            <strong>{nearExpiry.length}</strong>
            <span>lô hàng</span>
          </div>
          <p>
            {quantityOf(nearExpiry).toLocaleString("vi-VN")} sản phẩm · trong{" "}
            {data.settings.expiryDays} ngày
          </p>
        </article>
        <article className="batches-metric batches-metric--safe">
          <div className="batches-metric__top">
            <span className="batches-metric__icon">
              <ShieldCheck size={17} />
            </span>
            <span className="batches-metric__label">An toàn</span>
          </div>
          <div className="batches-metric__value">
            <strong>{safe.length}</strong>
            <span>lô hàng</span>
          </div>
          <p>
            {quantityOf(safe).toLocaleString("vi-VN")} sản phẩm · trên 90 ngày
          </p>
        </article>
      </section>

      <Panel className="batches-map">
        <div className="batches-map__heading">
          <div className="batches-map__title">
            <span className="batches-map__title-icon">
              <MapPin size={17} />
            </span>
            <div>
              <h2>Bản đồ vị trí kho</h2>
              <p>{mapBranch ?? "Chưa chọn cơ sở"}</p>
            </div>
          </div>
          <span className="batches-map__status">
            <span />
            {alertRacks.length
              ? `${alertRacks.length} kệ có lô cần chú ý`
              : "Không có kệ cận hạn"}
          </span>
        </div>
        <div className="batches-map__canvas">
          {mapRacks.length ? (
            <Suspense fallback={<MapLoading />}>
              <MiniWarehouse3D racks={mapRacks} alertRacks={alertRacks} />
            </Suspense>
          ) : (
            <div className="batches-map__loading">
              Chưa có sơ đồ kho cho cơ sở này.
            </div>
          )}
        </div>
        <div className="batches-map__footer">
          <span className="batches-map__legend">
            <span />
            Kệ có lô đã hết hạn hoặc cận hạn
          </span>
          {branch === "all" && mapBranch && (
            <span className="batches-map__scope">
              Đang tổng hợp tất cả cơ sở; bản đồ hiển thị {mapBranch}.
            </span>
          )}
          <Button
            variant="ghost"
            disabled={!mapAlerts.length}
            onClick={() => mapAlerts[0] && showOnMap(mapAlerts[0])}
          >
            Định vị lô cần xử lý
            <ArrowRight size={15} />
          </Button>
        </div>
      </Panel>

      <Panel className="batches-list">
        <div className="batches-list__heading" ref={listRef}>
          <div>
            <h2>Danh sách lô hàng</h2>
            <p>Sắp xếp theo hạn dùng tăng dần để hỗ trợ xuất hàng FEFO.</p>
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Tìm sản phẩm hoặc mã lô…"
          />
        </div>
        <div
          className="batches-tabs"
          role="tablist"
          aria-label="Lọc theo hạn dùng"
        >
          {filters.map((name) => {
            const count =
              name === "Tất cả"
                ? visibleProducts.length
                : name === "Đã hết hạn"
                  ? visibleProducts.filter(
                      (product) => daysLeft(product.expiry) < 0,
                    ).length
                  : name === `Trong ${data.settings.expiryDays} ngày`
                    ? visibleProducts.filter((product) => {
                        const remaining = daysLeft(product.expiry)

                        return (
                          remaining >= 0 &&
                          remaining <= data.settings.expiryDays
                        )
                      }).length
                    : name === middleRange
                      ? visibleProducts.filter((product) => {
                          const remaining = daysLeft(product.expiry)

                          return (
                            remaining > data.settings.expiryDays &&
                            remaining <= 90
                          )
                        }).length
                      : visibleProducts.filter(
                          (product) => daysLeft(product.expiry) > 90,
                        ).length

            return (
              <button
                key={name}
                className={filter === name ? "active" : ""}
                onClick={() => setFilter(name)}
                role="tab"
                aria-selected={filter === name}
              >
                {name}
                <span>{count}</span>
              </button>
            )
          })}
        </div>

        {rows.length ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm / mã lô</th>
                    <th>Hạn sử dụng</th>
                    <th>Số lượng</th>
                    {branch === "all" && <th>Cơ sở</th>}
                    <th>Vị trí</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((product) => (
                    <tr key={productKey(product)}>
                      <td>
                        <strong>{product.name}</strong>
                        <small>
                          {product.batch} · {product.variant}
                        </small>
                      </td>
                      <td>{dateLabel(product.expiry)}</td>
                      <td>{product.qty.toLocaleString("vi-VN")}</td>
                      {branch === "all" && <td>{product.branch}</td>}
                      <td>{locationLabel(product)}</td>
                      <td>
                        <ExpiryBadge
                          product={product}
                          threshold={data.settings.expiryDays}
                        />
                      </td>
                      <td>
                        <div className="batches-row-actions">
                          <Button
                            variant="ghost"
                            className="batches-row-actions__locate"
                            onClick={() => showOnMap(product)}
                          >
                            <LocateFixed size={15} />
                            Định vị
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setDetailKey(productKey(product))}
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer batches-pagination">
              <span role="status">Hiển thị {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, rows.length)} / {rows.length} lô hàng</span>
              <nav aria-label="Phân trang lô hàng">
                <Button variant="secondary" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Trước</Button>
                <span>Trang {currentPage} / {pageCount}</span>
                <Button variant="secondary" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>Sau</Button>
              </nav>
            </div>
          </>
        ) : (
          <Empty
            title="Không có lô phù hợp"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setFilter("Tất cả")

                  setSearch("")
                }}
              >
                Xóa bộ lọc
              </Button>
            }
          >
            Thử thay đổi mốc hạn dùng hoặc nội dung tìm kiếm.
          </Empty>
        )}
      </Panel>

      <div className="callout batches-fefo-note">
        <PackageCheck size={17} />
        <span>
          Ưu tiên xuất lô có hạn sử dụng gần nhất (FEFO). Lô đã hết hạn cần được
          kiểm tra và xử lý riêng, không đưa vào luồng xuất hàng.
        </span>
      </div>

      {detail && (
        <Modal title={detail.name} close={() => setDetailKey("")}>
          <div className="stack">
            <ExpiryBadge
              product={detail}
              threshold={data.settings.expiryDays}
            />
            <dl className="detail-list">
              <div>
                <dt>Mã lô</dt>
                <dd>{detail.batch}</dd>
              </div>
              <div>
                <dt>Hạn dùng</dt>
                <dd>{dateLabel(detail.expiry)}</dd>
              </div>
              <div>
                <dt>Tồn kho</dt>
                <dd>{detail.qty} sản phẩm</dd>
              </div>
              <div>
                <dt>Cơ sở</dt>
                <dd>{detail.branch}</dd>
              </div>
              <div>
                <dt>Vị trí</dt>
                <dd>{locationLabel(detail)}</dd>
              </div>
            </dl>
            <Button onClick={() => showOnMap(detail)}>
              <MapPin size={16} />
              Xem vị trí trên bản đồ
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
