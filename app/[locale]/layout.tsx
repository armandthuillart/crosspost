import "~/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, type Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ConvexClientProvider } from "~/app/convex-client-provider";
import { ThemeProvider } from "~/app/theme-provider";
import { routing } from "~/i18n/routing";
import { appName } from "~/lib/constants";
import type { ThemeColor } from "~/lib/types";
import { cn } from "~/lib/utils";

const sans = Geist({
	subsets: ["latin"],
	variable: "--font-geist",
});

const mono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;

	const t = await getTranslations({
		locale: locale as Locale,
		namespace: "LocaleLayout",
	});

	return {
		description: t("description"),
		keywords: t("keywords").split(","),
		metadataBase: process.env.SITE_URL,
		title: appName,
	};
}

export default async function LocaleLayout({
	params,
	children,
}: LayoutProps<"/[locale]">) {
	const [{ locale }, cookieStore] = await Promise.all([params, cookies()]);

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const themeColor = cookieStore.get("THEME_COLOR")?.value as ThemeColor;

	return (
		<html
			className="relative h-full"
			data-theme={themeColor}
			lang={locale}
			suppressHydrationWarning
		>
			<body
				className={cn(
					"relative h-full bg-background font-sans text-foreground antialiased",
					mono.variable,
					sans.variable,
				)}
			>
				<NuqsAdapter>
					<ThemeProvider>
						<JotaiProvider>
							<Analytics debug={false} />
							<SpeedInsights debug={false} />
							<NextIntlClientProvider>
								<ConvexClientProvider>{children}</ConvexClientProvider>
							</NextIntlClientProvider>
						</JotaiProvider>
					</ThemeProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
