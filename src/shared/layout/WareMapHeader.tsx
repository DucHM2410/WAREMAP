import { Sidebar } from './Sidebar'
import { AppHeader } from './AppHeader'
import type { WareMapRole } from './Sidebar'

type HeaderScreen = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'ACCOUNT' | 'SETTINGS'

export function WareMapHeader({ activeScreen, notify, theme = 'light', role = 'ADMIN_VIP' }: {
  activeScreen: HeaderScreen
  notify: (msg: string) => void
  theme?: 'light' | 'dark'
  role?: WareMapRole
}) {
  return (
    <>
      <Sidebar activeScreen={activeScreen} notify={notify} role={role} />
      <AppHeader activeScreen={activeScreen} notify={notify} theme={theme} role={role} />
    </>
  )
}

export type { WareMapRole }
