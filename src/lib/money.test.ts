import { describe, expect, it } from 'vitest'
import { lineTotal, orderTotal, paymentStatus, remainingBalance } from './money'

describe('money rules', () => {
  it('lineTotal multiplies and rejects negatives', () => {
    expect(lineTotal(2, 1000)).toBe(2000)
    expect(lineTotal(-1, 1000)).toBe(0)
    expect(lineTotal(2, -5)).toBe(0)
  })

  it('orderTotal applies discount and fees', () => {
    expect(orderTotal([{ quantity: 1, unitPrice: 10000 }], 500, 200)).toBe(9700)
  })

  it('remainingBalance never negative', () => {
    expect(remainingBalance(10000, [{ amount: 3000 }, { amount: 8000 }])).toBe(0)
    expect(remainingBalance(10000, [{ amount: 3000 }])).toBe(7000)
  })

  it('paymentStatus labels', () => {
    expect(paymentStatus(10000, 10000)).toBe('غير مدفوع')
    expect(paymentStatus(10000, 4000)).toBe('جزئي')
    expect(paymentStatus(10000, 0)).toBe('مدفوع بالكامل')
  })

  it('ignores invalid payment amounts', () => {
    expect(remainingBalance(5000, [{ amount: -10 }, { amount: 1000 }])).toBe(4000)
  })
})
