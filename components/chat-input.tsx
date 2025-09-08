"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import {
	type KeyboardEvent,
	type MouseEvent,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	PromptInput,
	PromptInputStop,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import { useTypewriter } from "@/hooks/use-typewriter";
import type { MyMessage } from "@/lib/types";

// Constants for textarea sizing
const TEXTAREA_MIN_HEIGHT = 24;
const TEXTAREA_EXPANDED_MIN_HEIGHT = 48;

interface ChatInputProps {
	stop: UseChatHelpers<MyMessage>["stop"];
	status: UseChatHelpers<MyMessage>["status"];
	setMessages: UseChatHelpers<MyMessage>["setMessages"];
}

export function ChatInput({ stop, status, setMessages }: ChatInputProps) {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [prompt, setPrompt] = useState("");
	const [threshold, setThreshold] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	// Auto-resize textarea and handle expansion/collapse logic in a single place
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally depend only on prompt to avoid feedback loops from setState
	useLayoutEffect(() => {
		const textarea = inputRef.current;
		if (!textarea) return;

		textarea.style.height = "auto";
		const scrollHeight = textarea.scrollHeight;
		const isOverflowing = scrollHeight > TEXTAREA_MIN_HEIGHT;

		let nextIsExpanded = isExpanded;
		let nextThreshold = threshold;

		const shouldExpand = isOverflowing && !isExpanded;

		const shouldCollapse =
			isExpanded &&
			!isOverflowing &&
			(nextThreshold == null || prompt.length < nextThreshold);

		if (shouldExpand) {
			nextIsExpanded = true;
			if (nextThreshold == null) {
				nextThreshold = prompt.length;
			}
		}

		if (shouldCollapse) {
			nextThreshold = null;
			nextIsExpanded = false;
		}

		const currentHeight = isOverflowing ? scrollHeight : TEXTAREA_MIN_HEIGHT;

		const newHeight = nextIsExpanded
			? Math.max(currentHeight, TEXTAREA_EXPANDED_MIN_HEIGHT)
			: currentHeight;

		const newHeightPx = `${newHeight}px`;
		if (textarea.style.height !== newHeightPx) {
			textarea.style.height = newHeightPx;
		}

		if (nextThreshold !== threshold) setThreshold(nextThreshold);
		if (nextIsExpanded !== isExpanded) setIsExpanded(nextIsExpanded);
	}, [prompt]);

	const handleStop = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			stop();
			setMessages((messages) => messages);
		},
		[stop, setMessages],
	);

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
			"your life...",
			"your week...",
			"your work...",
			"your goals...",
			"your business...",
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
			{status === "submitted" ? (
				<PromptInputStop onClick={handleStop} />
			) : (
				<PromptInputSubmit disabled={prompt.length === 0} />
			)}
		</PromptInput>
	);
}
