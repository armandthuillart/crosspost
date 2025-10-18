"use client";

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from "next-themes";

export const themeColors = [
	"default",
	"orange",
	"yellow",
	"green",
	"blue",
	"pink",
] as const;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableColorScheme
			enableSystem
			storageKey="theme"
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
