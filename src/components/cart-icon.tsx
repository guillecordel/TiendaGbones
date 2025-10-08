"use client";

import { ShoppingBag } from "lucide-react";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCart } from "@/context/cart-context";

export function CartIcon() {
	const { isCartOpen, openCart, closeCart, itemCount } = useCart();

	return (
		<>
			<button
				onClick={openCart}
				className="relative h-10 w-10 grid place-items-center rounded-full ring-1 ring-white/20 bg-white/10 hover:bg-white/15 transition focus-visible:ring-2 focus-visible:ring-white/50 outline-none"
				aria-label={`Open cart (${itemCount} items)`}
			>
				<ShoppingBag className="h-5 w-5 text-white" />
				{itemCount > 0 && (
					<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white ring-2 ring-white/20">
						{itemCount > 99 ? "99+" : itemCount}
					</span>
				)}
			</button>

			<CartSidebar isOpen={isCartOpen} onClose={closeCart} />
		</>
	);
}
