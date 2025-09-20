"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
	Conversation,
	ConversationAutoLoadOnTop,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { MessagePart } from "@/components/chat-message-part";
import { CopyIcon, TickIcon } from "@/components/ui/icons";
import { ShiningText } from "@/components/ui/shining-text";
import { attr } from "@/lib/utils";

interface ChatMessagesProps {
	messages: Array<UIMessage>;
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

	async function handleCopy(message: UIMessage) {
		await navigator.clipboard.writeText(message.text);
		setIsCopied(message.id);

		setTimeout(() => {
			setIsCopied(null);
		}, 2000);
	}

	const isLast = messages.at(-1)?.role === "user";

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

						return (
							<Message
								{...attr("scroll-padding", isLast && hasSentMessage)}
								{...attr("user", message.role === "user")}
								animate={fromUser && isPending}
								from={message.role}
								key={message.id}
							>
								<MessageContent>
									{message.parts.map((part, i) => (
										<MessagePart
											key={`${message.id}-${i}`}
											part={part}
											role={message.role}
										/>
									))}
									<Actions>
										<Action onClick={() => handleCopy(message)}>
											<AnimatePresence mode="wait">
												{hasCopied ? (
													<TickIcon
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														initial={{ opacity: 0 }}
														key="tick"
														transition={{ duration: 0.1 }}
													/>
												) : (
													<CopyIcon
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														initial={{ opacity: 0 }}
														key="copy"
														transition={{ duration: 0.1 }}
													/>
												)}
											</AnimatePresence>
										</Action>
									</Actions>
								</MessageContent>
							</Message>
						);
					})}

					{isLast && hasSentMessage && (
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
