import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"

import { useState } from "react"

import { Brand } from "../../app/ui"

import type { PublicPage, SiteContent } from "../site-content/types"

import "./public-site.css"

export const pageHashes: Record<PublicPage, string> = {
  home: "trang-chu",
  solution: "gioi-thieu",
  mom: "me-va-be",
  cosmetics: "my-pham",
}

type ChromeProps = {
  navigate: (page: PublicPage, section?: string) => void

  onRegister: () => void

  onLogin: () => void
}

export function PublicHeader({
  navigate: onNavigate,
  onRegister,
  onLogin,
  page,
}: ChromeProps & { page?: PublicPage }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = (next: PublicPage, section?: string) => {
    setMobileOpen(false)
    onNavigate(next, section)
  }

  return (
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
              className={page === "mom" || page === "cosmetics" ? "active" : ""}
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
          <button onClick={() => navigate("home", "pricing")}>Bảng giá</button>
          <button onClick={() => navigate("home", "support")}>Hướng dẫn</button>
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
  )
}

export function PublicFooter({
  content,
  navigate,
  onRegister,
  onLogin,
  onDemo,
}: ChromeProps & {
  content: SiteContent
  onDemo: () => void
}) {
  return (
    <footer className="wm-footer">
      <div className="wm-footer-main">
        <div className="wm-footer-brand">
          <button className="wm-brand-button" onClick={() => navigate("home")}>
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
          <button onClick={() => navigate("home", "pricing")}>Bảng giá</button>
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
        <span>© {new Date().getFullYear()} WareMap. All rights reserved.</span>
        <span>Bản trải nghiệm · Dữ liệu lưu trên trình duyệt</span>
      </div>
    </footer>
  )
}
