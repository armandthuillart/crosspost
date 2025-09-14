"use client";

import type { UIMessage } from "ai";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { MessagePart } from "@/components/chat-message-part";
import { CopyIcon, TickIcon } from "@/components/ui/icons";
import { attr, extract } from "@/lib/utils";

interface ChatMessagesProps {
	messages: Array<UIMessage>;
	hasSentMessage: boolean;
}

export function ChatMessages({ messages, hasSentMessage }: ChatMessagesProps) {
	const [isCopied, setIsCopied] = useState<string | null>(null);

	async function handleCopy(message: UIMessage) {
		const text = extract(message.parts);
		await navigator.clipboard.writeText(text);
		setIsCopied(message.id);

		setTimeout(() => {
			setIsCopied(null);
		}, 2000);
	}

	return (
		<Conversation>
			<ConversationContent>
				<AnimatePresence initial={false} mode="popLayout">
					{messages.map((message, i) => {
						const isLast = i === messages.length - 1;
						const hasCopied = isCopied === message.id;
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
											{hasCopied ? <TickIcon /> : <CopyIcon />}
										</Action>
									</Actions>
								</MessageContent>
							</Message>
						);
					})}
				</AnimatePresence>
			</ConversationContent>
			<ConversationScrollButton />
		</Conversation>
	);
}
