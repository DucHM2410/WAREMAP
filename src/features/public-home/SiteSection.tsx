import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  KeyRound,
  Layers,
  Map,
  MapPin,
  PackageSearch,
  ScanLine,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react"

import { useEffect, useRef, useState } from "react"

import { money, policy } from "../../app/model"

import type { ContentSection } from "../site-content/types"

import { EditableImage } from "./SiteImage"

const icons = [MapPin, PackageSearch, Layers, ShieldCheck, Truck, ScanLine]

const solutionIcons = [Search, Map, KeyRound, Boxes]

export function SiteSection({
  section: s,

  ctaLabel,

  onRegister,

  onDemo,
  onTrial,
}: {
  section: ContentSection

  ctaLabel: string

  onRegister: (plan?: "free" | "single" | "chain") => void

  onDemo: () => void
  onTrial: () => void
}) {
  const [slide, setSlide] = useState(0)

  const [paused, setPaused] = useState(false)

  const carousel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      s.layout !== "support" ||
      paused ||
      s.cards.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return

    const timer = window.setInterval(
      () => setSlide((value) => (value + 1) % s.cards.length),

      6000,
    )

    return () => window.clearInterval(timer)
  }, [s.layout, s.cards.length, paused])

  useEffect(() => {
    const container = carousel.current

    const card = container?.children[slide] as HTMLElement | undefined

    if (container && card && container.scrollWidth > container.clientWidth)
      container.scrollTo({
        left:
          card.offsetLeft - (container.children[0] as HTMLElement).offsetLeft,

        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      })
  }, [slide])

  if (!s.visible) return null

  const heading = (
    <div className="wm-section-head">
      {s.eyebrow && (
        <span
          className={`wm-eyebrow ${
            s.id === "challenges" ? "wm-eyebrow-boxed" : ""
          }`}
        >
          {s.eyebrow}
        </span>
      )}
      <h2>{s.title}</h2>
      {s.description && <p>{s.description}</p>}
    </div>
  )

  if (s.layout === "cta")
    return (
      <section id={s.id} className="wm-section wm-cta">
        <div>
          <span className="wm-eyebrow">{s.eyebrow}</span>
          <h2>{s.title}</h2>
          <p>{s.description}</p>
        </div>
        <button className="wm-btn wm-btn-white" onClick={onTrial}>
          {ctaLabel}
          <ArrowRight size={18} />
        </button>
      </section>
    )

  if (s.layout === "faq")
    return (
      <section id={s.id} className="wm-section wm-faq">
        {heading}
        <div>
          {s.cards.map((c, i) => (
            <details key={i}>
              <summary>
                {c.title}
                <ChevronDown size={19} />
              </summary>
              <p>{c.text}</p>
            </details>
          ))}
        </div>
      </section>
    )

  if (s.layout === "features" && s.id === "features")
    return (
      <section id={s.id} className="wm-section wm-feature-showcase">
        {heading}
        <div className="wm-card-grid wm-feature-grid">
          {s.cards.map((c, i) => (
            <article key={i}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
        <div className="wm-showcase-art">
          <EditableImage src={s.image} alt={s.imageAlt} compact />
        </div>
      </section>
    )

  if (s.layout === "features" && s.id === "warehouse-solution")
    return (
      <section id={s.id} className="wm-section wm-solution">
        {heading}
        <div className="wm-solution-body">
          <div className="wm-solution-cards">
            {s.cards.map((c, i) => {
              const Icon = solutionIcons[i % solutionIcons.length]

              return (
                <article key={i}>
                  <div className="wm-solution-card-head">
                    <span className="wm-icon">
                      <Icon size={22} />
                    </span>
                    <h3>{c.title}</h3>
                  </div>
                  <p>{c.text}</p>
                </article>
              )
            })}
          </div>
          <div className="wm-solution-visual">
            <EditableImage src={s.image} alt={s.imageAlt} compact />
          </div>
        </div>
      </section>
    )

  if (s.layout === "pricing")
    return (
      <section id={s.id} className="wm-section wm-pricing">
        {heading}
        <div className="wm-pricing-grid">
          {s.cards.map((c, i) => (
            <article key={i} className={i === 1 ? "is-featured" : ""}>
              {i === 1 && <span className="wm-popular">DÀNH CHO CỬA HÀNG</span>}
              <h3>{["Free Trial", "Đơn lẻ", "Chuỗi"][i] ?? c.title}</h3>
              <p>{["Trải nghiệm vận hành một cơ sở trong 7 ngày.", "Dành cho cửa hàng có một cơ sở.", "Dành cho chuỗi có tối đa 5 cơ sở trong gói cơ bản."][i] ?? c.text}</p>
              <div className="wm-price">
                {money([0, policy.single, policy.chain][i] ?? 0)}
                <small>{i === 0 ? "/ 7 ngày" : "/ tháng"}</small>
              </div>
              <ul>
                {(i === 0
                  ? [
                      "1 cơ sở · 1 Chủ doanh", "1 Quản lý kho + 3 Nhân viên",

                      "3D Builder, QR Kệ & QR Lô",

                      "Nhập xuất, kiểm kê, lô hàng & FEFO",
                    ]
                  : i === 1
                    ? [
                        "1 cơ sở · 1 Chủ doanh", "1 Quản lý kho + 3 Nhân viên",

                        "Thiết kế kho 3D & QR vị trí",

                        "Theo dõi lô, hạn dùng & FEFO",

                        "Phân quyền theo vai trò",
                      ]
                    : [
                        "Tối đa 5 cơ sở · 1 Chủ doanh", "3 Quản lý kho + 15 Nhân viên",

                        "Toàn bộ tính năng Một cơ sở",

                        "Theo dõi hàng đi đường",

                        "Đối soát chuyển kho",
                      ]
                )

                  .map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      {item}
                    </li>
                  ))}
              </ul>
              <button
                className={`wm-btn ${
                  i === 1 ? "wm-btn-primary" : "wm-btn-outline"
                }`}
                onClick={() => onRegister(i === 0 ? "free" : i === 1 ? "single" : "chain")}
              >
                {i === 0 ? "Đăng ký dùng thử" : "Đăng ký gói này"}
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>
        <p className="wm-pricing-note">
          Mở rộng cơ sở: {money(policy.branchBlock)}/tháng cho mỗi block 2 cơ sở, chỉ gói Chuỗi. Thêm 2 tài khoản: {money(policy.accountBlock)} một lần; Chủ doanh phân quyền Quản lý kho hoặc Nhân viên. Bản demo không thu phí.
        </p>
      </section>
    )

  if (s.layout === "split" || s.layout === "features")
    return (
      <section
        id={s.id}
        className={`wm-section wm-split ${
          s.layout === "features" ? "wm-split-features" : ""
        }`}
      >
        <div className="wm-split-visual">
          <EditableImage src={s.image} alt={s.imageAlt} compact />
        </div>
        <div>
          {heading}
          <div className="wm-feature-list">
            {s.cards.map((c, i) => {
              const Icon = icons[i % icons.length]

              return (
                <article key={i}>
                  <span className="wm-icon">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </article>
              )
            })}
          </div>
          <button className="wm-text-link" onClick={onDemo}>
            Khám phá kho 3D
            <ArrowUpRight size={17} />
          </button>
        </div>
      </section>
    )

  return (
    <section
      id={s.id}
      className={`wm-section wm-${s.layout} ${
        s.id === "challenges" ? "wm-challenges" : ""
      }`}
    >
      {heading}
      <div
        ref={s.layout === "support" ? carousel : undefined}
        className={`wm-card-grid ${
          s.layout === "categories" ? "wm-category-grid" : ""
        }`}
      >
        {s.cards.map((c, i) => {
          const Icon = icons[i % icons.length]

          return (
            <article
              className={
                s.layout === "support" && i === slide ? "is-current" : ""
              }
              key={i}
            >
              {s.id !== "challenges" && s.layout !== "support" && (
                <span className="wm-icon">
                  <Icon size={23} />
                </span>
              )}
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {s.layout === "support" && (
                <button className="wm-text-link" onClick={() => onRegister()}>
                  Tìm hiểu thêm
                  <ArrowRight size={15} />
                </button>
              )}
            </article>
          )
        })}
      </div>
      {s.layout === "support" && (
        <div className="wm-slide-controls" aria-label="Chọn nội dung hỗ trợ">
          {s.cards.map((c, i) => (
            <button
              key={i}
              aria-label={`Xem ${c.title}`}
              aria-pressed={slide === i}
              onClick={() => setSlide(i)}
              className={slide === i ? "active" : ""}
            />
          ))}
          <button
            className="wm-carousel-pause"
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Tiếp tục tự chuyển" : "Tạm dừng tự chuyển"}
          </button>
        </div>
      )}
      {s.image && (
        <div className="wm-section-image">
          <EditableImage src={s.image} alt={s.imageAlt} />
        </div>
      )}
    </section>
  )
}
