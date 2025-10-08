"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const inputClasses = cn(
	"appearance-none rounded-full absolute py-2 pl-10 pr-4 w-9 opacity-0 transition-opacity ease-linear",
	"bg-white/10 backdrop-blur-md ring-1 ring-white/20 focus:ring-white/40 text-white placeholder-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
	"border-0 focus:border-0 focus:outline-none",
	"max-smb:focus:w-[calc(100vw-2rem)] max-smb:cursor-default max-smb:focus:left-4 max-smb:focus:z-20 max-smb:focus:opacity-100",
	"smb:opacity-100 smb:w-full smb:pl-10 smb:pr-4 smb:inline-block smb:static",
	"md:pl-10 md:pr-4 md:max-w-72",
	"lg:pl-10 lg:pr-4",
);

export const SearchInputPlaceholder = ({ placeholder }: { placeholder: string }) => {
	return (
		<Input
			className={cn("pointer-events-none", inputClasses)}
			placeholder=""
			type="search"
			aria-label="Search products"
			aria-busy
			aria-disabled
		/>
	);
};

export const SearchInput = ({ placeholder }: { placeholder: string }) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const searchParamQuery = searchParams.get("q") ?? "";

	const [query, setQuery] = useState(searchParamQuery);
	const [_isQueryPending, debouncedQuery] = useDebouncedValue(query, 100);

	useEffect(() => {
		router.prefetch(`/search?q=${encodeURIComponent(query)}`);
	}, [query, router]);

	useEffect(() => {
		if (debouncedQuery) {
			router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });
		}
	}, [debouncedQuery, router]);

	useEffect(() => {
		if (pathname === "/search" && !query) {
			router.push(`/`, { scroll: true });
		}
	}, [pathname, query, router]);

	useEffect(() => {
		if (pathname !== "/search") {
			setQuery("");
		}
	}, [pathname]);

	return (
		<Input
			onChange={(e) => {
				const query = e.target.value;
				setQuery(query);
			}}
			className={inputClasses}
			placeholder=""
			type="search"
			enterKeyHint="search"
			name="search"
			value={query}
			aria-label="Search products"
		/>
	);
};
