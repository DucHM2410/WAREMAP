import type { DemoData } from "./model"

// Always pass a fresh seed, never a user's saved inventory.
export function guestData(sample: DemoData, branch: string): DemoData {
  const racks = sample.racks[branch] || []
  return {
    ...sample,
    products: sample.products.filter(product => product.branch === branch).slice(0, 16),
    racks: { [branch]: racks },
    inboundCartons: [],
    requests: [],
    activities: [],
    staff: [],
    transfers: [],
    locations: 1,
  }
}
