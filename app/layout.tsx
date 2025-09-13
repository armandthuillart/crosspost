import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConvexClientProvider } from "@/app/convex-client-provider";
import { isDevelopment } from "@/lib/constants";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
	description: "Create and post to social media by chatting with AI.",
	keywords: [
		"ai",
		"ai chat",
		"fragment",
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
			{isDevelopment && (
				<head>
					<script
						crossOrigin="anonymous"
						src="//unpkg.com/react-scan/dist/auto.global.js"
					/>
				</head>
			)}
			<body
				className={cn("h-full bg-background text-foreground", geist.className)}
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
