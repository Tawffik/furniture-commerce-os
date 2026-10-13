# نشر — Furniture Commerce OS

## GitHub Pages

1. Settings → Pages → Source: **GitHub Actions**.
2. Workflow: `.github/workflows/pages.yml`
   - `npm ci`
   - `npm test`
   - `npm run build`
   - deploy artifact
3. الرابط المتوقع: `https://tawffik.github.io/furniture-commerce-os/`

## تشغيل محلي

```bash
npm install
npm run dev
```

Base path مضبوط على `/furniture-commerce-os/` ليتوافق مع Pages.

## ملاحظات

- البيانات في `localStorage` للمتصفح فقط.
- لا أسرار ولا مفاتيح API في الكود.
