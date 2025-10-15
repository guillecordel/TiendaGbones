"use client";

import { X, Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { formatMoneyEUR } from "@/lib/money";

interface CartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Full-height cart drawer with opaque purple gradient
 * Nike-style layout: sticky header, scrollable content, sticky footer
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
	const { items, itemCount, subtotalCents, updateQty, removeItem } = useCart();

	// ESC key handler and body scroll lock
	useEffect(() => {
		if (!isOpen) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				onClose();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const currency = items[0]?.currency || "EUR";

	return (
		<>
			{/* Backdrop - clear separation from page */}
			<div
				className="fixed inset-0 z-[59] bg-black/60"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Cart Drawer - Full height, opaque gradient */}
			<aside
				className="fixed inset-y-0 right-0 z-[60] w-full sm:max-w-md h-screen max-h-screen
				           bg-gradient-to-b from-[#240024] via-[#45006e] to-[#001f4d]
				           shadow-2xl ring-1 ring-white/10 grid grid-rows-[auto_1fr_auto]"
				role="dialog"
				aria-label="Shopping Cart"
			>
				{/* Header - Sticky top */}
				<header
					className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4
					           border-b border-white/10 bg-black/10 backdrop-blur-md text-white"
				>
					<span className="text-lg font-semibold">Shopping Cart</span>
					{itemCount > 0 && (
						<span className="text-sm text-white/70">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
					)}
					<button
						onClick={onClose}
						className="ml-auto inline-flex size-9 items-center justify-center rounded-full
						           ring-1 ring-white/15 bg-white/10 hover:bg-white/15 text-white/90 transition-colors
						           focus:outline-none focus:ring-2 focus:ring-white/50"
						aria-label="Close cart"
					>
						<X className="size-5" />
					</button>
				</header>

				{/* Content - Scrollable */}
				<div className="min-h-0 overflow-y-auto px-5 py-4">
					{items.length === 0 ? (
						<div className="flex h-full items-center justify-center text-center text-white/80 py-12">
							<div className="space-y-3">
								<p className="text-xl font-medium">Your cart is empty</p>
								<p className="text-sm text-white/60">Add items to get started</p>
							</div>
						</div>
					) : (
						<ul className="space-y-4" role="list">
							{items.map((item) => (
								<li
									key={item.id}
									className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4
									           hover:bg-white/[0.07] hover:ring-white/15 transition-all
									           grid gap-3 grid-cols-[64px_1fr] sm:grid-cols-[64px_1fr_auto]"
								>
									{/* Thumbnail */}
									<div className="relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-white/10 bg-white/5">
										{item.image ? (
											<Image
												src={item.image}
												alt={item.title}
												fill
												sizes="64px"
												className="object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-white/30">
												<span className="text-xs">No image</span>
											</div>
										)}
									</div>

									{/* Title + Meta */}
									<div className="min-w-0 self-center">
										<p className="text-white font-medium leading-tight text-[15px] sm:text-lg break-words">
											{item.title}
										</p>
										{(item.variant || item.size || item.color) && (
											<p className="text-white/70 text-sm mt-0.5">
												{[item.variant, item.size, item.color].filter(Boolean).join(" • ")}
											</p>
										)}
										<p className="text-white/90 text-sm font-semibold mt-1">
											{formatMoneyEUR(item.priceCents)}
										</p>
									</div>

									{/* Controls: mobile under title, desktop on right */}
									<div className="col-span-2 sm:col-span-1 flex flex-wrap items-center gap-2 sm:justify-end pt-2 sm:pt-0">
										{/* Quantity Stepper */}
										<div className="inline-flex items-center rounded-full bg-white/10 ring-1 ring-white/15">
											<button
												onClick={() => updateQty(item.id, item.quantity - 1)}
												disabled={item.quantity <= 1}
												className="px-3 py-1.5 text-white/90 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
												aria-label={`Decrease quantity of ${item.title}`}
											>
												−
											</button>
											<span className="px-3 py-1.5 text-white font-medium tabular-nums">
												{item.quantity}
											</span>
											<button
												onClick={() => updateQty(item.id, item.quantity + 1)}
												disabled={item.maxQty ? item.quantity >= item.maxQty : false}
												className="px-3 py-1.5 text-white/90 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
												aria-label={`Increase quantity of ${item.title}`}
											>
												+
											</button>
										</div>

										{/* Remove Button */}
										<button
											onClick={() => removeItem(item.id)}
											className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
											           bg-white/10 hover:bg-white/15 ring-1 ring-white/15
											           text-white/90 text-sm transition-all
											           focus:outline-none focus:ring-2 focus:ring-white/50"
											aria-label={`Remove ${item.title}`}
										>
											<Trash2 className="size-4" />
											<span className="sm:inline">Remove</span>
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Footer - Sticky bottom */}
				{items.length > 0 && (
					<footer className="sticky bottom-0 z-10 border-t border-white/10 bg-black/10 backdrop-blur-md p-5 space-y-3">
						{/* Subtotal */}
						<div className="flex items-center justify-between text-white">
							<span className="text-base font-medium">Subtotal</span>
							<span className="text-xl font-semibold tabular-nums">
								{formatMoneyEUR(subtotalCents)}
							</span>
						</div>

						{/* Note */}
						<p className="text-white/70 text-xs">
							Shipping and taxes will be calculated at checkout
						</p>

						{/* Primary CTA - Proceed to Checkout */}
						{/* TODO(Firebase): Replace with actual checkout flow */}
						<button
							onClick={() => {
								alert("Checkout will be integrated with payment processing");
							}}
							className="w-full rounded-full px-5 py-3
							           bg-[linear-gradient(135deg,#7C3AED_0%,#8B5CF6_50%,#6366F1_100%)]
							           text-white font-semibold shadow-lg ring-1 ring-white/15
							           hover:brightness-110 transition-all
							           focus:outline-none focus:ring-2 focus:ring-purple-400"
						>
							Proceed to Checkout
						</button>

						{/* Secondary CTA - Continue Shopping */}
						<button
							onClick={onClose}
							className="w-full rounded-full px-5 py-3
							           bg-white/10 text-white ring-1 ring-white/15
							           hover:bg-white/15 transition-all
							           focus:outline-none focus:ring-2 focus:ring-white/50"
						>
							Continue Shopping
						</button>
					</footer>
				)}
			</aside>
		</>
	);
}

// ============================================================================
// TODO(Firebase): Cart sync when ready
// ============================================================================
/*
TODO(Firebase): Future integration points:

1. Checkout button - Navigate to checkout page with Firestore order creation
2. Cart sync - Real-time updates when logged in
3. Merge local cart on login
4. Payment processing integration
*/
