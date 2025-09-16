"use client";

import type { ThreadDoc } from "@convex-dev/agent";
import { optimisticallySendMessage } from "@convex-dev/agent/react";
import { useMutation } from "convex/react";
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
import { api } from "@/convex/_generated/api";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import { useTypewriter } from "@/hooks/use-typewriter";

const TEXTAREA_MIN_HEIGHT = 24;
const TEXTAREA_EXPANDED_MIN_HEIGHT = 48;

interface ChatInputProps {
	userId: string;
	isChat: boolean;
	threadId?: string;
	isStreaming: boolean;
}

export function ChatInput({
	isChat,
	userId,
	threadId,
	isStreaming,
}: ChatInputProps) {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [prompt, setPrompt] = useState("");
	const [threshold, setThreshold] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const isDirty = prompt.trim().length > 0;

	const createChat = useMutation(api.chat.createChat).withOptimisticUpdate(
		(localStore) => {
			const optimisticId = crypto.randomUUID();
			const existingChats = localStore.getQuery(api.chat.listChats, { userId });

			if (existingChats) {
				const now = Date.now();

				const optimisticChat: ThreadDoc = {
					_creationTime: now,
					_id: optimisticId,
					status: "active",
					title: "New Chat",
					userId,
				};

				localStore.setQuery(
					api.chat.listChats,
					{ userId },
					{ ...existingChats, page: [...existingChats.page, optimisticChat] },
				);

				window.history.replaceState({}, "", `/c/${optimisticId}`);
			}
		},
	);

	const sendMessage = useMutation(api.chat.sendMessage).withOptimisticUpdate(
		optimisticallySendMessage(api.chat.loadChat),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: would loop
	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!isDirty) return;

			if (!threadId) {
				threadId = await createChat({ prompt });
			}

			void sendMessage({ prompt, threadId });

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
			<PromptInputSubmit disabled={!isDirty || isStreaming} />
		</PromptInput>
	);
}
