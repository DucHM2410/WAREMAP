import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { INDUSTRIES, DEFAULT_INDUSTRY, type Industry, type IndustryConfig } from '../config/industries'

interface IndustryContextValue {
  industry: Industry
  config: IndustryConfig
  hasSavedIndustry: boolean
  setIndustry: (i: Industry) => void
}

const IndustryContext = createContext<IndustryContextValue | null>(null)

const readSavedIndustry = () => {
  try {
    return Boolean(localStorage.getItem('waremap_industry'))
  } catch {
    return false
  }
}

export function IndustryProvider({ children }: { children: ReactNode }) {
  const [industry, setIndustryState] = useState<Industry>(() => {
    try {
      const business = JSON.parse(localStorage.getItem('waremap-demo-v3') || 'null')
      if (business?.version === 3 && business.industryConfirmed && INDUSTRIES[business.industry as Industry]) return business.industry as Industry
      const stored = localStorage.getItem('waremap_industry') as Industry | null
      return stored && INDUSTRIES[stored] ? stored : DEFAULT_INDUSTRY
    } catch {
      return DEFAULT_INDUSTRY
    }
  })
  const [hasSavedIndustry, setHasSavedIndustry] = useState(readSavedIndustry)

  const setIndustry = (i: Industry) => {
    setIndustryState(i)
    setHasSavedIndustry(true)
    try {
      localStorage.setItem('waremap_industry', i)
    } catch {
      // The theme still applies for this session when storage is blocked.
    }
  }

  useEffect(() => {
    document.body.classList.remove('industry-mom', 'industry-cosmetics')
    document.body.classList.add(industry === 'mom-baby' ? 'industry-mom' : 'industry-cosmetics')
  }, [industry])

  return (
    <IndustryContext.Provider
      value={{
        industry,
        config: INDUSTRIES[industry],
        hasSavedIndustry,
        setIndustry,
      }}
    >
      {children}
    </IndustryContext.Provider>
  )
}

export function useIndustry() {
  const ctx = useContext(IndustryContext)
  if (!ctx) throw new Error('useIndustry must be used inside <IndustryProvider>')
  return ctx
}
