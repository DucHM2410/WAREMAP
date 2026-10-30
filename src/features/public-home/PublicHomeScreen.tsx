import { ArrowRight, ArrowUpRight, Check } from "lucide-react"

import { useEffect, useState } from "react"

import { useApp } from "../../app/store"

import { PublicHeader, PublicFooter, pageHashes } from "./PublicChrome"

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

  const current = content.pages[page]

  const industryHero = page === "mom" || page === "cosmetics"

  return (
    <div className={`wm-site ${embedded ? "wm-site-embedded" : ""}`}>
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
            <EditableImage src={current.image} alt={current.imageAlt} />
          </div>
        </section>
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
