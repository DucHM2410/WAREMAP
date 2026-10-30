import { PublicFlowLayout, PublicFlowHeading } from "../../features/auth/PublicFlowLayout"
import { Baby, Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { INDUSTRIES, type Industry } from '../config/industries'
import { Button, Modal } from '../../app/ui'

const icons: Record<string, typeof Baby> = { Baby, Sparkles }

export function IndustryPicker({
  onSelect,
  onCancel,
}: {
  onSelect: (industry: Industry) => boolean
  onCancel?: () => void
}) {
  const [pending, setPending] = useState<Industry | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!onCancel) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !confirming) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel, confirming])

  return (
    <PublicFlowLayout current="Chọn phân hệ" experienceParent>
      <div className="industry-setup">
        <PublicFlowHeading eyebrow="Thiết lập không gian" title="Chọn ngành hàng của bạn" description="WareMap sẽ dùng mẫu hàng và cách bố trí phù hợp với cửa hàng của bạn." />
        <div className="industry-selection">
          <fieldset className="industry-options">
            <legend className="sr-only">Ngành hàng của doanh nghiệp</legend>
            {Object.values(INDUSTRIES).map(item => {
              const Icon = icons[item.icon] ?? Sparkles
              return <label key={item.id} className={`industry-option ${pending === item.id ? 'is-selected' : ''}`}>
                <input type="radio" name="business-industry" value={item.id} checked={pending === item.id} onChange={() => setPending(item.id)} />
                <span className="industry-option-indicator" aria-hidden="true">{pending === item.id && <Check size={14} />}</span>
                <span className="industry-option-icon"><Icon size={24} aria-hidden="true" /></span>
                <span className="industry-option-copy"><strong>{item.id === 'mom-baby' ? 'Mẹ & Bé' : 'Mỹ phẩm'}</strong><span>{item.id === 'mom-baby' ? 'Sữa, bỉm và sản phẩm chăm sóc mẹ, bé' : 'Mỹ phẩm & Chăm sóc cá nhân'}</span></span>
                <span className="industry-option-categories">
                  {item.sampleCategories.map(category => <span key={category}>{category}</span>)}
                </span>
              </label>
            })}
          </fieldset>
          <div className="industry-selection-actions">
            <p><ShieldCheck size={16} aria-hidden="true" />Bạn có thể chọn lại khi đăng nhập phiên demo mới.</p>
            <Button disabled={!pending} onClick={() => setConfirming(true)}>Tiếp tục <ArrowRight size={16} /></Button>
          </div>
        </div>

        {confirming && pending && (
          <Modal title="Xác nhận phân hệ doanh nghiệp" close={() => setConfirming(false)}>
            <div className="industry-confirm">
              <p>Bạn đang chọn phân hệ</p>
              <strong className="industry-confirm__name">{INDUSTRIES[pending].label}</strong>
              <p>Phân hệ này sẽ áp dụng cho Chủ doanh, Quản lý kho và tất cả Nhân viên trong doanh nghiệp.</p>
              <div className="industry-confirm__warning">
                <ShieldCheck size={22} aria-hidden="true" />
                <span><strong>Khóa trong phiên demo này.</strong> Để chọn phân hệ khác, đăng xuất rồi đăng nhập lại bằng tài khoản Chủ doanh.</span>
              </div>
              <div className="industry-confirm__actions">
                <Button variant="secondary" onClick={() => setConfirming(false)}>Chọn lại</Button>
                <Button onClick={() => onSelect(pending)}>Xác nhận và bắt đầu <ArrowRight size={16} /></Button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </PublicFlowLayout>
  )
}
