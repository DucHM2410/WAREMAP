// ─── Types ────────────────────────────────────────────────────────────────────
export type AppScreen = 'home' | 'login' | 'dashboard' | 'builder' | 'mobile' | 'onboarding' | 'batches' | 'inventory' | 'roi' | 'scanner' | 'account' | 'settings'

export interface BatchRow {
  sku: string
  batchId: string
  expiry: string
  qty: number
  location: string
  daysLeft: number
  status: 'ok' | 'warn' | 'critical' | 'expired' | 'inspect'
}
