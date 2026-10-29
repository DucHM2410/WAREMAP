import type { Role, Screen } from "./model"

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
  if (screen === "website-editor")
    return role === "owner" || role === "platform"
  if (screen === "admin") return role === "platform"
  if (screen === "account") return role === "owner"
  if (["builder", "roi", "settings"].includes(screen))
    return role === "owner" || role === "manager"
  if (screen === "mobile") return role !== "sales"
  return true
}
