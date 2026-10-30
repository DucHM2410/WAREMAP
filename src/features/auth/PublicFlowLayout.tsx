import type { ReactNode } from "react"

import { ArrowLeft } from "lucide-react"

import { useApp } from "../../app/store"

import {
  PublicHeader,
  PublicFooter,
  pageHashes,
} from "../public-home/PublicChrome"

import { useSiteContent } from "../site-content/SiteContentContext"

import type { PublicPage } from "../site-content/types"

import "./public-flow.css"

export function PublicFlowLayout({
  current,

  experienceParent = false,

  children,
}: {
  current: string

  experienceParent?: boolean

  children: ReactNode
}) {
  const { go, startGuest, setRequestedPlan } = useApp()

  const { content } = useSiteContent()

  const navigate = (page: PublicPage, section?: string) => {
    history.replaceState(null, "", `#${section || pageHashes[page]}`)

    go("home")
  }

  const onRegister = () => {
    setRequestedPlan("free")
    go("request")
  }

  return (
    <div className="wm-site public-flow">
      <PublicHeader
        navigate={navigate}
        onRegister={onRegister}
        onLogin={() => go("login")}
      />
      <main id="main-content" className="public-flow-main">
        <nav
          className="public-flow-breadcrumb"
          aria-label="Đường dẫn điều hướng"
        >
          <ol>
            <li>
              <button onClick={() => go("home")}>Trang chủ</button>
            </li>
            <li aria-hidden="true">/</li>
            {experienceParent && (
              <>
                <li>
                  <button onClick={() => go("trial-info")}>
                    Trải nghiệm WareMap
                  </button>
                </li>
                <li aria-hidden="true">/</li>
              </>
            )}
            <li aria-current="page">{current}</li>
          </ol>
        </nav>
        {children}
      </main>
      <PublicFooter
        content={content}
        navigate={navigate}
        onRegister={onRegister}
        onLogin={() => go("login")}
        onDemo={() => startGuest("explore")}
      />
    </div>
  )
}

export function PublicFlowHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  const { goBack } = useApp()

  return (
    <header className="public-flow-intro">
      <span className="eyebrow">{eyebrow}</span>
      <div className="public-flow-title-row">
        <h1>{title}</h1>
        <button className="public-flow-back" onClick={goBack}>
          <ArrowLeft size={16} />
          Quay lại
        </button>
      </div>
      <p>{description}</p>
    </header>
  )
}
