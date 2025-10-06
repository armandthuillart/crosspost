"use client";

import { useEffect } from "react";

export function useShortcut(shortcut: ShortcutConfig, callback: () => void) {
	useEffect(() => {
		const isMac = /Mac|iPod|iPhone|iPad|Apple/.test(navigator.userAgent);

		function isModifierHeld(event: KeyboardEvent) {
			return shortcut.modifier
				? isMac
					? event.metaKey
					: event.ctrlKey
				: !(isMac ? event.metaKey : event.ctrlKey);
		}

		function isShiftHeld(event: KeyboardEvent) {
			return shortcut.shift ? event.shiftKey : !event.shiftKey;
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (isUserTyping(event.target)) return;

			const pressedKey = event.key.toLowerCase();
			const shortcutKey = shortcut.key.toLowerCase();

			if (
				pressedKey === shortcutKey &&
				isModifierHeld(event) &&
				isShiftHeld(event)
			) {
				event.preventDefault();
				callback();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [shortcut, callback]);
}

type ShortcutName = "TOGGLE_SIDEBAR" | "OPEN_SETTINGS" | "SEE_SHORTCUTS";

type ShortcutConfig = {
	key: string;
	label: string;
	shift?: boolean;
	modifier?: boolean;
};

export const SHORTCUTS: Record<ShortcutName, ShortcutConfig> = {
	OPEN_SETTINGS: {
		key: ",",
		label: "Open settings",
		modifier: true,
	},
	SEE_SHORTCUTS: {
		key: "?",
		label: "See shortcuts",
		modifier: true,
		shift: true,
	},
	TOGGLE_SIDEBAR: {
		key: "b",
		label: "Toggle sidebar",
		modifier: true,
	},
};

function isUserTyping(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	return (
		target.tagName === "INPUT" ||
		target.tagName === "TEXTAREA" ||
		target.isContentEditable
	);
}
