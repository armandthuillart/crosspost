"use client";

import {
	type KeyboardEvent,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	PromptInput,
	PromptInputTextarea,
	PurePromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import { useTypewriter } from "@/hooks/use-typewriter";

export function ChatInput() {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const expandedHeightRef = useRef<number>(24);

	const [prompt, setPrompt] = useState("");
	const [threshold, setThreshold] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	// Auto-resize textarea and handle expansion logic
	// biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally avoid circular dependencies by only depending on prompt
	useLayoutEffect(() => {
		if (!inputRef.current) {
			return;
		}

		// Always reset to auto to get accurate measurement
		inputRef.current.style.height = "auto";
		const scrollHeight = inputRef.current.scrollHeight;
		const shouldExpand = scrollHeight > 24;

		// Record the largest expanded height seen so far
		if (shouldExpand) {
			expandedHeightRef.current = Math.max(
				expandedHeightRef.current,
				scrollHeight,
			);
		}

		// Apply height: if expanded, lock to at least the last expanded height to avoid shrinking
		if (isExpanded) {
			const targetHeight = Math.max(
				shouldExpand ? scrollHeight : 24,
				expandedHeightRef.current,
			);
			inputRef.current.style.height = `${targetHeight}px`;
		} else {
			inputRef.current.style.height = shouldExpand
				? `${scrollHeight}px`
				: "24px";
		}

		// Handle state changes based on content and threshold

		// Handle threshold-based collapse (user deleted enough text AND content fits in 24px)
		if (
			threshold !== null &&
			prompt.length <= threshold &&
			isExpanded &&
			!shouldExpand
		) {
			setIsExpanded(false);
			setThreshold(null);
			expandedHeightRef.current = 24;
			// Ensure immediate visual collapse without waiting another cycle
			inputRef.current.style.height = "24px";
			return;
		}

		// Handle expansion - only expand if not already expanded
		if (shouldExpand && !isExpanded) {
			setIsExpanded(true);
			// Set threshold when expanding for the first time
			if (!threshold) {
				setThreshold(prompt.length);
			}
			expandedHeightRef.current = Math.max(48, scrollHeight);
			return;
		}

		// Handle natural collapse (content shrunk and no longer needs expansion)
		if (!shouldExpand && isExpanded && !threshold) {
			setIsExpanded(false);
			expandedHeightRef.current = 24;
			inputRef.current.style.height = "24px";
			return;
		}
	}, [prompt]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			setPrompt(event.currentTarget.value);
		},
		[],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>) => {
			const isEnter = event.key === "Enter";
			const isShiftKey = event.shiftKey;
			const isComposing = event.nativeEvent.isComposing;

			if (isEnter && !isShiftKey && !isComposing) {
				event.preventDefault();

				if (prompt.length > 0) {
					const form = event.currentTarget.form;
					if (form) form.requestSubmit();
				}
			}
		},
		[prompt.length],
	);

	useAutoFocus({
		onValueChange: setPrompt,
		targetRef: inputRef,
		value: prompt,
	});

	const typewriter = useTypewriter({
		enabled: true,
		loop: true,
		pauseDuration: 2000,
		texts: [
			"yourself...",
			"your app...",
			"anything...",
			"your day...",
			"your week...",
			"your work...",
			"your goals...",
			"your thoughts...",
		],
		typingSpeed: 100,
	});

	const placeholder = `Ask to post about ${typewriter}`;

	return (
		<PromptInput data-state={isExpanded ? "expanded" : "collapsed"}>
			<PromptInputTextarea
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				ref={inputRef}
				value={prompt}
			/>
			<PurePromptInputSubmit disabled={prompt.length === 0} />
		</PromptInput>
	);
}
