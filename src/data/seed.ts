import type { AppState, Order, Product } from './types'
import { orderTotal } from '../lib/money'

/** All names, phones, prices are DEMO ONLY — not real family data. */

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p-bed-oak',
    name: 'سرير خشب بلوط — موديل تجريبي',
    category: 'غرف نوم',
    kind: 'جاهز',
    summary: 'سرير مزدوج بتصميم بسيط — بيانات وأسعار تجريبية فقط.',
    description:
      'موديل جاهز للعرض في الديمو. الخامات والمقاسات والأسعار أمثلة وليست أسعار الورشة الحقيقية. يمكن طلب تفصيل بمقاسات مختلفة عبر نموذج الطلب.',
    priceEgp: 18500,
    materials: 'خشب طبيعي (مثال) + دهان مات',
    dimensions: '200 × 180 سم (مثال)',
    finish: 'لون خشبي طبيعي',
    leadTimeDays: 14,
    imageColor: '#8B6914',
    tags: ['سرير', 'غرف نوم', 'جاهز'],
    active: true,
  },
  {
    id: 'p-dining-6',
    name: 'سفرة 6 كراسي — تجريبي',
    category: 'سفرة',
    kind: 'جاهز',
    summary: 'سفرة عائلية مع 6 كراسي — سعر تجريبي.',
    description: 'منتج كتالوج تجريبي. التوفر ومدة التنفيذ تحتاج تأكيد العائلة في النظام الحقيقي.',
    priceEgp: 22000,
    materials: 'خشب + قماش كراسي (مثال)',
    dimensions: 'طاولة 160 × 90 سم',
    finish: 'بني غامق',
    leadTimeDays: 21,
    imageColor: '#5D4037',
    tags: ['سفرة', 'جاهز'],
    active: true,
  },
  {
    id: 'p-sofa-l',
    name: 'ركنة حرف L — تجريبي',
    category: 'ركنات',
    kind: 'جاهز',
    summary: 'ركنة مريحة للمساحات المتوسطة — بيانات تجريبية.',
    description: 'يمكن تخصيص القماش والزاوية في مسار التفصيل.',
    priceEgp: 28000,
    materials: 'إسفنج + قماش (مثال)',
    dimensions: 'حسب الرسم التجريبي',
    finish: 'رمادي فاتح',
    leadTimeDays: 25,
    imageColor: '#607D8B',
    tags: ['ركنة', 'جاهز'],
    active: true,
  },
  {
    id: 'p-desk',
    name: 'مكتب عمل منزلي — تجريبي',
    category: 'مكاتب',
    kind: 'جاهز',
    summary: 'مكتب بسيط مع أدراج — سعر تجريبي.',
    description: 'مناسب للشقق الصغيرة في سيناريو الديمو.',
    priceEgp: 9500,
    materials: 'خشب صناعي مطلي (مثال)',
    dimensions: '120 × 60 × 75 سم',
    finish: 'أبيض / خشبي',
    leadTimeDays: 10,
    imageColor: '#A1887F',
    tags: ['مكتب', 'جاهز'],
    active: true,
  },
  {
    id: 'p-wardrobe',
    name: 'دولاب ملابس 3 أبواب — تجريبي',
    category: 'تخزين',
    kind: 'جاهز',
    summary: 'دولاب بثلاثة أبواب ومرايا اختيارية — تجريبي.',
    description: 'خيارات التفصيل تشمل المقاس حسب ارتفاع السقف.',
    priceEgp: 16000,
    materials: 'خشب + مرايا (اختياري)',
    dimensions: '180 × 60 × 220 سم (مثال)',
    finish: 'بيج',
    leadTimeDays: 18,
    imageColor: '#D7CCC8',
    tags: ['دولاب', 'تخزين'],
    active: true,
  },
  {
    id: 'p-custom-kitchen',
    name: 'مطبخ حسب المقاس — مسار تفصيل',
    category: 'أخرى',
    kind: 'تفصيل',
    summary: 'ليس له سعر ثابت — يحتاج مقاسات وخامات وعرض سعر.',
    description:
      'مسار التفصيل في الديمو: العميل يرسل المقاسات والمنطقة، ثم يُنشأ عرض سعر بنسخ متعددة دون مسح التاريخ.',
    priceEgp: null,
    materials: 'حسب الاتفاق',
    dimensions: 'حسب الموقع',
    finish: 'حسب الاختيار',
    leadTimeDays: null,
    imageColor: '#795548',
    tags: ['تفصيل', 'مطبخ'],
    active: true,
  },
  {
    id: 'p-nightstand',
    name: 'كومودينو زوج — تجريبي',
    category: 'غرف نوم',
    kind: 'جاهز',
    summary: 'طقم كومودينو بجانب السرير.',
    description: 'سعر تجريبي للزوج.',
    priceEgp: 4200,
    materials: 'خشب (مثال)',
    dimensions: '50 × 40 × 55 سم للقطعة',
    finish: 'مطابق للسرير',
    leadTimeDays: 12,
    imageColor: '#8D6E63',
    tags: ['غرف نوم', 'جاهز'],
    active: true,
  },
  {
    id: 'p-tv-unit',
    name: 'وحدة تلفزيون — تجريبي',
    category: 'تخزين',
    kind: 'جاهز',
    summary: 'وحدة TV بعرض قابل للتعديل في التفصيل.',
    description: 'في الديمو السعر للكتالوج فقط.',
    priceEgp: 7500,
    materials: 'خشب + دهان',
    dimensions: '160 × 40 × 50 سم',
    finish: 'رمادي',
    leadTimeDays: 15,
    imageColor: '#455A64',
    tags: ['تخزين', 'جاهز'],
    active: true,
  },
]

function qLines(label: string, qty: number, price: number) {
  return [{ id: cryptoRandom(), label, quantity: qty, unitPrice: price }]
}

function cryptoRandom(): string {
  return `id-${Math.random().toString(36).slice(2, 10)}`
}

export function buildSeedOrders(now = new Date()): Order[] {
  const iso = (d: Date) => d.toISOString()
  const daysAgo = (n: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - n)
    return d
  }

  const lines1 = qLines('سرير خشب بلوط — تجريبي', 1, 18500)
  const total1 = orderTotal(lines1)

  const lines2 = [
    { id: cryptoRandom(), label: 'ركنة L قماش رمادي', quantity: 1, unitPrice: 26000 },
    { id: cryptoRandom(), label: 'توصيل تجريبي', quantity: 1, unitPrice: 800 },
  ]
  const total2v1 = orderTotal(lines2, 0, 0)
  const lines2b = [
    { id: cryptoRandom(), label: 'ركنة L قماش رمادي', quantity: 1, unitPrice: 25000 },
    { id: cryptoRandom(), label: 'توصيل تجريبي', quantity: 1, unitPrice: 800 },
  ]
  const total2v2 = orderTotal(lines2b, 500, 0)

  const customLines = [
    { id: cryptoRandom(), label: 'مطبخ علوي (تقديري تجريبي)', quantity: 1, unitPrice: 18000 },
    { id: cryptoRandom(), label: 'مطبخ سفلي (تقديري تجريبي)', quantity: 1, unitPrice: 22000 },
  ]
  const totalCustom = orderTotal(customLines)

  return [
    {
      id: 'ord-1',
      ref: 'FC-1001',
      createdAt: iso(daysAgo(5)),
      customerName: 'عميل تجريبي أ',
      phone: '01000000001',
      area: 'القاهرة — مثال',
      channel: 'واتساب',
      productId: 'p-bed-oak',
      kind: 'جاهز',
      title: 'طلب سرير جاهز',
      details: 'لون طبيعي — توصيل داخل القاهرة (سيناريو تجريبي).',
      status: 'قيد التصنيع',
      workshop: 'ورشة أ (تجريبي)',
      nextAction: 'متابعة دهان الإطار',
      blockedReason: '',
      quotes: [
        {
          id: 'q1',
          version: 1,
          createdAt: iso(daysAgo(4)),
          note: 'عرض أولي',
          lines: lines1,
          discount: 0,
          extraFees: 0,
          total: total1,
        },
      ],
      payments: [
        {
          id: 'pay1',
          amount: 5000,
          method: 'تحويل (تجريبي)',
          note: 'عربون تجريبي',
          createdAt: iso(daysAgo(3)),
        },
      ],
    },
    {
      id: 'ord-2',
      ref: 'FC-1002',
      createdAt: iso(daysAgo(12)),
      customerName: 'عميل تجريبي ب',
      phone: '01000000002',
      area: 'الجيزة — مثال',
      channel: 'فيسبوك',
      productId: 'p-sofa-l',
      kind: 'جاهز',
      title: 'ركنة — تعديل سعر',
      details: 'تم تخفيض السعر في نسخة العرض الثانية (للتوضيح فقط).',
      status: 'بانتظار الموافقة',
      workshop: 'ورشة ب (تجريبي)',
      nextAction: 'انتظار رد العميل على العرض v2',
      blockedReason: '',
      quotes: [
        {
          id: 'q2a',
          version: 1,
          createdAt: iso(daysAgo(11)),
          note: 'عرض أولي',
          lines: lines2,
          discount: 0,
          extraFees: 0,
          total: total2v1,
        },
        {
          id: 'q2b',
          version: 2,
          createdAt: iso(daysAgo(10)),
          note: 'تعديل بعد مناقشة',
          lines: lines2b,
          discount: 500,
          extraFees: 0,
          total: total2v2,
        },
      ],
      payments: [],
    },
    {
      id: 'ord-3',
      ref: 'FC-1003',
      createdAt: iso(daysAgo(2)),
      customerName: 'عميل تجريبي ج',
      phone: '01000000003',
      area: 'الإسكندرية — مثال',
      channel: 'واتساب',
      productId: 'p-custom-kitchen',
      kind: 'تفصيل',
      title: 'مطبخ حسب المقاس',
      details: 'عرض سعر تقديري جاهز للمراجعة.',
      status: 'قيد التسعير',
      workshop: 'ورشة ب (تجريبي)',
      nextAction: 'مراجعة العرض مع العميل',
      blockedReason: '',
      quotes: [
        {
          id: 'q5',
          version: 1,
          createdAt: iso(daysAgo(1)),
          note: 'تقدير أولي — ليس سعر ورشة حقيقي',
          lines: customLines,
          discount: 0,
          extraFees: 0,
          total: totalCustom,
        },
      ],
      payments: [],
    },
  ]
}

export function createSeedState(): AppState {
  return {
    version: 1,
    products: SEED_PRODUCTS.map((p) => ({ ...p })),
    orders: buildSeedOrders(),
    resetAt: new Date().toISOString(),
  }
}
