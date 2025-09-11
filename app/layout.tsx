import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
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
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
