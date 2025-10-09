import { Menu, UserIcon } from "lucide-react";
import Image from "next/image";
import { CartIcon } from "@/components/cart-icon";
import { MobileMenu } from "@/ui/nav/mobile-menu.client";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav.client";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";

export const Nav = async () => {
	return (
		<header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
			<div className="mx-auto flex max-w-7xl items-center gap-3 pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8 h-16">
				{/* Brand with skull logo - flush left like Nike */}
				<YnsLink href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition">
					<Image
						src="/calavera.svg"
						alt="Gbones logo"
						width={140}
						height={140}
						className="h-32 w-32 md:h-36 md:w-36 drop-shadow-lg text-white translate-y-[15px]"
						priority
					/>
					{/* Wordmark: show on md+ */}
					<SeoH1 className="hidden md:block text-xl font-brand tracking-wide text-white drop-shadow-md -ml-5">
						Gbones
					</SeoH1>
				</YnsLink>

				{/* Desktop nav menu - spaced from logo */}
				<div className="hidden lg:flex shrink overflow-auto ml-6 md:ml-8">
					<NavMenu />
				</div>

				{/* Search - responsive */}
				<div className="ml-auto">
					<SearchNav />
				</div>

				{/* Cart and user icons */}
				<div className="flex items-center gap-2">
					<CartIcon />
					<YnsLink
						href="/login"
						aria-label="Login"
						className="hidden lg:grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/20 bg-white/10 hover:bg-white/15 transition focus-visible:ring-2 focus-visible:ring-white/50 outline-none"
					>
						<UserIcon className="h-5 w-5 text-white" />
					</YnsLink>
				</div>

				{/* Mobile hamburger menu */}
				<MobileMenu />
			</div>
		</header>
	);
};
