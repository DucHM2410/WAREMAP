import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Box,
  Boxes,
  ChevronDown,
  Clock,
  KeyRound,
  Layers,
  LayoutGrid,
  Map,
  MapPin,
  PackageSearch,
  QrCode,
  ScanLine,
  Search,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react"

import { Fragment, useEffect, useRef, useState } from "react"

import type { ContentSection } from "../site-content/types"

import { PricingSection } from "./PricingSection"

import { EditableImage } from "./SiteImage"

const icons = [MapPin, PackageSearch, Layers, ShieldCheck, Truck, ScanLine]

const solutionIcons = [Search, Map, KeyRound, Boxes]

const flowIcons = [Clock, MapPin, Box, Search]

const valueIcons = [Search, LayoutGrid, QrCode, Users]

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

  const isIndustryNeeds = s.id === "industry-needs"

  const heading = (
    <div className="wm-section-head">
      {s.eyebrow && (
        <span
          className={`wm-eyebrow ${
            s.id === "challenges" || isIndustryNeeds ? "wm-eyebrow-boxed" : ""
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
        <div className="wm-cta-panel">
          {s.eyebrow && <span className="wm-eyebrow">{s.eyebrow}</span>}
          <h2>{s.title}</h2>
          {s.description && <p>{s.description}</p>}
          <button className="wm-btn wm-cta-btn" onClick={onTrial}>
            {ctaLabel}
          </button>
        </div>
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
      <PricingSection section={s} onRegister={onRegister} onTrial={onTrial} />
    )

  if (s.id === "what-is-waremap")
    return (
      <section id={s.id} className="wm-section wm-intro">
        <div className="wm-intro-copy">
          {s.eyebrow && <span className="wm-pill">{s.eyebrow}</span>}
          <h2>{s.title}</h2>
          {s.description

            .split(/\n\s*\n/)

            .map((paragraph) => paragraph.trim())

            .filter(Boolean)

            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
        <div className="wm-intro-visual">
          <EditableImage src={s.image} alt={s.imageAlt} compact />
        </div>
      </section>
    )

  if (s.id === "solution-problems")
    return (
      <section id={s.id} className="wm-section wm-problems">
        <div className="wm-problems-main">
          <div className="wm-problems-copy">
            {s.eyebrow && <span className="wm-pill">{s.eyebrow}</span>}
            <h2>{s.title}</h2>
            {s.description

              .split(/\n\s*\n/)

              .map((paragraph) => paragraph.trim())

              .filter(Boolean)

              .map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
          </div>
          <div className="wm-problems-visual">
            <EditableImage src={s.image} alt={s.imageAlt} compact />
          </div>
        </div>
        <div className="wm-problems-flow">
          {s.cards.map((c, i) => {
            const Icon = flowIcons[i % flowIcons.length]

            return (
              <Fragment key={i}>
                {i > 0 && (
                  <span className="wm-flow-arrow" aria-hidden="true">
                    <ArrowDown size={18} />
                  </span>
                )}
                <article
                  className={
                    i === s.cards.length - 1 ? "is-highlight" : undefined
                  }
                >
                  <span className="wm-problems-icon">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </article>
              </Fragment>
            )
          })}
        </div>
      </section>
    )

  if (s.id === "solution-value")
    return (
      <section id={s.id} className="wm-section wm-value">
        <div className="wm-value-box">
          <div className="wm-value-head">
            {s.eyebrow && <span className="wm-eyebrow">{s.eyebrow}</span>}
            <h2>{s.title}</h2>
            {s.description

              .split(/\n\s*\n/)

              .map((paragraph) => paragraph.trim())

              .filter(Boolean)

              .map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
          </div>
          <div className="wm-value-grid">
            {s.cards.map((c, i) => {
              const Icon = valueIcons[i % valueIcons.length]

              return (
                <article key={i}>
                  <span className="wm-value-icon">
                    <Icon size={24} />
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </article>
              )
            })}
          </div>
          <div className="wm-value-image">
            <EditableImage src={s.image} alt={s.imageAlt} compact />
          </div>
        </div>
      </section>
    )

  if (s.id === "industry-solution") {
    const paragraphs = s.description
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    return (
      <section id={s.id} className="wm-section wm-industry-solution">
        <div className="wm-industry-solution-box">
          {s.eyebrow && <span className="wm-eyebrow">{s.eyebrow}</span>}
          <div className="wm-industry-solution-grid">
            <div className="wm-industry-solution-visual">
              <EditableImage src={s.image} alt={s.imageAlt} compact />
            </div>
            <div className="wm-industry-solution-copy">
              <h2>{s.title}</h2>
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <div className="wm-industry-solution-actions">
                <button className="wm-btn wm-btn-primary" onClick={onTrial}>
                  {ctaLabel}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (s.id === "industry-features") {
    const paragraphs = s.description
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    const featureIcons = [MapPin, ShieldCheck, Clock, Truck]

    return (
      <section id={s.id} className="wm-section wm-industry-features">
        <div className="wm-industry-features-body">
          <div className="wm-industry-features-copy">
            {s.eyebrow && <span className="wm-eyebrow">{s.eyebrow}</span>}
            <h2>{s.title}</h2>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <div className="wm-industry-features-grid">
              {s.cards.map((c, i) => {
                const Icon = featureIcons[i % featureIcons.length]

                return (
                  <article key={i}>
                    <div className="wm-industry-features-card-head">
                      <span className="wm-icon">
                        <Icon size={20} />
                      </span>
                      <h3>{c.title}</h3>
                    </div>
                    <p>{c.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
          <div className="wm-industry-features-visual">
            <EditableImage src={s.image} alt={s.imageAlt} compact />
          </div>
        </div>
      </section>
    )
  }

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

  if (s.id === "industry-value")
    return (
      <section id={s.id} className="wm-section wm-industry-value">
        <div className="wm-industry-value-box">
          {heading}
          <div className="wm-card-grid">
            {s.cards.map((c, i) => (
              <article key={i}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    )

  return (
    <section
      id={s.id}
      className={`wm-section wm-${s.layout} ${
        s.id === "challenges" ? "wm-challenges" : ""
      } ${isIndustryNeeds ? "wm-industry-needs" : ""}`}
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
              {!isIndustryNeeds &&
                s.id !== "challenges" &&
                s.layout !== "support" && (
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
