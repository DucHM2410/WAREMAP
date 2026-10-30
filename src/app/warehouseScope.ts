import type { Role } from "./model"

export function warehouseScope(
  mode: string,
  role: Role,
  locations: number,
  names: string[],
) {
  if (mode !== "authenticated" || !["owner", "platform"].includes(role))
    return names.slice(0, 1)
  const count = Number.isFinite(locations)
    ? Math.max(1, Math.floor(locations))
    : 1
  return names.slice(0, count)
}
