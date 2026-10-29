import { Box, Check, MapPin, ScanLine } from "lucide-react"
export function WarehouseIllustration({
  compact = false,
}: {
  compact?: boolean
}) {
  return (
    <div
      className={`wm-warehouse-art ${compact ? "is-compact" : ""}`}
      aria-label="Minh họa bản đồ kho 3D WareMap"
    >
      <div className="wm-art-window">
        <div className="wm-art-windowbar">
          <span />
          <span />
          <span />
          <b>WareMap · Kho trung tâm</b>
          <i>3D LIVE</i>
        </div>
        <div className="wm-art-body">
          <aside>
            <Box size={19} />
            <MapPin size={19} />
            <ScanLine size={19} />
          </aside>
          <div className="wm-art-grid">
            <div className="wm-racks">
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((id, i) => (
                <div
                  className={`wm-art-rack ${i === 1 ? "is-selected" : ""}`}
                  key={id}
                >
                  <span>{id}</span>
                  {[0, 1, 2].map((level) => (
                    <div className="wm-art-shelf" key={level}>
                      <i />
                      <i />
                      <i />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="wm-art-location">
              <MapPin size={13} />
              Kệ A2 · Tầng 2 · Ô 03
            </div>
          </div>
        </div>
        <div className="wm-art-footer">
          <span>
            <i />
            Sơ đồ kho đã sẵn sàng
          </span>
          <span>Kéo để xoay · Cuộn để phóng to</span>
        </div>
      </div>
      <div className="wm-art-float wm-art-found">
        <span>
          <Check size={17} />
        </span>
        <div>
          <b>Đã tìm thấy sản phẩm</b>
          <small>Đúng vị trí. Đúng lô hàng.</small>
        </div>
      </div>
      <div className="wm-art-float wm-art-qr">
        <ScanLine size={22} />
        <div>
          <b>Xác minh QR</b>
          <small>Kệ + Lô · Khớp thông tin</small>
        </div>
      </div>
    </div>
  )
}
