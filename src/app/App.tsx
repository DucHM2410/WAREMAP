import { useState, Suspense, useEffect, useRef } from 'react'
import { lazy } from 'react'
import type { AppScreen } from '../shared'

const S1 = lazy(() => import('../features/dashboard/DashboardScreen'))
const S2 = lazy(() => import('../features/builder/BuilderScreen'))
const S3 = lazy(() => import('../features/in-transit/InTransitScreen'))
const S4 = lazy(() => import('../features/fefo-alerts/FefoAlertsScreen'))
const S5 = lazy(() => import('../features/batches/BatchesScreen'))
const Scanner = lazy(() => import('../features/scanner/MobileScannerScreen'))
const Account = lazy(() => import('../features/account/AccountRbacScreen'))
const Settings = lazy(() => import('../features/settings/SettingsScreen'))
const Inventory = lazy(() => import('../features/inventory/InventoryScreen'))
const Login = lazy(() => import('../features/auth/LoginScreen'))
const PublicHome = lazy(() => import('../features/public-home/PublicHomeScreen'))
const RoiDashboard = lazy(() => import('../features/roi/RoiDashboardScreen'))

function LoadingScreen() {
  return (
    <div className="app-loading">
      <div style={{ textAlign: 'center' }}>
        <div className="app-loading-spinner" />
        <div className="app-loading-label">Đang tải WareMap…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}

export default function App() {
  // `screen` drives which screen to show; `visible` lags one rAF behind
  // so the old Canvas fully unmounts (committed to DOM) before the new one mounts.
  const [screen, setScreen] = useState<AppScreen>('home')
  const [visible, setVisible] = useState<AppScreen>('home')
  const pendingRef = useRef<AppScreen | null>(null)

  useEffect(() => {
    if (pendingRef.current === null) return
    // screen changed → old content committed as gone → now mount new screen
    const id = requestAnimationFrame(() => {
      setVisible(pendingRef.current!)
      pendingRef.current = null
    })
    return () => cancelAnimationFrame(id)
  }, [screen])

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const nextScreen = (event as CustomEvent<AppScreen>).detail
      if (nextScreen) switchScreen(nextScreen)
    }
    window.addEventListener('waremap:navigate', handleNavigate)
    return () => window.removeEventListener('waremap:navigate', handleNavigate)
  }, [screen])

  function switchScreen(s: AppScreen) {
    if (s === screen) return
    pendingRef.current = s
    // Hide current screen (unmounts Canvas, commits before rAF fires)
    setScreen(s)
    setVisible(null as unknown as AppScreen)
  }

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        {visible === 'home'       && <PublicHome />}
        {visible === 'login'      && <Login />}
        {visible === 'dashboard'  && <S1 />}
        {visible === 'builder'    && <S2 />}
        {visible === 'mobile'     && <S3 />}
        {visible === 'onboarding' && <S4 onDone={() => switchScreen('dashboard')} />}
        {visible === 'batches'    && <S5 />}
        {visible === 'scanner'    && <Scanner />}
        {visible === 'account'    && <Account />}
        {visible === 'settings'   && <Settings />}
        {visible === 'inventory'  && <Inventory />}
        {visible === 'roi'        && <RoiDashboard />}
      </Suspense>
    </>
  )
}
