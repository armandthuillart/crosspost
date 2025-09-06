"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

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
			{children}
		</ThemeProvider>
	);
}
