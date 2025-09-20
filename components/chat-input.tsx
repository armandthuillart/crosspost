"use client";

import { optimisticallySendMessage } from "@convex-dev/agent/react";
import { isRateLimitError } from "@convex-dev/rate-limiter";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";
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
	PromptInputStop,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { api } from "@/convex/_generated/api";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import { useTypewriter } from "@/hooks/use-typewriter";
import { currentThreadIdAtom, showStreamerAtom } from "@/lib/atoms";
import { optimisticallyCreateChat } from "@/lib/stores";

const TEXTAREA_MIN_HEIGHT = 24;
const TEXTAREA_EXPANDED_MIN_HEIGHT = 48;

interface ChatInputProps {
	order: number;
	isChat: boolean;
	isStreaming: boolean;
	hasSubmitted: boolean;
}

export function ChatInput({
	order,
	isChat,
	isStreaming,
	hasSubmitted,
}: ChatInputProps) {
	const [currentThreadId, setCurrentThreadId] = useAtom(currentThreadIdAtom);

	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [, showStreamer] = useAtom(showStreamerAtom);
	const [prompt, setPrompt] = useState("");
	const [threshold, setThreshold] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const isDirty = prompt.trim().length > 0;

	const createChat = useMutation(api.chat.createChat).withOptimisticUpdate(
		optimisticallyCreateChat(api.chat.listChats, setCurrentThreadId),
	);

	const sendMessage = useMutation(api.chat.sendMessage).withOptimisticUpdate(
		optimisticallySendMessage(api.chat.loadChat),
	);

	const abortStreamByOrder = useMutation(api.chat.abortStreamByOrder);

	const resetHeight = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = "24px";
		}
	}, []);

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!isDirty) return;

			let chatId = currentThreadId;

			if (!chatId) {
				chatId = await createChat();
				setCurrentThreadId(chatId);
				window.history.replaceState(null, "", `/c/${chatId}`);
			}

			void sendMessage({
				prompt,
				threadId: chatId,
			}).catch((e) => {
				if (isRateLimitError(e)) {
					showStreamer(true);
				}
			});

			setPrompt("");
			resetHeight();
		},
		[
			prompt,
			isDirty,
			createChat,
			sendMessage,
			resetHeight,
			showStreamer,
			currentThreadId,
			setCurrentThreadId,
		],
	);

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
			{isStreaming ? (
				<PromptInputStop
					onClick={() =>
						currentThreadId &&
						abortStreamByOrder({ order, threadId: currentThreadId })
					}
				/>
			) : (
				<PromptInputSubmit disabled={!isDirty || hasSubmitted} />
			)}
		</PromptInput>
	);
}
