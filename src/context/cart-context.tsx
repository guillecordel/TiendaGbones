"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
	useCallback,
	useRef,
} from "react";

// ============================================================================
// Types
// ============================================================================

export type CartItem = {
	id: string; // unique per product+variant
	slug: string;
	title: string;
	priceCents: number;
	currency: "USD" | "EUR" | string;
	image: string;
	variant?: string;
	size?: string;
	color?: string;
	quantity: number; // >= 1
	maxQty?: number; // optional cap
};

export type CartState = {
	items: CartItem[];
	subtotalCents: number;
	itemCount: number;
};

interface CartContextType extends CartState {
	isCartOpen: boolean;
	openCart: () => void;
	closeCart: () => void;
	toggleCart: () => void;
	addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
	removeItem: (id: string) => void;
	updateQty: (id: string, qty: number) => void;
	clearCart: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "gbones:cart:v1";
const DEBOUNCE_MS = 500;

// ============================================================================
// Utilities
// ============================================================================

/**
 * Generate a unique cart item ID based on product attributes
 */
function generateItemId(item: Omit<CartItem, "id" | "quantity">): string {
	const parts = [item.slug];
	if (item.variant) parts.push(item.variant);
	if (item.size) parts.push(item.size);
	if (item.color) parts.push(item.color);
	return parts.join(":");
}

/**
 * Safely check if we're in a browser environment
 */
function isBrowser(): boolean {
	return typeof window !== "undefined";
}

/**
 * Load cart from localStorage (SSR-safe)
 */
function loadCartFromStorage(): CartItem[] {
	if (!isBrowser()) return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const parsed = JSON.parse(stored);
		if (Array.isArray(parsed)) {
			return parsed;
		}
	} catch (error) {
		console.error("[Cart] Failed to load from localStorage:", error);
	}

	return [];
}

/**
 * Save cart to localStorage (debounced)
 */
function saveCartToStorage(items: CartItem[]): void {
	if (!isBrowser()) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch (error) {
		console.error("[Cart] Failed to save to localStorage:", error);
	}
}

/**
 * Compute derived state (subtotal & item count)
 */
function computeDerivedState(items: CartItem[]): Pick<CartState, "subtotalCents" | "itemCount"> {
	const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
	return { subtotalCents, itemCount };
}

// ============================================================================
// Context
// ============================================================================

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);

	// Debounce timer ref
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Debounced save to localStorage
	const debouncedSave = useCallback((itemsToSave: CartItem[]) => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		saveTimeoutRef.current = setTimeout(() => {
			saveCartToStorage(itemsToSave);
		}, DEBOUNCE_MS);
	}, []);

	// Hydrate from localStorage on mount (client-only)
	useEffect(() => {
		const storedItems = loadCartFromStorage();
		setItems(storedItems);
		setIsHydrated(true);
	}, []);

	// Save to localStorage whenever items change (after hydration)
	useEffect(() => {
		if (isHydrated) {
			debouncedSave(items);
		}

		// Cleanup timeout on unmount
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [items, isHydrated, debouncedSave]);

	// Compute derived state
	const { subtotalCents, itemCount } = computeDerivedState(items);

	// ========================================================================
	// Actions
	// ========================================================================

	const addItem = useCallback((input: Omit<CartItem, "id"> & { id?: string }) => {
		setItems((prev) => {
			const id = input.id || generateItemId(input);
			const existingIndex = prev.findIndex((item) => item.id === id);

			if (existingIndex >= 0) {
				// Item already exists, increment quantity
				const updated = [...prev];
				const existing = updated[existingIndex];
				if (!existing) return prev;

				const newQty = existing.quantity + (input.quantity || 1);
				const cappedQty = existing.maxQty ? Math.min(newQty, existing.maxQty) : newQty;

				updated[existingIndex] = {
					...existing,
					quantity: cappedQty,
				};

				return updated;
			}

			// Add new item
			const newItem: CartItem = {
				...input,
				id,
				quantity: input.quantity || 1,
			};

			return [...prev, newItem];
		});
	}, []);

	const removeItem = useCallback((id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const updateQty = useCallback((id: string, qty: number) => {
		if (qty <= 0) {
			// Remove item if quantity is 0 or less
			removeItem(id);
			return;
		}

		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== id) return item;

				const cappedQty = item.maxQty ? Math.min(qty, item.maxQty) : qty;
				return {
					...item,
					quantity: cappedQty,
				};
			}),
		);
	}, [removeItem]);

	const clearCart = useCallback(() => {
		setItems([]);
	}, []);

	const openCart = useCallback(() => setIsCartOpen(true), []);
	const closeCart = useCallback(() => setIsCartOpen(false), []);
	const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

	// ========================================================================
	// Context Value
	// ========================================================================

	const value: CartContextType = {
		items,
		subtotalCents,
		itemCount,
		isCartOpen,
		openCart,
		closeCart,
		toggleCart,
		addItem,
		removeItem,
		updateQty,
		clearCart,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context
 */
export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}

// ============================================================================
// TODO(Firebase): Future enhancements
// ============================================================================
/*
TODO(Firebase): When integrating Firebase/Firestore:

1. Replace localStorage with Firestore
   - Store cart in: /users/{userId}/cart
   - Use onSnapshot to listen for remote changes

2. Merge local cart on login
   - Check for existing cart in localStorage
   - Merge with remote cart (prefer local quantities, dedupe by item.id)
   - Clear localStorage after successful merge

3. Sync cart updates to Firestore
   - Replace saveCartToStorage with a Firestore batch write
   - Handle offline mode with Firestore's built-in offline support

4. Conflict resolution
   - Use timestamps or version fields
   - On conflict, prefer most recent update or highest quantity

5. Example Firestore structure:
   {
     userId: "user123",
     cart: {
       items: [...],
       updatedAt: Timestamp,
       version: 1
     }
   }

6. Update useEffect to subscribe to Firestore:
   useEffect(() => {
     if (!user) return;

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
*/
