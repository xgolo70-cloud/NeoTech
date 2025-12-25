---
description: تقنية "Always Centered Morph" - تحول سلس للهيدر من كامل العرض إلى Pill عائم
---

# 🎯 تقنية "Always Centered Header Morph"

## الاسم الرسمي
**Always Centered Width Transition** (تحول العرض مع التمركز الدائم)

## الوصف
تقنية لإنشاء تحول سلس (butter-smooth) للهيدر من حالة كاملة العرض إلى حالة Pill عائم مصغر عند التمرير، **بدون أي قفزات أو تقطعات**.

---

## ❌ الطريقة الخاطئة (تسبب قفزات)

```css
/* الحالة الأولية */
.header {
  left: 0;
  width: 100%;
}

/* الحالة المصغرة - يسبب قفزة! */
.header.compact {
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  min-width: 650px;
}
```

**المشكلة:** تغيير `left` من `0` إلى `50%` مع إضافة `transform` يسبب قفزة مفاجئة لأن المتصفح لا يستطيع عمل transition سلس بين هاتين الحالتين.

---

## ✅ الطريقة الصحيحة (Always Centered)

### المبدأ الأساسي:
**الهيدر يبقى دائماً في المنتصف** باستخدام `left: 50%` و `translateX(-50%)` في **كلا الحالتين**. فقط العرض (`width`) هو الذي يتغير.

```css
/* ========================================
   الحالة الأولية - كامل العرض لكن في المنتصف
   ======================================== */
.fixed-header {
  position: fixed;
  top: 0;
  left: 50%;                          /* دائماً في المنتصف */
  transform: translateX(-50%);        /* دائماً centered */
  width: calc(100% - 80px);           /* عرض كامل مع padding */
  max-width: 1400px;
  z-index: 1000;
  padding: 0 var(--space-lg);
  border-radius: 0;
  
  /* Butter-smooth transitions */
  transition: 
    top 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    max-width 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ========================================
   الحالة المصغرة - Pill عائم
   ======================================== */
.fixed-header.compact {
  top: 16px;                          /* ينزل قليلاً من الأعلى */
  width: auto;                        /* يتقلص للمحتوى */
  max-width: 750px;                   /* حد أقصى للعرض */
  padding: 0;
  border-radius: 100px;               /* شكل Pill */
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}
```

---

## 🎨 Easing Function الموصى به

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

هذا يُسمى **"ease-out-expo"** - يبدأ سريعاً ثم يتباطأ بشكل تدريجي وناعم جداً.

### بدائل جيدة:
- `cubic-bezier(0.4, 0, 0.2, 1)` - Material Design standard
- `cubic-bezier(0.16, 1, 0.3, 1)` - ease-out-quint (أنعم)

---

## 🔑 نقاط مهمة

### 1. إخفاء العناصر بـ opacity بدلاً من display
```css
/* ❌ خطأ - يسبب قفزة */
.logo-subtext {
  display: none;
}

/* ✅ صحيح - تحول سلس */
.logo-subtext {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
  transition: 
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
```

### 2. Transitions منفصلة لكل عنصر
```css
.navbar .logo-icon {
  transition: 
    width 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.navbar .logo-text {
  transition: font-size 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.navbar .nav-links a {
  transition: 
    font-size 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
```

### 3. الخلفية تتحول باستخدام ::before
```css
.fixed-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: transparent;
  border-radius: inherit;
  opacity: 0;
  transition: 
    opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.fixed-header.compact::before {
  opacity: 1;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
}
```

---

## 📐 الملخص

| الخاصية | الحالة الأولية | الحالة المصغرة |
|---------|---------------|----------------|
| `left` | `50%` | `50%` ← **لا يتغير!** |
| `transform` | `translateX(-50%)` | `translateX(-50%)` ← **لا يتغير!** |
| `width` | `calc(100% - 80px)` | `auto` / `max-width: 750px` |
| `top` | `0` | `16px` |
| `border-radius` | `0` | `100px` |
| `padding` | `var(--space-lg)` | `0` |

---

## 🎬 النتيجة
- تحول سلس كالزبدة (butter-smooth)
- لا قفزات أو تقطعات
- جميع العناصر تتحول بتناغم
- تجربة مستخدم احترافية

