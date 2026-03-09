import type { Product } from "commerce-kit";
import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatMoneyEUR } from "@/lib/money";
import { YnsLink } from "@/ui/yns-link";

export function ApparelProductGrid({ products }: { products: Product[] }) {
	if (products.length === 0) {
		return (
			<p className="py-16 text-center text-white/60">No apparel products available.</p>
		);
	}

	return (
		<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product, idx) => (
				<li key={product.id} className="group">
					<article className="flex flex-col overflow-hidden rounded-lg bg-black/20 ring-1 ring-white/10 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-purple-500/10 hover:ring-purple-500/40">
						<YnsLink href={`/product/${product.slug}`} className="block">
							{product.images[0] && (
								<div className="aspect-square w-full overflow-hidden bg-neutral-900 rounded-t-lg">
									<Image
										className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-80"
										src={product.images[0]}
										width={768}
										height={768}
										loading={idx < 3 ? "eager" : "lazy"}
										priority={idx < 3}
										sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 700px"
										alt={product.name}
									/>
								</div>
							)}
						</YnsLink>

						<div className="flex flex-1 flex-col gap-3 p-4">
							<div>
								<h2 className="text-xl font-medium text-white drop-shadow-md">{product.name}</h2>
								{product.price !== undefined && (
									<p className="mt-1 text-base text-white/90 drop-shadow-sm">
										{formatMoneyEUR(product.price)}
									</p>
								)}
							</div>
							<AddToCartButton
								product={{
									slug: product.slug ?? product.id,
									title: product.name,
									priceCents: product.price ?? 0,
									currency: product.currency ?? "EUR",
									image: product.images[0] ?? "",
								}}
								className="mt-auto w-full"
							/>
						</div>
					</article>
				</li>
			))}
		</ul>
	);
}
