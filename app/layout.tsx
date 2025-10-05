import "~/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "~/app/convex-client-provider";
import { ThemeProvider } from "~/app/theme-provider";
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

export const metadata: Metadata = {
	description: "Create and post to social media by chatting with AI.",
	keywords: [
		"ai",
		"ai chat",
		"crosspost",
		"marketing",
		"broadcast",
		"crosspost",
		"social media",
		"post scheduler",
	],
	metadataBase: new URL("https://www.try-crosspost.com"),
	title: { default: appName, template: `%s | ${appName}` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html className="h-full" lang="en" suppressHydrationWarning>
			<head>
				<script src="https://unpkg.com/react-scan/dist/auto.global.js" />
			</head>
			<body
				className={cn(
					"h-full bg-background font-sans text-foreground antialiased",
					mono.variable,
					sans.variable,
				)}
			>
				<ThemeProvider>
					<JotaiProvider>
						<ConvexClientProvider>{children}</ConvexClientProvider>
						<Analytics debug={false} />
						<SpeedInsights debug={false} />
					</JotaiProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
