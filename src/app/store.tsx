import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  seed,
  withIndustrySamples,
  industryProducts,
  type DemoData,
  type Product,
  type Role,
  type Screen,
  branches,
} from "./model"
import { useIndustry } from "../shared/context/IndustryContext"
const key = "waremap-demo-v3"
export interface ScanTask {
  transferId?: string
  mode: "lookup" | "dispatch" | "receive"
}
interface State {
  data: DemoData
  update: (fn: (data: DemoData) => DemoData) => void
  screen: Screen
  go: (screen: Screen) => void
  branch: string
  setBranch: (branch: string) => void
  role: Role
  setRole: (role: Role) => void
  selected: string
  setSelected: (id: string) => void
  search: string
  setSearch: (s: string) => void
  notify: (s: string) => void
  log: (title: string, detail: string) => void
  visibleProducts: Product[]
  storageError: boolean
  scanTask: ScanTask
  setScanTask: (task: ScanTask) => void
  guardNavigation: (guard: (() => boolean) | null) => void
  requestedPlan: "free" | "paid"
  setRequestedPlan: (plan: "free" | "paid") => void
}
const Context = createContext<State | null>(null)
export function Provider({ children }: { children: ReactNode }) {
  const { industry, config } = useIndustry()
  const [data, setData] = useState<DemoData>(() => {
    try {
      const raw = localStorage.getItem(key)
      const saved = raw ? JSON.parse(raw) : null
      if (saved?.version === 3) {
        return saved.industry === config.id
          ? (saved as DemoData)
          : withIndustrySamples(saved, config)
      }
      return seed(config)
    } catch {
      return seed(config)
    }
  })
  const [screen, setScreen] = useState<Screen>("home"),
    [branch, setBranch] = useState("all"),
    [role, setRole] = useState<Role>("owner"),
    [selected, setSelected] = useState(
      () => industryProducts(config)[0]?.id ?? "",
    ),
    [search, setSearch] = useState(""),
    [toast, setToast] = useState(""),
    [storageError, setStorageError] = useState(false)
  const [scanTask, setScanTask] = useState<ScanTask>({ mode: "lookup" })
  const [requestedPlan, setRequestedPlan] = useState<"free" | "paid">("paid")
  const guard = useRef<(() => boolean) | null>(null)
  const guardNavigation = (fn: (() => boolean) | null) => {
    guard.current = fn
  }
  const mayLeave = () => {
    if (guard.current && !guard.current()) return false
    guard.current = null
    return true
  }
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [data])
  const appliedIndustry = useRef(industry)
  useEffect(() => {
    if (appliedIndustry.current === industry) return
    appliedIndustry.current = industry
    setData((current) => withIndustrySamples(current, config))
    setSelected(industryProducts(config)[0]?.id ?? "")
  }, [industry, config])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 4200)
    return () => clearTimeout(timer)
  }, [toast])
  const go = (next: Screen) => {
    if (!mayLeave()) return
    setScreen(next)
    setSearch("")
    window.scrollTo({ top: 0 })
  }
  useEffect(() => {
    const handler = (event: Event) => go((event as CustomEvent<Screen>).detail)
    window.addEventListener("waremap:navigate", handler)
    return () => window.removeEventListener("waremap:navigate", handler)
  }, [])
  const log = (title: string, detail: string) =>
    setData((d) => ({
      ...d,
      activities: [
        {
          id: crypto.randomUUID(),
          title,
          detail,
          time: new Date().toISOString(),
        },
        ...d.activities,
      ].slice(0, 40),
    }))
  const changeRole = (next: Role) => {
    if (!mayLeave()) return
    setRole(next)
    setBranch(next === "owner" || next === "platform" ? "all" : branches[0])
    setScanTask({ mode: "lookup" })
    go(next === "platform" ? "admin" : "dashboard")
  }
  const changeBranch = (next: string) => {
    if (next !== branch && !mayLeave()) return
    setBranch(next)
  }
  return (
    <Context.Provider
      value={{
        data,
        update: setData,
        screen,
        go,
        branch,
        setBranch: changeBranch,
        role,
        setRole: changeRole,
        selected,
        setSelected,
        search,
        setSearch,
        notify: setToast,
        log,
        visibleProducts: data.products.filter(
          (p) => branch === "all" || p.branch === branch,
        ),
        storageError,
        scanTask,
        setScanTask,
        guardNavigation,
        requestedPlan,
        setRequestedPlan,
      }}
    >
      {children}
      {toast && (
        <div className="notice" role="status">
          {toast}
          <button aria-label="Đóng thông báo" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  )
}
export function useApp() {
  const value = useContext(Context)
  if (!value) throw new Error("Missing WareMap provider")
  return value
}
