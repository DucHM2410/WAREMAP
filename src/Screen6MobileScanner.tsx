import { useRef, useState } from 'react'
import { ArrowLeft, Check, Flashlight, FlashlightOff, Keyboard, ScanLine, ShieldCheck } from 'lucide-react'
import { Btn } from './shared'

export default function Screen6MobileScanner() {
  const [flash, setFlash] = useState(false)
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [toast, setToast] = useState('')
  const timer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2200)
  }

  const scan = () => {
    if (step === 0) {
      setStep(1)
      notify('Đã xác minh mã Kệ A2-02-03')
    } else if (step === 1) {
      setStep(2)
      notify('Đã xác minh Lô LOT-WM-202608')
    } else {
      notify('Cặp mã Kệ / Lô đã sẵn sàng xuất kho')
    }
  }

  const goBack = () => window.dispatchEvent(new CustomEvent('waremap:navigate', { detail: 'dashboard' }))

  return (
    <div className="qs-stage">
      <main className="qs-phone">
        <header className="qs-top">
          <Btn variant="ghost" size="md" onClick={goBack}><ArrowLeft size={19} /></Btn>
          <div><strong>Chế độ Quét nhanh</strong><span>Xuất kho · Phiếu XK-2608-042</span></div>
          <Btn variant="ghost" size="md" onClick={() => setFlash((value) => !value)}>
            {flash ? <Flashlight size={19} /> : <FlashlightOff size={19} />}
          </Btn>
        </header>

        <section className="qs-content">
          <div className="qs-instruction">
            <span><ScanLine size={19} /></span>
            <div><strong>{step === 0 ? 'Quét mã Kệ trước' : step === 1 ? 'Tiếp theo, quét mã Lô' : 'Đã xác minh đủ 2 mã'}</strong><p>Đưa mã QR vào giữa khung hình để nhận diện tự động.</p></div>
          </div>

          <div className={`qs-camera ${flash ? 'flash' : ''} ${step === 2 ? 'done' : ''}`} onClick={scan}>
            <div className="qs-camera-noise" />
            <i className="tl" /><i className="tr" /><i className="bl" /><i className="br" />
            {step < 2 && <span className="qs-laser" />}
            <div className="qs-target"><ScanLine size={32} /><span>Chạm để mô phỏng quét</span></div>
            {step === 2 && <div className="qs-done"><Check size={30} /><strong>Xác minh thành công</strong></div>}
          </div>

          <div className="qs-indicators">
            <div className={step >= 1 ? 'complete' : ''}>
              <span>{step >= 1 ? <Check size={17} /> : '1'}</span>
              <div><small>MÃ KỆ</small><strong>{step >= 1 ? 'A2 · Tầng 02 · Ô 03' : 'Chưa quét'}</strong></div>
            </div>
            <i />
            <div className={step >= 2 ? 'complete' : ''}>
              <span>{step >= 2 ? <Check size={17} /> : '2'}</span>
              <div><small>MÃ LÔ</small><strong>{step >= 2 ? 'LOT-WM-202608' : 'Chưa quét'}</strong></div>
            </div>
          </div>

          <div className="qs-note"><ShieldCheck size={15} /><span>WareMap kiểm tra đúng Kệ, đúng Lô và thứ tự FEFO trước khi xuất.</span></div>
        </section>

        <footer className="qs-actions">
          <Btn
            variant="primary"
            size="lg"
            full
            disabled={step < 2}
            onClick={() => notify('Đã xác nhận xuất kho thành công')}
          >
            <Check size={18} /> Xác nhận Xuất kho
          </Btn>
          <Btn variant="ghost" size="md" full onClick={() => { setStep(2); notify('Đã nhập mã thủ công') }}>
            <Keyboard size={17} /> Nhập mã thủ công
          </Btn>
        </footer>
        {toast && <div className="qs-toast"><Check size={14} /> {toast}</div>}
      </main>
    </div>
  )
}
