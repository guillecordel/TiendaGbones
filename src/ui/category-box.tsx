import Image, { type ImageProps } from "next/image";
import { getTranslations } from "@/i18n/server";
import { deslugify } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";

export async function CategoryBox({ categorySlug, src }: { categorySlug: string; src: ImageProps["src"] }) {
	const t = await getTranslations("Global.actions");

	return (
		<YnsLink
			href={`/category/${categorySlug}`}
			className="group relative block overflow-hidden bg-black/20 backdrop-blur-sm ring-1 ring-white/10 rounded-lg transition-all hover:bg-black/30 hover:ring-white/20 shadow-lg hover:shadow-xl"
		>
			<div className="relative overflow-hidden">
				<Image
					alt="Cover image"
					className="w-full object-cover transition-all group-hover:opacity-75"
					sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 620px"
					src={src}
				/>
			</div>
			<div className="justify-end gap-2 px-4 py-3 text-white">
				<h3 className="text-lg font-bold tracking-tight drop-shadow-md">{deslugify(categorySlug)}</h3>
				<p className="text-white/80 drop-shadow-sm">{t("shopNow")}</p>
			</div>
		</YnsLink>
	);
}
