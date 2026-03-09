import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { commerce } from "@/lib/commerce";
import { ApparelProductGrid } from "@/ui/products/apparel-product-grid";

export const metadata: Metadata = {
	title: "Apparel — Gbones",
	description: "Dark fashion for rebels. Hoodies, jackets, and tees with a cyber streetwear edge.",
	alternates: { canonical: `${publicUrl}/apparel` },
};

export default async function ApparelPage() {
	const result = await commerce.product.browse({ first: 100, category: "apparel" });
	const products = result.data ?? [];

	return (
		<main className="pb-8">
			<div className="mb-2">
				<h1 className="text-3xl font-bold leading-none tracking-tight text-white drop-shadow-lg">
					Apparel
				</h1>
				<p className="mt-2 text-white/60 text-sm">Dark fashion for rebels</p>
			</div>
			<ApparelProductGrid products={products} />
		</main>
	);
}
