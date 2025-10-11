"use client";

import { type RefObject, useEffect } from "react";

interface KeyboardAutoFocusOptions {
	isValidKey?: (event: KeyboardEvent) => boolean;
	onAutoFocus?: (event: KeyboardEvent) => void;
	targetRef: RefObject<HTMLElement | null>;
	enabled?: boolean;
}

function useKeyboardAutoFocus({
	enabled = true,
	targetRef,
	onAutoFocus,
	isValidKey = defaultIsValidKey,
}: KeyboardAutoFocusOptions): void {
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleKeyboardEvent = (event: KeyboardEvent) => {
			if (document.activeElement === targetRef.current) {
				return;
			}

			if (!shouldAllowAutoFocus()) {
				return;
			}

			if (!isValidKey(event)) {
				return;
			}

			event.preventDefault();
			targetRef.current?.focus();
			onAutoFocus?.(event);
		};

		document.addEventListener("keydown", handleKeyboardEvent, {
			passive: false,
		});

		return () => {
			document.removeEventListener("keydown", handleKeyboardEvent);
		};
	}, [enabled, targetRef, onAutoFocus, isValidKey]);
}

function defaultIsValidKey(event: KeyboardEvent): boolean {
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

	return isPrintableKey || isNavigationKey;
}

function shouldAllowAutoFocus(): boolean {
	const active = document.activeElement;
	if (!active) return true;

	// Don't auto-focus if typing in input or inside dialog/edit mode
	const isEditable =
		active.tagName === "INPUT" ||
		active.tagName === "TEXTAREA" ||
		active.hasAttribute("contenteditable");

	return !isEditable && !active.closest('[role="dialog"], [data-mode="edit"]');
}

interface TextareaAutoFocusOptions {
	value: string;
	enabled?: boolean;
	targetRef: RefObject<HTMLTextAreaElement | null>;
	onValueChange: (value: string) => void;
}

export function useTextareaAutoFocus({
	value,
	enabled = true,
	targetRef,
	onValueChange,
}: TextareaAutoFocusOptions): void {
	const handleAutoFocus = (event: KeyboardEvent) => {
		if (event.key.length === 1) {
			const newValue = value + event.key;
			onValueChange(newValue);

			// Set cursor to end after React renders
			requestAnimationFrame(() => {
				targetRef.current?.setSelectionRange(newValue.length, newValue.length);
			});
		}
	};

	useKeyboardAutoFocus({
		enabled,
		isValidKey: (event) => {
			if (!defaultIsValidKey(event)) {
				return false;
			}

			return event.key.length === 1;
		},
		onAutoFocus: handleAutoFocus,
		targetRef,
	});
}
