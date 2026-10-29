import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  seed,
  withIndustrySamples,
  industryProducts,
  type DemoData,
  type AccessRequest,
  type Product,
  type Role,
  type Screen,
  branches,
} from "./model"
import { useIndustry } from "../shared/context/IndustryContext"
import { canAccessScreen, type AccessMode } from "./access"
import { guestData } from "./guestData"
import { warehouseScope } from "./warehouseScope"
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../shared/config/demoRoles"
const key = "waremap-demo-v3"
export interface ScanTask {
  productKey?: string
  transferId?: string
  mode: "lookup" | "dispatch" | "receive"
}
interface State {
  data: DemoData
  update: (fn: (data: DemoData) => DemoData) => void
  screen: Screen
  go: (screen: Screen) => void
  branch: string
  accessibleBranches: string[]
  setBranch: (branch: string) => void
  role: Role
  accessMode: AccessMode
  startGuest: (mode: "explore" | "trial") => void
  authenticate: (email: string, password: string) => boolean
  logout: () => void
  submitRequest: (request: AccessRequest) => void
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
  const [accountData, setData] = useState<DemoData>(() => {
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
    [role, setRole] = useState<Role>("sales"),
    [selected, setSelected] = useState(
      () => industryProducts(config)[0]?.id ?? "",
    ),
    [search, setSearch] = useState(""),
    [toast, setToast] = useState(""),
    [storageError, setStorageError] = useState(false)
  const [accessMode, setAccessMode] = useState<AccessMode>("explore")
  const sample = useMemo(() => seed(config), [config])
  const guestSample = useMemo(() => guestData(sample, branches[0]), [sample])
  const data = accessMode === "authenticated" ? accountData : guestSample
  const accessibleBranches = warehouseScope(accessMode, role, data.locations, branches)
  const scopedBranch = branch === "all" && accessibleBranches.length > 1
    ? "all" : accessibleBranches.includes(branch) ? branch : accessibleBranches[0]
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
      localStorage.setItem(key, JSON.stringify(accountData))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [accountData])
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
    if (!canAccessScreen(accessMode, role, next)) {
      setToast("Chức năng này cần đăng nhập bằng tài khoản được cấp quyền.")
      setScreen(accessMode === "authenticated" ? "dashboard" : "trial-info")
      return
    }
    setScreen(next)
    setSearch("")
    window.scrollTo({ top: 0 })
  }
  useEffect(() => {
    const handler = (event: Event) => go((event as CustomEvent<Screen>).detail)
    window.addEventListener("waremap:navigate", handler)
    return () => window.removeEventListener("waremap:navigate", handler)
  })
  const log = (title: string, detail: string) => {
    if (accessMode !== "authenticated") return
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
  }
  const changeRole = (next: Role) => {
    if (!mayLeave()) return
    setRole(next)
    setBranch(warehouseScope("authenticated", next, accountData.locations, branches).length > 1 ? "all" : branches[0])
    setScanTask({ mode: "lookup" })
    setScreen(next === "platform" ? "admin" : "dashboard")
    setSearch("")
  }
  const startGuest = (mode: "explore" | "trial") => {
    if (!mayLeave()) return
    setAccessMode(mode)
    setRole("sales")
    setBranch(branches[0])
    setScreen("warehouse")
    setSearch("")
    setScanTask({ mode: "lookup" })
    setSelected(sample.products.find(p => p.branch === branches[0])?.id ?? "")
  }
  const authenticate = (email: string, password: string) => {
    const account = DEMO_ACCOUNTS.find(a => a.email === email.trim().toLowerCase())
    if (!account || password !== DEMO_PASSWORD || !mayLeave()) return false
    setAccessMode("authenticated")
    changeRole(account.role)
    return true
  }
  const logout = () => {
    if (!mayLeave()) return
    setAccessMode("explore")
    setRole("sales")
    setBranch(branches[0])
    setSearch("")
    setScanTask({ mode: "lookup" })
    setScreen("login")
  }
  const changeBranch = (next: string) => {
    if (accessMode !== "authenticated" || (next === "all" ? accessibleBranches.length < 2 : !accessibleBranches.includes(next))) return
    if (next !== branch && !mayLeave()) return
    setBranch(next)
  }
  return (
    <Context.Provider
      value={{
        data,
        update: (fn) => { if (accessMode === "authenticated") setData(fn) },
        submitRequest: (request) => setData(d => ({ ...d, requests: [request, ...d.requests] })),
        screen,
        go,
        branch: scopedBranch,
        accessibleBranches,
        setBranch: changeBranch,
        role,
        accessMode,
        startGuest,
        authenticate,
        logout,
        selected,
        setSelected,
        search,
        setSearch,
        notify: setToast,
        log,
        visibleProducts: data.products.filter(
          (p) => accessibleBranches.includes(p.branch) && (scopedBranch === "all" || p.branch === scopedBranch),
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
