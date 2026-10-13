import { createSeedState } from './seed'
import type { AppState, Order, Payment, Product, QuoteLine, QuoteVersion } from './types'
import { orderTotal } from '../lib/money'

const KEY = 'furniture-commerce-os-demo-v1'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw) as AppState
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.products) || !Array.isArray(parsed.orders)) {
      return createSeedState()
    }
    return parsed
  } catch {
    return createSeedState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function resetState(): AppState {
  const s = createSeedState()
  saveState(s)
  return s
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function nextRef(orders: Order[]): string {
  const nums = orders
    .map((o) => parseInt(o.ref.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 1000
  return `FC-${max + 1}`
}

export function createInquiry(
  state: AppState,
  input: {
    customerName: string
    phone: string
    area: string
    channel: string
    productId: string | null
    kind: Order['kind']
    title: string
    details: string
  }
): { state: AppState; order: Order } {
  const order: Order = {
    id: uid('ord'),
    ref: nextRef(state.orders),
    createdAt: new Date().toISOString(),
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    area: input.area.trim() || 'غير محددة',
    channel: input.channel,
    productId: input.productId,
    kind: input.kind,
    title: input.title.trim(),
    details: input.details.trim(),
    status: 'استفسار',
    workshop: 'غير محدد',
    nextAction: 'مراجعة الاستفسار والرد على العميل',
    blockedReason: '',
    quotes: [],
    payments: [],
  }
  const next = { ...state, orders: [order, ...state.orders] }
  saveState(next)
  return { state: next, order }
}

export function updateOrder(state: AppState, orderId: string, patch: Partial<Order>): AppState {
  const next = {
    ...state,
    orders: state.orders.map((o) => (o.id === orderId ? { ...o, ...patch, id: o.id, ref: o.ref } : o)),
  }
  saveState(next)
  return next
}

export function addQuote(
  state: AppState,
  orderId: string,
  lines: QuoteLine[],
  discount: number,
  extraFees: number,
  note: string
): AppState {
  const total = orderTotal(lines, discount, extraFees)
  const nextOrders = state.orders.map((o) => {
    if (o.id !== orderId) return o
    const version = (o.quotes.reduce((m, q) => Math.max(m, q.version), 0) || 0) + 1
    const q: QuoteVersion = {
      id: uid('q'),
      version,
      createdAt: new Date().toISOString(),
      note: note.trim() || `عرض رقم ${version}`,
      lines,
      discount: Math.max(0, discount),
      extraFees: Math.max(0, extraFees),
      total,
    }
    return {
      ...o,
      quotes: [...o.quotes, q],
      status: o.status === 'استفسار' ? 'قيد التسعير' : o.status,
    }
  })
  const next = { ...state, orders: nextOrders }
  saveState(next)
  return next
}

export function addPayment(
  state: AppState,
  orderId: string,
  amount: number,
  method: string,
  note: string
): AppState {
  if (!Number.isFinite(amount) || amount <= 0) return state
  const payment: Payment = {
    id: uid('pay'),
    amount,
    method: method.trim() || 'تجريبي',
    note: note.trim(),
    createdAt: new Date().toISOString(),
  }
  const next = {
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId ? { ...o, payments: [...o.payments, payment] } : o
    ),
  }
  saveState(next)
  return next
}

export function upsertProduct(state: AppState, product: Product): AppState {
  const exists = state.products.some((p) => p.id === product.id)
  const products = exists
    ? state.products.map((p) => (p.id === product.id ? product : p))
    : [product, ...state.products]
  const next = { ...state, products }
  saveState(next)
  return next
}

export function deleteProduct(state: AppState, productId: string): AppState {
  const next = { ...state, products: state.products.filter((p) => p.id !== productId) }
  saveState(next)
  return next
}

export function latestQuote(order: Order): QuoteVersion | null {
  if (!order.quotes.length) return null
  return order.quotes.reduce((a, b) => (a.version >= b.version ? a : b))
}
