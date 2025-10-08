"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { useState } from "react";

export function SearchNav() {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			window.location.href = `/search?query=${encodeURIComponent(query.trim())}`;
		}
	};

	return (
		<>
			{/* Mobile: circular translucent button */}
			<button
				type="button"
				aria-label="Search"
				onClick={() => setIsOpen(true)}
				className="lg:hidden grid place-items-center h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/15 transition focus-visible:ring-2 focus-visible:ring-white/50 outline-none"
			>
				<SearchIcon className="h-5 w-5 text-white/90" />
			</button>

			{/* Desktop: pill input */}
			<form onSubmit={handleSearch} className="hidden lg:block">
				<label className="relative inline-flex w-64 xl:w-80 items-center">
					<SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-white/70" />
					<input
						type="search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						aria-label="Search products"
						placeholder="Search for products…"
						className="w-full rounded-full bg-white/10 py-2 pl-9 pr-3 text-white placeholder-white/50 ring-1 ring-white/20 focus:ring-white/40 focus-visible:ring-2 focus-visible:ring-white/50 outline-none transition"
					/>
				</label>
			</form>

			{/* Mobile search overlay */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 lg:hidden"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					{/* Search modal */}
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Search"
						className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-black/90 backdrop-blur-md rounded-2xl ring-1 ring-white/20 p-4 z-50 lg:hidden shadow-2xl"
					>
						{/* Close button */}
						<button
							onClick={() => setIsOpen(false)}
							aria-label="Close search"
							className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center ring-1 ring-white/20 transition"
						>
							<X className="h-4 w-4 text-white" />
						</button>

						{/* Search form */}
						<form onSubmit={handleSearch} className="mt-2">
							<div className="relative">
								<SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
								<input
									type="search"
									autoFocus
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									aria-label="Search products"
									placeholder="Search for products…"
									className="w-full rounded-full bg-white/10 py-3 pl-10 pr-4 text-white placeholder-white/50 ring-1 ring-white/20 focus:ring-white/40 focus-visible:ring-2 focus-visible:ring-white/50 outline-none text-base"
								/>
							</div>
							<button
								type="submit"
								className="w-full mt-3 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition ring-1 ring-white/20 focus-visible:ring-2 focus-visible:ring-white/50 outline-none"
							>
								Search
							</button>
						</form>
					</div>
				</>
			)}
		</>
	);
}
