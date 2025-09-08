"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConvexReactClient } from "convex/react";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string,
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
				<NuqsAdapter>
					<ConvexBetterAuthProvider authClient={authClient} client={convex}>
						{children}
						<Analytics debug={false} />
						<SpeedInsights debug={false} />
					</ConvexBetterAuthProvider>
				</NuqsAdapter>
			</JotaiProvider>
		</ThemeProvider>
	);
}
