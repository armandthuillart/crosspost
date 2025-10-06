import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ThemeColor } from "~/lib/types";

export const showShortcutsAtom = atom(false);

export const showBannerAtom = atomWithStorage("banner", false);

export const themeColorAtom = atomWithStorage<ThemeColor>(
	"theme-color",
	"default",
);
