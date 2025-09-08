"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Result = {
	reset: () => void;
	pause: () => void;
	resume: () => void;
	isComplete: boolean;
	textStream: string;
	startStreaming: () => void;
};

export function useSmoothStream(
	textStream: string | AsyncIterable<string>,
): Result {
	const [displayedText, setDisplayedText] = useState("");
	const [isComplete, setIsComplete] = useState(false);

	const currentIndexRef = useRef(0);
	const animationRef = useRef<number | null>(null);
	const streamRef = useRef<AbortController | null>(null);
	const completedRef = useRef(false);

	const getChunkSize = useCallback(() => {
		// Fixed speed of 20 - returns chunk size of 1 for smooth typewriter effect
		return 1;
	}, []);

	const getProcessingDelay = useCallback(() => {
		// Fixed speed of 20 - returns delay of 50ms for smooth typewriter effect
		return 50;
	}, []);

	const slice = useCallback((text: string, endIndex: number): string => {
		if (endIndex >= text.length) {
			return text;
		}

		let safeEndIndex = endIndex;

		while (safeEndIndex > 0) {
			const char = text[safeEndIndex];

			if (char && !char.match(/[\uDC00-\uDFFF]/)) {
				break;
			}

			safeEndIndex--;
		}

		return text.slice(0, safeEndIndex);
	}, []);

	const markComplete = useCallback(() => {
		if (!completedRef.current) {
			completedRef.current = true;
			setIsComplete(true);
		}
	}, []);

	const reset = useCallback(() => {
		currentIndexRef.current = 0;
		setDisplayedText("");
		setIsComplete(false);
		completedRef.current = false;

		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
	}, []);

	const processStringTypewriter = useCallback(
		(text: string) => {
			let lastFrameTime = 0;

			const streamContent = (timestamp: number) => {
				const delay = getProcessingDelay();
				if (delay > 0 && timestamp - lastFrameTime < delay) {
					animationRef.current = requestAnimationFrame(streamContent);
					return;
				}
				lastFrameTime = timestamp;

				if (currentIndexRef.current >= text.length) {
					markComplete();
					return;
				}

				const chunkSize = getChunkSize();
				const endIndex = Math.min(
					currentIndexRef.current + chunkSize,
					text.length,
				);
				const newDisplayedText = slice(text, endIndex);

				setDisplayedText(newDisplayedText);
				currentIndexRef.current = endIndex;

				if (endIndex < text.length) {
					animationRef.current = requestAnimationFrame(streamContent);
				} else {
					markComplete();
				}
			};

			animationRef.current = requestAnimationFrame(streamContent);
		},
		[getProcessingDelay, getChunkSize, markComplete, slice],
	);

	const processAsyncIterable = useCallback(
		async (stream: AsyncIterable<string>) => {
			const controller = new AbortController();
			streamRef.current = controller;

			let displayed = "";

			try {
				for await (const chunk of stream) {
					if (controller.signal.aborted) return;

					displayed += chunk;
					setDisplayedText(displayed);
				}

				markComplete();
			} catch (error) {
				console.error("Error processing text stream:", error);
				markComplete();
			}
		},
		[markComplete],
	);

	const startStreaming = useCallback(() => {
		if (typeof textStream === "string") {
			if (textStream.startsWith(displayedText)) {
				currentIndexRef.current = displayedText.length;
			} else {
				reset();
			}
			processStringTypewriter(textStream);
		} else if (textStream) {
			processAsyncIterable(textStream);
		}
	}, [
		textStream,
		reset,
		processStringTypewriter,
		processAsyncIterable,
		displayedText,
	]);

	const pause = useCallback(() => {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
	}, []);

	const resume = useCallback(() => {
		if (typeof textStream === "string" && !isComplete) {
			processStringTypewriter(textStream);
		}
	}, [textStream, isComplete, processStringTypewriter]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: no need
	useEffect(() => {
		startStreaming();

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			if (streamRef.current) {
				streamRef.current.abort();
			}
		};
	}, [textStream, startStreaming]);

	return {
		isComplete,
		pause,
		reset,
		resume,
		startStreaming,
		textStream: displayedText,
	};
}
