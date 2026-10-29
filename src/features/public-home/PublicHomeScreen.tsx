import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"

import { useEffect, useState } from "react"

import { useApp } from "../../app/store"

import { Brand } from "../../app/ui"

import { useSiteContent } from "../site-content/SiteContentContext"

import type { PublicPage, SiteContent } from "../site-content/types"

import { EditableImage } from "./SiteImage"

import { SiteSection } from "./SiteSection"

import "./public-site.css"

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

const pageHashes: Record<PublicPage, string> = {
  home: "trang-chu",

  solution: "gioi-thieu",

  mom: "me-va-be",

  cosmetics: "my-pham",
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

  const [mobileOpen, setMobileOpen] = useState(false)

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

    setMobileOpen(false)

    if (!embedded)
      history.pushState(null, "", `#${section || pageHashes[next]}`)

    requestAnimationFrame(() => {
      if (section)
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
      else if (!embedded) window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  const current = content.pages[page]

  return (
    <div className={`wm-site ${embedded ? "wm-site-embedded" : ""}`}>
      <header className="wm-header">
        <div className="wm-nav-wrap">
          <button
            className="wm-brand-button"
            aria-label="WareMap — Trang chủ"
            onClick={() => navigate("home")}
          >
            <Brand />
          </button>
          <button
            className="wm-menu-toggle"
            aria-label={mobileOpen ? "Đóng điều hướng" : "Mở điều hướng"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
          <nav
            className={mobileOpen ? "is-open" : ""}
            aria-label="Điều hướng website"
          >
            <button
              className={page === "solution" ? "active" : ""}
              onClick={() => navigate("solution")}
            >
              Giới thiệu
            </button>
            <details className="wm-industry-menu">
              <summary
                className={
                  page === "mom" || page === "cosmetics" ? "active" : ""
                }
              >
                Ngành hàng
                <ChevronDown size={14} />
              </summary>
              <div>
                <button
                  onClick={(e) => {
                    navigate("mom")

                    e.currentTarget.closest("details")?.removeAttribute("open")
                  }}
                >
                  Mẹ & Bé
                </button>
                <button
                  onClick={(e) => {
                    navigate("cosmetics")

                    e.currentTarget.closest("details")?.removeAttribute("open")
                  }}
                >
                  Mỹ phẩm & Chăm sóc cá nhân
                </button>
              </div>
            </details>
            <button onClick={() => navigate("home", "pricing")}>
              Bảng giá
            </button>
            <button onClick={() => navigate("home", "support")}>
              Hướng dẫn
            </button>
          </nav>
          <div className="wm-nav-actions">
            <button className="wm-login" onClick={onLogin}>
              Đăng nhập
            </button>
            <button
              className="wm-btn wm-btn-primary"
              onClick={() => onRegister()}
            >
              Đăng ký
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </header>
      <main id={embedded ? undefined : "main-content"}>
        <section
          className={`wm-section wm-hero ${
            page === "home" ? "wm-hero-home" : "wm-hero-subpage"
          }`}
        >
          <div className="wm-hero-copy">
            <span className="wm-pill">
              <i />
              {current.eyebrow}
            </span>
            <h1>{current.title}</h1>
            <p>{current.description}</p>
            <div className="wm-hero-actions">
              <button
                className="wm-btn wm-btn-primary"
                onClick={onTrial}
              >
                {content.ctaLabel}
                <ArrowRight size={18} />
              </button>
              <button className="wm-btn wm-btn-outline" onClick={onDemo}>
                Khám phá kho 3D
                <ArrowUpRight size={17} />
              </button>
            </div>
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
          </div>
          <div className="wm-hero-art">
            <EditableImage src={current.image} alt={current.imageAlt} />
          </div>
        </section>
        {page !== "home" && (
          <section
            className="wm-metrics wm-section"
            aria-label="Mục tiêu giá trị giải pháp"
          >
            <div>
              <b>01</b>
              <span>Bản đồ kho trực quan</span>
            </div>
            <div>
              <b>3D</b>
              <span>Định vị Kệ – Tầng – Ô</span>
            </div>
            <div>
              <b>FEFO</b>
              <span>Ưu tiên theo hạn dùng</span>
            </div>
            <div>
              <b>QR</b>
              <span>Xác minh vị trí và lô</span>
            </div>
            <p>Giá trị giải pháp · Không phải số liệu hiệu quả đã đo lường</p>
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
      <footer className="wm-footer">
        <div className="wm-footer-main">
          <div className="wm-footer-brand">
            <button
              className="wm-brand-button"
              onClick={() => navigate("home")}
            >
              <Brand />
            </button>
            <p>{content.footerDescription}</p>
            {content.contactEmail && (
              <a href={`mailto:${content.contactEmail}`}>
                {content.contactEmail}
              </a>
            )}
          </div>
          <div>
            <h3>Sản phẩm</h3>
            <button onClick={() => navigate("solution")}>Giới thiệu</button>
            <button onClick={() => navigate("home", "features")}>
              Tính năng
            </button>
            <button onClick={() => navigate("home", "pricing")}>
              Bảng giá
            </button>
          </div>
          <div>
            <h3>Ngành hàng</h3>
            <button onClick={() => navigate("mom")}>Mẹ & Bé</button>
            <button onClick={() => navigate("cosmetics")}>
              Mỹ phẩm & Chăm sóc cá nhân
            </button>
          </div>
          <div>
            <h3>Hỗ trợ</h3>
            <button onClick={() => navigate("home", "support")}>
              Hướng dẫn sử dụng
            </button>
            <button onClick={() => navigate("home", "faq")}>
              Câu hỏi thường gặp
            </button>
            <button onClick={() => onRegister()}>Liên hệ tư vấn</button>
          </div>
          <div>
            <h3>Tài khoản</h3>
            <button onClick={onLogin}>Đăng nhập</button>
            <button onClick={() => onRegister()}>Đăng ký</button>
            <button onClick={onDemo}>Trải nghiệm kho mẫu</button>
          </div>
        </div>
        <div className="wm-footer-bottom">
          <span>
            © {new Date().getFullYear()} WareMap. All rights reserved.
          </span>
          <span>Bản trải nghiệm · Dữ liệu lưu trên trình duyệt</span>
        </div>
      </footer>
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
