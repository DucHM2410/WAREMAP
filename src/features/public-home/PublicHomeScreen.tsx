import { ArrowRight, ArrowUpRight, Check, Pause, Play, MapPin, ScanLine, Truck } from "lucide-react"

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
import { WarehouseShowcase } from "./WarehouseShowcase"

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
            {page === "home" || page === "solution" ? <WarehouseShowcase notification={page === "home"}/> : <EditableImage src={current.image} alt={current.imageAlt} priority />}
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
            .wm-value-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:28px}.wm-value-card{display:flex;flex-direction:column;text-align:left;border:1px solid #e2e8f0;border-radius:15px;padding:24px;background:#fff;box-shadow:0 2px 4px #18354303}.wm-value-card p{font-size:13px;line-height:1.8;color:#64748b;margin:0 0 20px}.wm-value-card h3{font-size:19px;color:#192c45;line-height:1.5;margin:14px 0 10px}.wm-value-card .wm-value-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:#eaf3ff;color:#0b57c7}.wm-value-card .wm-value-problem{font-size:11px;color:#64748b;margin-top:14px}.wm-value-card .wm-value-flow{margin-top:auto;padding:12px;background:#f5f9ff;border-radius:9px;color:#334155;font-size:12px;line-height:1.9;border:1px solid #e5edf7}.wm-value-card .wm-value-flow b{font-size:10px;display:block;color:#64748b;font-weight:500}.wm-advisor-note{font-size:12px;margin-top:20px}
            @media(max-width:700px){.wm-value-grid{grid-template-columns:1fr}.wm-site .wm-zalo-preview{position:relative;right:auto;bottom:auto;max-width:none;margin:12px 0}.wm-advisor-section{padding-block:32px}}
          `}</style>
          <section className="wm-section wm-advisor-section" aria-labelledby="wm-value-title" style={{textAlign:"center"}}>
            <span className="wm-eyebrow">VẬN HÀNH CÙNG WAREMAP</span>
            <h2 id="wm-value-title">Từ tìm hàng đến nhập kệ và chuyển kho</h2>
            <p style={{marginInline:"auto"}}>Ba công việc quen thuộc, được kết nối bằng vị trí lưu trữ và thông tin lô hàng.</p>
            <div className="wm-value-grid">
              {[{icon:MapPin,problem:"Khó tìm đúng hàng, đúng lô",title:"Định vị lô trên Kho 3D",description:"Tìm theo tên, SKU hoặc mã lô. Bản đồ đưa bạn đến ô chứa hàng, kèm tồn kho và hạn sử dụng của lô đang chọn.",flow:"Tìm lô → Kệ → Tầng → Ô"},{icon:ScanLine,problem:"Dễ đặt nhầm hàng vào vị trí",title:"Quét & nhập hàng lên kệ",description:"Quét QR vị trí, quét hoặc nhập mã thùng, rồi kiểm tra thông tin và xác nhận nhập. Hàng cùng ô được phân biệt theo mã và lô.",flow:"Vị trí → Mã thùng → Xác nhận"},{icon:Truck,problem:"Khó nắm tình trạng hàng chuyển",title:"Theo dõi phiếu chuyển kho",description:"Xem kho xuất, kho nhận và tiến trình của từng phiếu. Xác minh giao nhận bằng QR; ghi nhận chênh lệch hoặc sự cố cùng người xử lý.",flow:"Tạo phiếu → Giao hàng → Kiểm nhận"}].map(({icon:Icon,...value})=><article className="wm-value-card" key={value.title}><span className="wm-value-icon"><Icon size={21}/></span><span className="wm-value-problem">{value.problem}</span><h3>{value.title}</h3><p>{value.description}</p><div className="wm-value-flow"><b>QUY TRÌNH TRONG HỆ THỐNG</b>{value.flow}</div></article>)}
            </div>
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
