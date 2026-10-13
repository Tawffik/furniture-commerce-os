export type ProductKind = 'جاهز' | 'تفصيل'
export type OrderStatus =
  | 'استفسار'
  | 'قيد التسعير'
  | 'بانتظار الموافقة'
  | 'مؤكد'
  | 'قيد التصنيع'
  | 'جاهز للتسليم'
  | 'تم التسليم'
  | 'متوقف'
  | 'ملغي'

export interface Product {
  id: string
  name: string
  category: string
  kind: ProductKind
  summary: string
  description: string
  /** Demo list price in EGP — clearly experimental */
  priceEgp: number | null
  materials: string
  dimensions: string
  finish: string
  leadTimeDays: number | null
  imageColor: string
  tags: string[]
  active: boolean
}

export interface QuoteLine {
  id: string
  label: string
  quantity: number
  unitPrice: number
}

export interface QuoteVersion {
  id: string
  version: number
  createdAt: string
  note: string
  lines: QuoteLine[]
  discount: number
  extraFees: number
  total: number
}

export interface Payment {
  id: string
  amount: number
  method: string
  note: string
  createdAt: string
}

export interface Order {
  id: string
  ref: string
  createdAt: string
  customerName: string
  phone: string
  area: string
  channel: string
  productId: string | null
  kind: ProductKind
  title: string
  details: string
  status: OrderStatus
  workshop: string
  nextAction: string
  blockedReason: string
  quotes: QuoteVersion[]
  payments: Payment[]
}

export interface AppState {
  version: 1
  products: Product[]
  orders: Order[]
  resetAt: string
}

export const ORDER_STATUSES: OrderStatus[] = [
  'استفسار',
  'قيد التسعير',
  'بانتظار الموافقة',
  'مؤكد',
  'قيد التصنيع',
  'جاهز للتسليم',
  'تم التسليم',
  'متوقف',
  'ملغي',
]

export const CATEGORIES = ['غرف نوم', 'سفرة', 'ركنات', 'مكاتب', 'تخزين', 'أخرى'] as const
export const CHANNELS = ['واتساب', 'فيسبوك', 'إنستجرام', 'مكالمة', 'إحالة', 'أخرى'] as const
export const WORKSHOPS = ['ورشة أ (تجريبي)', 'ورشة ب (تجريبي)', 'غير محدد'] as const
