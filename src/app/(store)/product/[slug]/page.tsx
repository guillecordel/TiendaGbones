// import { ProductModel3D } from "@/app/(store)/product/[slug]/product-model3d";

import type { YnsProduct } from "commerce-kit";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { ProductImageModal } from "@/app/(store)/product/[slug]/product-image-modal";
import { AddToCart } from "@/components/add-to-cart";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { publicUrl } from "@/env.mjs";
import { getLocale, getTranslations } from "@/i18n/server";
import { commerce } from "@/lib/commerce";
import { formatMoneyEUR } from "@/lib/money";
import { deslugify } from "@/lib/utils";
import { JsonLd, mappedProductToJsonLd } from "@/ui/json-ld";
import { Markdown } from "@/ui/markdown";
import { MainProductImage } from "@/ui/products/main-product-image";
import { YnsLink } from "@/ui/yns-link";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const product = await commerce.product.get({ slug: params.slug });

	if (!product) {
		return notFound();
	}
	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${publicUrl}/product/${params.slug}`);

	return {
		title: t("title", { productName: product.name }),
		description: product.summary,
		alternates: { canonical },
	} satisfies Metadata;
};

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string; image?: string }>;
}) {
	const params = await props.params;

	const product = await commerce.product.get({ slug: params.slug });

	if (!product) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	// Cast to YnsProduct to access YNS-specific fields
	const ynsProduct = product as YnsProduct;
	const category = ynsProduct.category?.slug;
	const images = product.images;

	return (
		<article className="pb-12">
			<Breadcrumb>
				<BreadcrumbList className="text-white/80">
					<BreadcrumbItem>
						<BreadcrumbLink asChild className="inline-flex min-h-12 min-w-12 items-center justify-center text-white/80 hover:text-white">
							<YnsLink href="/products">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator className="text-white/60" />
							<BreadcrumbItem>
								<BreadcrumbLink className="inline-flex min-h-12 min-w-12 items-center justify-center text-white/80 hover:text-white" asChild>
									<YnsLink href={`/category/${category}`}>{deslugify(category)}</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator className="text-white/60" />
					<BreadcrumbItem>
						<BreadcrumbPage className="text-white">{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="mt-4 grid gap-4 lg:grid-cols-12">
				<div className="lg:col-span-5 lg:col-start-8">
					<h1 className="text-3xl font-bold leading-none tracking-tight text-white drop-shadow-lg">{product.name}</h1>
					<p className="mt-2 text-2xl font-medium leading-none tracking-tight text-white/90 drop-shadow-md">
						{formatMoneyEUR(product.price)}
					</p>
					<div className="mt-2 text-white/80">{(product.stock || 0) <= 0 && <div>Out of stock</div>}</div>
				</div>

				<div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
					<h2 className="sr-only">{t("imagesTitle")}</h2>

					<div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
						{images.map((image, idx) => {
							const params = new URLSearchParams({
								image: idx.toString(),
							});
							return (
								<YnsLink key={idx} href={`?${params}`} scroll={false}>
									{idx === 0 ? (
										<MainProductImage
											key={image}
											className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
											src={image}
											loading="eager"
											priority
											alt=""
										/>
									) : (
										<Image
											key={image}
											className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
											src={image}
											width={700 / 3}
											height={700 / 3}
											sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
											loading="eager"
											priority
											alt=""
										/>
									)}
								</YnsLink>
							);
						})}
					</div>
				</div>

				<div className="grid gap-8 lg:col-span-5">
					<section>
						<h2 className="sr-only">{t("descriptionTitle")}</h2>
						<div className="prose prose-invert text-white/90">
							<Markdown source={product.summary || ""} />
						</div>
					</section>

					<AddToCart
						variantId={ynsProduct.variants[0]?.id || product.id}
						className={(product.stock || 0) <= 0 ? "opacity-50 cursor-not-allowed" : ""}
					>
						{(product.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
					</AddToCart>
				</div>
			</div>

			<Suspense>
				<SimilarProducts id={product.id} />
			</Suspense>

			<Suspense>
				<ProductImageModal images={images} />
			</Suspense>

			<JsonLd jsonLd={mappedProductToJsonLd(product)} />
		</article>
	);
}

async function SimilarProducts({ id }: { id: string }) {
	// TODO: Implement similar products functionality
	return null;
}
