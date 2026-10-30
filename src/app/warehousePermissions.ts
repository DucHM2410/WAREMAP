import type { Role } from "./model"
export const WAREHOUSE_PERMISSIONS: Record<Role, {view: boolean; design: boolean; putaway: boolean; scope: string}> = {
  owner: {view:true,design:true,putaway:true,scope:"Các cơ sở thuộc gói và được cấp quyền"},
  manager: {view:true,design:true,putaway:true,scope:"Kho được phân công"},
  warehouse: {view:true,design:false,putaway:true,scope:"Kho được phân công"},
  sales: {view:true,design:false,putaway:false,scope:"Chỉ tra cứu tại kho được phân công"},
  platform: {view:false,design:false,putaway:false,scope:"Quản trị hệ thống, không vào kho khách hàng"},
}
