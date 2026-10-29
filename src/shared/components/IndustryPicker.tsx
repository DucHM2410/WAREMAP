import { Baby, Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { INDUSTRIES, type Industry } from '../config/industries'
import { Brand, Button, Modal } from '../../app/ui'

const icons: Record<string, typeof Baby> = { Baby, Sparkles }

export function IndustryPicker({
  onSelect,
  onCancel,
}: {
  onSelect: (industry: Industry) => boolean
  onCancel?: () => void
}) {
  const [pending, setPending] = useState<Industry | null>(null)

  useEffect(() => {
    if (!onCancel) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !pending) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel, pending])

  const choose = (id: Industry) => {
    setPending(id)
  }

  return (
    <div
      className="industry-picker"
      aria-labelledby="industry-picker-title"
    >
      <div className="industry-picker__inner">
        <header className="industry-picker__head">
          <Brand />
          <span className="eyebrow">Thiết lập không gian</span>
          <h1 id="industry-picker-title">Cửa hàng của bạn bán gì?</h1>
          <p>
            Chọn ngành hàng để WareMap sắp xếp menu, mẫu hàng và cảnh báo theo
            đúng cách bạn làm việc. Trong bản demo, Chủ doanh chọn phân hệ cho mỗi phiên đăng nhập.
          </p>
        </header>

        <div className="industry-picker__grid">
          {Object.values(INDUSTRIES).map((item) => {
            const Icon = icons[item.icon] ?? Sparkles
            const selected = pending === item.id
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
                      Đang chọn
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
                  {selected ? 'Đã chọn phân hệ này' : 'Chọn phân hệ này'}
                  <ArrowRight size={16} />
                </button>
              </article>
            )
          })}
        </div>

        {pending && (
          <Modal title="Xác nhận phân hệ doanh nghiệp" close={() => setPending(null)}>
            <div className="industry-confirm">
              <p>Bạn đang chọn phân hệ</p>
              <strong className="industry-confirm__name">{INDUSTRIES[pending].label}</strong>
              <p>Phân hệ này sẽ áp dụng cho Chủ doanh, Quản trị và tất cả Nhân viên trong doanh nghiệp.</p>
              <div className="industry-confirm__warning">
                <ShieldCheck size={22} aria-hidden="true" />
                <span><strong>Khóa trong phiên demo này.</strong> Để chọn phân hệ khác, đăng xuất rồi đăng nhập lại bằng tài khoản Chủ doanh.</span>
              </div>
              <div className="industry-confirm__actions">
                <Button variant="secondary" onClick={() => setPending(null)}>Chọn lại</Button>
                <Button onClick={() => onSelect(pending)}>Xác nhận và bắt đầu <ArrowRight size={16} /></Button>
              </div>
            </div>
          </Modal>
        )}
        <footer className="industry-picker__foot">
          <span>
            <ShieldCheck size={15} />
            Đăng xuất rồi đăng nhập lại Chủ doanh để chọn phân hệ khác. Tài khoản Quản lý kho và Nhân viên dùng phân hệ đã xác nhận.
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
