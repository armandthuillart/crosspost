"use client";

import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import type { ChatStatus } from "ai";
import {
	type FormEvent,
	type KeyboardEvent,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	PromptInput,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import { useTypewriter } from "@/hooks/use-typewriter";

const TEXTAREA_MIN_HEIGHT = 24;
const TEXTAREA_EXPANDED_MIN_HEIGHT = 48;

interface ChatInputProps {
	chatId: string;
	isChat: boolean;
	chatStatus: ChatStatus;
	sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
}

export function ChatInput({
	isChat,
	chatId,
	chatStatus,
	sendMessage,
}: ChatInputProps) {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [prompt, setPrompt] = useState("");
	const [threshold, setThreshold] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const isDirty = prompt.trim().length > 0;

	// biome-ignore lint/correctness/useExhaustiveDependencies: would loop
	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!isDirty) return;

			window.history.replaceState({}, "", `/c/${chatId}`);

			sendMessage({
				parts: [{ text: prompt, type: "text" }],
				role: "user",
			});

			setPrompt("");
			resetHeight();
		},
		[prompt, sendMessage],
	);

	const resetHeight = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = "24px";
		}
	}, []);

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
			(threshold == null || prompt.length < threshold);

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
		enabled: !isChat && !isDirty,
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

	const placeholder = isChat
		? "Ask to post about anything..."
		: `Ask to post about ${typewriter}`;

	return (
		<PromptInput
			data-state={isExpanded ? "expanded" : "collapsed"}
			onSubmit={handleSubmit}
		>
			<PromptInputTextarea
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				ref={inputRef}
				value={prompt}
			/>
			<PromptInputSubmit disabled={!isDirty || chatStatus === "streaming"} />
		</PromptInput>
	);
}
