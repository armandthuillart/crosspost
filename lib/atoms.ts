import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const showStreamerAtom = atomWithStorage("streamer", false);
export const currentThreadIdAtom = atom<string | null>(null);
