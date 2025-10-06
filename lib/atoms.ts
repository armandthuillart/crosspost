import { atomWithStorage } from "jotai/utils";
import type { ThemeColor } from "~/lib/types";

export const showBannerAtom = atomWithStorage("banner", false);

export const themeColorAtom = atomWithStorage<ThemeColor>(
	"theme-color",
	"default",
);
