"use client";

import { optimisticallySendMessage } from "@convex-dev/agent/react";
import { isRateLimitError } from "@convex-dev/rate-limiter";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
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
	PromptInputButton,
	PromptInputStop,
	PromptInputSubmit,
	PromptInputTextarea,
} from "~/components/ai-elements/prompt-input";
import { InternetIcon } from "~/components/ui/icons";
import { api } from "~/convex/generated/api";
import { useAutoFocus } from "~/hooks/use-auto-focus";
import { useTypewriter } from "~/hooks/use-typewriter";
import { showBannerAtom } from "~/lib/atoms";
import { authClient } from "~/lib/auth-client";
import type { User } from "~/lib/types";
import { attr } from "~/lib/utils";

const TEXTAREA_MIN_HEIGHT = 24;
const TEXTAREA_EXPANDED_MIN_HEIGHT = 48;

interface ChatInputProps {
	user: User | null;
	order: number;
	isChat: boolean;
	chatId: string | null;
	isStreaming: boolean;
	hasSubmitted: boolean;
}

export function ChatInput({
	user,
	order,
	chatId,
	isChat,
	isStreaming,
	hasSubmitted,
}: ChatInputProps) {
	const { replace } = useRouter();
	const [threadId, setThreadId] = useState(chatId);

	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [, showBanner] = useAtom(showBannerAtom);
	const [prompt, setPrompt] = useState("");
	const [threshold, setThreshold] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const isDirty = prompt.trim().length > 0;

	const createChat = useMutation(api.chat.createChat);

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

			if (!user) {
				const { error } = await authClient.signIn.anonymous();

				if (error) {
					console.error("Failed to sign in anonymously", error);
					return;
				}
			}

			let threadId = chatId;

			if (!chatId) {
				threadId = await createChat();
				replace(`/c/${threadId}`);
				setThreadId(threadId);
			}

			if (!threadId) {
				console.error(
					"Should not happen, chatId is null but no threadId was created",
				);
				return;
			}

			void sendMessage({
				prompt,
				threadId,
			}).catch((e) => {
				if (isRateLimitError(e)) {
					showBanner(true);
				}
			});

			setPrompt("");
			resetHeight();
		},
		[
			user,
			chatId,
			prompt,
			isDirty,
			replace,
			showBanner,
			createChat,
			sendMessage,
			resetHeight,
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
		<PromptInput {...attr("expanded", isExpanded)} onSubmit={handleSubmit}>
			<PromptInputButton>
				<InternetIcon className="size-5" />
			</PromptInputButton>

			<PromptInputTextarea
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				ref={inputRef}
				value={prompt}
			/>
			{isStreaming ? (
				<PromptInputStop
					onClick={() => threadId && abortStreamByOrder({ order, threadId })}
				/>
			) : (
				<PromptInputSubmit disabled={!isDirty || hasSubmitted} />
			)}
		</PromptInput>
	);
}
