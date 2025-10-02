"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Action, Actions } from "~/components/ai-elements/actions";
import {
	Conversation,
	ConversationAutoLoadOnTop,
	ConversationContent,
	ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Message, MessageContent } from "~/components/ai-elements/message";
import { MessagePart } from "~/components/chat.message-part";
import { CopyIcon, TickIcon } from "~/components/ui/icons";
import { ShiningText } from "~/components/ui/shining-text";
import type { MyMessage } from "~/lib/types";
import { attr } from "~/lib/utils";

type ReasoningPart = Extract<MyMessage["parts"][number], { type: "reasoning" }>;

const isReasoningPart = (
	part: MyMessage["parts"][number],
): part is ReasoningPart =>
	part.type === "reasoning" && Boolean(part.text?.trim().length);

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
						const reasoningParts = message.parts.filter(isReasoningPart);
						let hasRenderedReasoning = false;

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
										if (part.type === "reasoning") {
											if (!reasoningParts.length || hasRenderedReasoning) {
												return null;
											}
											hasRenderedReasoning = true;

											return (
												<MessagePart
													isStreaming={isStreaming}
													key={`${message.key}-reasoning`}
													part={part}
													reasoningParts={reasoningParts}
													role={message.role}
												/>
											);
										}

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
										<Action onClick={() => handleCopy(message)} tooltip="Copy">
											<AnimatePresence mode="wait">
												{hasCopied ? (
													<TickIcon
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														initial={{ opacity: 0 }}
														key="tick"
														transition={{ duration: 0.15 }}
													/>
												) : (
													<CopyIcon
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														initial={{ opacity: 0 }}
														key="copy"
														transition={{ duration: 0.15 }}
													/>
												)}
											</AnimatePresence>
										</Action>
									</Actions>
								</MessageContent>
							</Message>
						);
					})}

					{isThinking && !hasActiveAssistantMessage && (
						<Message from="assistant">
							<MessageContent>
								<ShiningText text="Thinking..." />
							</MessageContent>
						</Message>
					)}
				</AnimatePresence>
			</ConversationContent>
			<ConversationScrollButton />
		</Conversation>
	);
}
