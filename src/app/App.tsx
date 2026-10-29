import { lazy, Suspense, Component, type ReactNode } from "react"
import { Provider, useApp } from "./store"
import { Shell } from "./Shell"
import { Button, Empty } from "./ui"
import { IndustryProvider } from "../shared/context/IndustryContext"
import { SiteContentProvider } from "../features/site-content/SiteContentContext"
const Home = lazy(() => import("../features/public-home/PublicHomeScreen"))
const Login = lazy(() => import("../features/auth/LoginScreen"))
const Request = lazy(() =>
  import("../features/auth/LoginScreen").then((m) => ({
    default: m.RequestAccess,
  })),
)
const IndustryPickerPage = lazy(
  () => import("../features/industry-picker/IndustryPickerScreen"),
)
const Dashboard = lazy(() => import("../features/dashboard/DashboardScreen"))
const Builder = lazy(() => import("../features/builder/BuilderScreen"))
const Inventory = lazy(() => import("../features/inventory/InventoryScreen"))
const Batches = lazy(() => import("../features/batches/BatchesScreen"))
const Transit = lazy(() => import("../features/in-transit/InTransitScreen"))
const Alerts = lazy(() => import("../features/fefo-alerts/FefoAlertsScreen"))
const Scanner = lazy(() => import("../features/scanner/MobileScannerScreen"))
const Reports = lazy(() => import("../features/roi/RoiDashboardScreen"))
const Account = lazy(() => import("../features/account/AccountRbacScreen"))
const Settings = lazy(() => import("../features/settings/SettingsScreen"))
const Admin = lazy(() => import("../features/account/AdminScreen"))
const WebsiteEditor = lazy(() => import("../features/site-content/HomepageEditorScreen"))
class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  render() {
    return this.state.error ? (
      <Empty
        title="Không thể mở nội dung này"
        action={
          <Button onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        }
      >
        Thử tải lại để tiếp tục. Dữ liệu đã lưu vẫn nằm trên trình duyệt này.
      </Empty>
    ) : (
      this.props.children
    )
  }
}
function Routes() {
  const { screen, role, go } = useApp()
  const views = {
    home: <Home />,
    login: <Login />,
    request: <Request />,
    "industry-picker": <IndustryPickerPage />,
    dashboard: <Dashboard />,
    builder: <Builder />,
    warehouse: <Builder />,
    inventory: <Inventory />,
    batches: <Batches />,
    mobile: <Transit />,
    onboarding: <Alerts />,
    scanner: <Scanner />,
    roi: <Reports />,
    account: <Account />,
    settings: <Settings />,
    admin: <Admin />,
    "website-editor": <WebsiteEditor />,
  }
  const denied =
    (screen === "website-editor" && !["owner", "platform"].includes(role)) ||
    (screen === "admin" && role !== "platform") ||
    (screen === "account" && role !== "owner") ||
    (screen === "builder" && !["owner", "manager"].includes(role)) ||
    (["roi", "settings"].includes(screen) &&
      !["owner", "manager"].includes(role)) ||
    (screen === "mobile" && role === "sales")
  const content = (
    <Boundary key={screen}>
      <Suspense
        fallback={
          <div className="empty" role="status">
            Đang mở WareMap System…
          </div>
        }
      >
        {denied ? (
          <Empty
            title="Chức năng dành cho vai trò khác"
            action={
              <Button onClick={() => go("dashboard")}>Về Tổng quan</Button>
            }
          >
            Bạn có thể đổi vai trò trong phần trải nghiệm bản demo.
          </Empty>
        ) : (
          views[screen]
        )}
      </Suspense>
    </Boundary>
  )
  return ["home", "login", "request", "industry-picker"].includes(screen) ? (
    content
  ) : (
    <Shell>{content}</Shell>
  )
}
export default function App() {
  return (
    <IndustryProvider>
      <SiteContentProvider>
      <Provider>
        <a className="skip-link" href="#main-content">
          Đến nội dung chính
        </a>
        <Routes />
      </Provider>
      </SiteContentProvider>
    </IndustryProvider>
  )
}
