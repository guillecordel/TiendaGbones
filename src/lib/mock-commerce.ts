// Mock commerce data for development without API
import type { Product } from "commerce-kit";

const mockProducts: Product[] = [
	{
		id: "prod_1",
		name: "Classic Black Hoodie",
		slug: "classic-black-hoodie",
		description: "Premium cotton hoodie with minimalist design. Perfect for everyday wear.",
		price: 7900,
		currency: "USD",
		images: [
			"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
			"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
		],
		variants: [
			{
				id: "var_1",
				name: "Default",
				price: 7900,
			},
		],
		metadata: {
			category: "apparel",
		},
	},
	{
		id: "prod_2",
		name: "Urban Streetwear Jacket",
		slug: "urban-streetwear-jacket",
		description: "Lightweight jacket with modern cut. Features multiple pockets and adjustable fit.",
		price: 12900,
		currency: "USD",
		images: [
			"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
			"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
		],
		variants: [
			{
				id: "var_2",
				name: "Default",
				price: 12900,
			},
		],
		metadata: {
			category: "apparel",
		},
	},
	{
		id: "prod_3",
		name: "Minimalist White Tee",
		slug: "minimalist-white-tee",
		description: "Essential white t-shirt made from organic cotton. Timeless and versatile.",
		price: 3500,
		currency: "USD",
		images: [
			"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
			"https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80",
		],
		variants: [
			{
				id: "var_3",
				name: "Default",
				price: 3500,
			},
		],
		metadata: {
			category: "apparel",
		},
	},
	{
		id: "prod_4",
		name: "Designer Sunglasses",
		slug: "designer-sunglasses",
		description: "Modern aviator style with UV protection. Includes premium case.",
		price: 8900,
		currency: "USD",
		images: [
			"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
			"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
		],
		variants: [
			{
				id: "var_4",
				name: "Default",
				price: 8900,
			},
		],
		metadata: {
			category: "accessories",
		},
	},
	{
		id: "prod_5",
		name: "Leather Crossbody Bag",
		slug: "leather-crossbody-bag",
		description: "Handcrafted leather bag with adjustable strap. Multiple compartments for organization.",
		price: 15900,
		currency: "USD",
		images: [
			"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
			"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
		],
		variants: [
			{
				id: "var_5",
				name: "Default",
				price: 15900,
			},
		],
		metadata: {
			category: "accessories",
		},
	},
	{
		id: "prod_6",
		name: "Minimalist Watch",
		slug: "minimalist-watch",
		description: "Clean design with leather strap. Japanese quartz movement.",
		price: 19900,
		currency: "USD",
		images: [
			"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
			"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
		],
		variants: [
			{
				id: "var_6",
				name: "Default",
				price: 19900,
			},
		],
		metadata: {
			category: "accessories",
		},
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
			const results = mockProducts.filter(
				(p) =>
					p.name.toLowerCase().includes(lowerQuery) ||
					p.description.toLowerCase().includes(lowerQuery),
			);

			return {
				data: results,
			};
		},
	},

	category: {
		get: async (slug: string) => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 100));

			const products = mockProducts.filter(
				(p) => p.metadata?.category === slug,
			);

			return {
				data: products,
			};
		},
	},
};
