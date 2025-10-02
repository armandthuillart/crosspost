import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConvexClientProvider } from "~/app/convex-client-provider";
import { ThemeProvider } from "~/app/theme-provider";
import { appName } from "~/lib/constants";
import { cn } from "~/lib/utils";

const inter = Inter({ subsets: ["latin"] });

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
	title: appName,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html className="h-full" lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"h-full bg-background text-foreground antialiased",
					inter.className,
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
