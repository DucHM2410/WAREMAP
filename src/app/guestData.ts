import type { DemoData } from "./model"

// Always pass a fresh seed, never a user's saved inventory.
export function guestData(sample: DemoData, branch: string): DemoData {
  const racks = sample.racks[branch] || []
  return {
    ...sample,
    products: sample.products.slice(0, 3).map((product, index) => ({
      ...product,
      branch,
      rack: racks[index % Math.max(1, racks.length)]?.id ?? product.rack,
    })),
    racks: { [branch]: racks },
    requests: [],
    activities: [],
    staff: [],
    transfers: [],
    locations: 1,
  }
}
