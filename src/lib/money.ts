/** Business calculation rules for the demo (EGP, integer piasters avoided — whole pounds). */

export function lineTotal(qty: number, unitPrice: number): number {
  if (!Number.isFinite(qty) || !Number.isFinite(unitPrice)) return 0
  if (qty < 0 || unitPrice < 0) return 0
  return Math.round(qty * unitPrice)
}

export function orderTotal(
  lines: { quantity: number; unitPrice: number }[],
  discount = 0,
  extraFees = 0
): number {
  const sum = lines.reduce((acc, l) => acc + lineTotal(l.quantity, l.unitPrice), 0)
  const d = Math.max(0, Number.isFinite(discount) ? discount : 0)
  const f = Math.max(0, Number.isFinite(extraFees) ? extraFees : 0)
  return Math.max(0, sum - d + f)
}

export function remainingBalance(totalDue: number, payments: { amount: number }[]): number {
  const paid = payments.reduce((a, p) => a + (Number.isFinite(p.amount) && p.amount > 0 ? p.amount : 0), 0)
  return Math.max(0, totalDue - paid)
}

export function paymentStatus(totalDue: number, remaining: number): 'غير مدفوع' | 'جزئي' | 'مدفوع بالكامل' {
  if (totalDue <= 0) return 'غير مدفوع'
  if (remaining <= 0) return 'مدفوع بالكامل'
  if (remaining < totalDue) return 'جزئي'
  return 'غير مدفوع'
}

export function formatEgp(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(n)
}
