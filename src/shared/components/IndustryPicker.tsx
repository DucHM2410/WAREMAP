import { Baby, Box, Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { INDUSTRIES, type Industry } from '../config/industries'
import { useIndustry } from '../context/IndustryContext'

const icons: Record<string, typeof Baby> = { Baby, Sparkles }

export function IndustryPicker({
  onSelect,
  onCancel,
}: {
  onSelect?: (industry: Industry) => void
  onCancel?: () => void
}) {
  const { industry: current, hasSavedIndustry, setIndustry } = useIndustry()

  useEffect(() => {
    if (!onCancel) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const choose = (id: Industry) => {
    setIndustry(id)
    onSelect?.(id)
  }

  return (
    <div
      className="industry-picker"
      role="dialog"
      aria-modal="true"
      aria-labelledby="industry-picker-title"
    >
      <div className="industry-picker__inner">
        <header className="industry-picker__head">
          <span className="industry-picker__brand">
            <span>
              <Box size={16} />
            </span>
            WareMap
          </span>
          <span className="eyebrow">Thiết lập không gian</span>
          <h1 id="industry-picker-title">Cửa hàng của bạn bán gì?</h1>
          <p>
            Chọn ngành hàng để WareMap sắp xếp menu, mẫu hàng và cảnh báo theo
            đúng cách bạn làm việc. Bạn có thể đổi lại bất cứ lúc nào.
          </p>
        </header>

        <div className="industry-picker__grid">
          {Object.values(INDUSTRIES).map((item) => {
            const Icon = icons[item.icon] ?? Sparkles
            const selected = hasSavedIndustry && current === item.id
            return (
              <article
                key={item.id}
                className={`industry-card ${selected ? 'is-current' : ''}`}
                style={
                  {
                    '--card-primary': item.primaryColor,
                    '--card-accent': item.accentColor,
                  } as CSSProperties
                }
              >
                <div className="industry-card__top">
                  <span className="industry-card__icon">
                    <Icon size={28} />
                  </span>
                  {selected && (
                    <span className="industry-card__badge">
                      <Check size={13} />
                      Đang dùng
                    </span>
                  )}
                </div>
                <h2>{item.label}</h2>
                <p>{item.heroTagline}</p>
                <div className="industry-card__chips" aria-label="Danh mục gợi ý">
                  {item.sampleCategories.map((category) => (
                    <span key={category}>{category}</span>
                  ))}
                </div>
                <button
                  type="button"
                  className="industry-card__cta"
                  onClick={() => choose(item.id)}
                >
                  {selected ? 'Tiếp tục với ngành này' : 'Chọn ngành này'}
                  <ArrowRight size={16} />
                </button>
              </article>
            )
          })}
        </div>

        <footer className="industry-picker__foot">
          <span>
            <ShieldCheck size={15} />
            Đổi ngành bất cứ lúc nào ở thanh bên. Mẫu hàng và cảnh báo sẽ đổi
            theo ngành; dữ liệu tự nhập vẫn được giữ.
          </span>
          {onCancel && (
            <button
              type="button"
              className="industry-picker__back"
              onClick={onCancel}
            >
              Quay lại
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
