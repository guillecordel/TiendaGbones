"use client";

import { Menu, UserIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { YnsLink } from "@/ui/yns-link";

export function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const links = [
		{ href: "/", label: "Home" },
		{ href: "/category/apparel", label: "Apparel" },
		{ href: "/category/accessories", label: "Accessories" },
		{ href: "/products", label: "All Products" },
	];

	// Handle body scroll lock
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	// Handle close with animation
	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsOpen(false);
			setIsClosing(false);
		}, 300); // Match animation duration
	};

	return (
		<>
			{/* Hamburger button - only on mobile */}
			<button
				onClick={() => setIsOpen(true)}
				aria-label="Open menu"
				className="lg:hidden h-10 w-10 grid place-items-center rounded-full ring-1 ring-white/20 bg-white/10 hover:bg-white/15 transition"
			>
				<Menu className="h-5 w-5 text-white" />
			</button>

			{/* Backdrop and drawer */}
			{isOpen && (
				<>
					{/* Backdrop with fade animation */}
					<div
						className={`fixed inset-0 z-[99] bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
							isClosing ? "opacity-0" : "opacity-100"
						}`}
						onClick={handleClose}
						aria-hidden="true"
					/>

					{/* Full-screen dropdown menu with slide animation */}
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Mobile navigation menu"
						className={`fixed top-0 left-0 h-screen w-full z-[100] lg:hidden overflow-y-auto bg-gradient-to-b from-[#240046] via-[#3d0071] to-[#1b0033] transition-transform duration-300 ease-out ${
							isClosing ? "-translate-y-full" : "translate-y-0"
						}`}
					>
						{/* Top header */}
						<div className="flex items-center justify-between pl-2 pr-4 sm:pl-4 sm:pr-6 h-16 border-b border-white/10">
							{/* Logo/Brand - matching main nav exactly */}
							<div className="flex items-center gap-2 md:gap-3">
								<Image
									src="/calavera.svg"
									alt="Gbones logo"
									width={140}
									height={140}
									className="h-32 w-32 md:h-36 md:w-36 drop-shadow-lg text-white translate-y-[15px]"
								/>
								<h2 className="text-xl font-brand text-white drop-shadow-md -ml-5">Gbones</h2>
							</div>

							{/* Close button */}
							<button
								onClick={handleClose}
								aria-label="Close menu"
								className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center ring-1 ring-white/20 transition-all duration-200"
							>
								<X className="h-6 w-6 text-white" />
							</button>
						</div>

						{/* Navigation links */}
						<nav className="flex flex-col px-6 py-8">
							{links.map((link, index) => (
								<YnsLink
									key={link.href}
									href={link.href}
									onClick={handleClose}
									className={`py-5 text-white hover:text-purple-300 transition-all duration-200 text-2xl font-medium tracking-wide border-b border-white/10 hover:pl-2 ${
										isClosing ? "opacity-100" : "opacity-0 animate-fadeIn"
									}`}
									style={{
										animationDelay: isClosing ? "0s" : `${index * 0.1}s`,
									}}
								>
									{link.label}
								</YnsLink>
							))}

							{/* Login link */}
							<YnsLink
								href="/login"
								onClick={handleClose}
								className={`flex items-center gap-3 py-5 text-white hover:text-purple-300 transition-all duration-200 text-2xl font-medium tracking-wide border-b border-white/10 hover:pl-2 ${
									isClosing ? "opacity-100" : "opacity-0 animate-fadeIn"
								}`}
								style={{
									animationDelay: isClosing ? "0s" : `${links.length * 0.1}s`,
								}}
							>
								<UserIcon className="h-6 w-6" />
								<span>Login</span>
							</YnsLink>
						</nav>

						{/* Footer */}
						<div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-white/10">
							<p className="text-sm text-white/80 text-center mb-2">Dark fashion for rebels</p>
							<p className="text-xs text-white/60 text-center tracking-wider">© 2025 GBONES</p>
						</div>
					</div>
				</>
			)}
		</>
	);
}


