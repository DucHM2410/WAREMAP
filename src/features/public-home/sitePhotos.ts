import warehousePicking from "../../assets/site-photos/warehouse-picking.jpg"
import warehouseTeam from "../../assets/site-photos/warehouse-team.jpg"
import cosmeticsShelves from "../../assets/site-photos/cosmetics-shelves.jpg"
import cosmeticsProducts from "../../assets/site-photos/cosmetics-products.jpg"
import babyClothes from "../../assets/site-photos/baby-clothes.jpg"
import babyFeeding from "../../assets/site-photos/baby-feeding.jpg"
import inventoryTablet from "../../assets/site-photos/inventory-tablet.jpg"
import inventoryComputer from "../../assets/site-photos/inventory-computer.jpg"
import inventoryCheck from "../../assets/site-photos/inventory-check.jpg"
import warehouseScreen from "../../assets/site-photos/waremap-3d-screen.png"
import type { PublicPage, SitePage } from "../site-content/types"

const photos = {
  picking: { image: warehousePicking, imageAlt: "Nhân viên lấy thùng hàng trên kệ trong kho" },
  team: { image: warehouseTeam, imageAlt: "Nhân viên phối hợp vận chuyển hàng giữa các dãy kệ kho" },
  cosmetics: { image: cosmeticsShelves, imageAlt: "Chai và hộp mỹ phẩm được trưng bày theo từng tầng kệ" },
  care: { image: cosmeticsProducts, imageAlt: "Sản phẩm chăm sóc cá nhân với nhiều loại bao bì trên kệ" },
  clothes: { image: babyClothes, imageAlt: "Quần áo sơ sinh với nhiều mẫu và kích thước tại cửa hàng" },
  feeding: { image: babyFeeding, imageAlt: "Bình sữa và sản phẩm dinh dưỡng dành cho bé" },
  tablet: { image: inventoryTablet, imageAlt: "Nhân viên dùng máy tính bảng và đầu đọc mã để kiểm tra hàng trong kho" },
  computer: { image: inventoryComputer, imageAlt: "Nhân viên xử lý thông tin hàng hóa trên máy tính tại bàn đóng gói" },
  check: { image: inventoryCheck, imageAlt: "Nhân viên đối chiếu thông tin tồn kho trên thiết bị cầm tay giữa các dãy kệ" },
  system: { image: warehouseScreen, imageAlt: "Giao diện WareMap thực tế: kệ A1 được chọn trên bản đồ 3D cùng vị trí và thông tin lô sản phẩm mẫu" },
}
const heroPhotos = { home: photos.picking, solution: photos.system, mom: photos.feeding, cosmetics: photos.cosmetics }

/** Defaults also cover older saved content, without rewriting CMS drafts or
 * persisting Vite's hashed asset URLs. An administrator's image always wins. */
export function withSitePhotos(page: SitePage, kind: PublicPage): SitePage {
  const sections: Record<string, typeof photos.picking> = {
    "warehouse-solution": photos.team,
    features: photos.picking,
    "what-is-waremap": photos.tablet,
    "solution-problems": photos.check,
    "solution-value": photos.computer,
    "industry-solution": kind === "mom" ? photos.clothes : photos.care,
    "industry-features": kind === "mom" ? photos.feeding : photos.cosmetics,
  }
  return {
    ...page,
    ...(!page.image ? heroPhotos[kind] : {}),
    sections: page.sections.map((section) => !section.image && sections[section.id]
      ? { ...section, ...sections[section.id] }
      : section),
  }
}
export const isSitePhoto = (source: string) => Object.values(photos).some((photo) => photo.image === source)
export const isSystemCapture = (source: string) => source === warehouseScreen
