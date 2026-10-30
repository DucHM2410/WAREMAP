import { useEffect, useRef } from "react"

/** Reveal each section once. Content remains visible without JS or observers. */
export function useSiteMotion(page: string, paused: boolean, embedded: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || embedded || paused || !("IntersectionObserver" in window)) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (preference.matches) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add("wm-entered")
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.08 })
    const targets = root.querySelectorAll("main > section")
    targets.forEach((target) => observer.observe(target))
    const stop = () => { if (preference.matches) observer.disconnect() }
    preference.addEventListener("change", stop)
    return () => {
      observer.disconnect()
      preference.removeEventListener("change", stop)
      targets.forEach((target) => target.classList.remove("wm-entered"))
    }
  }, [page, paused, embedded])
  return ref
}
