export type PublicPage = "home" | "solution" | "mom" | "cosmetics"
export type SectionLayout = "cards" | "split" | "features" | "pricing" | "support" | "faq" | "cta" | "categories"
export interface ContentCard {
  title: string
  text: string
}
export interface ContentSection {
  id: string
  layout: SectionLayout
  visible: boolean
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  cards: ContentCard[]
}
export interface SitePage {
  label: string
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  sections: ContentSection[]
}
export interface SiteContent {
  version: 1
  ctaLabel: string
  footerDescription: string
  contactEmail: string
  pages: Record<PublicPage, SitePage>
}
export const PAGE_LABELS: Record<PublicPage, string> = {
  home: "Trang chủ",
  solution: "Giới thiệu",
  mom: "Mẹ & Bé",
  cosmetics: "Mỹ phẩm & Chăm sóc cá nhân",
}
export function validImageSource(value: string): boolean {
  return (
    value === "" ||
    /^https:\/\//i.test(value) ||
    /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)
  )
}
export function validateContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false
  const data = value as SiteContent
  const text = (v: unknown) => typeof v === "string" && v.length <= 20000
  if (
    data.version !== 1 ||
    !text(data.ctaLabel) ||
    !text(data.footerDescription) ||
    !text(data.contactEmail)
  )
    return false
  return Object.keys(PAGE_LABELS).every((key) => {
    const page = data.pages?.[(key as PublicPage)]
    return Boolean(
      page &&
        [
          page.label,
          page.eyebrow,
          page.title,
          page.description,
          page.imageAlt,
        ].every(text) &&
        typeof page.image === "string" &&
        validImageSource(page.image) &&
        Array.isArray(page.sections) &&
        page.sections.length <= 30 &&
        page.sections.every(
          (s) =>
            s &&
            typeof s === "object" &&
            [s.id, s.eyebrow, s.title, s.description, s.imageAlt].every(text) &&
            /^[a-z][a-z0-9-]*$/.test(s.id) &&
            typeof s.visible === "boolean" &&
            [
              "cards",
              "split",
              "features",
              "pricing",
              "support",
              "faq",
              "cta",
              "categories",
            ].includes(s.layout) &&
            typeof s.image === "string" &&
            validImageSource(s.image) &&
            Array.isArray(s.cards) &&
            s.cards.length <= 30 &&
            s.cards.every((c) => c && text(c.title) && text(c.text)),
        ) &&
        new Set(page.sections.map((s) => s.id)).size === page.sections.length,
    )
  })
}
