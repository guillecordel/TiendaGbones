"use client";

import { AddToCartButton } from "./add-to-cart-button";
import { formatMoneyEUR } from "@/lib/money";

/**
 * Demo section showcasing the cart functionality
 * Displays sample products that can be added to the cart
 */
export function CartDemo() {
	// Sample demo products
	const demoProducts = [
		{
			slug: "skull-tshirt",
			title: "Gbones Skull T-Shirt",
			priceCents: 2999, // €29.99
			currency: "EUR",
			image: "/calavera.svg",
			variant: "Classic",
			size: "M",
		},
		{
			slug: "hoodie-purple",
			title: "Purple Gradient Hoodie",
			priceCents: 5999, // €59.99
			currency: "EUR",
			image: "/calavera.svg",
			variant: "Premium",
			size: "L",
			color: "Purple",
		},
		{
			slug: "cap-black",
			title: "Gbones Black Cap",
			priceCents: 1999, // €19.99
			currency: "EUR",
			image: "/calavera.svg",
		},
	];

	return (
		<section className="w-full py-12">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold text-white mb-3">Try the Cart</h2>
					<p className="text-white/70 max-w-2xl mx-auto">
						Click "Add to Cart" to see the cart drawer in action. All cart data is stored locally
						in your browser.
					</p>
				</div>

				{/* Demo Product Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{demoProducts.map((product) => (
						<div
							key={product.slug}
							className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition-all"
						>
							{/* Product Image */}
							<div className="aspect-square rounded-xl bg-white/10 ring-1 ring-white/10 mb-4 flex items-center justify-center overflow-hidden">
								<img
									src={product.image}
									alt={product.title}
									className="w-2/3 h-2/3 object-contain drop-shadow-lg"
								/>
							</div>

							{/* Product Info */}
							<div className="space-y-3">
								<div>
									<h3 className="font-semibold text-white text-lg">{product.title}</h3>
									{product.variant && (
										<p className="text-sm text-white/60 mt-1">
											{[product.variant, product.size, product.color].filter(Boolean).join(" • ")}
										</p>
									)}
								</div>

								<div className="flex items-baseline gap-2">
									<span className="text-2xl font-bold text-white">
										{formatMoneyEUR(product.priceCents)}
									</span>
								</div>

								{/* Add to Cart Button */}
								<AddToCartButton
									product={product}
									variant="primary"
									size="md"
									className="w-full"
									openCartOnAdd={false}
								/>
							</div>
						</div>
					))}
				</div>

				{/* Info Box */}
				<div className="mt-10 rounded-2xl bg-purple-500/10 ring-1 ring-purple-500/20 p-6 text-center">
					<p className="text-white/80 text-sm">
						<strong className="text-white">Note:</strong> This is a demo cart using localStorage.
						When Firebase is integrated, items will sync across devices and persist after login.
					</p>
				</div>
			</div>
		</section>
	);
}
