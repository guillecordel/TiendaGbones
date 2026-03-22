"use client";

/**
 * Demo section showcasing the cart functionality
 * Keeps only explanatory text, without demo product cards
 */
export function CartDemo() {
	return (
		<section className="w-full py-12">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold text-white mb-3">Try the Cart</h2>
					<p className="text-white/70 max-w-2xl mx-auto">
						Click "Add to Cart" to see the cart drawer in action. All cart data is stored locally in your
						browser.
					</p>
				</div>

				<div className="mt-10 rounded-2xl bg-purple-500/10 ring-1 ring-purple-500/20 p-6 text-center">
					<p className="text-white/80 text-sm">
						<strong className="text-white">Note:</strong> This is a demo cart using localStorage. When
						Firebase is integrated, items will sync across devices and persist after login.
					</p>
				</div>
			</div>
		</section>
	);
}
