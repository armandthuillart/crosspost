"use client";

import { type RefObject, useCallback, useEffect } from "react";

interface PureAutoFocusOptions {
	shouldFocus?: (event: KeyboardEvent) => boolean;
	onAutoFocus?: (event: KeyboardEvent) => void;
	targetRef: RefObject<HTMLElement | null>;
	enabled?: boolean;
}

export function usePureAutoFocus({
	enabled = true,
	targetRef,
	onAutoFocus,
	shouldFocus = defaultShouldFocus,
}: PureAutoFocusOptions): void {
	// 1. Memoize the event handler to avoid unnecessary re-renders.
	const handleKeyboardEvent = useCallback(
		(event: KeyboardEvent) => {
			if (document.activeElement === targetRef.current) {
				return;
			}

			if (isAnyInputFocused()) {
				return;
			}

			if (!shouldFocus(event)) {
				return;
			}

			event.preventDefault();
			targetRef.current?.focus();
			onAutoFocus?.(event);
		},
		[targetRef, onAutoFocus, shouldFocus],
	);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		// 2. Use passive event listeners to avoid layout thrashing.
		document.addEventListener("keydown", handleKeyboardEvent, {
			passive: false,
		});

		return () => {
			document.removeEventListener("keydown", handleKeyboardEvent);
		};
	}, [enabled, handleKeyboardEvent]);
}

function defaultShouldFocus(event: KeyboardEvent): boolean {
	const { key, ctrlKey, metaKey, altKey, shiftKey } = event;

	if (ctrlKey || metaKey || altKey || shiftKey) {
		return false;
	}

	const isPrintableKey = key.length === 1;

	const isNavigationKey = [
		"Backspace",
		"Delete",
		"Enter",
		"Space",
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
	].includes(key);

	if (hasOpenDialog()) {
		return false;
	}

	if (isTypingInMessageEditor()) {
		return false;
	}

	return isPrintableKey || isNavigationKey;
}

function isAnyInputFocused(): boolean {
	const activeElement = document.activeElement;
	return (
		activeElement?.tagName === "INPUT" ||
		activeElement?.tagName === "TEXTAREA" ||
		!!activeElement?.hasAttribute("contenteditable")
	);
}

function hasOpenDialog(): boolean {
	return (
		document.querySelector('[role="alertdialog"]') !== null ||
		document.querySelector('[role="dialog"]') !== null
	);
}

function isTypingInMessageEditor(): boolean {
	return document.activeElement?.closest('[data-mode="edit"]') !== null;
}

interface AutoFocusOptions {
	value: string;
	enabled?: boolean;
	targetRef: RefObject<HTMLTextAreaElement | null>;
	onValueChange: (value: string) => void;
}

export function useAutoFocus({
	value,
	enabled = true,
	targetRef,
	onValueChange,
}: AutoFocusOptions): void {
	// 3. Memoize the callback to prevent recreation.
	const handleAutoFocus = useCallback(
		(event: KeyboardEvent) => {
			if (event.key.length === 1) {
				const newValue = value + event.key;

				// 4. Use a single RAF to batch all operations.
				requestAnimationFrame(() => {
					onValueChange(newValue);

					// 5. Defer selection range update to avoid layout thrashing.
					requestAnimationFrame(() => {
						targetRef.current?.setSelectionRange(
							newValue.length,
							newValue.length,
						);
					});
				});
			}
		},
		[value, onValueChange, targetRef],
	);

	usePureAutoFocus({
		enabled,
		onAutoFocus: handleAutoFocus,
		shouldFocus: (event) => {
			if (!defaultShouldFocus(event)) {
				return false;
			}

			return event.key.length === 1;
		},
		targetRef,
	});
}
