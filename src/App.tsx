import { NavLink, Route, Routes, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState, FormEvent } from 'react'
import type { AppState, Order, OrderStatus, Product, ProductKind, QuoteLine } from './data/types'
import { CATEGORIES, CHANNELS, ORDER_STATUSES, WORKSHOPS } from './data/types'
import {
  addPayment,
  addQuote,
  createInquiry,
  deleteProduct,
  latestQuote,
  loadState,
  resetState,
  updateOrder,
  upsertProduct,
} from './data/store'
import { formatEgp, paymentStatus, remainingBalance } from './lib/money'

function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState())
  const refresh = useCallback(() => setState(loadState()), [])
  useEffect(() => {
    const onStorage = () => refresh()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])
  return { state, setState, refresh }
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            أثاث <span>العائلة</span> — ديمو
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              الرئيسية
            </NavLink>
            <NavLink to="/catalog">الكتالوج</NavLink>
            <NavLink to="/inquiry">طلب استفسار</NavLink>
            <NavLink to="/ops">لوحة التشغيل (ديمو)</NavLink>
          </nav>
        </div>
      </header>
      <div className="banner-demo">
        <strong>ديمو تجريبي فقط.</strong> الأسعار والطلبات والعملاء وهمية. البيانات تُحفظ محليًا في متصفحك ولا تُزامَن مع أحد.
        لوحة التشغيل ليست نظام صلاحيات إنتاجي — الرابط عام تقنيًا على موقع static.
      </div>
      {children}
      <footer className="footer-note">
        Furniture Commerce OS Demo · React + Vite · تخزين محلي · ليس نظام محاسبة أو دفع حقيقي
      </footer>
    </div>
  )
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <div className="product-thumb" style={{ background: `linear-gradient(135deg, ${product.imageColor}, #1c1917)` }}>
      {product.category}
    </div>
  )
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="card">
          <h1>ورشتان للأثاث — تجربة رقمية للطلب والمتابعة</h1>
          <p>
            هذا الديمو يوضح فكرة كتالوج عربي + استفسار/طلب + لوحة تشغيل تجريبية للطلبات وعروض الأسعار والدفعات.
            مبني على افتراضات موثّقة؛ ليس أسعار أو سياسات العائلة الحقيقية.
          </p>
          <div className="row">
            <Link className="btn" to="/catalog">
              تصفح الكتالوج
            </Link>
            <Link className="btn secondary" to="/inquiry">
              ابدأ استفسارًا
            </Link>
            <Link className="btn secondary" to="/ops">
              لوحة التشغيل
            </Link>
          </div>
        </div>
        <div className="card">
          <h2>ماذا يعمل في الديمو؟</h2>
          <ul className="muted">
            <li>بحث وفلاتر على المنتجات</li>
            <li>طلب جاهز أو تفصيل</li>
            <li>تغيير حالة الطلب</li>
            <li>عروض أسعار بنسخ تاريخية</li>
            <li>دفعات تجريبية ورصيد متبقي</li>
            <li>إعادة ضبط البيانات</li>
          </ul>
        </div>
      </section>
    </>
  )
}

function Catalog({ state }: { state: AppState }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('الكل')
  const [kind, setKind] = useState('الكل')
  const products = useMemo(() => {
    return state.products.filter((p) => {
      if (!p.active) return false
      if (cat !== 'الكل' && p.category !== cat) return false
      if (kind !== 'الكل' && p.kind !== kind) return false
      const hay = `${p.name} ${p.summary} ${p.tags.join(' ')}`.toLowerCase()
      return !q.trim() || hay.includes(q.trim().toLowerCase())
    })
  }, [state.products, q, cat, kind])

  return (
    <section>
      <h2>كتالوج المنتجات (تجريبي)</h2>
      <div className="toolbar">
        <input placeholder="بحث…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="تصنيف">
          <option value="الكل">كل التصنيفات</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="النوع">
          <option value="الكل">جاهز + تفصيل</option>
          <option value="جاهز">جاهز</option>
          <option value="تفصيل">تفصيل</option>
        </select>
      </div>
      {products.length === 0 ? (
        <div className="empty card">لا توجد منتجات مطابقة. جرّب تغيير البحث أو الفلاتر.</div>
      ) : (
        <div className="grid-products">
          {products.map((p) => (
            <article key={p.id} className="card product-card">
              <ProductThumb product={p} />
              <div className="product-body">
                <h3>
                  <Link to={`/product/${p.id}`}>{p.name}</Link>
                </h3>
                <div>
                  <span className="chip">{p.kind}</span>
                  <span className="chip">{p.category}</span>
                </div>
                <p className="meta">{p.summary}</p>
                <div className="price">
                  {p.priceEgp == null ? 'السعر بعد عرض تفصيلي' : formatEgp(p.priceEgp)}
                </div>
                <Link className="btn secondary" to={`/product/${p.id}`}>
                  التفاصيل
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function ProductPage({ state }: { state: AppState }) {
  const { id } = useParams()
  const p = state.products.find((x) => x.id === id)
  if (!p) {
    return (
      <div className="card empty">
        المنتج غير موجود.{' '}
        <Link to="/catalog">العودة للكتالوج</Link>
      </div>
    )
  }
  return (
    <section className="card">
      <ProductThumb product={p} />
      <h1 style={{ marginTop: 12 }}>{p.name}</h1>
      <div className="row">
        <span className="chip">{p.kind}</span>
        <span className="chip">{p.category}</span>
      </div>
      <p>{p.description}</p>
      <p className="meta">الخامات: {p.materials}</p>
      <p className="meta">المقاسات: {p.dimensions}</p>
      <p className="meta">التشطيب: {p.finish}</p>
      <p className="meta">
        مدة تقريبية: {p.leadTimeDays == null ? 'تُحدد بعد العرض' : `${p.leadTimeDays} يومًا (تجريبي)`}
      </p>
      <p className="price" style={{ fontSize: '1.2rem' }}>
        {p.priceEgp == null ? 'بدون سعر ثابت — مسار تفصيل' : formatEgp(p.priceEgp)}
      </p>
      <div className="row">
        <Link className="btn" to={`/inquiry?product=${p.id}`}>
          اطلب / استفسر عن هذا المنتج
        </Link>
        <Link className="btn secondary" to="/catalog">
          رجوع
        </Link>
      </div>
    </section>
  )
}

function InquiryForm({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const productId = sp.get('product')
  const product = state.products.find((p) => p.id === productId)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [area, setArea] = useState('')
  const [channel, setChannel] = useState<string>(CHANNELS[0])
  const [kind, setKind] = useState<ProductKind>(product?.kind ?? 'جاهز')
  const [title, setTitle] = useState(product ? `استفسار: ${product.name}` : '')
  const [details, setDetails] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Order | null>(null)

  function validate() {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'اكتب الاسم (حرفين على الأقل)'
    if (!/^01\d{9}$/.test(phone.trim()) && !/^0\d{9,11}$/.test(phone.trim())) {
      e.phone = 'رقم هاتف مصري تجريبي مثل 01012345678'
    }
    if (title.trim().length < 3) e.title = 'عنوان قصير للطلب'
    if (details.trim().length < 5) e.details = 'اكتب تفاصيل أو مقاسات أو ملاحظات'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    const { state: next, order } = createInquiry(state, {
      customerName: name,
      phone,
      area,
      channel,
      productId: product?.id ?? null,
      kind,
      title,
      details,
    })
    setState(next)
    setDone(order)
  }

  if (done) {
    return (
      <div className="success-box card">
        <h2>تم تسجيل الاستفسار (تجريبي)</h2>
        <p>
          الرقم المرجعي: <strong>{done.ref}</strong>
        </p>
        <p className="muted">الطلب ظاهر الآن في لوحة التشغيل داخل هذا المتصفح فقط.</p>
        <div className="row">
          <Link className="btn" to={`/ops/orders/${done.id}`}>
            عرض الطلب في اللوحة
          </Link>
          <button className="btn secondary" type="button" onClick={() => navigate('/catalog')}>
            الكتالوج
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="card" style={{ maxWidth: 560 }}>
      <h2>نموذج استفسار / طلب تجريبي</h2>
      {product && <p className="meta">مرتبط بالمنتج: {product.name}</p>}
      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">الاسم</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="field">
          <label htmlFor="phone">الهاتف</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>
        <div className="field">
          <label htmlFor="area">المنطقة</label>
          <input id="area" value={area} onChange={(e) => setArea(e.target.value)} placeholder="مثال تجريبي" />
        </div>
        <div className="field">
          <label htmlFor="channel">مصدر التواصل</label>
          <select id="channel" value={channel} onChange={(e) => setChannel(e.target.value)}>
            {CHANNELS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="kind">النوع</label>
          <select id="kind" value={kind} onChange={(e) => setKind(e.target.value as ProductKind)}>
            <option value="جاهز">موديل جاهز</option>
            <option value="تفصيل">تفصيل حسب الطلب</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="title">عنوان الطلب</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>
        <div className="field">
          <label htmlFor="details">التفاصيل / المقاسات</label>
          <textarea id="details" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />
          {errors.details && <div className="error">{errors.details}</div>}
        </div>
        <button className="btn" type="submit">
          إرسال الاستفسار (تجريبي)
        </button>
      </form>
    </section>
  )
}

function OpsHome({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const needAction = state.orders.filter((o) =>
    ['استفسار', 'قيد التسعير', 'بانتظار الموافقة', 'متوقف'].includes(o.status)
  )
  const delivered = state.orders.filter((o) => o.status === 'تم التسليم')
  let orderValue = 0
  let collected = 0
  for (const o of state.orders) {
    const q = latestQuote(o)
    if (q) orderValue += q.total
    collected += o.payments.reduce((a, p) => a + p.amount, 0)
  }

  return (
    <section>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <h2>لوحة التشغيل — ديمو</h2>
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            if (confirm('إعادة ضبط كل البيانات التجريبية؟')) setState(resetState())
          }}
        >
          إعادة ضبط البيانات
        </button>
      </div>
      <p className="muted">
        المؤشرات محسوبة من بيانات الديمو الحالية. إجمالي قيمة الطلبات ≠ المحصّل ≠ الربح. لا توجد تكلفة تصنيع مسجّلة هنا.
      </p>
      <div className="stats">
        <div className="stat">
          <div className="n">{state.orders.length}</div>
          <div className="l">كل الطلبات</div>
        </div>
        <div className="stat">
          <div className="n">{needAction.length}</div>
          <div className="l">تحتاج متابعة</div>
        </div>
        <div className="stat">
          <div className="n">{formatEgp(orderValue)}</div>
          <div className="l">قيمة عروض حالية</div>
        </div>
        <div className="stat">
          <div className="n">{formatEgp(collected)}</div>
          <div className="l">مدفوعات مسجّلة</div>
        </div>
        <div className="stat">
          <div className="n">{delivered.length}</div>
          <div className="l">تم التسليم</div>
        </div>
        <div className="stat">
          <div className="n">{state.products.filter((p) => p.active).length}</div>
          <div className="l">منتجات نشطة</div>
        </div>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <Link className="btn" to="/ops/orders">
          الطلبات
        </Link>
        <Link className="btn secondary" to="/ops/products">
          المنتجات
        </Link>
      </div>
      <div className="card">
        <h3 className="section" style={{ marginTop: 0 }}>
          يحتاج متابعة اليوم
        </h3>
        {needAction.length === 0 ? (
          <div className="empty">لا توجد طلبات في حالات المتابعة الحالية.</div>
        ) : (
          <ul>
            {needAction.map((o) => (
              <li key={o.id}>
                <Link to={`/ops/orders/${o.id}`}>
                  {o.ref} — {o.title}
                </Link>{' '}
                <span className="status warn">{o.status}</span> · {o.nextAction || '—'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function OrdersList({ state }: { state: AppState }) {
  const [status, setStatus] = useState('الكل')
  const [q, setQ] = useState('')
  const list = state.orders.filter((o) => {
    if (status !== 'الكل' && o.status !== status) return false
    const hay = `${o.ref} ${o.customerName} ${o.title}`.toLowerCase()
    return !q.trim() || hay.includes(q.trim().toLowerCase())
  })
  return (
    <section>
      <h2>الطلبات</h2>
      <div className="toolbar">
        <input placeholder="بحث…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="الكل">كل الحالات</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <Link className="btn secondary" to="/ops">
          لوحة التحكم
        </Link>
      </div>
      <div className="card table-wrap">
        {list.length === 0 ? (
          <div className="empty">لا نتائج</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>المرجع</th>
                <th>العنوان</th>
                <th>العميل</th>
                <th>الحالة</th>
                <th>النوع</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/ops/orders/${o.id}`}>{o.ref}</Link>
                  </td>
                  <td>{o.title}</td>
                  <td>{o.customerName}</td>
                  <td>
                    <span className="status">{o.status}</span>
                  </td>
                  <td>{o.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

function OrderDetail({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const { id } = useParams()
  const order = state.orders.find((o) => o.id === id)
  const [lineLabel, setLineLabel] = useState('بند')
  const [lineQty, setLineQty] = useState(1)
  const [linePrice, setLinePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [fees, setFees] = useState(0)
  const [qNote, setQNote] = useState('')
  const [payAmt, setPayAmt] = useState(0)
  const [payMethod, setPayMethod] = useState('تحويل (تجريبي)')
  const [payNote, setPayNote] = useState('')
  const [msg, setMsg] = useState('')

  if (!order) {
    return (
      <div className="card empty">
        الطلب غير موجود. <Link to="/ops/orders">القائمة</Link>
      </div>
    )
  }

  const quote = latestQuote(order)
  const rem = quote ? remainingBalance(quote.total, order.payments) : 0
  const paySt = quote ? paymentStatus(quote.total, rem) : 'غير مدفوع'

  function saveStatus(status: OrderStatus) {
    setState(updateOrder(state, order!.id, { status }))
    setMsg('تم تحديث الحالة (محليًا)')
  }

  function saveMeta(field: keyof Order, value: string) {
    setState(updateOrder(state, order!.id, { [field]: value } as Partial<Order>))
  }

  function onAddQuote(ev: FormEvent) {
    ev.preventDefault()
    if (lineQty <= 0 || linePrice < 0) {
      setMsg('الكمية يجب أن تكون موجبة والسعر غير سالب')
      return
    }
    const lines: QuoteLine[] = [
      {
        id: `l-${Date.now()}`,
        label: lineLabel.trim() || 'بند',
        quantity: lineQty,
        unitPrice: linePrice,
      },
    ]
    setState(addQuote(state, order!.id, lines, discount, fees, qNote))
    setMsg('أُضيف عرض سعر جديد دون حذف النسخ السابقة')
  }

  function onPay(ev: FormEvent) {
    ev.preventDefault()
    if (payAmt <= 0) {
      setMsg('المبلغ يجب أن يكون أكبر من صفر')
      return
    }
    setState(addPayment(state, order!.id, payAmt, payMethod, payNote))
    setMsg('تم تسجيل الدفعة (تجريبي — محلي فقط)')
    setPayAmt(0)
    setPayNote('')
  }

  return (
    <section>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>
          {order.ref} — {order.title}
        </h2>
        <Link className="btn secondary" to="/ops/orders">
          القائمة
        </Link>
      </div>
      {msg && <div className="success-box">{msg}</div>}
      <div className="card">
        <p>
          <strong>العميل:</strong> {order.customerName} · {order.phone} · {order.area}
        </p>
        <p className="meta">
          القناة: {order.channel} · النوع: {order.kind} · الورشة: {order.workshop}
        </p>
        <p>{order.details}</p>
        <div className="field">
          <label>الحالة</label>
          <select value={order.status} onChange={(e) => saveStatus(e.target.value as OrderStatus)}>
            {ORDER_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>الورشة</label>
          <select value={order.workshop} onChange={(e) => saveMeta('workshop', e.target.value)}>
            {WORKSHOPS.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>الإجراء التالي</label>
          <input value={order.nextAction} onChange={(e) => saveMeta('nextAction', e.target.value)} />
        </div>
        <div className="field">
          <label>سبب التوقف (إن وجد)</label>
          <input value={order.blockedReason} onChange={(e) => saveMeta('blockedReason', e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="section">عروض الأسعار (نسخ تاريخية)</h3>
        {order.quotes.length === 0 ? (
          <p className="muted">لا عروض بعد.</p>
        ) : (
          <ul>
            {order.quotes
              .slice()
              .sort((a, b) => b.version - a.version)
              .map((qv) => (
                <li key={qv.id}>
                  <strong>v{qv.version}</strong> — {formatEgp(qv.total)} · {qv.note} ·{' '}
                  {new Date(qv.createdAt).toLocaleString('ar-EG')}
                  <ul>
                    {qv.lines.map((l) => (
                      <li key={l.id}>
                        {l.label} × {l.quantity} @ {formatEgp(l.unitPrice)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        )}
        {quote && (
          <p>
            أحدث إجمالي: <strong>{formatEgp(quote.total)}</strong> · حالة الدفع: <span className="status">{paySt}</span>{' '}
            · المتبقي: {formatEgp(rem)}
          </p>
        )}
        <form onSubmit={onAddQuote} style={{ marginTop: 12 }}>
          <h4>إضافة عرض سعر جديد</h4>
          <div className="row">
            <div className="field" style={{ flex: 2 }}>
              <label>البند</label>
              <input value={lineLabel} onChange={(e) => setLineLabel(e.target.value)} />
            </div>
            <div className="field">
              <label>الكمية</label>
              <input type="number" min={1} value={lineQty} onChange={(e) => setLineQty(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>سعر الوحدة</label>
              <input type="number" min={0} value={linePrice} onChange={(e) => setLinePrice(Number(e.target.value))} />
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label>خصم</label>
              <input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>رسوم إضافية</label>
              <input type="number" min={0} value={fees} onChange={(e) => setFees(Number(e.target.value))} />
            </div>
            <div className="field" style={{ flex: 2 }}>
              <label>ملاحظة</label>
              <input value={qNote} onChange={(e) => setQNote(e.target.value)} />
            </div>
          </div>
          <button className="btn" type="submit">
            حفظ عرض سعر (نسخة جديدة)
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="section">الدفعات (تجريبي)</h3>
        {order.payments.length === 0 ? (
          <p className="muted">لا دفعات مسجّلة.</p>
        ) : (
          <ul>
            {order.payments.map((p) => (
              <li key={p.id}>
                {formatEgp(p.amount)} — {p.method} · {p.note} · {new Date(p.createdAt).toLocaleString('ar-EG')}
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={onPay} style={{ marginTop: 12 }}>
          <div className="row">
            <div className="field">
              <label>المبلغ</label>
              <input type="number" min={1} value={payAmt || ''} onChange={(e) => setPayAmt(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>الطريقة</label>
              <input value={payMethod} onChange={(e) => setPayMethod(e.target.value)} />
            </div>
            <div className="field" style={{ flex: 2 }}>
              <label>ملاحظة</label>
              <input value={payNote} onChange={(e) => setPayNote(e.target.value)} />
            </div>
          </div>
          <button className="btn" type="submit">
            تسجيل دفعة
          </button>
        </form>
      </div>
    </section>
  )
}

function ProductsAdmin({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [kind, setKind] = useState<ProductKind>('جاهز')
  const [price, setPrice] = useState<number | ''>('')
  const [summary, setSummary] = useState('')

  function add(ev: FormEvent) {
    ev.preventDefault()
    if (name.trim().length < 2) return
    const product: Product = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      category,
      kind,
      summary: summary.trim() || 'منتج تجريبي',
      description: summary.trim() || 'أُضيف من لوحة الديمو',
      priceEgp: price === '' ? null : Number(price),
      materials: 'غير محدد',
      dimensions: 'غير محدد',
      finish: 'غير محدد',
      leadTimeDays: null,
      imageColor: '#78716c',
      tags: [category],
      active: true,
    }
    setState(upsertProduct(state, product))
    setName('')
    setSummary('')
    setPrice('')
  }

  return (
    <section>
      <h2>إدارة المنتجات (ديمو)</h2>
      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={add}>
          <div className="field">
            <label>الاسم</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="row">
            <div className="field" style={{ flex: 1 }}>
              <label>التصنيف</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>النوع</label>
              <select value={kind} onChange={(e) => setKind(e.target.value as ProductKind)}>
                <option value="جاهز">جاهز</option>
                <option value="تفصيل">تفصيل</option>
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>سعر تجريبي (اختياري)</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
          <div className="field">
            <label>ملخص</label>
            <input value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
          <button className="btn" type="submit">
            إضافة منتج
          </button>
        </form>
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>التصنيف</th>
              <th>السعر</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.priceEgp == null ? '—' : formatEgp(p.priceEgp)}</td>
                <td>
                  <button type="button" className="btn danger" onClick={() => setState(deleteProduct(state, p.id))}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12 }}>
        <Link to="/ops">رجوع للوحة</Link>
      </p>
    </section>
  )
}

export default function App() {
  const { state, setState } = useAppState()
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog state={state} />} />
        <Route path="/product/:id" element={<ProductPage state={state} />} />
        <Route path="/inquiry" element={<InquiryForm state={state} setState={setState} />} />
        <Route path="/ops" element={<OpsHome state={state} setState={setState} />} />
        <Route path="/ops/orders" element={<OrdersList state={state} />} />
        <Route path="/ops/orders/:id" element={<OrderDetail state={state} setState={setState} />} />
        <Route path="/ops/products" element={<ProductsAdmin state={state} setState={setState} />} />
      </Routes>
    </Layout>
  )
}
