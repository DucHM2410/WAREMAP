import type { Role, Screen } from "./model"
import { WAREHOUSE_PERMISSIONS } from "./warehousePermissions"

export type AccessMode = "explore" | "trial" | "authenticated"
export const publicScreens: Screen[] = [
  "home",
  "login",
  "request",
  "trial-info",
]

export function canAccessScreen(mode: AccessMode, role: Role, screen: Screen) {
  if (publicScreens.includes(screen)) return true
  if (mode !== "authenticated") {
    return (
      screen === "warehouse" || (mode === "trial" && screen === "inventory")
    )
  }
  if (role === "platform") return ["admin", "website-editor"].includes(screen)
  if (screen === "warehouse") return WAREHOUSE_PERMISSIONS[role].view
  if (screen === "putaway") return WAREHOUSE_PERMISSIONS[role].putaway
  if (screen === "website-editor")
    return role === "owner"
  if (screen === "admin") return false
  if (screen === "account") return role === "owner"
  if (["builder", "roi", "settings"].includes(screen))
    return role === "owner" || role === "manager"
  if (screen === "mobile") return role !== "sales"
  return true
}
