import { create } from "zustand";

type UsageStore = {
	showBanner: () => void;
	isVisible: boolean;
	hideBanner: () => void;
};

export const useUsageStore = create<UsageStore>((set) => ({
	hideBanner: () => set({ isVisible: false }),
	isVisible: false,
	showBanner: () => set({ isVisible: true }),
}));
