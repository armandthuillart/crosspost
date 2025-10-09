import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ThemeColor } from "~/lib/types";

export const showShortcutsAtom = atom(false);

export const showBannerAtom = atomWithStorage("banner", false);

const createThemeStorage = () => ({
	getItem: (key: string): ThemeColor => {
		if (typeof window === "undefined") return "default";
		return (localStorage.getItem(key) as ThemeColor) || "default";
	},
	removeItem: (key: string) => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(key);
		// biome-ignore lint/suspicious/noDocumentCookie: is ok
		document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
	},
	setItem: (key: string, value: string) => {
		if (typeof window === "undefined") return;
		localStorage.setItem(key, value);
		// biome-ignore lint/suspicious/noDocumentCookie: is ok
		document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
	},
});

export const themeColorAtom = atomWithStorage<ThemeColor>(
	"theme-color",
	"default",
	createThemeStorage(),
);
