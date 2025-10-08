import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Chivo_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { env, publicUrl } from "@/env.mjs";
import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";

// Chivo Mono font for brand
const chivoMono = Chivo_Mono({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-brand",
	display: "swap",
});

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("Global.metadata");
	return {
		title: t("title"),
		description: t("description"),
		metadataBase: new URL(publicUrl),
		icons: {
			icon: "/icon.svg",
			shortcut: "/icon.svg",
			apple: "/icon.svg",
		},
	};
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className={`h-full antialiased ${chivoMono.variable}`}>
			<body className="relative flex min-h-screen flex-col font-brand text-white dark-gradient">
				{/* Subtle overlay for depth */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(255,255,255,0.05)_0%,_transparent_60%)] pointer-events-none z-0" />

				<IntlClientProvider messages={messages} locale={locale}>
					<div className="relative z-10 flex min-h-full flex-1 flex-col" vaul-drawer-wrapper="">
						{children}
					</div>
					<Toaster position="top-center" offset={10} />
				</IntlClientProvider>
				{env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
					<Script
						async
						src="/stats/script.js"
						data-host-url={publicUrl + "/stats"}
						data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					/>
				)}
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
