import type { DemoData, Role } from "./model"
import { withIndustrySamples } from "./model"
import { INDUSTRIES, type Industry } from "../shared/config/industries"

// A new owner demo session reopens setup; other roles retain the business choice.
export function beginIndustryDemoSession(data: DemoData, role: Role): DemoData {
  return role === "owner" ? { ...data, industryConfirmed: false } : data
}

// Confirmation still locks changes during the current demo session.
export function confirmBusinessIndustry(data: DemoData, role: Role, choice: Industry): DemoData {
  if (role !== "owner" || data.industryConfirmed || !INDUSTRIES[choice]) return data
  const next = data.industry === choice ? data : withIndustrySamples(data, INDUSTRIES[choice])
  return { ...next, industryConfirmed: true }
}
