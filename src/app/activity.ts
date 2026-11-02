// These IDs identify local demo history, not credentials or security tokens.
let sequence = 0

export function activityId(source: Pick<Crypto, "randomUUID"> | undefined = globalThis.crypto): string {
  try {
    if (typeof source?.randomUUID === "function") return source.randomUUID()
  } catch {
    // Some embedded browsers expose the API but disallow calling it.
  }
  sequence += 1
  return `activity-${Date.now().toString(36)}-${sequence.toString(36)}`
}
