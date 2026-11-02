import { ArrowRight, ArrowUpRight, Check, Pause, Play } from "lucide-react"

import { useEffect, useState } from "react"

import { useApp } from "../../app/store"

import { PublicHeader, PublicFooter, pageHashes } from "./PublicChrome"

import { useSiteContent } from "../site-content/SiteContentContext"

import type { PublicPage, SiteContent } from "../site-content/types"

import { EditableImage } from "./SiteImage"

import { SiteSection } from "./SiteSection"

import "./public-site.css"
import { withSitePhotos } from "./sitePhotos"
import { useSiteMotion } from "./useSiteMotion"
import "./site-motion.css"
import warehouseScreen from "../../assets/site-photos/waremap-3d-screen.png"

export function MiniMap({ highlight = "A2" }: { highlight?: string }) {
  return (
    <div
      className="rack-mini"
      aria-label={`Sơ đồ minh họa, kệ ${highlight} được đánh dấu`}
    >
      {["A1", "A2", "A3"].map((id) => (
        <div
          key={id}
          className={`rack-drawing ${highlight === id ? "highlight" : ""}`}
        >
          <span>{id}</span>
          <i />
          <i />
          <i />
        </div>
      ))}
    </div>
  )
}

const accentPhrase = "bản đồ 3D"

function renderTitle(title: string) {
  const index = title.indexOf(accentPhrase)

  if (index === -1) return title

  return (
    <>
      {title.slice(0, index)}
      <span className="wm-title-accent">{accentPhrase}</span>
      {title.slice(index + accentPhrase.length)}
    </>
  )
}

export function PublicSite({
  content,

  initialPage = "home",

  embedded = false,

  onRegister = () => {},

  onLogin = () => {},

  onDemo = () => {},

  onTrial = () => {},
}: {
  content: SiteContent

  initialPage?: PublicPage

  embedded?: boolean

  onRegister?: (plan?: "free" | "single" | "chain") => void

  onLogin?: () => void

  onDemo?: () => void

  onTrial?: () => void
}) {
  const [page, setPage] = useState<PublicPage>(initialPage)
  const [motionPaused, setMotionPaused] = useState(false)
  const siteRef = useSiteMotion(page, motionPaused, embedded)

  useEffect(() => {
    setPage(initialPage)
  }, [initialPage])

  useEffect(() => {
    if (embedded) return

    const handler = () => {
      const hash = location.hash.slice(1)

      const found = (Object.keys(pageHashes) as PublicPage[]).find(
        (key) => pageHashes[key] === hash,
      )

      if (found) {
        setPage(found)

        window.scrollTo({ top: 0 })
      } else if (["pricing", "support", "faq", "features"].includes(hash)) {
        setPage("home")

        requestAnimationFrame(() =>
          document.getElementById(hash)?.scrollIntoView(),
        )
      }
    }

    handler()

    window.addEventListener("hashchange", handler)

    return () => window.removeEventListener("hashchange", handler)
  }, [embedded])

  const navigate = (next: PublicPage, section?: string) => {
    setPage(next)

    if (!embedded)
      history.pushState(null, "", `#${section || pageHashes[next]}`)

    requestAnimationFrame(() => {
      if (section)
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
      else if (!embedded) window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  const current = withSitePhotos(content.pages[page], page)

  const industryHero = page === "mom" || page === "cosmetics"

  return (
    <div ref={siteRef} className={`wm-site wm-photo-site ${embedded ? "wm-site-embedded" : ""}`} data-motion={motionPaused || embedded ? "paused" : "on"}>
      <PublicHeader
        page={page}
        navigate={navigate}
        onRegister={() => onRegister()}
        onLogin={onLogin}
      />
      <main id={embedded ? undefined : "main-content"}>
        <section
          className={`wm-section wm-hero ${
            page === "home" ? "wm-hero-home" : "wm-hero-subpage"
          } ${industryHero ? "wm-hero-industry" : ""} ${
            page === "solution" ? "wm-hero-solution" : ""
          }`}
        >
          <div className="wm-hero-copy">
            {industryHero ? (
              <span className="wm-eyebrow">{current.eyebrow}</span>
            ) : (
              <span className="wm-pill">
                <i />
                {current.eyebrow}
              </span>
            )}
            <h1>{renderTitle(current.title)}</h1>
            {industryHero ? (
              current.description

                .split(/\n\s*\n/)

                .map((paragraph) => paragraph.trim())

                .filter(Boolean)

                .map((paragraph, i) => <p key={i}>{paragraph}</p>)
            ) : (
              <p>{current.description}</p>
            )}
            <div className="wm-hero-actions">
              <button className="wm-btn wm-btn-primary" onClick={onTrial}>
                {content.ctaLabel}
                <ArrowRight size={18} />
              </button>
              {!industryHero && page !== "solution" && (
                <button className="wm-btn wm-btn-outline" onClick={onDemo}>
                  Khám phá kho 3D
                  <ArrowUpRight size={17} />
                </button>
              )}
            </div>
            {!industryHero && (
              <div className="wm-hero-assurance">
                <span>
                  <Check size={15} />
                  Không cần cài đặt
                </span>
                <span>
                  <Check size={15} />
                  Kho mẫu chỉ xem · Có giới hạn
                </span>
              </div>
            )}
          </div>
          <div className="wm-hero-art">
            <EditableImage src={page === "home" ? warehouseScreen : current.image} alt={page === "home" ? "Bản đồ kho 3D WareMap với kệ và vị trí sản phẩm" : current.imageAlt} priority />
            {page === "home" && <aside className="wm-zalo-preview" aria-label="Minh họa cảnh báo Zalo">
              <strong>Zalo Alert <small>Minh họa</small></strong>
              <p>Lô sữa tại Kệ A2 sắp hết hạn.</p>
              <span>Kiểm tra vị trí trên WareMap →</span>
            </aside>}
            {!embedded && (
              <button className="wm-motion-toggle" onClick={() => setMotionPaused(!motionPaused)} aria-pressed={motionPaused}>
                {motionPaused ? <Play size={12} /> : <Pause size={12} />}
                {motionPaused ? "Bật hiệu ứng" : "Tắt hiệu ứng"}
              </button>
            )}
          </div>
        </section>
        {page === "home" && <>
          <style>{`
            .wm-site .wm-zalo-preview{position:absolute;right:16px;bottom:62px;max-width:260px;padding:18px;background:white;border:1px solid #dbeafe;border-radius:16px;box-shadow:0 16px 40px #192c4520;color:#192c45}
            .wm-zalo-preview strong{color:#0876dd}.wm-zalo-preview small{font-weight:400;color:#64748b;margin-left:8px}.wm-zalo-preview p{font-size:14px;margin:8px 0}.wm-zalo-preview span{font-size:12px}
            .wm-advisor-section{padding-block:56px}.wm-advisor-section h2{font-size:clamp(24px,3vw,36px);margin:12px 0}.wm-advisor-section>p{color:#64748b;max-width:760px;line-height:1.8}
            .wm-partner-grid,.wm-value-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:28px}.wm-partner-card,.wm-value-card{border:1px solid #e2e8f0;border-radius:18px;padding:28px;background:#fff}.wm-partner-card svg{width:155px;height:42px;max-width:100%}.wm-partner-card p,.wm-value-card p{font-size:14px;line-height:1.7;color:#64748b}.wm-value-card strong{display:block;font-size:22px;color:#0b57c7;margin:14px 0}.wm-value-card span{color:#64748b}.wm-advisor-note{font-size:12px;margin-top:20px}
            @media(max-width:700px){.wm-partner-grid,.wm-value-grid{grid-template-columns:1fr}.wm-site .wm-zalo-preview{position:relative;right:auto;bottom:auto;max-width:none;margin:12px 0}.wm-advisor-section{padding-block:32px}}
          `}</style>
          <section className="wm-section wm-advisor-section" aria-labelledby="wm-partner-title">
            <span className="wm-eyebrow">CHUYỂN ĐỔI SỐ TỪ QUY TRÌNH SẴN CÓ</span>
            <h2 id="wm-partner-title">Tích hợp sâu với hệ sinh thái hiện có</h2>
            <p>Không thay thế POS của bạn, mà là lớp quản lý kho 3D bổ trợ.</p>
            <div className="wm-partner-grid">
              {[{name:"KiotViet",color:"#16a34a",text:"Định hướng đồng bộ danh mục và tồn kho từ POS."},{name:"Sapo",color:"#0089ff",text:"Định hướng kết nối luồng bán hàng với vị trí lưu trữ."},{name:"Zalo OA",color:"#0068ff",text:"Định hướng gửi cảnh báo lô cận hạn đến người phụ trách."}].map(partner=><article className="wm-partner-card" key={partner.name}>
                <svg role="img" aria-label={partner.name} viewBox="0 0 180 48"><text x="0" y="35" fill={partner.color} fontSize="32" fontWeight="800" fontFamily="sans-serif">{partner.name}</text></svg>
                <p>{partner.text}</p>
              </article>)}
            </div>
            <p className="wm-advisor-note">Hệ sinh thái tích hợp dự kiến · Chưa có kết nối API trực tiếp hoặc xác nhận đối tác thương mại. Logo chữ dùng để nhận diện nền tảng.</p>
          </section>
          <section className="wm-section wm-advisor-section" aria-labelledby="wm-value-title">
            <span className="wm-eyebrow">TỪ VẤN ĐỀ ĐẾN QUY TRÌNH CỤ THỂ</span>
            <h2 id="wm-value-title">Bài toán thực tế đã giải quyết</h2>
            <div className="wm-value-grid">
              {[{before:"Tìm hàng 5 phút",after:"Còn 30 giây",description:"Tìm mã hàng → định vị đúng kệ, tầng và ô trong 3D."},{before:"Đếm kho thủ công",after:"Đối soát QR 2 chiều, lệch 0%",description:"Quét vị trí và mã lô; ghi nhận chênh lệch để quản lý xử lý."},{before:"Thất lạc hàng đi đường",after:"Theo dõi In-transit minh bạch",description:"Theo dõi phiếu từ lúc tạo đến kiểm nhận, kèm lịch sử và người phụ trách."}].map(value=><article className="wm-value-card" key={value.before}><span>{value.before}</span><strong>→ {value.after}</strong><p>{value.description}</p></article>)}
            </div>
            <p className="wm-advisor-note">30 giây và lệch 0% là mục tiêu minh họa cho quy trình, chưa phải kết quả đo lường hoặc cam kết. Hiệu quả phụ thuộc dữ liệu vị trí, thiết bị và cách vận hành.</p>
          </section>
        </>}
        {page !== "home" && (
          <section
            className="wm-metrics wm-section"
            aria-label="Mục tiêu giá trị giải pháp"
          >
            <div className="wm-metrics-box">
              <div>
                <b>100%</b>
                <span>Định vị chính xác</span>
              </div>
              <div>
                <b>Giảm 50%</b>
                <span>Thời gian tìm hàng</span>
              </div>
              <div>
                <b>Tăng 30%</b>
                <span>Hiệu suất vận hành</span>
              </div>
              <div>
                <b>Hạn chế 99%</b>
                <span>Nhầm lẫn hàng hóa</span>
              </div>
            </div>
          </section>
        )}
        {current.sections.map((s) => (
          <SiteSection
            key={`${page}-${s.id}`}
            section={s}
            ctaLabel={content.ctaLabel}
            onRegister={onRegister}
            onTrial={onTrial}
            onDemo={onDemo}
          />
        ))}
      </main>
      <PublicFooter
        content={content}
        navigate={navigate}
        onRegister={() => onRegister()}
        onLogin={onLogin}
        onDemo={onDemo}
      />
    </div>
  )
}

export default function PublicHome() {
  const { go, startGuest, setRequestedPlan } = useApp()

  const { content } = useSiteContent()

  return (
    <PublicSite
      content={content}
      onRegister={(plan = "free") => {
        setRequestedPlan(plan)

        go("request")
      }}
      onLogin={() => go("login")}
      onTrial={() => go("trial-info")}
      onDemo={() => startGuest("explore")}
    />
  )
}
