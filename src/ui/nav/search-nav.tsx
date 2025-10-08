import { SearchIcon } from "lucide-react";
import { Suspense } from "react";
import { getTranslations } from "@/i18n/server";
import { SearchInput, SearchInputPlaceholder } from "@/ui/nav/search-input.client";

export const SearchNav = async () => {
	const t = await getTranslations("Global.nav.search");
	return (
		<label className="relative flex w-full items-center min-w-9 justify-end">
			<span className="sr-only">{t("title")}</span>
			<SearchIcon className="absolute left-3 z-20 h-5 w-5 text-white/70 pointer-events-none" />
			<Suspense fallback={<SearchInputPlaceholder placeholder={t("placeholder")} />}>
				<SearchInput placeholder={t("placeholder")} />
			</Suspense>
		</label>
	);
};
