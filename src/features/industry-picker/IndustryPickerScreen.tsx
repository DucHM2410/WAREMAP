import { useApp } from '../../app/store'
import { IndustryPicker } from '../../shared/components/IndustryPicker'

export default function IndustryPickerScreen() {
  const { go, role, industryConfirmed, confirmIndustry } = useApp()

  if (role !== 'owner' || industryConfirmed) return (
    <div className="empty">
      <h1>{industryConfirmed ? 'Phân hệ doanh nghiệp đã được xác nhận' : 'Chờ Chủ doanh thiết lập phân hệ'}</h1>
      <p>Chỉ Chủ doanh được chọn phân hệ. Trong bản demo, đăng xuất rồi đăng nhập lại Chủ doanh để chọn lại.</p>
      <button onClick={() => go('dashboard')}>Về Tổng quan</button>
    </div>
  )

  return (
    <IndustryPicker
      onSelect={confirmIndustry}
    />
  )
}
