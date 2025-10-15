"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart, type CartItem } from "@/context/cart-context";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
	product: Omit<CartItem, "id" | "quantity">;
	quantity?: number;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	className?: string;
	openCartOnAdd?: boolean;
}

/**
 * Add to Cart button with Gbones styling
 * Shows success feedback and optionally opens the cart drawer
 */
export function AddToCartButton({
	product,
	quantity = 1,
	variant = "primary",
	size = "md",
	className,
	openCartOnAdd = false, // Changed default to false - drawer only opens on manual click
}: AddToCartButtonProps) {
	const { addItem, openCart } = useCart();
	const [isAdding, setIsAdding] = useState(false);
	const [justAdded, setJustAdded] = useState(false);

	async function handleAddToCart() {
		setIsAdding(true);

		try {
			// Add item to cart
			addItem({
				...product,
				quantity,
			});

			// Show success state
			setJustAdded(true);

			// Open cart drawer if requested (now disabled by default)
			if (openCartOnAdd) {
				setTimeout(() => {
					openCart();
				}, 300);
			}

			// Reset success state after 2s
			setTimeout(() => {
				setJustAdded(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to add to cart:", error);
		} finally {
			setIsAdding(false);
		}
	}

	const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-full";

	const sizeStyles = {
		sm: "px-4 py-2 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
	};

	const variantStyles = {
		primary:
			"bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/25 active:scale-[0.98]",
		secondary:
			"bg-white/15 hover:bg-white/25 text-white ring-1 ring-white/20 active:scale-[0.98]",
		outline:
			"bg-transparent hover:bg-white/10 text-white ring-2 ring-white/30 hover:ring-white/50 active:scale-[0.98]",
	};

	return (
		<button
			onClick={handleAddToCart}
			disabled={isAdding || justAdded}
			className={cn(
				baseStyles,
				sizeStyles[size],
				variantStyles[variant],
				"disabled:opacity-70 disabled:cursor-not-allowed",
				className,
			)}
			aria-label={`Add ${product.title} to cart`}
		>
			{justAdded ? (
				<>
					<Check className="h-5 w-5" />
					<span>Added!</span>
				</>
			) : (
				<>
					<ShoppingBag className="h-5 w-5" />
					<span>{isAdding ? "Adding..." : "Add to Cart"}</span>
				</>
			)}
		</button>
	);
}
