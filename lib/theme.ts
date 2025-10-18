import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setThemeColorCookie } from "~/app/actions";
import { isSSR } from "~/lib/constants";
import type { ThemeColor } from "~/lib/types";

interface ThemeStore {
	themeColor: ThemeColor;
	setThemeColor: (themeColor: ThemeColor) => void;
}

function syncThemeColor(themeColor: ThemeColor): void {
	if (!isSSR) {
		document.documentElement.setAttribute("data-theme", themeColor);
	}
}

export const useThemeStore = create<ThemeStore>()(
	persist(
		(set) => ({
			setThemeColor: async (themeColor) => {
				set({ themeColor });
				syncThemeColor(themeColor);
				await setThemeColorCookie(themeColor);
			},
			themeColor: "default",
		}),
		{
			name: "THEME_COLOR",
			onRehydrateStorage: () => async (localState) => {
				const { themeColor } = localState ?? {};

				if (themeColor) {
					syncThemeColor(themeColor);
					await setThemeColorCookie(themeColor);
				}
			},
		},
	),
);
