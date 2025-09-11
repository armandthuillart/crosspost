"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConvexReactClient } from "convex/react";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string,
	{ expectAuth: true },
);

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableColorScheme
			enableSystem
			storageKey="chat:theme"
		>
			<JotaiProvider>
				<ConvexBetterAuthProvider authClient={authClient} client={convex}>
					{children}
					<Analytics debug={false} />
					<SpeedInsights debug={false} />
				</ConvexBetterAuthProvider>
			</JotaiProvider>
		</ThemeProvider>
	);
}
