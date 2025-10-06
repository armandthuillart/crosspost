import "~/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, type Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConvexClientProvider } from "~/app/convex-client-provider";
import { ThemeProvider } from "~/app/theme-provider";
import { routing } from "~/i18n/routing";
import { appName } from "~/lib/constants";
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
		title: appName,
	};
}

export default async function LocaleLayout({
	params,
	children,
}: LayoutProps<"/[locale]">) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	return (
		<html className="relative h-full" lang={locale} suppressHydrationWarning>
			<body
				className={cn(
					"relative h-full bg-background font-sans text-foreground antialiased",
					mono.variable,
					sans.variable,
				)}
			>
				<ThemeProvider>
					<JotaiProvider>
						<Analytics debug={false} />
						<SpeedInsights debug={false} />
						<NextIntlClientProvider>
							<ConvexClientProvider>{children}</ConvexClientProvider>
						</NextIntlClientProvider>
					</JotaiProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
