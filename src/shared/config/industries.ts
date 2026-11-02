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
    primaryColor: '#DB2777',
    accentColor: '#7C3AED',
    heroTagline: 'Quản lý kho sữa, bỉm, đồ dùng cho bé — không sót lô, không nhặt nhầm',
    sampleCategories: ['Sữa bột', 'Bỉm tã', 'Ăn dặm', 'Đồ dùng bé', 'Chăm sóc mẹ'],
    sampleRacks: ['Kệ Sữa', 'Kệ Bỉm', 'Kệ Ăn Dặm', 'Kệ Đồ Dùng', 'Tủ Mát'],
    sampleSKUs: [
      { sku: 'MILK-001', name: 'Sữa Nan Optipro 3', category: 'Sữa bột', unit: 'Hộp 800g' },
      { sku: 'DIAP-002', name: 'Bỉm Huggies M', category: 'Bỉm tã', unit: 'Bịch 76 miếng' },
      { sku: 'BABY-003', name: 'Bột Ăn Dặm Hipp', category: 'Ăn dặm', unit: 'Hộp 250g' },
      { sku: 'BABY-004', name: 'Vitamin D3 Ostelin', category: 'Chăm sóc mẹ', unit: 'Lọ 20ml' },
      { sku: 'BABY-005', name: 'Cháo ăn dặm Heinz', category: 'Ăn dặm', unit: 'Hộp 120g' },
      { sku: 'BABY-006', name: 'Dầu gội trẻ em Cetaphil', category: 'Chăm sóc mẹ', unit: 'Chai 230ml' },
      { sku: 'BABY-007', name: 'Nước giặt D-nee', category: 'Đồ dùng bé', unit: 'Túi 600ml' },
      { sku: 'BABY-008', name: 'Kem chống hăm Bepanthen', category: 'Chăm sóc mẹ', unit: 'Tuýp 30g' },
      { sku: 'BABY-009', name: 'Khăn ướt Mamamy', category: 'Đồ dùng bé', unit: 'Gói 100 tờ' },
    ],
    sampleBatches: [
      { lot: 'LOT-MILK-2026', expiry: '15/10/2026', qty: 120 },
      { lot: 'LOT-DIAP-2026', expiry: '22/12/2026', qty: 240 },
      { lot: 'LOT-BABY-2026', expiry: '05/11/2026', qty: 180 },
      { lot: 'LOT-VITD3-2026', expiry: '08/11/2026', qty: 36 },
      { lot: 'LOT-HEINZ-2026', expiry: '11/11/2026', qty: 52 },
      { lot: 'LOT-CETAPHIL-2026', expiry: '14/11/2026', qty: 28 },
      { lot: 'LOT-DNEE-2026', expiry: '18/11/2026', qty: 44 },
      { lot: 'LOT-BEPANTHEN-2026', expiry: '23/11/2026', qty: 31 },
      { lot: 'LOT-MAMAMY-2026', expiry: '29/11/2026', qty: 67 },
    ],
  },
  'cosmetics': {
    id: 'cosmetics',
    label: 'Mỹ phẩm & Chăm sóc cá nhân',
    shortLabel: 'Mỹ phẩm',
    icon: 'Sparkles',
    primaryColor: '#0891B2',
    accentColor: '#2563EB',
    heroTagline: 'Quản lý kho mỹ phẩm theo lô, hạn dùng — tự tin tư vấn cho khách',
    sampleCategories: ['Son môi', 'Kem dưỡng', 'Sữa rửa mặt', 'Nước hoa', 'Trang điểm'],
    sampleRacks: ['Kệ Son', 'Kệ Kem', 'Kệ Trang Điểm', 'Kệ Nước Hoa', 'Khu Tester'],
    sampleSKUs: [
      { sku: 'LIP-001', name: 'Son MAC Ruby Woo', category: 'Son môi', unit: 'Thỏi 3g' },
      { sku: 'CRM-002', name: 'Kem Dưỡng Innisfree', category: 'Kem dưỡng', unit: 'Hũ 50ml' },
      { sku: 'SER-003', name: 'Serum The Ordinary', category: 'Serum', unit: 'Chai 30ml' },
      { sku: 'SUN-004', name: 'Kem chống nắng Skin1004', category: 'Chăm sóc da', unit: 'Tuýp 50ml' },
      { sku: 'CLN-005', name: 'Sữa rửa mặt CeraVe', category: 'Chăm sóc da', unit: 'Chai 236ml' },
      { sku: 'TON-006', name: 'Toner Klairs Supple', category: 'Chăm sóc da', unit: 'Chai 180ml' },
      { sku: 'CRM-007', name: 'Kem dưỡng CeraVe PM', category: 'Kem dưỡng', unit: 'Chai 52ml' },
      { sku: 'LIP-008', name: 'Son Maybelline Vinyl Ink', category: 'Son môi', unit: 'Thỏi 4.2ml' },
      { sku: 'MAS-009', name: 'Mascara Maybelline Sky High', category: 'Trang điểm', unit: 'Tuýp 6ml' },
    ],
    sampleBatches: [
      { lot: 'LOT-LIP-2026', expiry: '15/10/2026', qty: 60 },
      { lot: 'LOT-CRM-2026', expiry: '22/12/2026', qty: 80 },
      { lot: 'LOT-SER-2026', expiry: '05/11/2026', qty: 45 },
      { lot: 'LOT-SUN-2026', expiry: '08/11/2026', qty: 32 },
      { lot: 'LOT-CLN-2026', expiry: '11/11/2026', qty: 27 },
      { lot: 'LOT-TON-2026', expiry: '14/11/2026', qty: 41 },
      { lot: 'LOT-CRM-PM-2026', expiry: '18/11/2026', qty: 24 },
      { lot: 'LOT-LIP-VINYL-2026', expiry: '23/11/2026', qty: 38 },
      { lot: 'LOT-MAS-2026', expiry: '29/11/2026', qty: 19 },
    ],
  },
}

export const DEFAULT_INDUSTRY: Industry = 'mom-baby'
