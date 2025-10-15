"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Format price from cents to currency display
 */
function formatPrice(amountCents: number, currency: string): string {
	const amount = amountCents / 100;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency.toUpperCase(),
	}).format(amount);
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
	const { items, itemCount, subtotalCents, updateQty, removeItem } = useCart();

	// Close on ESC key
	useEffect(() => {
		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		}

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			// Prevent body scroll when drawer is open
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const hasItems = items.length > 0;
	const currency = items[0]?.currency || "USD";

	return (
		<>
			{/* Backdrop overlay with blur */}
			<div
				className={cn(
					"fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-300",
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
				)}
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Drawer - slides in from right */}
			<div
				className={cn(
					"fixed inset-y-0 right-0 z-50 w-full sm:max-w-md lg:max-w-lg",
					"bg-gradient-to-b from-[#2A0051]/95 to-[#0B0240]/95",
					"shadow-2xl ring-1 ring-white/10 backdrop-blur-xl",
					"transition-transform duration-300 ease-out",
					"flex flex-col",
					isOpen ? "translate-x-0" : "translate-x-full",
				)}
				role="dialog"
				aria-modal="true"
				aria-labelledby="cart-title"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-full bg-white/10 ring-1 ring-white/20">
							<ShoppingBag className="h-5 w-5 text-white" />
						</div>
						<div>
							<h2 id="cart-title" className="text-lg font-semibold text-white">
								Your Cart
							</h2>
							{hasItems && (
								<p className="text-sm text-white/60" aria-live="polite">
									{itemCount} {itemCount === 1 ? "item" : "items"}
								</p>
							)}
						</div>
					</div>
					<button
						onClick={onClose}
						className="rounded-full p-2 bg-white/10 hover:bg-white/20 ring-1 ring-white/20 transition-colors"
						aria-label="Close cart"
					>
						<X className="h-5 w-5 text-white" />
					</button>
				</div>

				{/* Content - scrollable */}
				<div className="flex-1 overflow-y-auto px-6 py-4">
					{!hasItems ? (
						// Empty state
						<div className="flex h-full flex-col items-center justify-center gap-4 text-center py-12">
							<div className="p-6 rounded-full bg-white/5 ring-1 ring-white/10">
								<ShoppingBag className="h-12 w-12 text-white/40" />
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-medium text-white">Your cart is empty</h3>
								<p className="text-sm text-white/60 max-w-xs">
									Start shopping to add items to your cart
								</p>
							</div>
							<button
								onClick={onClose}
								className="mt-4 px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium ring-1 ring-white/20 transition-all"
							>
								Continue Shopping
							</button>
						</div>
					) : (
						// Cart items
						<div className="space-y-4" role="list" aria-label="Cart items">
							{items.map((item) => (
								<div
									key={item.id}
									role="listitem"
									className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/[0.07] transition-colors"
								>
									<div className="flex gap-4">
										{/* Product Image */}
										<div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/10 ring-1 ring-white/10">
											{item.image ? (
												<Image
													src={item.image}
													alt={item.title}
													width={80}
													height={80}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<ShoppingBag className="h-8 w-8 text-white/30" />
												</div>
											)}
										</div>

										{/* Product Info */}
										<div className="flex-1 min-w-0 space-y-2">
											<div>
												<h3 className="font-medium text-white text-sm leading-snug line-clamp-2">
													{item.title}
												</h3>
												{(item.variant || item.size || item.color) && (
													<p className="text-xs text-white/60 mt-1">
														{[item.variant, item.size, item.color].filter(Boolean).join(" • ")}
													</p>
												)}
											</div>

											<div className="flex items-center justify-between">
												{/* Price */}
												<p className="text-sm font-semibold text-white">
													{formatPrice(item.priceCents, item.currency)}
												</p>

												{/* Quantity Controls */}
												<div className="flex items-center gap-2 bg-white/10 rounded-full px-2 py-1 ring-1 ring-white/10">
													<button
														onClick={() => updateQty(item.id, item.quantity - 1)}
														className="rounded-full p-1 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
														disabled={item.quantity <= 1}
														aria-label={`Decrease quantity of ${item.title}`}
													>
														<Minus className="h-3.5 w-3.5 text-white" />
													</button>
													<span className="min-w-[2rem] text-center text-sm font-medium text-white tabular-nums">
														{item.quantity}
													</span>
													<button
														onClick={() => updateQty(item.id, item.quantity + 1)}
														className="rounded-full p-1 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
														disabled={item.maxQty ? item.quantity >= item.maxQty : false}
														aria-label={`Increase quantity of ${item.title}`}
													>
														<Plus className="h-3.5 w-3.5 text-white" />
													</button>
												</div>
											</div>
										</div>

										{/* Remove button */}
										<button
											onClick={() => removeItem(item.id)}
											className="self-start p-1.5 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
											aria-label={`Remove ${item.title} from cart`}
										>
											<X className="h-4 w-4" />
										</button>
									</div>

									{/* Item total (quantity × price) */}
									{item.quantity > 1 && (
										<div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs">
											<span className="text-white/60">Item total:</span>
											<span className="font-semibold text-white">
												{formatPrice(item.priceCents * item.quantity, item.currency)}
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer - Subtotal & Actions */}
				{hasItems && (
					<div className="border-t border-white/10 px-6 py-5 space-y-4 bg-gradient-to-t from-black/20">
						{/* Subtotal */}
						<div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
							<div className="flex items-center justify-between">
								<span className="text-base font-medium text-white/80">Subtotal</span>
								<span className="text-xl font-bold text-white tabular-nums">
									{formatPrice(subtotalCents, currency)}
								</span>
							</div>
							<p className="text-xs text-white/50 mt-2">Shipping and taxes calculated at checkout</p>
						</div>

						{/* Action buttons */}
						<div className="space-y-3">
							{/* TODO(Firebase): Replace with actual checkout flow */}
							<button
								className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98]"
								onClick={() => {
									// TODO: Navigate to checkout
									alert("Checkout functionality coming soon!");
								}}
							>
								Proceed to Checkout
							</button>

							<Link
								href="/"
								onClick={onClose}
								className="block w-full py-3 text-center rounded-full bg-white/10 hover:bg-white/20 text-white font-medium ring-1 ring-white/20 transition-all"
							>
								Continue Shopping
							</Link>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

// TODO(Firebase): Cart sync features to add:
/*
TODO(Firebase): When user logs in:
1. Load cart from Firestore: /users/{userId}/cart
2. Merge with local cart items
3. Show merge notification if items were combined

TODO(Firebase): Real-time sync:
1. Subscribe to Firestore cart updates
2. Show notification when cart changes from another device
3. Handle conflicts (prefer newest or merge quantities)

TODO(Firebase): Checkout integration:
1. Create order document in Firestore
2. Process payment via Stripe
3. Clear cart on successful order
4. Redirect to order confirmation page
*/
