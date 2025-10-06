"use client";

import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Action, Actions } from "~/components/ai-elements/actions";
import {
	Conversation,
	ConversationAutoLoadOnTop,
	ConversationContent,
	ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageThinking,
} from "~/components/ai-elements/message";
import { MessagePart } from "~/components/chat.message-part";
import { CopyIcon, TickIcon } from "~/components/ui/icons";
import type { MyMessage } from "~/lib/types";
import { attr } from "~/lib/utils";

interface ChatMessagesProps {
	messages: Array<MyMessage>;
	loadMore: (numItems: number) => void;
	canLoadMore: boolean;
	isLoadingMore: boolean;
	hasSentMessage: boolean;
}

export function ChatMessages({
	loadMore,
	messages,
	canLoadMore,
	isLoadingMore,
	hasSentMessage,
}: ChatMessagesProps) {
	const t = useTranslations("ChatMessages");

	const [isCopied, setIsCopied] = useState<string | null>(null);
	const [isThinking, setIsThinking] = useState(false);
	const hasActiveAssistantMessage = messages.some(
		({ role, status }) => role === "assistant" && status !== "pending",
	);

	async function handleCopy(message: MyMessage) {
		await navigator.clipboard.writeText(message.text);
		setIsCopied(message.id);

		setTimeout(() => {
			setIsCopied(null);
		}, 2000);
	}

	function handleUserMessageAnimationComplete(isLastMessage: boolean) {
		if (isLastMessage && hasSentMessage) {
			setIsThinking(true);
		}
	}

	useEffect(() => {
		if (hasActiveAssistantMessage || messages.length === 0) {
			setIsThinking(false);
		}
	}, [hasActiveAssistantMessage, messages.length]);

	return (
		<Conversation>
			<ConversationAutoLoadOnTop
				canLoadMore={canLoadMore}
				isLoadingMore={isLoadingMore}
				loadMore={loadMore}
			/>
			<ConversationContent>
				<AnimatePresence initial={false} mode="popLayout">
					{messages.map((message, i) => {
						const isLast = i === messages.length - 1;
						const fromUser = message.role === "user";
						const hasCopied = isCopied === message.id;
						const isPending = message.status === "pending";
						const isStreaming = message.status === "streaming";

						return (
							<Message
								{...attr("scroll-padding", isLast && hasSentMessage)}
								{...attr("user", message.role === "user")}
								animate={isLast && fromUser}
								from={message.role}
								key={message.key}
								onAnimationComplete={
									fromUser && isPending
										? () => handleUserMessageAnimationComplete(isLast)
										: undefined
								}
							>
								<MessageContent>
									{message.parts.map((part, partIndex) => {
										return (
											<MessagePart
												isStreaming={isStreaming}
												key={`${message.key}-${partIndex}`}
												part={part}
												role={message.role}
											/>
										);
									})}
									<Actions>
										<Action
											onClick={() => handleCopy(message)}
											tooltip={t("copy")}
										>
											{hasCopied ? <TickIcon /> : <CopyIcon />}
										</Action>
									</Actions>
								</MessageContent>
							</Message>
						);
					})}

					{isThinking && (
						<Message from="assistant">
							<MessageContent>
								<MessageThinking />
							</MessageContent>
						</Message>
					)}
				</AnimatePresence>
			</ConversationContent>
			<ConversationScrollButton />
		</Conversation>
	);
}
