import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConvexClientProvider } from "@/app/convex-client-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	description: "Post to social media by chatting with AI.",
	keywords: [
		"ai",
		"ai chat",
		"fragment",
		"fragmant",
		"marketing",
		"broadcast",
		"crosspost",
		"social media",
		"post scheduler",
	],
	title: "Fragment",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html className="h-full" lang="en" suppressHydrationWarning>
			<body
				className={cn("h-full bg-background text-foreground", inter.className)}
			>
				<JotaiProvider>
					<ConvexClientProvider>{children}</ConvexClientProvider>
					<Analytics debug={false} />
					<SpeedInsights debug={false} />
				</JotaiProvider>
			</body>
		</html>
	);
}
