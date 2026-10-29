import { createContext, useContext, useState, type ReactNode } from "react"
import { DEFAULT_SITE_CONTENT } from "./defaultContent"
import { validateContent, type SiteContent } from "./types"
import bundledContent from "./publishedContent.json"
const baseContent = validateContent(bundledContent)
  ? bundledContent
  : DEFAULT_SITE_CONTENT
const LIVE_KEY = "waremap-website-content-v1"
const DRAFT_KEY = "waremap-website-draft-v1"
const read = (key: string): SiteContent => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) || "null")
    return validateContent(saved) ? saved : baseContent
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
