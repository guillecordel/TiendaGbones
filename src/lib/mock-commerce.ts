// Mock commerce data for development without API
import type { Product } from "commerce-kit";

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
		browse: async ({ first = 10 }: { first?: number } = {}) => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 100));

			return {
				data: mockProducts.slice(0, first),
				hasNextPage: mockProducts.length > first,
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
};
