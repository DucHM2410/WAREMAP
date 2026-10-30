import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { DEFAULT_SITE_CONTENT } from "./defaultContent"

import { validateContent, type PublicPage, type SiteContent } from "./types"

import bundledContent from "./publishedContent.json"

const baseContent = validateContent(bundledContent)
  ? bundledContent
  : DEFAULT_SITE_CONTENT

const LIVE_KEY = "waremap-website-content-v1"

const DRAFT_KEY = "waremap-website-draft-v1"

const LEGACY_CTA_TITLE = "Một kho ngăn nắp. Một đội ngũ chủ động."

const LEGACY_CTA_TITLE_2 = "WareMap – Giải pháp quản lý kho thông minh"

const LEGACY_SOLUTION_DESCRIPTION =
  "WareMap giúp biến những vị trí khó nhớ thành thông tin rõ ràng. Từ tìm kiếm đến kiểm soát lô hàng, cả đội cùng làm việc trên một sơ đồ dễ hiểu."

const LEGACY_INTRO_DESCRIPTION =
  "Nắm đúng số lượng là chưa đủ. Bạn còn cần biết từng mặt hàng đang ở đâu, thuộc lô nào và nên xử lý thế nào."

const LEGACY_PROBLEMS_DESCRIPTION =
  "Giảm thời gian tìm kiếm và sự phụ thuộc vào trí nhớ của từng nhân viên."

const LEGACY_VALUE_DESCRIPTION = "Một nền tảng để phối hợp công việc trong kho."

const LEGACY_INDUSTRY_SOLUTION_TITLE =
  "Hiểu từng vị trí. Chủ động từng lô hàng."

const LEGACY_INDUSTRY_NEEDS_CARD =
  "Theo dõi rõ từng nhóm hàng và đặc tính bảo quản."

const LEGACY_INDUSTRY_FEATURES_CARD = "Tra cứu nhanh sản phẩm trên bản đồ 3D."

const LEGACY_INDUSTRY_VALUE_CARD =
  "Nhân viên mới dễ làm quen với cách sắp xếp trong kho."

const LEGACY_PRICING_TITLE =
  "Lựa chọn gói dịch vụ phù hợp với nhu cầu quản lý kho"

const currentCta = DEFAULT_SITE_CONTENT.pages.home.sections.find(
  (section) => section.layout === "cta",
)

const currentPricing = DEFAULT_SITE_CONTENT.pages.home.sections.find(
  (section) => section.layout === "pricing",
)

const currentIntro = DEFAULT_SITE_CONTENT.pages.solution.sections.find(
  (section) => section.id === "what-is-waremap",
)

const currentProblems = DEFAULT_SITE_CONTENT.pages.solution.sections.find(
  (section) => section.id === "solution-problems",
)

const currentValue = DEFAULT_SITE_CONTENT.pages.solution.sections.find(
  (section) => section.id === "solution-value",
)

const currentSolutionDescription =
  DEFAULT_SITE_CONTENT.pages.solution.description

const currentMomSolution = DEFAULT_SITE_CONTENT.pages.mom.sections.find(
  (section) => section.id === "industry-solution",
)

const currentCosmeticsSolution =
  DEFAULT_SITE_CONTENT.pages.cosmetics.sections.find(
    (section) => section.id === "industry-solution",
  )

const currentMomNeeds = DEFAULT_SITE_CONTENT.pages.mom.sections.find(
  (section) => section.id === "industry-needs",
)

const currentCosmeticsNeeds =
  DEFAULT_SITE_CONTENT.pages.cosmetics.sections.find(
    (section) => section.id === "industry-needs",
  )

const currentMomFeatures = DEFAULT_SITE_CONTENT.pages.mom.sections.find(
  (section) => section.id === "industry-features",
)

const currentCosmeticsFeatures =
  DEFAULT_SITE_CONTENT.pages.cosmetics.sections.find(
    (section) => section.id === "industry-features",
  )

const currentMomValue = DEFAULT_SITE_CONTENT.pages.mom.sections.find(
  (section) => section.id === "industry-value",
)

const currentCosmeticsValue =
  DEFAULT_SITE_CONTENT.pages.cosmetics.sections.find(
    (section) => section.id === "industry-value",
  )

const syncLegacyCopy = (content: SiteContent): SiteContent => {
  const pages = { ...content.pages }

  let changed = false

  if (currentCta)
    for (const key of Object.keys(pages) as PublicPage[]) {
      const page = pages[key]

      let pageChanged = false

      const sections = page.sections.map((section) => {
        if (
          section.layout !== "cta" ||
          (section.title !== LEGACY_CTA_TITLE &&
            section.title !== LEGACY_CTA_TITLE_2)
        )
          return section

        pageChanged = true

        return {
          ...section,

          eyebrow: currentCta.eyebrow,

          title: currentCta.title,

          description: currentCta.description,
        }
      })

      if (pageChanged) {
        changed = true

        pages[key] = { ...page, sections }
      }
    }

  if (currentIntro && pages.solution) {
    let introChanged = false

    const sections = pages.solution.sections.map((section) => {
      if (
        section.id !== "what-is-waremap" ||
        section.description !== LEGACY_INTRO_DESCRIPTION
      )
        return section

      introChanged = true

      return {
        ...section,

        description: currentIntro.description,

        cards: currentIntro.cards,
      }
    })

    if (introChanged) {
      changed = true

      pages.solution = { ...pages.solution, sections }
    }
  }

  if (currentProblems && pages.solution) {
    let problemsChanged = false

    const sections = pages.solution.sections.map((section) => {
      if (
        section.id !== "solution-problems" ||
        section.description !== LEGACY_PROBLEMS_DESCRIPTION
      )
        return section

      problemsChanged = true

      return {
        ...section,

        eyebrow: currentProblems.eyebrow,

        title: currentProblems.title,

        description: currentProblems.description,

        cards: currentProblems.cards,
      }
    })

    if (problemsChanged) {
      changed = true

      pages.solution = { ...pages.solution, sections }
    }
  }

  if (currentValue && pages.solution) {
    let valueChanged = false

    const sections = pages.solution.sections.map((section) => {
      if (
        section.id !== "solution-value" ||
        section.description !== LEGACY_VALUE_DESCRIPTION
      )
        return section

      valueChanged = true

      return {
        ...section,

        description: currentValue.description,

        cards: currentValue.cards,
      }
    })

    if (valueChanged) {
      changed = true

      pages.solution = { ...pages.solution, sections }
    }
  }

  if (pages.solution?.description === LEGACY_SOLUTION_DESCRIPTION) {
    changed = true

    pages.solution = {
      ...pages.solution,

      description: currentSolutionDescription,
    }
  }

  const industrySolutionSources = [
    { page: "mom" as const, current: currentMomSolution },

    { page: "cosmetics" as const, current: currentCosmeticsSolution },
  ]

  for (const { page: pageKey, current } of industrySolutionSources) {
    if (!current) continue

    let solutionChanged = false

    const sections = pages[pageKey].sections.map((section) => {
      if (
        section.id !== "industry-solution" ||
        section.title !== LEGACY_INDUSTRY_SOLUTION_TITLE
      )
        return section

      solutionChanged = true

      return {
        ...section,

        eyebrow: current.eyebrow,

        title: current.title,

        description: current.description,

        imageAlt: current.imageAlt,

        cards: current.cards,
      }
    })

    if (solutionChanged) {
      changed = true

      pages[pageKey] = { ...pages[pageKey], sections }
    }
  }

  const industryNeedsSources = [
    { page: "mom" as const, current: currentMomNeeds },

    { page: "cosmetics" as const, current: currentCosmeticsNeeds },
  ]

  for (const { page: pageKey, current } of industryNeedsSources) {
    if (!current) continue

    let needsChanged = false

    const sections = pages[pageKey].sections.map((section) => {
      if (
        section.id !== "industry-needs" ||
        section.cards[0]?.text !== LEGACY_INDUSTRY_NEEDS_CARD
      )
        return section

      needsChanged = true

      return {
        ...section,

        eyebrow: current.eyebrow,

        cards: current.cards,
      }
    })

    if (needsChanged) {
      changed = true

      pages[pageKey] = { ...pages[pageKey], sections }
    }
  }

  const industryFeaturesSources = [
    { page: "mom" as const, current: currentMomFeatures },

    { page: "cosmetics" as const, current: currentCosmeticsFeatures },
  ]

  for (const { page: pageKey, current } of industryFeaturesSources) {
    if (!current) continue

    let featuresChanged = false

    const sections = pages[pageKey].sections.map((section) => {
      if (
        section.id !== "industry-features" ||
        section.cards[0]?.text !== LEGACY_INDUSTRY_FEATURES_CARD
      )
        return section

      featuresChanged = true

      return {
        ...section,

        eyebrow: current.eyebrow,

        description: current.description,

        cards: current.cards,
      }
    })

    if (featuresChanged) {
      changed = true

      pages[pageKey] = { ...pages[pageKey], sections }
    }
  }

  const industryValueSources = [
    { page: "mom" as const, current: currentMomValue },

    { page: "cosmetics" as const, current: currentCosmeticsValue },
  ]

  for (const { page: pageKey, current } of industryValueSources) {
    if (!current) continue

    let valueChanged = false

    const sections = pages[pageKey].sections.map((section) => {
      if (
        section.id !== "industry-value" ||
        section.cards[0]?.text !== LEGACY_INDUSTRY_VALUE_CARD
      )
        return section

      valueChanged = true

      return {
        ...section,

        title: current.title,

        cards: current.cards,
      }
    })

    if (valueChanged) {
      changed = true

      pages[pageKey] = { ...pages[pageKey], sections }
    }
  }

  if (currentPricing && pages.home) {
    let pricingChanged = false

    const sections = pages.home.sections.map((section) => {
      if (
        section.layout !== "pricing" ||
        section.title !== LEGACY_PRICING_TITLE
      )
        return section

      pricingChanged = true

      return {
        ...section,

        eyebrow: currentPricing.eyebrow,

        title: currentPricing.title,

        description: currentPricing.description,

        cards: currentPricing.cards,
      }
    })

    if (pricingChanged) {
      changed = true

      pages.home = { ...pages.home, sections }
    }
  }

  return changed ? { ...content, pages } : content
}

const read = (key: string): SiteContent => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) || "null")

    return validateContent(saved) ? syncLegacyCopy(saved) : baseContent
  } catch {
    return baseContent
  }
}

interface SiteContentState {
  content: SiteContent

  readDraft: () => SiteContent

  saveDraft: (content: SiteContent) => void

  apply: (content: SiteContent) => void
}

const Context = createContext<SiteContentState | null>(null)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(() => read(LIVE_KEY))

  useEffect(() => {
    setContent((current) => syncLegacyCopy(current))
  }, [])

  return (
    <Context.Provider
      value={{
        content,

        readDraft: () => read(DRAFT_KEY),

        saveDraft: (draft) => {
          if (!validateContent(draft))
            throw new Error("Nội dung không đúng cấu trúc.")

          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        },

        apply: (next) => {
          if (!validateContent(next))
            throw new Error("Nội dung không đúng cấu trúc.")

          localStorage.setItem(LIVE_KEY, JSON.stringify(next))

          setContent(next)
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useSiteContent() {
  const context = useContext(Context)

  if (!context) throw new Error("SiteContentProvider is required")

  return context
}
