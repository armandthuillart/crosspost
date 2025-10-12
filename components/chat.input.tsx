"use client";

import { optimisticallySendMessage } from "@convex-dev/agent/react";
import { isRateLimitError } from "@convex-dev/rate-limiter";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";
import { useLocale, useTranslations } from "next-intl";
import {
	type FormEvent,
	forwardRef,
	type KeyboardEvent,
	useImperativeHandle,
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
import { Button } from "~/components/ui/button";
import { PlusIcon } from "~/components/ui/icons";
import { useTextareaAutoFocus } from "~/hooks/use-auto-focus";
import { useTypewriter } from "~/hooks/use-typewriter";
import { useRouter } from "~/i18n/navigation";
import { showBannerAtom } from "~/lib/atoms";
import { authClient } from "~/lib/auth-client";
import type { User } from "~/lib/types";
import { attr } from "~/lib/utils";
import { api } from "../convex/_generated/api";

const TEXTAREA_MIN_HEIGHT = 24;
const TEXTAREA_EXPANDED_MIN_HEIGHT = 48;

export interface InputRef {
	onSubmit: (prompt: string) => void;
}

interface ChatInputProps {
	user: User | null;
	order: number;
	isChat: boolean;
	chatId: string | null;
	isStreaming: boolean;
	countryCode?: string;
	hasSubmitted: boolean;
	userLocation: { city?: string; country?: string; region?: string };
	onStartNewChat?: () => void;
}

export const ChatInput = forwardRef<InputRef, ChatInputProps>(
	(
		{
			user,
			order,
			chatId,
			isChat,
			isStreaming,
			userLocation,
			hasSubmitted,
			onStartNewChat,
		},
		ref,
	) => {
		const t = useTranslations("ChatInput");
		const locale = useLocale();
		const router = useRouter();
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

		const resetHeight = () => {
			if (inputRef.current) {
				inputRef.current.style.height = "auto";
				inputRef.current.style.height = "24px";
			}
		};

		const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
				onStartNewChat?.();
				threadId = await createChat({ locale });
				router.replace(`/chat/${threadId}`);
				setThreadId(threadId);
			}

			if (!threadId) {
				return;
			}

			void sendMessage({
				city: userLocation.city,
				country: userLocation.country,
				locale,
				prompt,
				region: userLocation.region,
				threadId,
			}).catch((e) => {
				if (isRateLimitError(e)) {
					showBanner(true);
				}
			});

			setPrompt("");
			resetHeight();
		};

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

		const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
			setPrompt(event.currentTarget.value);
		};

		const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
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
		};

		useTextareaAutoFocus({
			onValueChange: setPrompt,
			targetRef: inputRef,
			value: prompt,
		});

		const typewriter = useTypewriter({
			enabled: !isChat && !isDirty,
			loop: true,
			pauseDuration: 2000,
			texts: [
				t("you"),
				t("yourApp"),
				t("anything"),
				t("yourDay"),
				t("yourLife"),
				t("yourWeek"),
				t("yourWork"),
				t("yourGoals"),
				t("yourBusiness"),
				t("yourThoughts"),
			],
			typingSpeed: 100,
		});

		const placeholder = isChat
			? t("placeholder", { action: t("anything") })
			: t("placeholder", { action: typewriter });

		// TODO: Imperative code using refs should be avoided in most cases.
		// Should be replaced by some architectural changes (via props or state).
		useImperativeHandle(
			ref,
			() => ({
				onSubmit: (prompt: string) => {
					setPrompt(prompt);
					setTimeout(() => {
						const form = inputRef.current?.form;
						if (form) form.requestSubmit();
					}, 0);
				},
			}),
			[],
		);

		return (
			<PromptInput onSubmit={handleSubmit} {...attr("expanded", isExpanded)}>
				<PromptInputButton asChild kbd="/" tooltip={t("attach")}>
					<Button
						className="rounded-full bg-background text-muted-foreground hover:bg-background"
						size="icon"
					>
						<PlusIcon className="size-5" />
					</Button>
				</PromptInputButton>

				<PromptInputTextarea
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					ref={inputRef}
					value={prompt}
				/>

				{threadId && isStreaming ? (
					<PromptInputStop
						onClick={() => abortStreamByOrder({ order, threadId })}
					/>
				) : (
					<PromptInputSubmit disabled={!isDirty || hasSubmitted} />
				)}
			</PromptInput>
		);
	},
);

ChatInput.displayName = "ChatInput";
