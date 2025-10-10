import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { setThemeColorCookie } from "~/app/actions";
import type { ThemeColor } from "~/lib/types";

export const showShortcutsAtom = atom(false);

export const showBannerAtom = atomWithStorage("banner", false);

const atomWithCookie = () => ({
	getItem: (key: string): ThemeColor => {
		if (typeof window === "undefined") return "default";
		return (localStorage.getItem(key) as ThemeColor) || "default";
	},
	removeItem: async (key: string) => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(key);
		await setThemeColorCookie("default");
	},
	setItem: async (key: string, value: string) => {
		if (typeof window === "undefined") return;
		localStorage.setItem(key, value);
		await setThemeColorCookie(value);
	},
});

export const themeColorAtom = atomWithStorage<ThemeColor>(
	"theme-color",
	"default",
	atomWithCookie(),
);
