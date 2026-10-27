import { daysLeft, expiryLabel, type Product } from "./model"
import { Badge } from "./ui"
export const productKey = (p: Product) => `${p.id}|${p.batch}|${p.branch}`
export function ExpiryBadge({
  product,
  threshold,
}: {
  product: Product
  threshold: number
}) {
  const days = daysLeft(product.expiry)
  return (
    <Badge
      tone={days < 0 ? "danger" : days <= threshold ? "warning" : "success"}
    >
      {expiryLabel(product.expiry)}
    </Badge>
  )
}
export function matchesProduct(p: Product, query: string) {
  return `${p.name} ${p.variant} ${p.id} ${p.batch} ${p.branch} ${p.rack}`
    .toLocaleLowerCase("vi")
    .includes(query.toLocaleLowerCase("vi").trim())
}
