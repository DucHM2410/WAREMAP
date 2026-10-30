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
import { withShelfSamples } from "./shelfSamples"
import { beginIndustryDemoSession, confirmBusinessIndustry } from "./industryPolicy"
import { INDUSTRIES, type Industry } from "../shared/config/industries"
import { warehouseScope } from "./warehouseScope"
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../shared/config/demoRoles"
const key = "waremap-demo-v3"
export interface ScanTask {
  locationCode?: string
  productKey?: string
  transferId?: string
  mode: "lookup" | "dispatch" | "receive"
}
interface State {
  data: DemoData
  update: (fn: (data: DemoData) => DemoData) => void
  screen: Screen
  go: (screen: Screen) => void
  goBack: () => void
  branch: string
  accessibleBranches: string[]
  setBranch: (branch: string) => void
  role: Role
  accessMode: AccessMode
  startTrialDemo: () => void
  startGuest: (mode: "explore" | "trial") => void
  authenticate: (email: string, password: string) => boolean
  logout: () => void
  industryConfirmed: boolean
  confirmIndustry: (choice: Industry) => boolean
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
  requestedPlan: "free" | "single" | "chain"
  requestFromExperience: boolean
  setRequestedPlan: (plan: "free" | "single" | "chain") => void
}
const Context = createContext<State | null>(null)
export function Provider({ children }: { children: ReactNode }) {
  const { industry, config, setIndustry } = useIndustry()
  const [accountData, setData] = useState<DemoData>(() => {
    try {
      const raw = localStorage.getItem(key)
      const saved = raw ? JSON.parse(raw) : null
      if (saved?.version === 3 && saved.allowance === 5) saved.allowance = saved.locations === 1 ? 4 : 18
      if (saved?.version === 3) {
        const restored = saved.industryConfirmed || saved.industry === config.id
          ? (saved as DemoData)
          : withIndustrySamples(saved, config)
        return withShelfSamples(restored, INDUSTRIES[restored.industry] || config)
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
  const [requestedPlan, setRequestedPlan] = useState<"free" | "single" | "chain">("single")
  const [requestFromExperience, setRequestFromExperience] = useState(false)
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
  useEffect(() => {
    if (accountData.industryConfirmed && industry !== accountData.industry) {
      setIndustry(accountData.industry)
    }
  }, [accountData.industryConfirmed, accountData.industry, industry])
  const confirmedRef = useRef(Boolean(accountData.industryConfirmed))
  const confirmIndustry = (choice: Industry) => {
    if (accessMode !== "authenticated" || role !== "owner" || confirmedRef.current) return false
    const next = confirmBusinessIndustry(accountData, role, choice)
    if (next === accountData) return false
    try {
      // Do not leave setup if the confirmed business profile cannot be saved.
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      setStorageError(true)
      setToast("Không lưu được phân hệ. Hãy cho phép trình duyệt lưu dữ liệu rồi thử lại.")
      return false
    }
    confirmedRef.current = true
    setData(next)
    setIndustry(choice)
    setSelected(industryProducts(INDUSTRIES[choice])[0]?.id ?? "")
    setScreen("dashboard")
    return true
  }
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 4200)
    return () => clearTimeout(timer)
  }, [toast])
  const navigationHistory = useRef<{ screen: Screen; requestFromExperience: boolean }[]>([])
  const go = (next: Screen) => {
    if (!mayLeave()) return
    if (!canAccessScreen(accessMode, role, next)) {
      setToast("Chức năng này cần đăng nhập bằng tài khoản được cấp quyền.")
      setScreen(accessMode === "authenticated" ? role === "platform" ? "admin" : "dashboard" : "trial-info")
      return
    }
    if (next === "industry-picker" && accountData.industryConfirmed) {
      setToast("Phân hệ đã khóa trong phiên demo này. Đăng xuất rồi đăng nhập lại Chủ doanh để chọn lại.")
      return
    }
    if (next !== screen) navigationHistory.current.push({ screen, requestFromExperience })
    if (next === "request") setRequestFromExperience(screen === "trial-info")
    setScreen(next)
    setSearch("")
    window.scrollTo({ top: 0 })
  }
  const goBack = () => {
    if (!mayLeave()) return
    const previous = navigationHistory.current.pop()
    if (previous && canAccessScreen(accessMode, role, previous.screen)) {
      setRequestFromExperience(previous.requestFromExperience)
      setScreen(previous.screen)
    } else setScreen("home")
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
    setScreen(next === "platform" ? "admin" : next === "owner" ? "industry-picker" : "dashboard")
    setSearch("")
  }
  const startTrialDemo = () => {
    if (!mayLeave()) return
    navigationHistory.current.push({ screen, requestFromExperience })
    confirmedRef.current = false
    setData(d => ({ ...beginIndustryDemoSession(d, "owner"), trialDemo: true, locations: 1, allowance: 4 }))
    setAccessMode("authenticated")
    setRole("owner")
    setBranch(branches[0])
    setScreen("industry-picker")
    setSearch("")
    setScanTask({ mode: "lookup" })
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
    navigationHistory.current.push({ screen, requestFromExperience })
    if (account.role === "owner") {
      confirmedRef.current = false
      setData(d => beginIndustryDemoSession(d, account.role))
    }
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
        update: (fn) => {
          if (accessMode !== "authenticated") return
          setData(current => {
            const next = fn(current)
            return current.industryConfirmed
              ? { ...next, industry: current.industry, industryConfirmed: true }
              : next
          })
        },
        submitRequest: (request) => setData(d => ({ ...d, requests: [request, ...d.requests] })),
        screen,
        go,
        goBack,
        branch: scopedBranch,
        accessibleBranches,
        setBranch: changeBranch,
        role,
        accessMode,
        startGuest,
        startTrialDemo,
        authenticate,
        logout,
        industryConfirmed: Boolean(accountData.industryConfirmed),
        confirmIndustry,
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
        requestFromExperience,
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
