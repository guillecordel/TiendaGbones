// Mock commerce data for development without API
import type { Cart, CartItem, Product } from "commerce-kit";

// In-memory cart store
const mockCarts = new Map<string, Cart>();

function generateId(): string {
	return Math.random().toString(36).substring(2, 11);
}

function computeTotal(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

const mockProducts: Product[] = [
	{
		id: "prod_1",
		name: "Classic Black Hoodie",
		slug: "classic-black-hoodie",
		price: 7900,
		currency: "USD",
		active: true,
		images: [
			"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
			"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
		],
	},
	{
		id: "prod_2",
		name: "Urban Streetwear Jacket",
		slug: "urban-streetwear-jacket",
		price: 12900,
		currency: "USD",
		active: true,
		images: [
			"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
			"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
		],
	},
	{
		id: "prod_3",
		name: "Minimalist White Tee",
		slug: "minimalist-white-tee",
		price: 3500,
		currency: "USD",
		active: true,
		images: [
			"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
			"https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80",
		],
	},
	{
		id: "prod_4",
		name: "Designer Sunglasses",
		slug: "designer-sunglasses",
		price: 8900,
		currency: "USD",
		active: true,
		images: [
			"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
			"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
		],
	},
	{
		id: "prod_5",
		name: "Leather Crossbody Bag",
		slug: "leather-crossbody-bag",
		price: 15900,
		currency: "USD",
		active: true,
		images: [
			"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
			"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
		],
	},
	{
		id: "prod_6",
		name: "Minimalist Watch",
		slug: "minimalist-watch",
		price: 19900,
		currency: "USD",
		active: true,
		images: [
			"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
			"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
		],
	},
];

// Mock commerce implementation
export const mockCommerce = {
	product: {
		browse: async ({ first = 10, category }: { first?: number; category?: string } = {}) => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 100));

			const filtered = category
				? mockProducts.filter((p) => p.slug?.startsWith(category))
				: mockProducts;

			return {
				data: filtered.slice(0, first),
				hasNextPage: filtered.length > first,
			};
		},

		get: async (slugOrOptions: string | { slug: string }) => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 100));

			const slug = typeof slugOrOptions === "string" ? slugOrOptions : slugOrOptions.slug;
			const product = mockProducts.find((p) => p.slug === slug);
			if (!product) {
				throw new Error(`Product not found: ${slug}`);
			}
			return product;
		},

		search: async (query: string) => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 100));

			const lowerQuery = query.toLowerCase();
			const results = mockProducts.filter((p) => p.name.toLowerCase().includes(lowerQuery));

			return {
				data: results,
			};
		},
	},

	category: {
		get: async (slug: string) => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Return all products for now (category filtering not yet implemented)
			return {
				data: mockProducts,
			};
		},
	},

	cart: {
		get: async ({ cartId }: { cartId: string }): Promise<Cart | null> => {
			await new Promise((resolve) => setTimeout(resolve, 100));
			return mockCarts.get(cartId) ?? null;
		},

		add: async ({
			cartId,
			variantId,
			quantity,
		}: {
			cartId?: string;
			variantId: string;
			quantity: number;
		}): Promise<Cart> => {
			await new Promise((resolve) => setTimeout(resolve, 100));

			const product = mockProducts.find((p) => p.id === variantId);
			const price = product?.price ?? 0;

			const id = cartId ?? generateId();
			const cart: Cart = mockCarts.get(id) ?? {
				id,
				items: [],
				total: 0,
				currency: "USD",
			};

			const existing = cart.items.find((item) => item.variantId === variantId);
			if (existing) {
				existing.quantity += quantity;
			} else {
				cart.items.push({
					id: generateId(),
					productId: variantId,
					variantId,
					quantity,
					price,
				});
			}

			cart.total = computeTotal(cart.items);
			mockCarts.set(id, cart);
			return cart;
		},

		update: async ({
			cartId,
			variantId,
			quantity,
		}: {
			cartId: string;
			variantId: string;
			quantity: number;
		}): Promise<Cart> => {
			await new Promise((resolve) => setTimeout(resolve, 100));

			const cart = mockCarts.get(cartId);
			if (!cart) throw new Error(`Cart not found: ${cartId}`);

			const item = cart.items.find((i) => i.variantId === variantId);
			if (item) item.quantity = quantity;

			cart.total = computeTotal(cart.items);
			return cart;
		},

		remove: async ({
			cartId,
			variantId,
		}: {
			cartId: string;
			variantId: string;
		}): Promise<Cart> => {
			await new Promise((resolve) => setTimeout(resolve, 100));

			const cart = mockCarts.get(cartId);
			if (!cart) throw new Error(`Cart not found: ${cartId}`);

			cart.items = cart.items.filter((i) => i.variantId !== variantId);
			cart.total = computeTotal(cart.items);
			return cart;
		},

		clear: async ({ cartId }: { cartId: string }): Promise<Cart> => {
			await new Promise((resolve) => setTimeout(resolve, 100));

			const cart = mockCarts.get(cartId);
			if (!cart) throw new Error(`Cart not found: ${cartId}`);

			cart.items = [];
			cart.total = 0;
			return cart;
		},
	},
};
