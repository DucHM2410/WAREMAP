export type Industry = 'mom-baby' | 'cosmetics'

export interface IndustryConfig {
  id: Industry
  label: string
  shortLabel: string
  icon: string
  primaryColor: string
  accentColor: string
  heroTagline: string
  sampleCategories: string[]
  sampleRacks: string[]
  sampleSKUs: { sku: string; name: string; category: string; unit: string }[]
  sampleBatches: { lot: string; expiry: string; qty: number }[]
}

export const INDUSTRIES: Record<Industry, IndustryConfig> = {
  'mom-baby': {
    id: 'mom-baby',
    label: 'Mẹ & Bé',
    shortLabel: 'Mẹ & Bé',
    icon: 'Baby',
    primaryColor: '#0891B2',
    accentColor: '#F59E0B',
    heroTagline: 'Quản lý kho sữa, bỉm, đồ dùng cho bé — không sót lô, không nhặt nhầm',
    sampleCategories: ['Sữa bột', 'Bỉm tã', 'Ăn dặm', 'Đồ dùng bé', 'Chăm sóc mẹ'],
    sampleRacks: ['Kệ Sữa', 'Kệ Bỉm', 'Kệ Ăn Dặm', 'Kệ Đồ Dùng', 'Tủ Mát'],
    sampleSKUs: [
      { sku: 'MILK-001', name: 'Sữa Nan Optipro 3', category: 'Sữa bột', unit: 'Hộp 800g' },
      { sku: 'DIAP-002', name: 'Bỉm Huggies M', category: 'Bỉm tã', unit: 'Bịch 76 miếng' },
      { sku: 'BABY-003', name: 'Bột Ăn Dặm Hipp', category: 'Ăn dặm', unit: 'Hộp 250g' },
    ],
    sampleBatches: [
      { lot: 'LOT-MILK-2026', expiry: '15/10/2026', qty: 120 },
      { lot: 'LOT-DIAP-2026', expiry: '22/12/2026', qty: 240 },
      { lot: 'LOT-BABY-2026', expiry: '05/11/2026', qty: 180 },
    ],
  },
  'cosmetics': {
    id: 'cosmetics',
    label: 'Mỹ phẩm & Chăm sóc cá nhân',
    shortLabel: 'Mỹ phẩm',
    icon: 'Sparkles',
    primaryColor: '#DB2777',
    accentColor: '#7C3AED',
    heroTagline: 'Quản lý kho mỹ phẩm theo lô, hạn dùng — tự tin tư vấn cho khách',
    sampleCategories: ['Son môi', 'Kem dưỡng', 'Sữa rửa mặt', 'Nước hoa', 'Trang điểm'],
    sampleRacks: ['Kệ Son', 'Kệ Kem', 'Kệ Trang Điểm', 'Kệ Nước Hoa', 'Khu Tester'],
    sampleSKUs: [
      { sku: 'LIP-001', name: 'Son MAC Ruby Woo', category: 'Son môi', unit: 'Thỏi 3g' },
      { sku: 'CRM-002', name: 'Kem Dưỡng Innisfree', category: 'Kem dưỡng', unit: 'Hũ 50ml' },
      { sku: 'SER-003', name: 'Serum The Ordinary', category: 'Serum', unit: 'Chai 30ml' },
    ],
    sampleBatches: [
      { lot: 'LOT-LIP-2026', expiry: '15/10/2026', qty: 60 },
      { lot: 'LOT-CRM-2026', expiry: '22/12/2026', qty: 80 },
      { lot: 'LOT-SER-2026', expiry: '05/11/2026', qty: 45 },
    ],
  },
}

export const DEFAULT_INDUSTRY: Industry = 'mom-baby'
