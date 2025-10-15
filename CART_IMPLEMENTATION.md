# Gbones Cart Implementation Guide

## Overview

This document describes the localStorage-based cart system for Gbones. The cart is fully functional, uses React Context for state management, persists data locally, and features the Gbones visual design language (dark purple gradients, glassy surfaces, white text).

## File Structure

```
src/
├── context/
│   └── cart-context.tsx          # Cart state management & localStorage
├── components/
│   ├── cart-icon.tsx              # Cart icon with badge (in navbar)
│   ├── cart-sidebar.tsx           # Drawer UI component
│   ├── add-to-cart-button.tsx     # Reusable "Add to Cart" button
│   └── cart-demo.tsx              # Demo section for homepage
└── app/
    └── (store)/
        ├── layout.tsx             # CartProvider wrapper
        └── page.tsx               # Homepage with cart demo
```

## Core Components

### 1. Cart Context (`src/context/cart-context.tsx`)

**Features:**
- SSR-safe localStorage persistence
- Debounced writes (500ms)
- Automatic ID generation for cart items
- Derived state computation (subtotal, item count)
- Quantity validation and capping

**Types:**
```typescript
type CartItem = {
  id: string;           // auto-generated: slug:variant:size:color
  slug: string;
  title: string;
  priceCents: number;
  currency: 'USD' | 'EUR' | string;
  image: string;
  variant?: string;
  size?: string;
  color?: string;
  quantity: number;
  maxQty?: number;      // optional inventory cap
};

type CartState = {
  items: CartItem[];
  subtotalCents: number;
  itemCount: number;
};
```

**API:**
```typescript
const {
  items,              // CartItem[]
  subtotalCents,      // number (in cents)
  itemCount,          // total quantity across all items
  isCartOpen,         // boolean
  openCart,           // () => void
  closeCart,          // () => void
  toggleCart,         // () => void
  addItem,            // (item: Omit<CartItem, 'id'> & { id?: string }) => void
  removeItem,         // (id: string) => void
  updateQty,          // (id: string, qty: number) => void
  clearCart,          // () => void
} = useCart();
```

**LocalStorage Key:** `gbones:cart:v1`

### 2. Cart Sidebar (`src/components/cart-sidebar.tsx`)

**Features:**
- Slides in from the right
- Backdrop blur overlay
- ESC key to close
- Body scroll lock when open
- Gbones styling (purple gradients, glassy cards)
- Accessible (ARIA labels, keyboard navigation)

**Visual Design:**
- Background: `bg-gradient-to-b from-[#2A0051]/95 to-[#0B0240]/95`
- Cards: `bg-white/5 ring-1 ring-white/10 rounded-2xl`
- Buttons: `rounded-full bg-white/15 hover:bg-white/25 ring-1 ring-white/20`
- Text: `text-white` with opacity variants for secondary text

**States:**
- Empty state with icon and CTA
- Item list with image, title, variant, price, quantity controls
- Footer with subtotal and checkout button

### 3. Add to Cart Button (`src/components/add-to-cart-button.tsx`)

**Props:**
```typescript
interface AddToCartButtonProps {
  product: Omit<CartItem, 'id' | 'quantity'>;
  quantity?: number;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  openCartOnAdd?: boolean;  // default: true
}
```

**Features:**
- Success feedback ("Added!" with checkmark)
- Auto-opens cart drawer on add
- Three visual variants
- Loading state
- Accessible labels

**Usage Example:**
```tsx
<AddToCartButton
  product={{
    slug: 'skull-tshirt',
    title: 'Gbones Skull T-Shirt',
    priceCents: 2999,
    currency: 'USD',
    image: '/products/skull-tshirt.jpg',
    variant: 'Classic',
    size: 'M',
  }}
  variant="primary"
  size="md"
  openCartOnAdd={true}
/>
```

### 4. Cart Icon (`src/components/cart-icon.tsx`)

**Features:**
- Circular glassy button matching navbar style
- Badge showing item count (hidden when 0)
- Opens cart drawer on click
- Accessible label with count

### 5. Cart Demo (`src/components/cart-demo.tsx`)

**Purpose:** Demonstrates cart functionality with sample products

**Location:** Added to homepage (`src/app/(store)/page.tsx`)

**Features:**
- 3 sample products with images
- Grid layout (responsive)
- Info box explaining localStorage vs Firebase

## Styling Guidelines

### Gbones Visual Language

All cart components follow these design patterns:

1. **Colors:**
   - Background gradients: Purple (`#2A0051`, `#0B0240`)
   - Text: White with opacity variants (`text-white`, `text-white/60`, `text-white/80`)
   - Accents: Purple (`purple-500`, `purple-600`)

2. **Surfaces:**
   - Glassy cards: `bg-white/5 ring-1 ring-white/10`
   - Translucent buttons: `bg-white/15 hover:bg-white/25`
   - Backdrop: `backdrop-blur-md` or `backdrop-blur-xl`

3. **Shapes:**
   - Rounded corners: `rounded-2xl` (cards), `rounded-full` (buttons)
   - Soft rings: `ring-1 ring-white/10` to `ring-2 ring-white/20`

4. **Animations:**
   - Smooth transitions: `transition-all` or `transition-colors`
   - Duration: 200-300ms
   - Active states: `active:scale-[0.98]`

## Usage in Your App

### Adding "Add to Cart" to Product Pages

```tsx
import { AddToCartButton } from '@/components/add-to-cart-button';

export function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${(product.priceCents / 100).toFixed(2)}</p>

      <AddToCartButton
        product={{
          slug: product.slug,
          title: product.name,
          priceCents: product.priceCents,
          currency: 'USD',
          image: product.image,
        }}
        variant="primary"
        size="lg"
      />
    </div>
  );
}
```

### Accessing Cart Data Anywhere

```tsx
'use client';

import { useCart } from '@/context/cart-context';

export function MyComponent() {
  const { items, itemCount, subtotalCents, openCart } = useCart();

  return (
    <div>
      <p>Cart has {itemCount} items</p>
      <p>Subtotal: ${(subtotalCents / 100).toFixed(2)}</p>
      <button onClick={openCart}>View Cart</button>
    </div>
  );
}
```

### Manual Cart Operations

```tsx
const { addItem, removeItem, updateQty, clearCart } = useCart();

// Add item
addItem({
  slug: 'product-slug',
  title: 'Product Name',
  priceCents: 2999,
  currency: 'USD',
  image: '/image.jpg',
  quantity: 1,
});

// Update quantity
updateQty('product-slug:M:blue', 3);

// Remove item
removeItem('product-slug:M:blue');

// Clear cart
clearCart();
```

## Firebase Integration (TODO)

The cart system has clear `TODO(Firebase)` markers in the code for future enhancements. Here's what needs to be done:

### 1. Cart Context (`cart-context.tsx`)

**Current:** localStorage with key `gbones:cart:v1`

**Firebase Changes:**
```typescript
// Add Firestore imports
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context'; // Your auth context

// In CartProvider:
useEffect(() => {
  if (!user) return; // user from auth context

  // Subscribe to Firestore cart
  const unsubscribe = onSnapshot(
    doc(db, 'users', user.uid, 'cart'),
    (snapshot) => {
      const data = snapshot.data();
      if (data?.items) {
        setItems(data.items);
      }
    }
  );

  return unsubscribe;
}, [user]);

// Replace saveCartToStorage with:
async function saveCartToFirestore(items: CartItem[]) {
  if (!user) return;

  await setDoc(doc(db, 'users', user.uid, 'cart'), {
    items,
    updatedAt: serverTimestamp(),
    version: 1,
  });
}
```

### 2. Merge Local Cart on Login

```typescript
// When user logs in:
async function mergeLocalCartWithRemote(userId: string) {
  const localItems = loadCartFromStorage();

  if (localItems.length === 0) return;

  const remoteDoc = await getDoc(doc(db, 'users', userId, 'cart'));
  const remoteItems = remoteDoc.data()?.items || [];

  // Merge logic (prefer local quantities, dedupe by item.id)
  const merged = mergeCartItems(localItems, remoteItems);

  // Save to Firestore
  await setDoc(doc(db, 'users', userId, 'cart'), {
    items: merged,
    updatedAt: serverTimestamp(),
    version: 1,
  });

  // Clear localStorage
  localStorage.removeItem('gbones:cart:v1');
}

function mergeCartItems(local: CartItem[], remote: CartItem[]): CartItem[] {
  const itemMap = new Map<string, CartItem>();

  // Add remote items
  remote.forEach(item => itemMap.set(item.id, item));

  // Merge local items (prefer higher quantity)
  local.forEach(item => {
    const existing = itemMap.get(item.id);
    if (existing) {
      itemMap.set(item.id, {
        ...existing,
        quantity: Math.max(existing.quantity, item.quantity),
      });
    } else {
      itemMap.set(item.id, item);
    }
  });

  return Array.from(itemMap.values());
}
```

### 3. Firestore Data Structure

```
/users/{userId}/cart
{
  items: [
    {
      id: "skull-tshirt:M:black",
      slug: "skull-tshirt",
      title: "Gbones Skull T-Shirt",
      priceCents: 2999,
      currency: "USD",
      image: "/products/skull-tshirt.jpg",
      variant: "Classic",
      size: "M",
      color: "black",
      quantity: 2,
    }
  ],
  updatedAt: Timestamp,
  version: 1
}
```

### 4. Cart Sidebar Changes

**Checkout Button:**
```tsx
// Replace alert with actual checkout flow
<button
  onClick={async () => {
    // Create order in Firestore
    const orderId = await createOrder(user.uid, items, subtotalCents);

    // Process payment
    const { error } = await processPayment(orderId);

    if (!error) {
      clearCart();
      router.push(`/orders/${orderId}`);
    }
  }}
>
  Proceed to Checkout
</button>
```

### 5. Real-time Sync Notifications

Show a toast when cart changes from another device:

```tsx
useEffect(() => {
  if (!user) return;

  const unsubscribe = onSnapshot(
    doc(db, 'users', user.uid, 'cart'),
    (snapshot) => {
      const data = snapshot.data();
      if (data?.items && data.updatedAt > lastLocalUpdate) {
        // Show notification
        toast.info('Cart updated from another device');
        setItems(data.items);
      }
    }
  );

  return unsubscribe;
}, [user]);
```

## Testing the Cart

1. **Open the app:** Navigate to http://localhost:3000
2. **Try the demo:** Click "Add to Cart" on the sample products
3. **Check the drawer:** Cart should slide in from the right
4. **Test quantity:** Use +/- buttons to adjust quantities
5. **Remove items:** Click the × button on any item
6. **Persistence:** Refresh the page - cart should remain
7. **Empty state:** Remove all items to see empty state
8. **Keyboard:** Press ESC to close drawer
9. **Accessibility:** Tab through controls, check screen reader labels

## Accessibility Features

- **ARIA labels:** All buttons have descriptive labels
- **Keyboard navigation:** TAB, ESC, ENTER work as expected
- **Focus management:** Drawer traps focus when open
- **Live regions:** Cart count updates announced to screen readers
- **Color contrast:** All text meets WCAG AA standards
- **Touch targets:** Minimum 44×44px for mobile

## Performance Considerations

- **Debounced saves:** LocalStorage writes are batched (500ms)
- **Memoized callbacks:** Cart actions use `useCallback`
- **Optimistic updates:** UI updates immediately, storage async
- **SSR safety:** No localStorage access during server render
- **Lazy loading:** Cart drawer only renders when open

## Troubleshooting

### Cart doesn't persist
- Check browser console for localStorage errors
- Verify `gbones:cart:v1` key exists in DevTools > Application > LocalStorage
- Ensure private/incognito mode allows localStorage

### Items duplicating
- Check `generateItemId()` logic in `cart-context.tsx`
- Verify same product with same variant has consistent ID

### Drawer won't open
- Check `isCartOpen` state in React DevTools
- Verify `openCart()` is being called
- Check for CSS z-index conflicts

### TypeScript errors
- Ensure all CartItem fields are provided when calling `addItem()`
- Check that currency is uppercase (USD, EUR, etc.)
- Verify image paths are valid strings

## Future Enhancements

- [ ] Wishlist functionality
- [ ] Recently viewed items
- [ ] Product recommendations in cart
- [ ] Gift wrapping options
- [ ] Promo code support
- [ ] Estimated shipping calculator
- [ ] Save for later / Move to wishlist
- [ ] Cart abandonment recovery (via Firebase)
- [ ] Multi-currency support
- [ ] Inventory warnings (low stock)

---

**Built for Gbones** • localStorage-based • Firebase-ready • Fully accessible • Gbones design language
