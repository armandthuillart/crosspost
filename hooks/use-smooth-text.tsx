"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FPS = 20;
const MS_PER_FRAME = 1000 / FPS;
const DEFAULT_CHARS_PER_SEC = 128;

interface SmoothTextState {
	cursor: number;
	isStreaming: boolean;
}

interface SmoothTextOptions {
	startStreaming?: boolean;
}

export function useSmoothText(
	text: string,
	options: SmoothTextOptions = {},
): [string, SmoothTextState] {
	const { startStreaming = false } = options;

	const [visibleText, setVisibleText] = useState(
		startStreaming ? "" : text || "",
	);

	const stateRef = useRef({
		charsPerMs: DEFAULT_CHARS_PER_SEC / 1000,
		cursor: visibleText.length,
		initial: true,
		lastUpdate: Date.now(),
		lastUpdateLength: text.length,
		tick: Date.now(),
	});

	const isStreaming = stateRef.current.cursor < text.length;

	const updateText = useCallback(() => {
		const state = stateRef.current;

		if (state.cursor >= text.length) return;

		const now = Date.now();
		const timeSinceLastUpdate = now - state.tick;
		const charsSinceLastUpdate = Math.floor(
			timeSinceLastUpdate * state.charsPerMs,
		);

		const chars = Math.min(charsSinceLastUpdate, text.length - state.cursor);

		state.cursor += chars;
		state.tick = now;
		setVisibleText(text.slice(0, state.cursor));
	}, [text]);

	useEffect(() => {
		if (!isStreaming) return;

		const state = stateRef.current;

		if (state.lastUpdateLength !== text.length) {
			const timeSinceLastUpdate = Date.now() - state.lastUpdate;

			if (timeSinceLastUpdate > 0) {
				const latestCharsPerMs =
					(text.length - state.lastUpdateLength) / timeSinceLastUpdate;
				const charLag = state.lastUpdateLength - state.cursor;
				const lagRate = charLag / timeSinceLastUpdate;
				const rateError = latestCharsPerMs - state.charsPerMs;

				const adjustment = state.initial
					? 0
					: Math.max(0, (rateError + lagRate) / 2);
				const newCharsPerMs = latestCharsPerMs + adjustment;

				state.charsPerMs = Math.min(
					(2 * newCharsPerMs + state.charsPerMs) / 3,
					state.charsPerMs * 2,
				);
				state.initial = false;
			}
		}

		// Ensure the first immediate update has at least one frame of delta so
		// very short, fast-finishing replies render at least one character.
		state.tick = Math.min(state.tick, Date.now() - MS_PER_FRAME);
		state.lastUpdate = Date.now();
		state.lastUpdateLength = text.length;

		updateText();
		const interval = setInterval(updateText, MS_PER_FRAME);
		return () => clearInterval(interval);
	}, [text, isStreaming, updateText]);

	// Finalization flush: when streaming ends or streaming was never started,
	// immediately show the full text and synchronize the internal cursor.
	useEffect(() => {
		if (startStreaming) return;
		const state = stateRef.current;
		if (state.cursor !== text.length || visibleText !== text) {
			state.cursor = text.length;
			state.lastUpdate = Date.now();
			state.lastUpdateLength = text.length;
			state.tick = Date.now();
			setVisibleText(text || "");
		}
	}, [startStreaming, text, visibleText]);

	return [
		visibleText,
		{
			cursor: stateRef.current.cursor,
			isStreaming,
		},
	];
}
