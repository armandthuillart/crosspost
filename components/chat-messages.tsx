"use client";

import type { UIMessage } from "ai";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
	Conversation,
	ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { MessagePart } from "@/components/chat-message-part";
import { CopyIcon, TickIcon } from "@/components/ui/icons";
import { attr, buildTextFromParts } from "@/lib/utils";

interface ChatMessagesProps {
	chatId: string;
	messages: Array<UIMessage>;
	isSubmitted: boolean;
}

export function ChatMessages({
	chatId,
	messages,
	isSubmitted,
}: ChatMessagesProps) {
	const [isCopied, setIsCopied] = useState(false);
	const [hasSentMessage, setHasSentMessage] = useState(false);

	useEffect(() => {
		if (chatId) {
			setHasSentMessage(false);
		}
	}, [chatId]);

	useEffect(() => {
		if (isSubmitted) {
			setHasSentMessage(true);
		}
	}, [isSubmitted]);

	async function handleCopy(message: UIMessage) {
		const text = buildTextFromParts(message.parts);
		await navigator.clipboard.writeText(text);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	}

	return (
		<Conversation>
			<ConversationContent>
				<AnimatePresence initial={false} mode="popLayout">
					{messages.map((message, i) => {
						const isLast = i === messages.length - 1;
						return (
							<Message
								{...attr("scroll-padding", isLast && hasSentMessage)}
								{...attr("user", message.role === "user")}
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
										<Action onClick={() => handleCopy(message)} tooltip="Copy">
											{isCopied ? <TickIcon /> : <CopyIcon />}
										</Action>
									</Actions>
								</MessageContent>
							</Message>
						);
					})}
				</AnimatePresence>
			</ConversationContent>
		</Conversation>
	);
}
