import type { BatchRow } from './types'

// ─── Batch data ───────────────────────────────────────────────────────────────
export const BATCHES: BatchRow[] = [
  { sku: 'Paracetamol 500mg', batchId: 'BAT-2026-09A', expiry: '15/11/2026', qty: 240, location: 'A1-L2-B03', daysLeft: 53,  status: 'critical' },
  { sku: 'Amoxicillin 250mg', batchId: 'BAT-2026-07C', expiry: '28/12/2026', qty: 180, location: 'A1-L2-B04', daysLeft: 96,  status: 'warn' },
  { sku: 'Vitamin C 1000mg',  batchId: 'BAT-2026-08B', expiry: '05/03/2027', qty: 320, location: 'B2-L3-B01', daysLeft: 163, status: 'ok' },
  { sku: 'Omeprazole 20mg',   batchId: 'BAT-2026-06D', expiry: '20/04/2027', qty: 140, location: 'B1-L1-B06', daysLeft: 209, status: 'ok' },
  { sku: 'Cetirizine 10mg',   batchId: 'BAT-2025-12E', expiry: '01/09/2026', qty: 60,  location: 'C2-L2-B02', daysLeft: -23, status: 'expired' },
  { sku: 'Ibuprofen 400mg',   batchId: 'BAT-2026-05F', expiry: '10/11/2026', qty: 120, location: 'A2-L1-B01', daysLeft: 48,  status: 'critical' },
  { sku: 'Metformin 500mg',   batchId: 'BAT-2026-08G', expiry: '22/02/2027', qty: 280, location: 'B1-L2-B03', daysLeft: 151, status: 'ok' },
  { sku: 'Atorvastatin 20mg', batchId: 'BAT-2026-07H', expiry: '18/07/2027', qty: 100, location: 'C1-L1-B05', daysLeft: 297, status: 'ok' },
  { sku: 'Clarithromycin',    batchId: 'BAT-2025-11I', expiry: '03/09/2026', qty: 40,  location: 'A2-L3-B02', daysLeft: -21, status: 'expired' },
  { sku: 'Amlodipine 5mg',    batchId: 'BAT-2026-09J', expiry: '30/12/2026', qty: 200, location: 'B2-L1-B04', daysLeft: 98,  status: 'warn' },
]
